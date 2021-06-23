import sys
import json
import itertools
import functools
import binascii

from typing import List, Dict, Optional

from dataclasses_json import dataclass_json
from dataclasses import dataclass


@dataclass_json
@dataclass
class ItemPair:
    item_id: str
    quantity: int

    def __str__(self) -> str:
        return "%d %s(s)" % (self.quantity, self.item_id)
    
class Trade:
    offer: List[ItemPair]
    desire: List[ItemPair]

    def __init__(self, offer, desire):
        self.offer = offer
        self.desire = desire

    def __add__(self, other):
        if not isinstance(other, self.__class__):
            raise TypeError(f"unsupported operand type(s) for +: '{self.__class__}' and '{type(other)}'")

        self.offer += other.offer
        self.desire += other.desire

    def __eq__(self, other) -> bool:
        return hash(self) == hash(other)

    def __str__(self) -> str:
        return "%s => %s" % (", ".join(map(str, self.offer)), ", ".join(map(str, self.desire)))

    def __repr__(self) -> str: 
        return f"< {self} >"

    def __hash__(self) -> int:
        return binascii.crc32(("%r" % self).encode("utf-8"))

    def to_dict(self) -> Dict:
        return {"offer": [_.to_dict() for _ in self.offer], "desire": [_.to_dict() for _ in self.desire]}

    @functools.lru_cache(maxsize=128)
    def value(self) -> int:
        return self.value_nocache()

    def value_nocache(self) -> int:
        offer_value = sum(VALUES.get(_.item_id, 0) * _.quantity for _ in self.offer)
        desire_value = sum(VALUES.get(_.item_id, 0) * _.quantity for _ in self.desire)
        return offer_value - desire_value

class TradeSet(list):
    def to_dict(self) -> Dict:
        return [_.to_dict() for _ in self]

    def best(self) -> Optional[Trade]:
        if len(self) > 0:
            best = self[0]
            if len(self) > 1:
                for trade in self[1:]:
                    if trade.value() >= best.value():
                        best = trade
            return best


class Items:
    TeleFart = 1
    TonyStank = 2
    Grooviton = 3
    Flashfunk = 4
    HonkHonk = 5
    GongLong = 6
    PlantPlug = 7
    SugarCrush = 8
    NastyNoodles = 9
    PocketHole = 10
    MirrorMirror = 11
    SnoozeBest = 12
    ForkThis = 13
    ClementEye = 14
    DeFeeters = 15
    Hypnomon = 16
    ShimmerGlimmer = 17
    OminousOnion = 18
    DurianGrey = 19
    Skelebowl = 20
    HolyMoly = 21
    CalciumFancium = 22
    StingySullivan = 23
    BlingRing = 24
    CactusJack = 25
    DiamondDough = 26
    SlitheringSoup = 27
    Smellmonell = 28
    NosyNolan = 29
    CloakKent = 30
    FoxyBoxy = 31
    FattyPatty = 32
    RainbowMunch = 33
    WonderWall = 34


COMMISSION = 0.1 # Being an NPC is hard...
VALUES = {
    Items.ForkThis: 8,
    Items.Smellmonell: 9,
    Items.Grooviton: 18,
    Items.NosyNolan: 21,
    Items.TeleFart: 24,
    Items.StingySullivan: 25,
    Items.BlingRing: 26,
    Items.MirrorMirror: 1000,
    Items.Flashfunk: 1_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_001 # Fair price I think
}

def main():
    try:
        data = json.loads(sys.stdin.readline())
    except json.JSONDecodeError:
        print("Could not decode JSON.", file=sys.stderr)
        return -1

    try:
        trade_set = TradeSet()
        for raw_offer, raw_desire in itertools.product(data["offers"], data["desires"]):
            offer = [ItemPair.from_dict(o) for o in raw_offer]
            desire = [ItemPair.from_dict(d) for d in raw_desire]

            trade = Trade(offer, desire)
            if trade.value() > COMMISSION:
                trade_set.append(trade)

        # Choose best trade pair
        if len(trade_set) > 0:
            best_trade = trade_set.best() 
            print(json.dumps(Trade(best_trade.desire, best_trade.offer).to_dict()))
        else:
            print(json.dumps(Trade(offer=[], desire=[]).to_dict()))

    except (TypeError, KeyError):
        # Invalid trade!
        print("Trade decode error.", file=sys.stderr)
        return -1

    return 0

if __name__ == "__main__":
    sys.exit(main())
