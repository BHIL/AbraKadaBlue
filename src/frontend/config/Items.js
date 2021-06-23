class Item {
    constructor(id, name, classname, description) {
        this.id = id;
        this.name = name;
        this.classname = classname;
        this.description = description;
    }
}


const _items = [
    new Item(1, 'TeleFart', 'TeleFart', 'An ancient wizard’s fart that came to life, terrorizing the land with its awful smell until its capture by Boredino, the wizard with too much time on his hands'),
    new Item(2, 'Tony Stank', 'TonyStank', 'A graduate of the prestigious Skunk Academy that has fallen on hard times due to a failed perfume start-up. Will stink for food.'),
    new Item(3, 'Grooviton', 'Grooviton', 'A relic from the Village of the People, where Disco never died. Until it did. Since then this disco ball has seen its fair share of garage sales, waiting to shine once again.'),
    new Item(4, 'Flashfunk', 'Flashfunk', 'According to an ancient  prophecy, it is said that a hero will come to this land, encounter  this flashy spinner, and be by mildly amused by it'),
    new Item(5, 'Honk Honk!', 'HonkHonk', 'Wanna hear the most annoying sound in the world? This accursed horn has been banned from every league in the land, except this one. You’re welcome.'),
    new Item(6, 'Gong Long', 'Gong_Long', 'This fine-tuned bowl was first implemented during the Hundred Year Snore, a magic war too boring to talk about. Musical talent not included'),    
    new Item(7, 'Sugar Crush', 'SugarCrush', 'The official ice cream of the Abra KadBlue League! May contain magic, dark magic, orc cane sugar, pharmaceutical grade potions and programmer tears.'),
    new Item(8, 'Plant Plug', 'PlantPlug', 'What happens when a race of tiny fairy farmers settles in your ear canal? This. This happens. At least you get free tomatoes.'),
    new Item(9, 'Snooze Best', 'SnoozeBest', 'A book of spells filled with such tedious, uninteresting information that even reading its description can put you to sleep.'),
    new Item(10, 'Pocket Hole', 'PocketHole', 'A limited-edition cereal box prize shipped with the popular brand WhizzO’s. Caution: May end all of existence and cause mild skin irritation.'),
    new Item(11, 'Smellmonell', 'Smellmonell', 'Developed as a medical  treatment for people who lost their sense of smell, it was  banned from use after patients started selling their noses on the  black market. '),
    new Item(12, 'Nasty Noodles', 'NastyNoodles', 'The evil wizard Trololo’s favorite food. You feel an inexplicable need to constantly share pictures of this dish with complete strangers.'),
    new Item(13, 'Fork This', 'ForkThis', 'A haunted dinner set that roams the land and terrorizes people who didn’t eat everything off of their plate.'),
    new Item(14, 'ClementEye', 'ClementEye', 'Created by the grocery chain SorcerMart as an edible anti-theft device, this fruity cyclops has your back. Don’t let it near your wallet, though.'),
    new Item(15, 'DeFeeters', 'DeFeeters', 'Unwashed socks left behind by the evil wizard Trololo during his  last rampage through the  kingdom. No laundromat is brave enough to take this pair on.'),
    new Item(16, 'Hypnomon', 'Hypnomon', 'Wizard schools claimed this helps beginner wizards keep their rhythm while casting spells, but it actually hypnotized them into buying more spell books.'),
    new Item(17, 'Shimmer Glimmer', 'ShimmerGlimmer', 'A contraband potion made in the Underworld Underpass, where safety regulations are somewhat laxer. Drink at your own peril, and keep away from Sheryl.'),
    new Item(18, 'Durian Grey', 'DurianGrey', 'A fruit so nasty eating it is considered capital punishment. Many a poor prisoner were sentenced to this smelly fate. '),
    new Item(19, 'Ominous Onion', 'OminousOnion', 'An escaped convict from the prison colony Salad 5, this onion now spends its days as a soldier for hire. It can make anyone cry… for the right price.'),
    new Item(20, 'Skelebowl', 'Skelebowl', 'Is this bowl filled with the remains of an unfortunate wizard, or the latest food craze in the wizarding world? Put it in your mouth and find out!'),
    new Item(21, 'Holy Moly', 'HolyMoly', 'The official sponsor of the AbraKadaBlue League. A drink favored by the gods of drink/gods who drink. '),
    new Item(22, 'Calcium Fancium', 'CalciumFancium', 'The height of the wizard experience. Every time you take a sip, an angel gets hydrated.'),
    new Item(23, 'Stingy Sullivan', 'StingySullivan', 'A moquito that can tell whos  naughty or nice, but stingseveryone anyway. Kind of a prickwhen you think about it.'),
    new Item(24, 'Bling Ring', 'BlingRing', 'Before wizard battles were introduced, wizards used this device to leave incomprehensible, drunken messages to each other in the middle of the night.'),
    new Item(25, 'Cactus Jack', 'CactusJack', 'This rough looking plant is actually a fashion icon in the Kingdom of Fluff, strutting on walkways while wearing the latest in wizard’s wear.'),
    new Item(26, 'Diamond Dough', 'DiamondDough', 'The Devilish Dentist Scrivello designed and marketed these nigh-indestructible cookies in an effort to get more patients.'),
    new Item(27, 'Slithering Soup', 'SlitheringSoup', 'take great care when eating this soup, or it will slither right out of your stomach!'),
    new Item(28, 'Mirror Mirror', 'Mirror_Mirror', 'A magical mirror found at the bottom of the lake. Stare at it long enough and it’ll show you where you left your car keys last night.'),
    new Item(29, 'Nosy Nolan', 'Nosy_Nolan', 'Carved from an odorless tree, this clip will hold onto your nose  until you forget what birthday cakes and wet Chihuahua smell like.  '),
    new Item(30, 'Cloak Kent', 'Cloak_kent', 'The old King Dragon would wear this on his nightly trips to the   bathroom when he didn’t feel  like putting on clothes. '),
    new Item(31, 'Foxy Boxy', 'Foxy_boxy', 'A magical box containing random items belonging to the  great wizard Pandora the Disorganized. Is this where you left your long lost youth? '),
    new Item(32, 'Fatty Patty', 'Fatty_Patty', 'Have you ever tried an entire 10 course meal stuffed inbetween 2 burger buns? Legally it cant be called a hamburger, but it sure tastes delicious '),
    new Item(33, 'Rainbow Munch', 'Rainbow_Munch', 'Manufactured in a unicorn sweatshop, only wizards with teeth stronger than steel will be able to take a bite out its colorful exterior.'),
    new Item(34, 'Wonder Wall', 'Wonder_Wall', 'Today is gonna be the day that theyre gonna troll it back to you. Wonder Wall - Sunglasses for the soul.'),
];

const Items = Object.assign({}, ..._items.map(item => ({[item.id]: item})));

export default Items;

