import sys
import json

HonkHonk = 5
SnoozeBest = 9
ForkThis = 13
ShimmerGlimmer = 17
OminousOnion = 19

VALUES = {
    HonkHonk: 5, 
    OminousOnion: 2,
    ForkThis: 7,
    ShimmerGlimmer: 2,
    SnoozeBest: 13,
}

def evaluate(items):
    return sum(VALUES.get(item['item_id'], 0) * item['quantity'] for item in items)

def main():
    try:
        data = json.loads(sys.stdin.readline())
    except json.JSONDecodeError:
        print("Could not decode JSON.", file=sys.stderr)
        return -1

    try:
        best_offer = max(data["offers"], key=evaluate)
        best_desire = min(data["desires"], key=evaluate)
        
        if evaluate(best_offer) > evaluate(best_desire):
            # The desire and offer are swapped from my point of view
            best_deal = {'desire': best_offer, 'offer': best_desire}
            print(json.dumps(best_deal))

    except (TypeError, KeyError):
        # Invalid trade!
        print("Trade decode error.", file=sys.stderr)
        return -1

    return 0

if __name__ == "__main__":
    sys.exit(main())
