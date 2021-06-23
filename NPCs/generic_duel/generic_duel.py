import sys
import json
from itertools import combinations, permutations
from copy import deepcopy

from Items import Items, items_by_id

OPPONENT = {
    'npc': 'player', 
    'player': 'npc', 
}


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

def iterate_possible_moves(state):
    possible_items = [item['item_id'] for item in state['npc']['inventory'] if item['amount'] > 0]
    max_num_of_items = min(len(possible_items), 3)
    for num_of_items in range(max_num_of_items + 1):
        yield from combinations(possible_items, r=num_of_items)


def evaluate(new_state, is_done):
    if is_done:
        if new_state['npc']['trollerance'] < new_state['player']['trollerance']:
            return -99999999
        return 99999999
    return new_state['npc']['trollerance'] - 2 * new_state['player']['trollerance']


def main():
    try:
        data = json.loads(sys.stdin.readline())
    except json.JSONDecodeError:
        print("Could not decode JSON.", file=sys.stderr)
        return -1

    try:
        best_score = -99999999
        best_move = None
        for possible_move in iterate_possible_moves(data['state']):
            new_state, is_done = calc_state(deepcopy(data['state']), {'player': data['player_selected_items'], 'npc': possible_move})
            score = evaluate(new_state, is_done)
            if score > best_score:
                best_score = score
                best_move = possible_move

        print(json.dumps(best_move))

    except:
        print("Error", file=sys.stderr)
        return -1

    return 0

if __name__ == "__main__":
    sys.exit(main())
