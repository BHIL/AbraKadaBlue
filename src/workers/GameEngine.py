import asyncio
from models import User, Duel
from config import items_by_id, Items, NPCs, DUEL_SCORE
from config.consts import DUEL_TURN_DURATION, MAX_DUEL_LENGTH
from utils import TempInventory, NPCRunner, Logger
from utils.SharedRowLock import DuelLock

from sqlalchemy import and_
from datetime import datetime
import random
import json


logger = Logger(__name__)


class GameEngineWorker:
    @staticmethod
    def tick():
        max_last_turn_time = datetime.utcnow() - DUEL_TURN_DURATION
        with DuelLock(and_(Duel.status == Duel.Status.ACTIVE, Duel.last_turn_time < max_last_turn_time)) as active_duels:
            asyncio.run(GameEngineWorker.tick_duels(active_duels))

    @staticmethod
    async def tick_duels(duels):
        players = {u.id: u for u in User.query.filter(User.status == User.Status.IN_DUEL).all()}

        await asyncio.gather(*(GameEngineWorker.tick_duel(players, duel) for duel in duels), return_exceptions=True)

    @staticmethod
    async def tick_duel(players, duel):
        player1 = players[duel.player1_id]
        player_selected_items = player1.duel_selected_items
        player1.duel_selected_items = []
        player2 = None
        secrets = None

        if duel.npc_id:
            npc = NPCs[duel.npc_id]
            player = 'player'
            opponent = 'npc'
            secrets = {player: player1.secret, opponent: player1.secret}

            # If player didn't choose items, wait for the player and don't progress the duel
            if len(player_selected_items) == 0:
                return
        else:
            player2 = players[duel.player2_id]
            player = 'player1'
            opponent = 'player2'
            secrets = {player: player1.secret, opponent: player2.secret}

            opponent_selected_items = player2.duel_selected_items
            player2.duel_selected_items = []

        opponent_temp_inv = TempInventory(duel.state[opponent]['inventory'])

        # Assert player's selected items exist
        player_temp_inv = TempInventory(duel.state[player]['inventory'])
        if not player_temp_inv.contains(player_selected_items):
            logger.warning("player choose item they doesn't own", duel_id=duel.id, player_selected_items=player_selected_items)
            player_selected_items = []

        # Get npc selected items
        if duel.npc_id:
            try:
                opponent_selected_items = await GameEngineWorker.execute_npc(npc, query={'state': duel.state, 'player_selected_items': player_selected_items})
            
                # Validate opponent has the items selected in their inventory
                assert opponent_temp_inv.contains(opponent_selected_items), 'Item not in inventory'
                assert len(opponent_selected_items) > 0, 'No item selected'

            except:
                logger.exception('failed to execute npc, fallbacking to default move')
                opponent_selected_items = npc.default_move
        
        # If the player choose item they doesn't own, change the selection to an empty list
        if not opponent_temp_inv.contains(opponent_selected_items):
            logger.warning("opponent choose item they doesn't own", duel_id=duel.id, opponent_selected_items=opponent_selected_items)
            opponent_selected_items = []
            
        new_state, game_ended = GameEngineWorker.calc_state(duel.state, {player: player_selected_items, opponent: opponent_selected_items}, secrets)

        if new_state['turn_num'] > MAX_DUEL_LENGTH:
            game_ended = True
        
        duel.state = new_state
        duel.last_turn_time = datetime.utcnow()

        if game_ended:
            # Declear a winner
            winner_player = None
            if duel.state[player]['trollerance'] > duel.state[opponent]['trollerance']:
                winner = player
                winner_player = player1
                duel.status = Duel.Status.FIRST_PLAYER_WINS
            else:
                winner = opponent
                if player2:
                    winner_player = player2
                duel.status = Duel.Status.SECOND_PLAYER_WINS
                    
            # Reward with the prize if possible
            if winner_player:
                inv = TempInventory(duel.state[winner]['inventory'])
                inv[winner_player.duel_offer['risked_item']] += 1
                inv[winner_player.duel_offer['desired_item']] += 1
                # try to reward with the prize, if possible
                if inv.is_valid():
                    logger.trace('Player granted a reward', winner=winner_player.id, prize=winner_player.duel_offer['desired_item'])
                    winner_player.set_inventory(inv)
                else:
                    # Otherwise, just give back the risked item
                    logger.trace("Player won, but no room for the prize", winner=winner_player.id, prize=winner_player.duel_offer['desired_item'])
                    inv = TempInventory(duel.state[winner]['inventory'])
                    inv[winner_player.duel_offer['risked_item']] += 1
                    winner_player.set_inventory(inv)

            # Update players status
            player1.status = User.Status.MAP
            player1.last_action_result = {
                'opponent': 'human' if player2 else duel.npc_id,
                'is_winner': winner == player,
                'prize': player1.duel_offer['desired_item'] if winner == player else player1.duel_offer['risked_item'],
                'action': 'duel',
                'id': duel.state['id'],
            }
            player1.last_duel_id = duel.id
            
            if player2:
                player2.status = User.Status.MAP
                player2.last_action_result = {
                    'opponent': 'human',
                    'is_winner': winner == opponent,
                    'prize': player2.duel_offer['desired_item'] if winner == opponent else player2.duel_offer['risked_item'],
                    'action': 'duel',
                    'id': duel.state['id'],
                }
                player2.last_duel_id = duel.id
            
            if duel.npc_id and winner == player:
                # If the player just won an npc, update the score
                if (Duel.query
                    .filter(Duel.status == Duel.Status.FIRST_PLAYER_WINS)
                    .filter(Duel.player1_id == player1.id)
                    .filter(Duel.npc_id == duel.npc_id)
                    .count()) == 1:
                    player1.duels_score += DUEL_SCORE.get(duel.npc_id, 0)


    @staticmethod
    async def execute_npc(npc, query):
        out = await NPCRunner.ask_npc_async(npc, query)
        return GameEngineWorker.parse_and_validate(out)

    @staticmethod
    def parse_and_validate(response):
        try:
            parsed_response = json.loads(response)
            return [item_id for item_id in parsed_response if item_id in items_by_id]
        except:
            pass

    @staticmethod
    def apply_energy_effects(state, attack_base):
        attack = attack_base
        attacker = state['current_attacker']
        defender = GameEngineWorker.OPPONENT[state['current_attacker']]
        attacker_energy = state[attacker]['energy']

        # The attack decrease when the attacker has no energy
        if attacker_energy < 25:
            attack = attack * 0.8
        # The attack increase when the attacker has high energy
        elif attacker_energy > 75:
            attack = attack * 1.2

        # When you are in a sugarush, everything is more annoying
        defender_energy = state[defender]['energy']
        if defender_energy > 95:
            attack = attack * 1.5
        
        return attack

    OPPONENT = {
        'npc': 'player', 
        'player': 'npc', 
        'player1': 'player2', 
        'player2': 'player1'
    }

    @staticmethod
    def random(secret, duel_id, turn):
        random.seed(secret + duel_id + turn)
        return random.randint(0, 1)

    @staticmethod
    def calc_state(state, selected_items, secrets):
        attacker = state['current_attacker']
        defender = GameEngineWorker.OPPONENT[state['current_attacker']]

        attacker_items = list(map(items_by_id.get, selected_items[attacker]))
        defender_items = list(map(items_by_id.get, selected_items[defender]))

        current_turn = {
            'attacker': attacker,
            'attacks': [],
            'defences': [],
        }
        
        for i in attacker_items:
            delta_trollerance = 0
            delta_energy = 0
            attacked_player = None
            defence_item = None

            # Pocket hole to win it all
            if i.id == Items.PocketHole.id:
                # All of the player's trollerance and energy is sucked into the hole
                state[defender]['trollerance'] = min(state[defender]['trollerance'], 0)
                state[defender]['energy'] = min(state[defender]['energy'], 0)
                attacked_player = defender
                attack = i.attack.get()

            # A foxy in a boxy
            elif i.id == Items.FoxyBoxy.id:
                attack = i.attack.get()
                attack = GameEngineWorker.apply_energy_effects(state, attack)

                if GameEngineWorker.random(secrets[attacker], state['id'], state['turn_num']):
                    attacked_player = defender
                    defence_item, damage, is_mirrored = GameEngineWorker.select_best_defence(defender_items, i.is_animal, attack)

                    # Apply the attack on the chosen defence
                    delta_trollerance, delta_energy = damage
                else:
                    attacked_player = attacker
                    delta_trollerance, delta_energy = attack.damage

            elif i.attack:
                attack = i.attack.get()

                attack = GameEngineWorker.apply_energy_effects(state, attack)

                defence_item, damage, is_mirrored = GameEngineWorker.select_best_defence(defender_items, i.is_animal, attack)

                delta_trollerance, delta_energy = damage
                attacked_player = attacker if is_mirrored else defender

            assert attacked_player is not None, "What's the point of attacking void?"

            state[attacked_player]['trollerance'] = state[attacked_player]['trollerance'] + delta_trollerance
            state[attacked_player]['energy'] = state[attacked_player]['energy'] + delta_energy

            # Update inventory of attacker (item wear down)
            attacker_inv = state[attacker]['inventory']
            for item in attacker_inv:
                if item['item_id'] == i.id:
                    item['amount'] -= 1
                    break

            # Keep record of the attack result
            current_turn['attacks'].append({
                'attack': i.id,
                'defence': defence_item.id if defence_item else None,
                'attacked': attacked_player,
                'trollerance': state[attacked_player]['trollerance'],
                'energy': state[attacked_player]['energy'],
                'reaction': attack.reaction,
            })
        
        for i in defender_items:
            if i.defence:
                delta_trollerance, delta_energy = i.defence.apply()

                if i.id == Items.FoxyBoxy.id:
                    if GameEngineWorker.random(secrets[defender], state['id'], state['turn_num']) == False:
                        delta_trollerance *= -1
                        delta_energy *= -1
                
                state[defender]['trollerance'] = state[defender]['trollerance'] + delta_trollerance
                state[defender]['energy'] = state[defender]['energy'] + delta_energy

            
            # Update inventory of defender (item wear down)
            defender_inv = state[defender]['inventory']
            for item in defender_inv:
                if item['item_id'] == i.id:
                    item['amount'] -= 1
                    break

            current_turn['defences'].append({
                'defence': i.id,
                'trollerance': state[defender]['trollerance'],
                'energy': state[defender]['energy'],
            })

        # Limit trollerance and energy to the range [0..100]
        state[attacker]['trollerance'] = min(max(state[attacker]['trollerance'], 0), 100)
        state[defender]['trollerance'] = min(max(state[defender]['trollerance'], 0), 100)
        state[attacker]['energy'] = min(max(state[attacker]['energy'], 0), 100)
        state[defender]['energy'] = min(max(state[defender]['energy'], 0), 100)

        # Record the turn
        state['last_turn'] = current_turn
        state['turn_num'] += 1

        # Give the opponent chance to strike back
        state['current_attacker'] = defender

        return state, state[attacker]['trollerance'] <= 0 or state[defender]['trollerance'] <= 0

    @staticmethod
    def select_best_defence(defender_items, is_animal, attack):
        best_defence_item = None
        best_assessment = attack.damage

        for d in defender_items:
            if d.id == Items.MirrorMirror.id:
                return d, attack.damage, True
            
            if d.defence:
                assesment = d.defence.assess(attack, is_animal)

                if best_assessment is None or best_assessment.abs() > assesment.abs():
                    best_assessment = assesment
                    best_defence_item = d

        return best_defence_item, best_assessment, False

