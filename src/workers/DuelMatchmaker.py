from sqlalchemy.sql.operators import op
from application import db
from models import User, Duel
from config import NPCs, NPC
from utils import TempInventory, Logger
from utils.SharedRowLock import UserLock

from collections import defaultdict
from sqlalchemy import and_
import random
import json


logger = Logger(__name__)


class DuelMatchmakerWorker:
    @staticmethod
    def tick():
        npc_match_finder = defaultdict(list)
        human_match_finder = defaultdict(list)

        # Insert all npcs to the match finder
        for npc in NPCs.values():
            if npc.kind == NPC.Kind.DUEL:
                for rp in npc.risked_prizes:
                    for dp in npc.desired_prizes:
                        key = rp, dp, npc.front
                        npc_match_finder[key].append(npc)

        logger.trace('Start match making')

        # Find matches for all waiting players
        users_filter = User.status == User.Status.WAITING_FOR_DUEL
        with UserLock(users_filter) as waiting_players:
            for player in waiting_players:
                # Do not serve canceled requests
                if player.is_cancel_pending:
                    player.status = User.Status.MAP
                    continue

                key = player.duel_offer['risked_item'], player.duel_offer['desired_item'], player.duel_offer_npc
                reverse_key = player.duel_offer['desired_item'], player.duel_offer['risked_item'], player.duel_offer_npc

                if reverse_key in npc_match_finder and len(npc_match_finder[reverse_key]) > 0:
                    opponent_npc = npc_match_finder[reverse_key][0]
                    logger.trace('match found with npc', player=player.id, opponent_npc=opponent_npc.id)

                    if not all(opponent_npc.id != locked_npc.npc_id for locked_npc in player.locked_npcs):
                        player.status = User.Status.MAP
                        player.last_action_result = {
                            'msg': "The NPC is locked",
                            'npc': opponent_npc.id,
                            'action': 'error',
                        }
                        continue
                    

                    DuelMatchmakerWorker.initiate_duel(player, npc=opponent_npc)
                    continue
                
                arena_master = NPCs[player.duel_offer_npc]
                if not arena_master.allow_human_duels:
                    # The arena master doesn't support pvp duels and no match found against NPCs
                    player.status = User.Status.MAP
                    player.last_action_result = {
                        'msg': 'No match found',
                        'npc': player.duel_offer_npc,
                        'action': 'error',
                    }                    
                elif reverse_key in human_match_finder and len(human_match_finder[reverse_key]) > 0:
                    # We have found a pvp match
                    opponent = human_match_finder[reverse_key].pop(0)
                    logger.trace('match found with human', player=player.id, opponent=opponent.id)

                    DuelMatchmakerWorker.initiate_duel(player, opponent)
                else:
                    # Save the player to find matches
                    human_match_finder[key].append(player)

        # Cancel all requests from users who waited for cancelation
        with UserLock(and_(users_filter, User._cancel_pending == True)) as canceling_users:
            for player in canceling_users:
                player.status = User.Status.MAP

    @staticmethod
    def initiate_duel(player, opponent=None, npc=None):
        assert (opponent is None) != (npc is None), 'exactly one of the arguments should be used'

        player_inv = player.get_inventory()

        # Find the risked item by player
        player_item = player.duel_offer['risked_item']
        assert player_item in player_inv, 'Item not found in player inventory'

        opponent_item = None
        # Find the risked item by opponent
        if opponent:
            opponent_inv = opponent.get_inventory()
            opponent_item = opponent.duel_offer['risked_item']
            assert opponent_item in opponent_inv, 'Item not found in opponent inventory'
                
        # Change player status
        player.status = User.Status.IN_DUEL
        if opponent:
            opponent.status = User.Status.IN_DUEL
        
        # Reserve prize in inventories
        player_inv[player_item] -= 1
        player.set_inventory(player_inv)

        if opponent:
            opponent_inv[opponent_item] -= 1
            opponent.set_inventory(opponent_inv)

        # Start a duel
        player_name = 'player1' if opponent else 'player'
        opponent_name = 'player2' if opponent else 'npc'

        if opponent:
            opponent_inventory = [{'item_id': i, 'amount': a} for i, a in opponent_inv.items()]
        else:
            opponent_inventory = [{'item_id': item_id, 'amount': amount} for item_id, amount in npc.inventory.items()]

        initial_state = {
            'current_attacker': opponent_name,
            player_name: {
                'inventory': [{'item_id': i, 'amount': a} for i, a in player_inv.items()],
                'trollerance': 100,
                'energy': 50
            },
            opponent_name: {
                'inventory': opponent_inventory,
                'trollerance': 100,
                'energy': 50
            },
            'last_turn': None,
            'turn_num': 0,
            'id': random.randint(0, 12345678)
        }

        if opponent:
            new_duel = Duel(initial_state, player.id, player2_id=opponent.id)
        else:
            new_duel = Duel(initial_state, player.id, npc_id=npc.id)

        db.session.add(new_duel)
        return new_duel
