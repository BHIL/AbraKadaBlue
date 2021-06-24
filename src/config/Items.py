from collections import namedtuple


class Dmg(namedtuple('Dmg', ['trollerance','energy'])):
    def __mul__(self, factor):
        return Dmg(self.trollerance * factor, self.energy * factor)

    def abs(self):
        return Dmg(abs(self.trollerance), abs(self.energy))

class Atk(namedtuple('Atk', ['medium', 'damage', 'reaction'])):
    def __mul__(self, factor):
        return Atk(self.medium, self.damage * factor, self.reaction)


class Item:
    def __init__(self, id, attack=None, defence=None, is_animal=False):
        self.id = id
        self.attack = attack
        self.defence = defence
        self.is_animal = is_animal

    def __repr__(self):
        return f"<{self.__class__.__name__}(id={repr(self.id)})>"


class Attack:
    class Medium:
        SMELL = 'SMELL'
        CLOSE_SMELL = 'CLOSE_SMELL'
        LIGHT = 'LIGHT'
        SOUND = 'SOUND'
        FOOD = 'FOOD'

    class Reaction:
        BLINK = 'blink'
        CRY = 'cry'
        HIPNOTIC = 'hipnotic'
        SLEEPY = 'sleepy'
        STINKY = 'stinky'
        LOUD = 'loud'
        
    def get(self):
        raise NotImplementedError()


class Defence:
    def assess(self, defences, scare_animals):
        raise NotImplementedError()

    def apply(self):
        return Dmg(0, 0)


class BasicAttack(Attack):
    def __init__(self, medium, trollerance, energy, reaction):
        self._medium = medium
        self._damage = Dmg(trollerance, energy)
        self._reaction = reaction
        
    def get(self):
        return Atk(self._medium, self._damage, self._reaction)


class SpecialAttack(BasicAttack):
    pass

class BasicDefence(Defence):
    def __init__(self, defences, scare_animals=False):
        self._defences = defences
        self._scare_animals = scare_animals

    def assess(self, attack, is_animal):
        if self._scare_animals and is_animal:
            return Dmg(0, 0)
        else:
            f = (100 - self._defences.get(attack.medium, 0)) / 100.
            return attack.damage * f


class FoodDefence(Defence):
    def __init__(self, trollerance, energy):
        self._damage = Dmg(trollerance, energy)

    def assess(self, attack, is_animal):
        return attack.damage

    def apply(self):
        return self._damage

class SpecialFoodDefence(FoodDefence):
    pass

class Items:
    TeleFart = Item(1, attack=BasicAttack(Attack.Medium.CLOSE_SMELL, -20, 0, Attack.Reaction.STINKY), defence=BasicDefence({
        Attack.Medium.LIGHT: 35,
        Attack.Medium.SMELL: 35
    }))

    TonyStank = Item(2, attack=BasicAttack(Attack.Medium.SMELL, -20, 0, Attack.Reaction.STINKY), defence=BasicDefence({
        Attack.Medium.LIGHT: 35,
        Attack.Medium.FOOD: 35
    }), is_animal=True)

    Grooviton = Item(3, attack=BasicAttack(Attack.Medium.LIGHT, -20, 0, Attack.Reaction.BLINK), defence=BasicDefence({
        Attack.Medium.LIGHT: 35,
        Attack.Medium.SOUND: 30
    }))
    
    Flashfunk = Item(4, attack=BasicAttack(Attack.Medium.LIGHT, -50, 0, Attack.Reaction.BLINK), defence=BasicDefence({
        Attack.Medium.SMELL: 35,
        Attack.Medium.SOUND: 30
    }))

    HonkHonk = Item(5, attack=BasicAttack(Attack.Medium.SOUND, -10, 0, Attack.Reaction.LOUD), defence=BasicDefence({
        # No defence
    }, scare_animals=True))
     
    GongLong = Item(6, attack=BasicAttack(Attack.Medium.SOUND, -20, -20, Attack.Reaction.LOUD), defence=BasicDefence({
        Attack.Medium.SOUND: 20,
    }, scare_animals=True))

    SugarCrush = Item(7, attack=BasicAttack(Attack.Medium.FOOD, 0, 10, Attack.Reaction.STINKY), defence=FoodDefence(5, 10))

    PlantPlug = Item(8, defence=BasicDefence({
        Attack.Medium.SOUND: 35,
    }))

    SnoozeBest = Item(9, attack=BasicAttack(Attack.Medium.SOUND, 0, -10, Attack.Reaction.SLEEPY), defence=BasicDefence({
        Attack.Medium.LIGHT: 30,
    }))
    
    PocketHole = Item(10, attack=SpecialAttack(Attack.Medium.LIGHT, 0, 0, Attack.Reaction.HIPNOTIC), defence=BasicDefence({
        Attack.Medium.SOUND: 100,
        Attack.Medium.SMELL: 100,
        Attack.Medium.FOOD: 100,
        Attack.Medium.LIGHT: 100,
        Attack.Medium.CLOSE_SMELL: 100,
    }))

    Smellmonell = Item(11, attack=BasicAttack(Attack.Medium.SMELL, -15, 0, Attack.Reaction.HIPNOTIC))
    
    NastyNoodles = Item(12, attack=BasicAttack(Attack.Medium.FOOD, -20, -10, Attack.Reaction.STINKY), defence=FoodDefence(20, 10))
    
    ForkThis = Item(13, attack=BasicAttack(Attack.Medium.SOUND, -10, 0, Attack.Reaction.LOUD), defence=BasicDefence({
        Attack.Medium.LIGHT: 25,
    }))
    
    ClementEye = Item(14, attack=BasicAttack(Attack.Medium.SMELL, -20, 0, Attack.Reaction.STINKY), defence=FoodDefence(25, 10))

    DeFeeters = Item(15, attack=BasicAttack(Attack.Medium.SMELL, -45, -20, Attack.Reaction.STINKY), defence=BasicDefence({
        Attack.Medium.LIGHT: 35,
    }))

    Hypnomon = Item(16, attack=BasicAttack(Attack.Medium.LIGHT, 0, -40, Attack.Reaction.HIPNOTIC), defence=BasicDefence({
        Attack.Medium.LIGHT: 30,
        Attack.Medium.SOUND: 30,
    }))

    ShimmerGlimmer = Item(17, attack=BasicAttack(Attack.Medium.CLOSE_SMELL, -10, -10, Attack.Reaction.STINKY), defence=BasicDefence({
        Attack.Medium.LIGHT: 30,
    }))

    DurianGrey = Item(18, attack=BasicAttack(Attack.Medium.SMELL, -45, 0, Attack.Reaction.STINKY), defence=FoodDefence(30, 20))

    OminousOnion = Item(19, attack=BasicAttack(Attack.Medium.CLOSE_SMELL, -15, 0, Attack.Reaction.CRY), defence=BasicDefence({
        # No defence
    }, scare_animals=True), is_animal=True)

    Skelebowl = Item(20, attack=BasicAttack(Attack.Medium.FOOD, 0, 25, Attack.Reaction.STINKY), defence=FoodDefence(32, 25))

    HolyMoly = Item(21, attack=BasicAttack(Attack.Medium.SOUND, -50, 0, Attack.Reaction.HIPNOTIC), defence=BasicDefence({
        Attack.Medium.SMELL: 40,
        Attack.Medium.FOOD: 40,
        Attack.Medium.CLOSE_SMELL: 10,
    }))

    CalciumFancium = Item(22, attack=BasicAttack(Attack.Medium.FOOD, 0, -30, Attack.Reaction.SLEEPY), defence=FoodDefence(0, -30))

    StingySullivan = Item(23, attack=BasicAttack(Attack.Medium.SMELL, -25, 0, Attack.Reaction.SLEEPY), defence=BasicDefence({
        Attack.Medium.SMELL: 35,
    }))

    BlingRing = Item(24, attack=BasicAttack(Attack.Medium.SOUND, -20, 0, Attack.Reaction.LOUD), defence=BasicDefence({
        Attack.Medium.SOUND: 35,
    }, scare_animals=True))

    CactusJack = Item(25, attack=BasicAttack(Attack.Medium.SOUND, -15, 0, Attack.Reaction.LOUD), defence=BasicDefence({
        Attack.Medium.LIGHT: 20,
        Attack.Medium.SOUND: 25,
    }))

    DiamondDough = Item(26, attack=BasicAttack(Attack.Medium.FOOD, -30, -20, Attack.Reaction.CRY), defence=BasicDefence({
        Attack.Medium.LIGHT: 35,
    }))

    SlitheringSoup = Item(27, attack=BasicAttack(Attack.Medium.FOOD, -45, -10, Attack.Reaction.STINKY), defence=BasicDefence({
        # No defence
    }, scare_animals=True))

    MirrorMirror = Item(28, attack=BasicAttack(Attack.Medium.LIGHT, -10, 0, Attack.Reaction.BLINK)) # This item has a special defence

    NosyNolan = Item(29, attack=BasicAttack(Attack.Medium.SMELL, -15, 0, Attack.Reaction.STINKY), defence=BasicDefence({
        Attack.Medium.CLOSE_SMELL: 60,
        Attack.Medium.SMELL: 35,
    }))

    CloakKent = Item(30, attack=BasicAttack(Attack.Medium.LIGHT, -45, 0, Attack.Reaction.CRY), defence=BasicDefence({
        Attack.Medium.LIGHT: 40,
    }))

    FoxyBoxy = Item(31, attack=SpecialAttack(Attack.Medium.LIGHT, -25, 0, Attack.Reaction.HIPNOTIC), defence=SpecialFoodDefence(25, 10))

    FattyPatty = Item(32, attack=BasicAttack(Attack.Medium.FOOD, -5, -15, Attack.Reaction.STINKY), defence=FoodDefence(5, 15))

    RainbowMunch = Item(33, attack=BasicAttack(Attack.Medium.FOOD, 35, 0, Attack.Reaction.STINKY), defence=FoodDefence(35, 25))

    WonderWall = Item(34, attack=BasicAttack(Attack.Medium.LIGHT, -15, 0, Attack.Reaction.BLINK), defence=BasicDefence({
        Attack.Medium.SOUND: 30,
    }))

items_by_id = {i.id: i for i in Items.__dict__.values() if type(i) == Item}

INITIAL_INVENTORY = [
    {'item_id': Items.FattyPatty.id, 'amount': 9},
    {'item_id': Items.CactusJack.id, 'amount': 8},
    {'item_id': Items.WonderWall.id, 'amount': 8},
    {'item_id': Items.SugarCrush.id, 'amount': 1},
]

INITIAL_INVENTORY_AFTER_TUTORIAL = [
    {'item_id': Items.OminousOnion.id, 'amount': 30},
    {'item_id': Items.SnoozeBest.id, 'amount': 30},
    {'item_id': Items.ForkThis.id, 'amount': 30},
    {'item_id': Items.ShimmerGlimmer.id, 'amount': 30},
]

MAX_INVENTORY_SIZE = 5
