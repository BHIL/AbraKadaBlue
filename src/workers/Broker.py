from application import db
from models import User
from config import NPCs, NPC
from utils import Logger
from utils.SharedRowLock import UserLock

from datetime import datetime
from collections import defaultdict
from sqlalchemy import and_

logger = Logger(__name__)


class MatchFinder:
    def __init__(self):
        self.players_by_interpertations = defaultdict(set)

    def _iter_interpertations(self, suggested_trade, npc_id, opposite=False):
        for items_group1 in suggested_trade['desires' if opposite else 'offers']:
            for items_group2 in suggested_trade['offers' if opposite else 'desires']:
                yield {
                    'offer': items_group1,
                    'desire': items_group2,
                }, (tuple((item['item_id'], item['quantity']) for item in items_group1), tuple((item['item_id'], item['quantity']) for item in items_group2), npc_id)

    def remove(self, player):
        for interpertation, key in self._iter_interpertations(player.suggested_trade, player.suggested_trade_npc):
            self.players_by_interpertations[key].remove(player)

    def add(self, player):
        for interpertation, key in self._iter_interpertations(player.suggested_trade, player.suggested_trade_npc):
            self.players_by_interpertations[key].add(player)

    def iter_potential_matches(self, suggested_trade, suggested_trade_npc):
        for opposite_interpertation, key in self._iter_interpertations(suggested_trade, suggested_trade_npc, opposite=True):
            for second_player in self.players_by_interpertations[key]:
                yield second_player, opposite_interpertation


class BrokerWorker:
    @staticmethod
    def tick():
        users_filter = User.status == User.Status.WAITING_FOR_BROKER
        with UserLock(users_filter) as user_trades:            
            match_finder = MatchFinder()
            
            for player in user_trades:
                # Do not serve canceled requests
                if player.is_cancel_pending:
                    player.status = User.Status.MAP
                    continue

                for second_player, potential_deal in match_finder.iter_potential_matches(player.suggested_trade, player.suggested_trade_npc):
                    try:
                        nested = db.session.begin_nested() # establish a savepoint
                        BrokerWorker.apply_trade(potential_deal['desire'], potential_deal['offer'], player, second_player)

                        match_finder.remove(second_player)
                        break
                    except:
                        logger.exception('Failed to trade with Broker, rolling back the changes')
                        # Rollback for partial changes in the DB
                        db.session.rollback()
                        player.last_action_result = {
                            'msg': 'Unexpected error. Please try again later',
                            'action': 'trade',
                        }
                        player.status = User.Status.MAP
                        player.last_action_time = datetime.utcnow()
                else:
                    # If we didn't find a match, save the player in cache for later
                    match_finder.add(player)

        # Cancel all requests from users who waited for cancelation
        with UserLock(and_(users_filter, User._cancel_pending == True)) as canceling_users:
            for player in canceling_users:
                player.status = User.Status.MAP


    @staticmethod
    def apply_trade(sell_items, buy_items, player1, player2):
        assert player1.status == User.Status.WAITING_FOR_BROKER, "Player doesn't wait for market anymore"
        assert player2.status == User.Status.WAITING_FOR_BROKER, "Player doesn't wait for market anymore"
        
        player1.status = User.Status.MAP
        player1_inv = player1.get_inventory()

        player2.status = User.Status.MAP
        player2_inv = player2.get_inventory()

        for sell_item in sell_items:
            assert sell_item['item_id'] in player1_inv, 'Item not found in inventory'
            assert player1_inv[sell_item['item_id']] >= sell_item['quantity'], 'Insufficient amount in inventory'
            player1_inv[sell_item['item_id']] -= sell_item['quantity']
        
        for buy_item in buy_items:
            assert buy_item['item_id'] in player2_inv, 'Item not found in inventory'
            assert player2_inv[buy_item['item_id']] >= buy_item['quantity'], 'Insufficient amount in inventory'
            player2_inv[buy_item['item_id']] -= buy_item['quantity']

        for buy_item in buy_items:
            player1_inv[buy_item['item_id']] += buy_item['quantity']

        for sell_item in sell_items:
            player2_inv[sell_item['item_id']] += sell_item['quantity']

        if player1_inv.is_valid() and player2_inv.is_valid():
            player1.set_inventory(player1_inv)
            player2.set_inventory(player2_inv)

            player1.last_action_result = {
                'npc': player1.suggested_trade_npc,
                'sell': sell_items,
                'buy': buy_items,
                'action': 'broker',
            }

            player2.last_action_result = {
                'npc': player2.suggested_trade_npc,
                'sell': buy_items, # NOTE: the buy and the sell are swapped for the second player point of view
                'buy': sell_items,
                'action': 'broker',
            }
