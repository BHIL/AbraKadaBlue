from config import Items
from config.consts import MAX_TRADE_VOLUME

class NPC:
    class Kind:
        BROKER = 'broker'
        TRADER = 'trader'
        ARENA_MASTER = 'arena_master'
        DUEL = 'duel'

    def __init__(self, id, kind, front=None, unlock_price=None, inventory=None, port=None, permitted_items=None, default_move=None, risked_prizes=None, desired_prizes=None, allow_human_duels=False):
        self.id = id
        self.kind = kind
        self.front = front
        self.unlock_price = unlock_price
        self.inventory = inventory
        self.port = port
        self.permitted_items = permitted_items
        self.default_move = default_move
        self.risked_prizes = risked_prizes
        self.desired_prizes = desired_prizes
        self.allow_human_duels = allow_human_duels

    def __repr__(self):
        return f"<{self.__class__.__name__}(id={repr(self.id)})>"

ALL_ITEMS = (
    Items.TeleFart.id,
    Items.TonyStank.id,
    Items.Grooviton.id,
    Items.Flashfunk.id,
    Items.HonkHonk.id,
    Items.GongLong.id,
    Items.PlantPlug.id,
    Items.SugarCrush.id,
    Items.NastyNoodles.id,
    Items.PocketHole.id,
    Items.MirrorMirror.id,
    Items.SnoozeBest.id,
    Items.ForkThis.id,
    Items.ClementEye.id,
    Items.DeFeeters.id,
    Items.Hypnomon.id,
    Items.ShimmerGlimmer.id,
    Items.OminousOnion.id,
    Items.DurianGrey.id,
    Items.Skelebowl.id,
    Items.HolyMoly.id,
    Items.CalciumFancium.id,
    Items.StingySullivan.id,
    Items.BlingRing.id,
    Items.CactusJack.id,
    Items.DiamondDough.id,
    Items.SlitheringSoup.id,
    Items.Smellmonell.id,
    Items.NosyNolan.id,
    Items.CloakKent.id,
    Items.FoxyBoxy.id,
    Items.FattyPatty.id,
    Items.RainbowMunch.id,
    Items.WonderWall.id
)

NPCs = {
    npc.id: npc for npc in [
        # ####### #
        # Brokers #
        # ####### #
        NPC('B1', NPC.Kind.BROKER,
            permitted_items = (
                Items.HonkHonk.id,
                Items.SnoozeBest.id,
                Items.ForkThis.id,
                Items.ShimmerGlimmer.id,
                Items.OminousOnion.id,
                Items.CactusJack.id,
                Items.WonderWall.id,
            ),
        ),

        NPC('B2', NPC.Kind.BROKER,
            permitted_items = (
                Items.TonyStank.id,
                Items.SugarCrush.id,
                Items.ClementEye.id,
                Items.CalciumFancium.id,
                Items.StingySullivan.id,
                Items.BlingRing.id,
                Items.NosyNolan.id,
            ),
        ),

        NPC('B3', NPC.Kind.BROKER,
            permitted_items = (
                Items.SugarCrush.id,
                Items.Smellmonell.id,
                Items.FattyPatty.id,
                Items.WonderWall.id,
            ),
        ),

        NPC('B4', NPC.Kind.BROKER,
            permitted_items = (
                Items.GongLong.id,
                Items.NastyNoodles.id,
                Items.ClementEye.id,Items.CalciumFancium.id,
            ),
        ),

        # ####### #
        # Traders #
        # ####### #
        NPC('T1', NPC.Kind.TRADER,
            inventory = {
                Items.TeleFart.id: 1,
                Items.CloakKent.id: 1,
            },
            permitted_items=(
                ALL_ITEMS
            ),
            port = 31340,
        ),
        NPC('T2', NPC.Kind.TRADER,
            inventory = {
                Items.DiamondDough.id: 1,
                Items.Skelebowl.id: 1,
            },
            permitted_items = (
                Items.Flashfunk.id,
                Items.OminousOnion.id,
                Items.Skelebowl.id,
                Items.DiamondDough.id,
                Items.RainbowMunch.id,
                Items.WonderWall.id,
            ),
            port = 31341,
        ),
        NPC('T3', NPC.Kind.TRADER, 
            inventory = {
                Items.TonyStank.id: 1,
                Items.Grooviton.id: 1,
                Items.SugarCrush.id: 1,
                Items.SnoozeBest.id: 1,
                Items.Smellmonell.id: 1,
                Items.ForkThis.id: 1,
                Items.DurianGrey.id: 1,
                Items.CalciumFancium.id: 1,
                Items.CactusJack.id: 1,
                Items.FattyPatty.id: 1,
                Items.RainbowMunch.id: 1,
            },
            permitted_items = (
                Items.SnoozeBest.id,
                Items.ForkThis.id,
                Items.CalciumFancium.id,
                Items.FattyPatty.id,
                Items.Smellmonell.id,
                Items.SugarCrush.id,
                Items.TonyStank.id,
                Items.Grooviton.id,
                Items.DurianGrey.id,
                Items.RainbowMunch.id,
                Items.CactusJack.id,
            ),
            port = 31342,
        ),
        NPC('T4', NPC.Kind.TRADER,
            # Ready
            inventory  = {
                Items.SnoozeBest.id: 1,
                Items.OminousOnion.id: 3,
            },
            permitted_items = (
                Items.SnoozeBest.id,
                Items.OminousOnion.id,
                Items.HonkHonk.id,
                Items.ForkThis.id,
                Items.ShimmerGlimmer.id,
            ),
            port = 31343,
        ),
        NPC('T5', NPC.Kind.TRADER,
            # Ready
            inventory = {
                Items.HonkHonk.id: 1,
                Items.ForkThis.id: 1,
                Items.ShimmerGlimmer.id: 1,
            },
            permitted_items = (
                Items.SugarCrush.id,
                Items.OminousOnion.id,
                Items.HonkHonk.id,
                Items.ForkThis.id,
                Items.ShimmerGlimmer.id,

                # Initial inventory items
                Items.FattyPatty.id,
                Items.CactusJack.id,
                Items.WonderWall.id,
            ),
            port = 31344,
        ),
        NPC('T6', NPC.Kind.TRADER,
            inventory = {
                Items.Flashfunk.id: 1,
                Items.StingySullivan.id: 7,
                Items.NosyNolan.id: 4,
                Items.Smellmonell.id: 9,
            },
            permitted_items = (
                Items.ForkThis.id,
                Items.Smellmonell.id,
                Items.Grooviton.id,
                Items.NosyNolan.id,
                Items.TeleFart.id,
                Items.StingySullivan.id,
                Items.BlingRing.id,
                Items.MirrorMirror.id,
                Items.Flashfunk.id,
            ),
            port = 31338,
        ),
        NPC('T7', NPC.Kind.TRADER,
            inventory = {
                Items.GongLong.id: MAX_TRADE_VOLUME,
                Items.SugarCrush.id: MAX_TRADE_VOLUME,
                Items.NastyNoodles.id: MAX_TRADE_VOLUME,
                Items.ClementEye.id: MAX_TRADE_VOLUME,
                Items.CalciumFancium.id: MAX_TRADE_VOLUME,
                Items.WonderWall.id: MAX_TRADE_VOLUME,
            },
            permitted_items = (
                Items.GongLong.id,
                Items.SugarCrush.id,
                Items.NastyNoodles.id,
                Items.ClementEye.id,
                Items.CalciumFancium.id,
                Items.WonderWall.id,

                Items.HonkHonk.id,
                Items.SnoozeBest.id,
                Items.ForkThis.id,
                Items.ShimmerGlimmer.id,
                Items.OminousOnion.id,
                Items.CactusJack.id,
                Items.FattyPatty.id,
            ),
            port = 31339,
        ),
        NPC('T8', NPC.Kind.TRADER, 
            inventory = {
                Items.Smellmonell.id: 1,
                Items.SlitheringSoup.id: 1,
                Items.StingySullivan.id: 1,
                Items.Grooviton.id: 1,
                Items.Flashfunk.id: 1,
                Items.NosyNolan.id: 1,
                Items.Hypnomon.id: 1,
                Items.TeleFart.id: 1,
                Items.BlingRing.id: 1,
                Items.PlantPlug.id: 1,
                Items.RainbowMunch.id: 1,
            },
            permitted_items = (
                Items.Smellmonell.id,
                Items.SlitheringSoup.id,
                Items.StingySullivan.id,
                Items.Grooviton.id,
                Items.Flashfunk.id,
                Items.NosyNolan.id,
                Items.Hypnomon.id,
                Items.TeleFart.id,
                Items.BlingRing.id,
                Items.PlantPlug.id,
                Items.RainbowMunch.id,
            ),
            port = 31346,
            unlock_price=Items.Flashfunk.id,
        ),

        # ##### #
        # Duels #
        # ##### #
        NPC('D1', NPC.Kind.DUEL,
            front = 'M4',
            inventory = {
                Items.TonyStank.id: 14,
                Items.ClementEye.id: 12,
                Items.CalciumFancium.id: 10,
                Items.CactusJack.id: 8,
                Items.WonderWall.id: 6,
            },
            default_move = (Items.TonyStank.id, Items.ClementEye.id, Items.CalciumFancium.id),
            risked_prizes = (
                Items.TonyStank.id,
                Items.PlantPlug.id,
                Items.ShimmerGlimmer.id,
            ),
            desired_prizes = (
                Items.Smellmonell.id,
                Items.StingySullivan.id,
                Items.NosyNolan.id,
            ),
            unlock_price = Items.TeleFart.id,
            port=31348,
        ),

        NPC('D2', NPC.Kind.DUEL,
            front = 'M4',
            inventory = {
                Items.GongLong.id: 14,
                Items.BlingRing.id: 12,
                Items.NosyNolan.id: 10,
                Items.ForkThis.id: 8,
                Items.FattyPatty.id: 6,
            },
            unlock_price = Items.DiamondDough.id,
            default_move = (Items.GongLong.id, Items.BlingRing.id, Items.NosyNolan.id),
            risked_prizes=[
                Items.ClementEye.id,
                Items.PlantPlug.id,
                Items.StingySullivan.id,
            ],
            desired_prizes=[
                Items.Grooviton.id,
                Items.GongLong.id,
                Items.CactusJack.id,
            ],
            port=31348,
        ),

        NPC('D3', NPC.Kind.DUEL,
            front = 'M1',
            inventory = {
                Items.Flashfunk.id: 14,
                Items.Hypnomon.id: 12,
                Items.RainbowMunch.id: 10,
                Items.StingySullivan.id: 8,
                Items.NosyNolan.id: 6,
            },
            default_move = (Items.Flashfunk.id, Items.Hypnomon.id, Items.RainbowMunch.id),
            risked_prizes = (
                Items.TonyStank.id,
                Items.ClementEye.id,
            ),
            desired_prizes = (
                Items.NosyNolan.id,
                Items.RainbowMunch.id,
            ),
            port=31348,
        ),

        NPC('D4', NPC.Kind.DUEL,
            front = 'M1',
            inventory = {
                Items.NosyNolan.id: 14,
                Items.HonkHonk.id: 12,
                Items.SnoozeBest.id: 10,
                Items.ShimmerGlimmer.id: 8,
                Items.CactusJack.id: 6,
            },
            default_move = (Items.NosyNolan.id, Items.HonkHonk.id, Items.SnoozeBest.id),
            risked_prizes=[
                Items.FattyPatty.id,
                Items.WonderWall.id,
            ],
            desired_prizes=[
                Items.HonkHonk.id,
                Items.OminousOnion.id,
                Items.CactusJack.id,
            ],
            port=31348,
        ),

        NPC('D5', NPC.Kind.DUEL,
            front = 'M2',
            inventory = {
                Items.Smellmonell.id: 14,
                Items.ForkThis.id: 12,
                Items.FattyPatty.id: 10,
                Items.OminousOnion.id: 8,
                Items.WonderWall.id: 6,
            },
            default_move = (Items.Smellmonell.id, Items.ForkThis.id, Items.FattyPatty.id),
            risked_prizes=[
                Items.HonkHonk.id,
            ],
            desired_prizes=[
                Items.PlantPlug.id,
                Items.Smellmonell.id,
                Items.ShimmerGlimmer.id,
                Items.CactusJack.id,
            ],
            port=31348,
        ),
        
        # Tutorial unlock
        NPC('D6', NPC.Kind.DUEL,
            front = 'M1',
            inventory = {
                Items.FoxyBoxy.id: 10,
                Items.MirrorMirror.id: 10,
                Items.SugarCrush.id: 10,
                Items.Hypnomon.id: 10,
                Items.PlantPlug.id: 10,
            },
            default_move = (Items.FoxyBoxy.id, Items.MirrorMirror.id, Items.SugarCrush.id),
            unlock_price = Items.SnoozeBest.id,
            risked_prizes = [
                Items.FoxyBoxy.id
            ],
            desired_prizes = [
                Items.SnoozeBest.id
            ],
            port = 31347
        ),

        NPC('D7', NPC.Kind.DUEL,
            front = 'M4',
            inventory = {
                Items.DeFeeters.id: 14,
                Items.Hypnomon.id: 12,
                Items.DurianGrey.id: 10,
                Items.Skelebowl.id: 8,
                Items.CloakKent.id: 6,
            },
            default_move = (Items.DeFeeters.id, Items.Hypnomon.id, Items.DurianGrey.id),
            risked_prizes=[
                Items.Smellmonell.id,
                Items.ForkThis.id,
                Items.StingySullivan.id,
                Items.BlingRing.id,
            ],
            desired_prizes=[
                Items.DiamondDough.id,
            ],
            port=31348,
        ),

        NPC('D8', NPC.Kind.DUEL,
            front = 'M1',
            inventory = {
                Items.StingySullivan.id: 14,
                Items.BlingRing.id: 12,
                Items.ClementEye.id: 10,
                Items.CalciumFancium.id: 8,
                Items.NosyNolan.id: 6,
            },
            default_move = (Items.StingySullivan.id, Items.BlingRing.id, Items.ClementEye.id),
            risked_prizes=[
                Items.ClementEye.id,
            ],
            desired_prizes=[
                Items.Flashfunk.id,
                Items.GongLong.id,
            ],
            port=31348,
        ),

        NPC('D9', NPC.Kind.DUEL,
            front = 'M2',
            inventory = {
                Items.CalciumFancium.id: 14,
                Items.ForkThis.id: 12,
                Items.SugarCrush.id: 10,
                Items.OminousOnion.id: 8,
                Items.FattyPatty.id: 6,
            },
            default_move = (Items.CalciumFancium.id, Items.ForkThis.id, Items.SugarCrush.id),
            risked_prizes=[
                Items.WonderWall.id,
            ],
            desired_prizes=[
                Items.OminousOnion.id,
                Items.CalciumFancium.id,
                Items.FattyPatty.id,
            ],
            port=31348,
        ),

        NPC('D10', NPC.Kind.DUEL,
            front = 'M1',
            inventory = {
                Items.Flashfunk.id: 14,
                Items.ClementEye.id: 12,
                Items.StingySullivan.id: 10,
                Items.NastyNoodles.id: 8,
                Items.FattyPatty.id: 6,
            },
            default_move = (Items.Flashfunk.id, Items.ClementEye.id, Items.StingySullivan.id),
            risked_prizes=[
                Items.TonyStank.id,
                Items.StingySullivan.id,
            ],
            desired_prizes=[
                Items.GongLong.id,
            ],
            port=31348,
        ),

        NPC('D11', NPC.Kind.DUEL,
            front = 'M4',
            inventory = {
                Items.TeleFart.id: 14,
                Items.GongLong.id: 12,
                Items.NastyNoodles.id: 10,
                Items.StingySullivan.id: 8,
                Items.ShimmerGlimmer.id: 6,
            },
            default_move = (Items.TeleFart.id, Items.GongLong.id, Items.NastyNoodles.id),
            unlock_price = Items.Grooviton.id,
            risked_prizes=[
                Items.PlantPlug.id,
                Items.NosyNolan.id,
            ],
            desired_prizes=[
                Items.BlingRing.id,
            ],
            port=31348,
        ),

        NPC('D12', NPC.Kind.DUEL,
            front = 'M2',
            inventory = {
                Items.TonyStank.id: 14,
                Items.Grooviton.id: 12,
                Items.StingySullivan.id: 10,
                Items.HonkHonk.id: 8,
                Items.SugarCrush.id: 6,
            },
            default_move = (Items.TonyStank.id, Items.Grooviton.id, Items.StingySullivan.id),
            risked_prizes=[
                Items.ForkThis.id,
            ],
            desired_prizes=[
                Items.SnoozeBest.id,
            ],
            port=31348,
        ),

        NPC('D13', NPC.Kind.DUEL,
            front = 'M4',
            inventory = {
                Items.HolyMoly.id: 10,
                Items.SlitheringSoup.id: 10,
                Items.PocketHole.id: 10,
                Items.CloakKent.id: 10,
                Items.DurianGrey.id: 10,
            },
            default_move = (Items.PocketHole.id, Items.DurianGrey.id, Items.HolyMoly.id),
            risked_prizes=[Items.FoxyBoxy.id],
            desired_prizes=[Items.FoxyBoxy.id],
            port=31345
        ),

        NPC('D14', NPC.Kind.DUEL,
            front = 'M4',
            inventory = {
                Items.DeFeeters.id: 14,
                Items.Skelebowl.id: 12,
                Items.DiamondDough.id: 10,
                Items.TeleFart.id: 8,
                Items.Grooviton.id: 6,
            },
            default_move = (Items.DeFeeters.id, Items.Skelebowl.id, Items.DiamondDough.id),
            risked_prizes=[
                Items.Hypnomon.id,
            ],
            desired_prizes=[
                Items.DeFeeters.id,
            ],
            port=31348,
        ),

        NPC('D15', NPC.Kind.DUEL,
            front = 'M1',
            inventory = {
                Items.MirrorMirror.id: 14,
                Items.Hypnomon.id: 12,
                Items.HolyMoly.id: 10,
                Items.SlitheringSoup.id: 8,
                Items.PlantPlug.id: 6,
            },
            default_move = (Items.MirrorMirror.id, Items.Hypnomon.id, Items.HolyMoly.id),
            risked_prizes=[
                Items.DeFeeters.id,
            ],
            desired_prizes=[
                Items.Hypnomon.id,
            ],
            port=31348,
        ),

        NPC('TD1', NPC.Kind.DUEL, # Tutorial only
            front = 'TM1',
            inventory = {
                Items.HonkHonk.id: 20,
                Items.SnoozeBest.id: 20,
                Items.ForkThis.id: 20,
            },
            default_move = (Items.HonkHonk.id, Items.SnoozeBest.id, Items.ForkThis.id),
            risked_prizes = (
                Items.SugarCrush.id,
            ),
            desired_prizes = (
                Items.FattyPatty.id,
            ),
            # No port, this NPC plays the default_move only
        ),

        # ############# #
        # Arena Masters #
        # ############# #
        NPC('M1', NPC.Kind.ARENA_MASTER,
            permitted_items = ALL_ITEMS
        ),
        NPC('M2', NPC.Kind.ARENA_MASTER,
            permitted_items = ALL_ITEMS
        ),
        NPC('M3', NPC.Kind.ARENA_MASTER,
            allow_human_duels = True, # The most human arena master
            permitted_items=[
                Items.ForkThis.id,
                Items.HonkHonk.id,
                Items.SnoozeBest.id,
                Items.ShimmerGlimmer.id,
                Items.SugarCrush.id,
                Items.StingySullivan.id,
                Items.OminousOnion.id,
                Items.WonderWall.id,
                Items.TonyStank.id,
                Items.CactusJack.id,
                Items.ClementEye.id,
                Items.CalciumFancium.id,
                Items.BlingRing.id,
                Items.NosyNolan.id,
                Items.Smellmonell.id,
                Items.FattyPatty.id,
                Items.GongLong.id,
                Items.NastyNoodles.id,
            ]
        ),
        NPC('M4', NPC.Kind.ARENA_MASTER,
            permitted_items = ALL_ITEMS,
            unlock_price=Items.PlantPlug.id
        ),
        NPC('TM1', NPC.Kind.ARENA_MASTER,
            # Ready
            permitted_items = [
                Items.SugarCrush.id, 
                Items.FattyPatty.id
            ],
        ), # Tutorial only
    ]
}

TUTORIAL_UNLOCK = 'D6'

INITIALY_LOCKED_NPCS = [npc.id for npc in NPCs.values() if npc.unlock_price is not None]
