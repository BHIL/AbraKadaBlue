import sys
import json

def main():
    try:
        data = json.loads(sys.stdin.readline())
    except json.JSONDecodeError:
        print("Could not decode JSON.", file=sys.stderr)
        return -1

    try:
        player_inventory_indexes = {item['item_id']: index for index, item in enumerate(data['state']['player']['inventory'])}
        indexes = map(player_inventory_indexes.get, data['player_selected_items'])
        selected_move = [data['state']['npc']['inventory'][index]['item_id'] for index in indexes]
        if len(selected_move) < 3:
            missing_items = 3 - len(selected_move)
            not_selected_items = [item['item_id'] for item in data['state']['npc']['inventory'] if item['amount'] > 0 and item['item_id'] not in selected_move]
            selected_move += not_selected_items[:missing_items]

        print(json.dumps(selected_move))

    except (TypeError, KeyError):
        # Invalid trade!
        print("Trade decode error.", file=sys.stderr)
        return -1

    return 0

if __name__ == "__main__":
    sys.exit(main())
