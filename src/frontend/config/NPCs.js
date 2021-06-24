import {NPC_TYPE, SPEAKER} from 'enums';
import {TUTORIAL_NPC} from 'consts';

const _SHARED_CONFIG = {"B1": {"permitted_items": [5, 9, 13, 17, 19, 25, 34]}, "B2": {"permitted_items": [2, 7, 14, 22, 23, 24, 29]}, "B3": {"permitted_items": [7, 11, 32, 34]}, "B4": {"permitted_items": [6, 12, 14, 22]}, "T1": {"permitted_items": [1, 2, 3, 4, 5, 6, 8, 7, 12, 10, 28, 9, 13, 14, 15, 16, 17, 19, 18, 20, 21, 22, 23, 24, 25, 26, 27, 11, 29, 30, 31, 32, 33, 34], "inventory": [{"item_id": 1, "amount": 1}, {"item_id": 30, "amount": 1}]}, "T2": {"permitted_items": [4, 19, 20, 26, 33, 34], "inventory": [{"item_id": 26, "amount": 1}, {"item_id": 20, "amount": 1}]}, "T3": {"permitted_items": [9, 13, 22, 32, 11, 7, 2, 3, 18, 33, 25], "inventory": [{"item_id": 2, "amount": 1}, {"item_id": 3, "amount": 1}, {"item_id": 7, "amount": 1}, {"item_id": 9, "amount": 1}, {"item_id": 11, "amount": 1}, {"item_id": 13, "amount": 1}, {"item_id": 18, "amount": 1}, {"item_id": 22, "amount": 1}, {"item_id": 25, "amount": 1}, {"item_id": 32, "amount": 1}, {"item_id": 33, "amount": 1}]}, "T4": {"permitted_items": [9, 19, 5, 13, 17], "inventory": [{"item_id": 9, "amount": 1}, {"item_id": 19, "amount": 3}]}, "T5": {"permitted_items": [7, 19, 5, 13, 17, 32, 25, 34], "inventory": [{"item_id": 5, "amount": 1}, {"item_id": 13, "amount": 1}, {"item_id": 17, "amount": 1}]}, "T6": {"permitted_items": [13, 11, 3, 29, 1, 23, 24, 28, 4], "inventory": [{"item_id": 4, "amount": 1}, {"item_id": 23, "amount": 7}, {"item_id": 29, "amount": 4}, {"item_id": 11, "amount": 9}]}, "T7": {"permitted_items": [6, 7, 12, 14, 22, 34, 5, 9, 13, 17, 19, 25, 32], "inventory": [{"item_id": 6, "amount": 10}, {"item_id": 7, "amount": 10}, {"item_id": 12, "amount": 10}, {"item_id": 14, "amount": 10}, {"item_id": 22, "amount": 10}, {"item_id": 34, "amount": 10}]}, "T8": {"unlock_price": 4, "permitted_items": [11, 27, 23, 3, 4, 29, 16, 1, 24, 8, 33], "inventory": [{"item_id": 11, "amount": 1}, {"item_id": 27, "amount": 1}, {"item_id": 23, "amount": 1}, {"item_id": 3, "amount": 1}, {"item_id": 4, "amount": 1}, {"item_id": 29, "amount": 1}, {"item_id": 16, "amount": 1}, {"item_id": 1, "amount": 1}, {"item_id": 24, "amount": 1}, {"item_id": 8, "amount": 1}, {"item_id": 33, "amount": 1}]}, "D1": {"unlock_price": 1, "inventory": [{"item_id": 2, "amount": 14}, {"item_id": 14, "amount": 12}, {"item_id": 22, "amount": 10}, {"item_id": 25, "amount": 8}, {"item_id": 34, "amount": 6}]}, "D2": {"unlock_price": 26, "inventory": [{"item_id": 6, "amount": 14}, {"item_id": 24, "amount": 12}, {"item_id": 29, "amount": 10}, {"item_id": 13, "amount": 8}, {"item_id": 32, "amount": 6}]}, "D3": {"inventory": [{"item_id": 4, "amount": 14}, {"item_id": 16, "amount": 12}, {"item_id": 33, "amount": 10}, {"item_id": 23, "amount": 8}, {"item_id": 29, "amount": 6}]}, "D4": {"inventory": [{"item_id": 29, "amount": 14}, {"item_id": 5, "amount": 12}, {"item_id": 9, "amount": 10}, {"item_id": 17, "amount": 8}, {"item_id": 25, "amount": 6}]}, "D5": {"inventory": [{"item_id": 11, "amount": 14}, {"item_id": 13, "amount": 12}, {"item_id": 32, "amount": 10}, {"item_id": 19, "amount": 8}, {"item_id": 34, "amount": 6}]}, "D6": {"unlock_price": 9, "inventory": [{"item_id": 31, "amount": 10}, {"item_id": 28, "amount": 10}, {"item_id": 7, "amount": 10}, {"item_id": 16, "amount": 10}, {"item_id": 8, "amount": 10}]}, "D7": {"inventory": [{"item_id": 15, "amount": 14}, {"item_id": 16, "amount": 12}, {"item_id": 18, "amount": 10}, {"item_id": 20, "amount": 8}, {"item_id": 30, "amount": 6}]}, "D8": {"inventory": [{"item_id": 23, "amount": 14}, {"item_id": 24, "amount": 12}, {"item_id": 14, "amount": 10}, {"item_id": 22, "amount": 8}, {"item_id": 29, "amount": 6}]}, "D9": {"inventory": [{"item_id": 22, "amount": 14}, {"item_id": 13, "amount": 12}, {"item_id": 7, "amount": 10}, {"item_id": 19, "amount": 8}, {"item_id": 32, "amount": 6}]}, "D10": {"inventory": [{"item_id": 4, "amount": 14}, {"item_id": 14, "amount": 12}, {"item_id": 23, "amount": 10}, {"item_id": 12, "amount": 8}, {"item_id": 32, "amount": 6}]}, "D11": {"unlock_price": 3, "inventory": [{"item_id": 1, "amount": 14}, {"item_id": 6, "amount": 12}, {"item_id": 12, "amount": 10}, {"item_id": 23, "amount": 8}, {"item_id": 17, "amount": 6}]}, "D12": {"inventory": [{"item_id": 2, "amount": 14}, {"item_id": 3, "amount": 12}, {"item_id": 23, "amount": 10}, {"item_id": 5, "amount": 8}, {"item_id": 7, "amount": 6}]}, "D13": {"inventory": [{"item_id": 21, "amount": 10}, {"item_id": 27, "amount": 10}, {"item_id": 10, "amount": 10}, {"item_id": 30, "amount": 10}, {"item_id": 18, "amount": 10}]}, "D14": {"inventory": [{"item_id": 15, "amount": 14}, {"item_id": 20, "amount": 12}, {"item_id": 26, "amount": 10}, {"item_id": 1, "amount": 8}, {"item_id": 3, "amount": 6}]}, "D15": {"inventory": [{"item_id": 28, "amount": 14}, {"item_id": 16, "amount": 12}, {"item_id": 21, "amount": 10}, {"item_id": 27, "amount": 8}, {"item_id": 8, "amount": 6}]}, "TD1": {"inventory": [{"item_id": 5, "amount": 20}, {"item_id": 9, "amount": 20}, {"item_id": 13, "amount": 20}]}, "M1": {"permitted_items": [1, 2, 3, 4, 5, 6, 8, 7, 12, 10, 28, 9, 13, 14, 15, 16, 17, 19, 18, 20, 21, 22, 23, 24, 25, 26, 27, 11, 29, 30, 31, 32, 33, 34]}, "M2": {"permitted_items": [1, 2, 3, 4, 5, 6, 8, 7, 12, 10, 28, 9, 13, 14, 15, 16, 17, 19, 18, 20, 21, 22, 23, 24, 25, 26, 27, 11, 29, 30, 31, 32, 33, 34]}, "M3": {"permitted_items": [13, 5, 9, 17, 7, 23, 19, 34, 2, 25, 14, 22, 24, 29, 11, 32, 6, 12]}, "M4": {"unlock_price": 8, "permitted_items": [1, 2, 3, 4, 5, 6, 8, 7, 12, 10, 28, 9, 13, 14, 15, 16, 17, 19, 18, 20, 21, 22, 23, 24, 25, 26, 27, 11, 29, 30, 31, 32, 33, 34]}, "TM1": {"permitted_items": [7, 32]}};

export class NPCConfig {
    constructor(id, name, type, graphics, conversation, locked_graphics=null, locked_conversation=null, src_url=null) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.graphics = graphics;
        this.conversation = conversation;
        this.locked_graphics = locked_graphics;
        this.locked_conversation = locked_conversation;
        this.src_url = src_url;

        // Config shared with the server
        this.permitted_items = _SHARED_CONFIG[id]?.permitted_items;
        this.unlock_price = _SHARED_CONFIG[id]?.unlock_price;
        this.inventory = _SHARED_CONFIG[id]?.inventory;
    }

    get_conversation(is_locked) {
        return is_locked ? this.locked_conversation : this.conversation;
    }
}

const _NPCs = [

    /****************
    * Arena Masters *
    ****************/

    new NPCConfig('M1', 'Master Ligma', NPC_TYPE.ARENA_MASTER, {
        sprite: 'arena_master red',
        animation_loop: [
            {x: 3355, y: 1260, animation: 'down', duration: 1400},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'If you got the balls to troll'},
        {speaker: SPEAKER.NPC, text: 'You must show control'},
        {speaker: SPEAKER.NPC, text: 'Your foes will persist'},
        {speaker: SPEAKER.NPC, text: 'And rarely desist'},
        {speaker: SPEAKER.NPC, text: 'To stop you from reaching your goal'},
    ]),

    new NPCConfig('M2', 'Master Blaster', NPC_TYPE.ARENA_MASTER, {
        sprite: 'arena_master blue',
        animation_loop: [
            {x: 400, y: 831, animation: 'down', duration: 1400},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'The benevolent wizard seeks to troll, as I embark on my morning stroll'},
        {speaker: SPEAKER.NPC, text: 'Are you here to duel, or just to stare and drool?'},
    ]),

    new NPCConfig('M3', 'Master Yoshi', NPC_TYPE.ARENA_MASTER, {
        sprite: 'arena_master yellow',
        animation_loop: [
            {x: 2473, y: 966, animation: 'down', duration: 1400},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'A Villain Returns'},
        {speaker: SPEAKER.NPC, text: 'The Chimney is in peril'},
        {speaker: SPEAKER.NPC, text: 'Prepare to do battle'},
    ]),

    new NPCConfig('M4', 'Master Pinker', NPC_TYPE.ARENA_MASTER, {
        sprite: 'arena_master pink',
        animation_loop: [
            {x: 3180, y: 185, animation: 'up', duration: 4000},
            {x: 3180, y: 185, animation: 'right', duration: 3000},
            {x: 3180, y: 185, animation: 'down', duration: 8000},
            {x: 3180, y: 185, animation: 'left', duration: 3000},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Ah! Thou hath returneth!'},
        {speaker: SPEAKER.NPC, text: 'Forsooth, I was seeking for a fool when I found you'},
        {speaker: SPEAKER.NPC, text: 'Now now, nay needeth to beest sour. How about thee release thy '},
        {speaker: SPEAKER.NPC, text: 'aggression on new battles instead?'},
    ], {
        // Locked graphics
        sprite: 'arena_master pink hidden',
        animation_loop: [
            {x: 3110, y: 390, animation: 'down', duration: 4000},
        ],
    }, [
        // Locked conversation
        {speaker: SPEAKER.NPC, text: 'Stand ho! Art thee a helpful wizard'},
        {speaker: SPEAKER.CHARACTER, text: 'I guesseth'},
        {speaker: SPEAKER.NPC, text: 'Shalt thee assist me in plugging this leaking pond? Mine own house hast been flooded for three days and nights.'},
    ]),

    
    /**********
    * Brokers *
    **********/

    new NPCConfig('B1', 'ReddIT', NPC_TYPE.BROKER, {
        sprite: 'broker_red',
        animation_loop: [
           {x: 2747, y: 390, animation: 'up', duration: 1900},
           {x: 2747, y: 611, animation: 'down', duration: 1900},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Oh, so you’re a wizard? Name every spell.'},
        {speaker: SPEAKER.CHARACTER, text: 'Ummm… '},
        {speaker: SPEAKER.NPC, text: 'Pfft, amateur'},
        {speaker: SPEAKER.CHARACTER, text: 'So what you want?… '},


    ]),
    new NPCConfig('B2', 'Mellow Yellow', NPC_TYPE.BROKER, {
        sprite: 'broker_yellow',
        animation_loop: [
            {x: 2691, y: 1616, animation: 'up', duration: 4500},
            {x: 2691, y: 1750, animation: 'down', duration: 4500},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'You from the league, right? That’s dope'},
        {speaker: SPEAKER.CHARACTER, text: 'Are you also participating?'},
        {speaker: SPEAKER.NPC, text: 'Nah, man, I’m too chill to troll'},
        {speaker: SPEAKER.NPC, text: 'What can I do you for?'},
    ]),

    new NPCConfig('B3', 'Pinkus Dingus', NPC_TYPE.BROKER, {
        sprite: 'broker_pink',
        animation_loop: [
            {x: 1614, y: 357, animation: 'up', duration: 2500},
            {x: 1512, y: 445, animation: 'down', duration: 3500},
        ],
    }, [
        {speaker: SPEAKER.CHARACTER, text: 'You can’t keep looking at the chimney all day. There are trades to do'},
        {speaker: SPEAKER.NPC, text: '“Haha chimney go brrr'},
    ]),

    new NPCConfig('B4', "Blue's Cruise", NPC_TYPE.BROKER, {
        sprite: 'broker_blue',
        animation_loop: [
            {x: 415, y: 1043, animation: 'up', duration: 5500},
            {x: 415, y: 1516, animation: 'down', duration: 5500},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'I feel the need… the need to broker trades!'},
        {speaker: SPEAKER.CHARACTER, text: 'I’m glad you’re clueing me in'},
        {speaker: SPEAKER.NPC, text: 'Show me the money'},
    ]),


    /**********
    * Traders *
    **********/

    new NPCConfig('T1', 'Hatsimus', NPC_TYPE.TRADER, {
        sprite: 'trader green2',
        animation_loop: [
            {x: 3350, y: 461, animation: 'down', duration: 4500},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'I am the great gladiator, Hatsimus!'},
        {speaker: SPEAKER.CHARACTER, text: 'So you’re part of the league, right?'},
        {speaker: SPEAKER.NPC, text: 'Me?! Are you mad?!'},
        {speaker: SPEAKER.NPC, text: 'Trades are my battlefield!'},
    ]),

    new NPCConfig('T2', 'Hatty Potter', NPC_TYPE.TRADER, {
        sprite: 'trader black',
        animation_loop: [
            {x: 1293, y: 1499, animation: 'up', duration: 9500},
            {x: 885, y: 1499, animation: 'left', duration: 9500},
            {x: 885, y: 1932, animation: 'down', duration: 9500},
            {x: 1293, y: 1932, animation: 'right', duration: 9500},
            
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'I saw a sinister looking cat lurking around the kingdom. I must pet it… For great justice.'},
        {speaker: SPEAKER.CHARACTER, text: 'How can I assist you, noble Wizard?'},

    ]),

    new NPCConfig('T3', 'Hatwell', NPC_TYPE.TRADER, {
        sprite: 'trader black2',
        animation_loop: [
            {x: 3303, y: 1747, animation: 'up', duration: 5500},
            {x: 3303, y: 1998, animation: 'down', duration: 5500},
            {x: 2894, y: 1998, animation: 'right', duration: 5500},
            {x: 3303, y: 1998, animation: 'left', duration: 5500},  
        ],
    }, [
       {speaker: SPEAKER.NPC, text: 'Trading elements only to spend them in silly battles seems rather pedestrian if you ask me'},
       {speaker: SPEAKER.CHARACTER, text: 'I didn’t'},
       {speaker: SPEAKER.NPC, text: 'I’m a busy hat, so let’s get this over with'},
    ]),

    new NPCConfig('T4', 'Whatahat', NPC_TYPE.TRADER, {
        sprite: 'trader blue',
        animation_loop: [
            {x: 2988, y: 1649, animation: 'up', duration: 3500},
            {x: 2808, y: 1933, animation: 'down', duration: 2500},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Care to try my new line of scented nose hairs?'},
        {speaker: SPEAKER.CHARACTER, text: 'No thanks, I’m just here to trade.'},
        {speaker: SPEAKER.NPC, text: 'Let me know if you change your mind, you smelly bastard…'},
    ]),

    new NPCConfig('T5', 'Chad Hatter', NPC_TYPE.TRADER, {
        sprite: 'trader blue2',
        animation_loop: [
            {x: 1527, y: 1549, animation: 'left', duration: 5500},
            {x: 1624, y: 1650, animation: 'right', duration: 5500},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'So you’re the do-gooder who’s going to save the kingdom? Cool story, bro.'},
    ]),

    new NPCConfig('T6', 'Hatrick', NPC_TYPE.TRADER, {
        sprite: 'trader purple2',
        animation_loop: [
            {x: 724, y: 164, animation: 'left', duration: 9500},
            {x: 1930, y: 164, animation: 'right', duration: 9500},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: '2 successful trades today! I’m on a roll.'},
        {speaker: SPEAKER.CHARACTER, text: 'Congrats'},
        {speaker: SPEAKER.NPC, text: 'I have a sneaking suspicion trade number 3 is staring me in the face'},
    ]),

    new NPCConfig('T7', 'P.Hat', NPC_TYPE.TRADER, {
        sprite: 'trader green',
        animation_loop: [
           {x: 1495, y: 1257, animation: 'down', duration: 3500},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Does this hat make me look fat?  '},
        {speaker: SPEAKER.CHARACTER, text: 'No?'},
        {speaker: SPEAKER.NPC, text: 'Are you just saying that to be polite?'},
        {speaker: SPEAKER.CHARACTER, text: 'Yes?'},
        {speaker: SPEAKER.NPC, text: 'How about a trade? I heard it’s very slimming :)'},

    ]),

    new NPCConfig('T8', 'Hatman', NPC_TYPE.TRADER, {
        sprite: 'trader purple',
        animation_loop: [
            {x: 1542, y: 361, animation: 'down', duration: 1000}, // Stand by the lake
            {x: 1630, y: 210, animation: 'up', duration: 1748},
            {x: 1930, y: 210, animation: 'right', duration: 3000},
            {x: 1930, y: 400, animation: 'down', duration: 1900},
            {x: 2480, y: 400, animation: 'right', duration: 5500},
            {x: 2480, y: 300, animation: 'up', duration: 1000},
            {x: 2480, y: 300, animation: 'up', duration: 2000},   // Stand in the market
            {x: 2480, y: 400, animation: 'down', duration: 1000},
            {x: 1930, y: 400, animation: 'left', duration: 5500},
            {x: 1930, y: 210, animation: 'up', duration: 1900},
            {x: 1630, y: 210, animation: 'left', duration: 3000},
            {x: 1542, y: 361, animation: 'down', duration: 1748},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Ah, it’s the wizard-who-must-not-be-named!”'},
        {speaker: SPEAKER.CHARACTER, text: 'I have a name, though...'},
        {speaker: SPEAKER.NPC, text: 'I help sort out a lot of trades in the kingdom,'},
        {speaker: SPEAKER.NPC, text: ' so I am glad to be of service!'},
    ],
    {
        // Locked graphics
        sprite: 'trader purple hidden',
        animation_loop: [
            {x: 1542, y: 361, animation: 'down', duration: 5000},
        ],
    },
    [
        // Locked conversation
        {speaker: SPEAKER.NPC, text: 'A Wizard! Excellent timing '},
        {speaker: SPEAKER.NPC, text: ' I teleported here by accident and my wand fell into the water…'},
        {speaker: SPEAKER.NPC, text: 'this never would have happened in the books!'},
        {speaker: SPEAKER.NPC, text: 'If you can arrange for something to transport me off of Dino Douche '},
        {speaker: SPEAKER.NPC, text: 'over here, I will be most thankful'},
    ]),


    /********
    * Duels *
    ********/

     new NPCConfig('D1', 'Cotton Eye Joe', NPC_TYPE.DUEL, {
        sprite: 'Cotton_Eye_Joe',
        animation_loop: [
            // Moon walk
            {x: 1320, y: 810, animation: 'left', duration: 15000},
            {x: 1320, y: 810, animation: 'left', duration: 5000},
            {x: 930, y: 820, animation: 'right', duration: 15000},

            // Walk
            {x: 1320, y: 810, animation: 'right', duration: 15000},
            {x: 1320, y: 810, animation: 'right', duration: 5000},
            {x: 930, y: 820, animation: 'left', duration: 15000},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'You’re staring at my eye again, aren’t you?'},
        {speaker: SPEAKER.CHARACTER, text: 'It’s hard to gloss over!'},
        {speaker: SPEAKER.NPC, text: 'Oh, so now you’re saying I have a glass eye, is that it?'},
        {speaker: SPEAKER.CHARACTER, text: 'No, I…'},
        {speaker: SPEAKER.NPC, text: 'You’d best get ready for a world of hurt!'},
    ], {
        // Locked graphics
        sprite: 'Cotton_Eye_Joe hidden',
        animation_loop: [
            {x: 930, y: 820, animation: 'right', duration: 4500},
        ],
    }, [
        // Locked conversation
        {speaker: SPEAKER.NPC, text: 'I spy with my one eye a wizard willing to help'},
        {speaker: SPEAKER.CHARACTER, text: 'How’d you end up there?'},
        {speaker: SPEAKER.NPC, text: 'I climbed up this tower to get a better view of the kingdom when this snake decided I’m his next meal.'},
        {speaker: SPEAKER.NPC, text: 'Been stuck here ever since. Quite a stinky situation'},
    ]),
    

    new NPCConfig('D2', 'Wood Chipper', NPC_TYPE.DUEL, {
        sprite: 'Wood_Chipper',
        animation_loop: [
            {x: 330, y: 1830, animation: 'down', duration: 1000}, // Stand by the ballons
            {x: 330, y: 1070, animation: 'up', duration: 7600},
            {x: 926, y: 1070, animation: 'right', duration: 5960},
            {x: 926, y: 1222, animation: 'down', duration: 1520},
            {x: 450, y: 1222, animation: 'left', duration: 4760},
            {x: 450, y: 1830, animation: 'down', duration: 6080},
            {x: 330, y: 1830, animation: 'left', duration: 1200},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'That was the best three seconds of my life! Thanks for your help!'},
        {speaker: SPEAKER.CHARACTER, text: 'What can I say? I’m a tree hugger'},
        {speaker: SPEAKER.NPC, text: 'Gee whiz, thanks again for helping me out!'},
        {speaker: SPEAKER.CHARACTER, text: 'Now that you’re back on the ground, how about we duke it out?'},
        {speaker: SPEAKER.NPC, text: 'Great honk! I may be chipper,'},
        {speaker: SPEAKER.NPC, text: 'but I won’t take it easy on you when we do battle'},

    ], {
        // Locked graphics
        sprite: 'Wood_Chipper hidden',
        animation_loop: [
            {x: 330, y: 1830, animation: 'down', duration: 5000},
        ],
    }, [
        // Locked conversation
        {speaker: SPEAKER.NPC, text: 'Gosh golly! Are you a wizard?'},
        {speaker: SPEAKER.CHARACTER, text: 'If you’re looking to battle, I’m afraid I’m a little tied up right now'},
        {speaker: SPEAKER.NPC, text: 'You’ll have to help this ‘ole tree fly first if you want to cut it down to size'},
    ]),
  
    new NPCConfig('D3', 'The Brock', NPC_TYPE.DUEL, {
        sprite: 'The_Brock',
        animation_loop: [
            {x: 1069, y: 1850, animation: 'left', duration: 2000},
            {x: 1108, y: 1850, animation: 'right', duration: 2000},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'The Brock is my name and dueling suckas like you is my game. Can you dig it?'},
    ]),
    
    new NPCConfig('D4', 'Chocolate Dripo', NPC_TYPE.DUEL, {
        sprite: 'Chocolate_Drip_white',
        animation_loop: [
            {x: 3704, y: 1830, animation: 'right', duration: 3500},
            {x: 3704, y: 2033, animation: 'down', duration: 5000},
            {x: 3425, y: 2033, animation: 'left', duration: 3500},
            {x: 3425, y: 1830, animation: 'up', duration: 5000},
           
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Wizard… Food!'},
        {speaker: SPEAKER.CHARACTER, text: 'No, Wizard not food. Wizard duel'},
        {speaker: SPEAKER.NPC, text: 'Heh heh… Wizard duel… then food!'},
    ]),
    
    new NPCConfig('D5', 'Chocolate Drip', NPC_TYPE.DUEL, {
        sprite: 'Chocolate_Drip_black',
        animation_loop: [
            {x: 1612, y: 780, animation: 'up', duration: 3500},
            {x: 1612, y: 895, animation: 'down', duration: 5000},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Wizard… Food!'},
        {speaker: SPEAKER.CHARACTER, text: 'No, Wizard not food. Wizard duel'},
        {speaker: SPEAKER.NPC, text: 'Heh heh… Wizard duel… then food!'},,
    ]),
    
    new NPCConfig('D6', 'Boorilla', NPC_TYPE.DUEL, {
        sprite: 'Boorilla',
        animation_loop: [
            {x: 3339, y: 1051, animation: 'left', duration: 5000},
            {x: 3719, y: 1051, animation: 'right', duration: 5000},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Ooh ohh, Wizard no match for ape magic'},
        {speaker: SPEAKER.CHARACTER, text: 'Whatever you say. Just don’t fling your doo-doo at me when you lose!'},
        {speaker: SPEAKER.NPC, text: 'Ohh ooh, Boorilla no appreciate magical sarcasm!'},
    ], {
        // Locked graphics
        sprite: 'Boorilla',
        animation_loop: [
            {x: 241, y: 694, animation: 'down', duration: 4000},
        ],
    }, [
        // Locked conversation
        {speaker: SPEAKER.NPC, text: 'Ooh ohh, Borilla welcomes you to Turtorial. Wizard no pass until you show me a Snooze Best.'},
        {speaker: SPEAKER.CHARACTER, text: 'How do I get a Snooze Best?'},
        {speaker: SPEAKER.NPC, text: 'Ohh ooh, speak to arena master to get a Sugar Crush,'},
        {speaker: SPEAKER.NPC, text: 'then make a deal with the traders for a Snooze Best.'},
        {speaker: SPEAKER.NPC, text: 'Ooh ohh, if things seem complicated, look for Help in the Menu.'},
    ]),

    new NPCConfig('D7', 'Monocole', NPC_TYPE.DUEL, {
        sprite: 'Monocole',
        animation_loop: [
            {x: 1878, y: 1494, animation: 'right', duration: 8000},
            {x: 1557, y: 1494, animation: 'left', duration: 8000},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Hmmm, yes… indeed I am facing a lowly Wizard'},
        {speaker: SPEAKER.CHARACTER, text: 'Have you tried looking in the mirror lately?'},
        {speaker: SPEAKER.NPC, text: 'Hmmm, yes… the lowly Wizard has resorted to a “No U” rebuttal. How unimaginative!'},
    ]),
    
    
    new NPCConfig('D8', 'Meloosa', NPC_TYPE.DUEL, {
        sprite: 'Meloosa',
        animation_loop: [
            
            {x: 3104, y: 1090, animation: 'down', duration: 3500},
            {x: 2778, y: 1090, animation: 'left', duration: 3500},
            {x: 2778, y: 730, animation: 'up', duration: 3500},
            {x: 3104, y: 730, animation: 'right', duration: 3500},
        ],
    }, [
        {speaker: SPEAKER.CHARACTER, text: 'Hi!'},
        {speaker: SPEAKER.NPC, text: 'Hey there, sugar lips. Care to give me a smooch'},
        {speaker: SPEAKER.CHARACTER, text: 'No thanks. Last person who tried that ended up as a statue in the magic museum!'},
        {speaker: SPEAKER.NPC, text: 'Can’t blame a girl for trying… Oh well, see you out there!'},
    ]),

    new NPCConfig('D9', 'Whino', NPC_TYPE.DUEL, {
        sprite: 'Whino',
        animation_loop: [
            {x: 870, y: 1958, animation: 'down', duration: 4500},
            {x: 1300, y: 1958, animation: 'right', duration: 5000},
            {x: 1300, y: 1500, animation: 'up', duration: 4500},
            {x: 870, y: 1500, animation: 'left', duration: 5000},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'I can’t believe they’re making me battle on my day off… '},
        {speaker: SPEAKER.CHARACTER, text: 'It’s always your day off!'},
        {speaker: SPEAKER.NPC, text: 'This is all your fault! Prancing around the kingdom like a goody two shoes… Just wait till I get my horn on you'},
    ]),
    
    new NPCConfig('D10', 'Whino', NPC_TYPE.DUEL, {
        sprite: 'Whino',
        animation_loop: [
            {x: 1266, y: 1492, animation: 'up', duration: 4500},
            {x: 862, y: 1492, animation: 'left', duration: 5000},
            {x: 862, y: 1924, animation: 'down', duration: 4500},
            {x: 1266, y: 1924, animation: 'right', duration: 5000},
           
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'I can’t believe they’re making me battle on my day off… '},
        {speaker: SPEAKER.CHARACTER, text: 'It’s always your day off!'},
        {speaker: SPEAKER.NPC, text: 'This is all your fault! Prancing around the kingdom like a goody two shoes… Just wait till I get my horn on you'},
    ]),

    new NPCConfig('D11', 'BroBot', NPC_TYPE.DUEL, {
        sprite: 'BroBot_red',
        animation_loop: [
            {x: 1130, y: 1290, animation: 'left', duration: 5500},
            {x: 1280, y: 1290, animation: 'right', duration: 5500},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Familiar face recognized. Engagement authorized. Hello again'},
        {speaker: SPEAKER.NPC, text: 'What’s the word?”'},
        {speaker: SPEAKER.CHARACTER, text: 'Keep on groovin'},
        
    ], {
        // Locked graphics
        sprite: 'BroBot_red',
        animation_loop: [
            {x: 1130, y: 1190, animation: 'left', duration: 5500},
            {x: 1280, y: 1190, animation: 'right', duration: 5500},
        ],
    }, [
        // Locked conversation
        {speaker: SPEAKER.NPC, text: 'Detecting carbon-based life form... Initiating standard greeting sequence… Hello magic human.'},
        {speaker: SPEAKER.CHARACTER, text: 'Hello to you too'},
        {speaker: SPEAKER.NPC, text: 'Low power, Cannot further conversation until dancing batteries are recharged'},
    ]),    

    new NPCConfig('D12', 'BroBoto', NPC_TYPE.DUEL, {
        sprite: 'BroBot_grey',
        animation_loop: [
            {x: 104, y: 1526, animation: 'up', duration: 4500},
            {x: 104, y: 1800, animation: 'down', duration: 4500},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Bzzz Bzzzz Bzzzz'}
    ]),
    
    new NPCConfig('D13', 'Trololo', NPC_TYPE.DUEL, {
        sprite: 'Trololo',
        animation_loop: [
            {x: 2392, y: 1150, animation: 'up', duration: 1500},
           {x: 2023, y: 1150, animation: 'left', duration: 3500},
            {x: 2023, y: 1245, animation: 'down', duration: 1500},
           {x: 2392, y: 1245, animation: 'right', duration: 3500},      
        ],
    }, [ 
        {speaker: SPEAKER.NPC, text: 'ROFL you the n00b trying to restore the chimney? Epic fail.'},
        {speaker: SPEAKER.CHARACTER, text: 'You’re Trololo, the evil wizard! I won’t let you destroy the chimney again.'},
        {speaker: SPEAKER.NPC, text: 'Think you’re on my level? SMDH… Go get some clout before I bop you on the snout.'},

        
]),
    
    
    new NPCConfig('D14', 'Dino', NPC_TYPE.DUEL, {
        sprite: 'Dino',
        animation_loop: [
            {x: 912, y: 2048, animation: 'left', duration: 9500},
            {x: 1409, y: 2048, animation: 'right', duration: 9500},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Yo, You the one cruisin’ for a bruisin’?'},
        {speaker: SPEAKER.CHARACTER, text: 'I’m on a troll patrol, if that’s what you mean'},
        {speaker: SPEAKER.NPC, text: 'Then get ready for a Jurassic beatdown!'},
    ]),
    
    new NPCConfig('D15', 'Wooch', NPC_TYPE.DUEL, {
        sprite: 'Wooch',
        animation_loop: [
            {x: 122, y: 506, animation: 'left', duration: 8000},
            {x: 347, y: 506, animation: 'right', duration: 8000},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'So you’re the Wizard who’s been climbing up the league ranks...'},
        {speaker: SPEAKER.CHARACTER, text: 'Archmage Wooch! It’s an honor to finally beat… sorry, meet you'},
        {speaker: SPEAKER.NPC, text: 'I troll turds like you for breakfast. You’re no match for me'},
    ]),

    new NPCConfig('D16', 'Koko', NPC_TYPE.DUEL, {
        sprite: 'rooster',
        animation_loop: [
            {x: 2742, y: 1500, animation: 'down', duration: 2000},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Kokokokokokokokokokokokokokokoko'},
    ]),


    /************
     * Tutorial *
     ***********/
     new NPCConfig('TM1', 'Master Blaster', NPC_TYPE.ARENA_MASTER, {
        sprite: 'arena_master blue',
        animation_loop: [
            {x: 1143, y: 444, animation: 'down', duration: 1400},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'If you’re looking to duel, I can arrange a battle with Meloosa.'},
        {speaker: SPEAKER.NPC, text: 'Free fights don’t come cheap, though,'},
        {speaker: SPEAKER.NPC, text: 'so you’ll have to wager your Fatty Patty'},
        {speaker: SPEAKER.NPC, text: "if you want a shot at winning Meloosa's Sugar Crush."},
    ]),
    
    new NPCConfig('TD1', 'Meloosa', NPC_TYPE.DUEL, {
        sprite: 'Meloosa',
        animation_loop: [
            {x: 1100, y: 208, animation: 'down', duration: 5500},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Oh, your’e approaching me? Instead of running away you’re coming right at me?”'},
        {speaker: SPEAKER.CHARACTER, text: 'I can’t troll you without getting closer'},
    ]),
];

const NPCs = Object.assign({}, ..._NPCs.map(npc => ({[npc.id]: npc})));

const _tutorial_NPCs = [

    /****************
    * Arena Master *
    ****************/
     new NPCConfig('TM1', 'Master Blaster', NPC_TYPE.ARENA_MASTER, {
        sprite: 'arena_master blue',
        animation_loop: [
            {x: 1143, y: 444, animation: 'down', duration: 1400},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'If you’re looking to duel, I can arrange a battle with Meloosa.'},
        {speaker: SPEAKER.NPC, text: 'Free fights don’t come cheap, though,'},
        {speaker: SPEAKER.NPC, text: 'so you’ll have to wager your Fatty Patty'},
        {speaker: SPEAKER.NPC, text: "if you want a shot at winning Meloosa's Sugar Crush."},
    ]),

    /**********
    * Traders *
    **********/
     new NPCConfig('T4', 'Whatahat', NPC_TYPE.TRADER, {
        sprite: 'trader blue',
        animation_loop: [
            {x: 1130, y: 573, animation: 'up', duration: 3500},
            {x: 1130, y: 766, animation: 'down', duration: 2500},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'I have a Tutorial special for you! I’ll trade you up to 2 Ominous Onions in return for 1 Honk Honk.'},
        {speaker: SPEAKER.NPC, text: 'Alternitively I’ll trade you 1 Fork This for 3 Ominous Onions.'},
       
    
    ]),

    new NPCConfig('T5', 'Chad Hatter', NPC_TYPE.TRADER, {
        sprite: 'trader blue2',
        animation_loop: [
            {x: 380, y: 301, animation: 'right', duration: 5500},
            {x: 156, y: 301, animation: 'left', duration: 5500},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Hey bro, I’ve been dying to get a Sugar Crush off of Meloosa.'},
        {speaker: SPEAKER.NPC, text: 'but the only way to do that is to beat them in battle.'},
        {speaker: SPEAKER.NPC, text: 'If you bring me a Sugar Crush I’ll give you 1 Honk Honk and 1 Fork This.'},
        {speaker: SPEAKER.NPC, text: 'I also offer a secret deal for my chill clientele,'},
        {speaker: SPEAKER.NPC, text: 'look in the code to find out more.'},
    ]),

    /********
    * Duels *
    ********/
    new NPCConfig('TD1', 'Meloosa', NPC_TYPE.DUEL, {
        sprite: 'Meloosa',
        animation_loop: [
            {x: 1100, y: 208, animation: 'down', duration: 5500},
        ],
    }, [
        {speaker: SPEAKER.NPC, text: 'Oh, your’e approaching me? Instead of running away you’re coming right at me?'},
        {speaker: SPEAKER.CHARACTER, text: 'I can’t troll you without getting closer.'},
        {speaker: SPEAKER.NPC, text: 'Tough luck then, you will have to speak to the arena master to get a shot at me.'},
    ]),
 
    // The tutorial npc config should be the same as outside of the tutorial since it is locked
    NPCs[TUTORIAL_NPC]
];


export const TutorialNPCs = Object.assign({}, ..._tutorial_NPCs.map(npc => ({[npc.id]: npc})));

export default NPCs;