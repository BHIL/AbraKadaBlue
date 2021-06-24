import asyncio
from application import db
from models import User
from config import NPCs, NPC
from utils import NPCRunner, Logger
from utils.SharedRowLock import UserLock
from config.consts import TRADE_COOLDOWN_DURATION

import json
from jsonschema import validate
from datetime import datetime
from sqlalchemy import and_, or_

logger = Logger(__name__)

ITEM_LIST_SCHEMA = {
    'type': 'array', 
    'minItems': 1,
    'maxItems': 10,
    'items': {
        'type': 'object',
        'properties': {
            'item_id': {
                "type": "integer"
                # TODO: allow only item ids 1-34
            },
            'quantity': { 
                "type" : "integer",
                "minimum": 0,
                "maximum": 100,
            },
        }
    }
}

CHOOSEN_TRADE_SCHEMA = {
    'type': 'object', 
    'properties': {
        'desire': ITEM_LIST_SCHEMA,
        'offer': ITEM_LIST_SCHEMA,
    }
}

class TraderWorker:
    @staticmethod
    def tick():
        max_last_action_time = datetime.utcnow() - TRADE_COOLDOWN_DURATION

        users_filter = and_(User.status == User.Status.WAITING_FOR_TRADER, or_(User.last_action_time == None, User.last_action_time < max_last_action_time))
        with UserLock(users_filter) as user_trades:
            asyncio.run(TraderWorker.trade_with_npcs(user_trades))

        # Cancel all requests from users who waited for cancelation
        with UserLock(and_(users_filter, User._cancel_pending == True)) as canceling_users:
            for player in canceling_users:
                player.status = User.Status.MAP


    @staticmethod
    async def trade_with_npcs(user_trades):
        await asyncio.gather(*(TraderWorker.trade_single_player(player) for player in user_trades), return_exceptions=True)
            
    @staticmethod
    async def trade_single_player(player):
        # Do not serve canceled requests
        if player.is_cancel_pending:
            player.status = User.Status.MAP
            return

        npc = NPCs[player.suggested_trade_npc]

        if npc.kind != NPC.Kind.TRADER:
            logger.warning('Trying to trade with non trader NPC', npc=npc.id)
            return

        # Make sure the npc is not locked
        if any(npc.id == locked_npc.npc_id for locked_npc in player.locked_npcs):
            logger.warning('Trying to trade with a locked trader NPC', npc=npc.id)
            return
        try:
            nested = db.session.begin_nested() # establish a savepoint
            msg = None

            accepted_trade = await TraderWorker.execute_npc(npc, player.suggested_trade)
            if accepted_trade:
                logger.trace('Trade accepted')

                # Validate the offer is valid given that NPC inventory configuration
                if all(npc.inventory.get(item['item_id'], 0) >= item['quantity'] for item in accepted_trade['offer']):
                    logger.trace('Applying trade with NPC', accepted_trade=json.dumps(accepted_trade), npc=npc.id)

                    msg = TraderWorker.apply_trade(accepted_trade['desire'], accepted_trade['offer'], player)
                else:
                    msg = "I really want to, but I don't have it"
            else:
                msg = 'Sorry, but no deal'

            # No matter if the trade got accepted or not, Send the user back to the map
            player.status = User.Status.MAP
            if msg:
                player.last_action_result = {
                    'npc': player.suggested_trade_npc,
                    'msg': msg,
                    'action': 'trade',
                }
                player.last_action_time = datetime.utcnow()
        except Exception as ex:
            logger.exception('Failed to trade with NPC, rolling back the changes')
            # Rollback for partial changes in the DB
            db.session.rollback()
            player.last_action_result = {
                'npc': player.suggested_trade_npc,
                'msg': 'Unexpected error. Please try again later',
                'action': 'trade',
            }
            player.status = User.Status.MAP
            player.last_action_time = datetime.utcnow()

    @staticmethod
    async def execute_npc(npc, suggested_trade):
        # create a new process and run the binary
        out = await NPCRunner.ask_npc_async(npc, query=suggested_trade)
        return TraderWorker.parse_and_validate(out)

    @staticmethod
    def parse_and_validate(response):
        try:
            choosen_trade = json.loads(response)
            validate(choosen_trade, schema=CHOOSEN_TRADE_SCHEMA)
            return choosen_trade
        except:
            pass

    @staticmethod
    def apply_trade(sell_items, buy_items, player):
        assert player.status == User.Status.WAITING_FOR_TRADER, "Player doesn't wait for market anymore"

        player.status = User.Status.MAP
        player1_inv = player.get_inventory()

        for sell_item in sell_items:
            if sell_item['item_id'] not in player1_inv:
                return "This is why I don't trust wizards"
            if player1_inv[sell_item['item_id']] < sell_item['quantity']:
                return "Don't troll with me"
            player1_inv[sell_item['item_id']] -= sell_item['quantity']

        for buy_item in buy_items:
            player1_inv[buy_item['item_id']] += buy_item['quantity']

        if player1_inv.is_valid():
            player.set_inventory(player1_inv)

            player.last_action_result = {
                'npc': player.suggested_trade_npc,
                'sell': sell_items,
                'buy': buy_items,
                'action': 'trade',
            }
            player.last_action_time = datetime.utcnow()
        else:
            return "With you, it's like a trollercoster"
