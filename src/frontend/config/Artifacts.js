//const BASE_URL = location.host == '127.0.0.1:5000' ? 'static/' : '';
const BASE_URL = 'static/';

export class ArtifactConfig {
    constructor(sprite, x, y, z_offset, assosiated_npc=null) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.z = y + z_offset;
        this.assosiated_npc = assosiated_npc;
    }
}

const Artifacts = [
    new ArtifactConfig('chimeny', 2036, 599, 492),

    new ArtifactConfig('arena', 277, 614, 96),
    new ArtifactConfig('arena', 2353, 728, 96),
    new ArtifactConfig('arena', 3235, 1118, 96),

    new ArtifactConfig('armory', 1568, 1858, 112),
    new ArtifactConfig('armory', 609, 1376, 112),
    new ArtifactConfig('armory', 2112, 1370, 112),
    new ArtifactConfig('armory', 3369, 1657, 112),
    new ArtifactConfig('armory', 3506, 165, 112),
    new ArtifactConfig('armory', 1166, 475, 112),

    new ArtifactConfig('door', 706, 1903, 171),
    new ArtifactConfig('door2', 3653, 740, 171),

    new ArtifactConfig('garden_jungle', 3021, 1750, 250),

    new ArtifactConfig('monoment', 1484-146, 1400, 310),

    new ArtifactConfig('rc_cars', 3624-155, 1204, 200),

    new ArtifactConfig('casino', 504, 286, 200),

    new ArtifactConfig('weather_ballons', 108, 900, 490, 'D2'),

    new ArtifactConfig('tower', 904-155, 586, 296, 'D1'),
    new ArtifactConfig('tower_empty', 3070-155, 692, 296),

    new ArtifactConfig('flowers_batch1', 800, 48, 2),

  
    new ArtifactConfig('chicken', 3559, 995, 16),
   new ArtifactConfig('chicken', 2852, 186, 16),
    new ArtifactConfig('chicken', 2604, 108, 16),


    new ArtifactConfig('market_batch', 2222, 82, 123),
    new ArtifactConfig('market_batch', 2402, 188, 123),
    new ArtifactConfig('market_batch', 2586, 104, 123),
    new ArtifactConfig('market_batch', 2900, 104, 123),
    new ArtifactConfig('market_batch', 2350, 1762, 123),
    new ArtifactConfig('market_batch', 2552, 1843, 123),
    new ArtifactConfig('market_batch', 2267, 1931, 123),

    new ArtifactConfig('market', 2168, 230, 60),
    new ArtifactConfig('market', 3205, 110, 60),
    new ArtifactConfig('market', 2784, 230, 60),
    new ArtifactConfig('market', 2696, 2002, 60),

    
    new ArtifactConfig('house_blue', 1632, 300, 63),
    new ArtifactConfig('house_blue', 1732, 300, 63),
    new ArtifactConfig('house_blue', 1832, 300, 63),
    new ArtifactConfig('house_blue', 1687, 379, 63),
    new ArtifactConfig('house_blue', 1787, 379, 63),
    new ArtifactConfig('house_blue', 1740, 457, 63),

    /*new ArtifactConfig('house_green', 2840, 375, 71),
    new ArtifactConfig('house_green', 2926, 375, 71),
    new ArtifactConfig('house_green', 3012, 375, 71),
    new ArtifactConfig('house_green', 3098, 375, 71),
    new ArtifactConfig('house_green', 2840, 454, 71),
    new ArtifactConfig('house_green', 2926, 454, 71),
    new ArtifactConfig('house_green', 3012, 454, 71),
    new ArtifactConfig('house_green', 3098, 454, 71),
    new ArtifactConfig('house_green', 2840, 531, 71),
    new ArtifactConfig('house_green', 2926, 531, 71),
    new ArtifactConfig('house_green', 3012, 531, 71),
    new ArtifactConfig('house_green', 3099, 547, 71),*/

    new ArtifactConfig('house_yellow', 69, 1052, 66),
    new ArtifactConfig('house_yellow', 160, 1052, 66),
    new ArtifactConfig('house_yellow', 256, 1052, 66),
    new ArtifactConfig('house_yellow', 114, 1133, 66),
    new ArtifactConfig('house_yellow', 210, 1133, 66),
    new ArtifactConfig('house_yellow', 162, 1210, 66),

    new ArtifactConfig('house_red', 2828, 1222, 65),
    new ArtifactConfig('house_red', 2914, 1222, 65),
    new ArtifactConfig('house_red', 3000, 1228, 65),
    new ArtifactConfig('house_red', 2884, 1311, 65),
    new ArtifactConfig('house_red', 2970, 1311, 65),
    new ArtifactConfig('house_red', 3056, 1311, 65),
    new ArtifactConfig('house_red', 2928, 1396, 65),
    new ArtifactConfig('house_red', 3015, 1396, 65),
    new ArtifactConfig('house_red', 3101, 1396, 65),
    new ArtifactConfig('house_red', 2888, 1482, 65),
    new ArtifactConfig('house_red', 2974, 1482, 65),
    new ArtifactConfig('house_red', 3060, 1482, 65),
    new ArtifactConfig('house_red', 2832, 1559, 65),
    new ArtifactConfig('house_red', 2918, 1559, 65),
    new ArtifactConfig('house_red', 3004, 1559, 65),
    new ArtifactConfig('house_red', 2630, 1429, 65),

    new ArtifactConfig('dance_hall', 1054, 1036, 100, 'D11'),

    new ArtifactConfig('arena_ladder', 2480, 872, 8),
    new ArtifactConfig('arena_ladder', 406, 756, 14),

    new ArtifactConfig('maze', 937, 1561, -445),
    
    new ArtifactConfig('shroom_1', 1766, 1872, 16),
    new ArtifactConfig('shroom_1', 530, 1404, 16),
    new ArtifactConfig('shroom_1', 806, 1391, 16),
    new ArtifactConfig('shroom_1', 3426, 196, 16),
    new ArtifactConfig('shroom_1', 3288, 1685, 16),
    new ArtifactConfig('shroom_1', 1926, 1472, 16),
    new ArtifactConfig('shroom_1', 2036, 1398, 16),
    new ArtifactConfig('shroom_1', 2312, 1502, 16),
    new ArtifactConfig('shroom_1', 1084, 504, 16),
    new ArtifactConfig('shroom_1', 1361, 490, 16),
    
    new ArtifactConfig('shroom_2', 750, 1354, 16),
    new ArtifactConfig('shroom_2', 2256, 1348, 16),
    new ArtifactConfig('shroom_2', 1710, 1835, 16),
    new ArtifactConfig('shroom_2', 3508, 1634, 16),
    new ArtifactConfig('shroom_2', 3646, 145, 16),
    new ArtifactConfig('shroom_2', 1304, 454, 16),

    new ArtifactConfig('shroom_3', 3720, 240, 74),
    new ArtifactConfig('shroom_3', 3594, 1666, 74),
    new ArtifactConfig('shroom_3', 2344, 1346, 74),
    new ArtifactConfig('shroom_3', 908, 1390, 74),

    new ArtifactConfig('sword', 580, 1444, 13),
    new ArtifactConfig('sword', 2086, 1438, 13),
    new ArtifactConfig('sword', 3338, 1724, 13),
    new ArtifactConfig('sword', 1540, 1926, 13),
    new ArtifactConfig('sword', 1134, 544, 13),
    new ArtifactConfig('sword', 3476, 236, 13),

    new ArtifactConfig('mush_02', 3124, 116, 4),
    new ArtifactConfig('mush_02', 3380, 182, 4),
    new ArtifactConfig('mush_02', 3508, 148, 4),
    new ArtifactConfig('mush_02', 3722, 200, 4),
    new ArtifactConfig('mush_02', 3318, 388, 4),
    new ArtifactConfig('mush_02', 3348, 396, 4),
    new ArtifactConfig('mush_02', 3690, 1720, 4),
    new ArtifactConfig('mush_02', 3630, 1784, 4),
    new ArtifactConfig('mush_02', 3590, 1768, 4),
    new ArtifactConfig('mush_02', 3368, 1662, 4),
    new ArtifactConfig('mush_02', 2168, 1840, 4),
    new ArtifactConfig('mush_02', 1802, 1924, 4),
    new ArtifactConfig('mush_02', 1530, 1984, 4),

    new ArtifactConfig('cactus_big', 1808, 1682, 27),
    new ArtifactConfig('cactus_big', 1760, 1684, 27),
    new ArtifactConfig('cactus_big', 1714, 1683, 27),
    new ArtifactConfig('cactus_big', 1634, 1670, 27),
    new ArtifactConfig('cactus_big', 1586, 1714, 27),
    new ArtifactConfig('cactus_big', 1734, 1724, 27),
    new ArtifactConfig('cactus_big', 1786, 1726, 27),
    new ArtifactConfig('cactus_big', 12, 1603, 27),
    new ArtifactConfig('cactus_big', 12, 1653, 27),
    new ArtifactConfig('cactus_big', 12, 1713, 27),

    new ArtifactConfig('cactus_small', 2620, 1768, 19),
    new ArtifactConfig('cactus_small', 2530, 1770, 19),
    new ArtifactConfig('cactus_small', 2044, 1900, 19),
    new ArtifactConfig('cactus_small', 2112, 1994, 19),
    new ArtifactConfig('cactus_small', 1892, 1726, 19),
    new ArtifactConfig('cactus_small', 1842, 1726, 19),
    new ArtifactConfig('cactus_small', 1692, 1758, 19),
    new ArtifactConfig('cactus_small', 1630, 1738, 19),
    new ArtifactConfig('cactus_small', 1664, 1718, 19),
    new ArtifactConfig('cactus_small', 1714, 1596, 19),
    new ArtifactConfig('cactus_small', 1764, 1596, 19),
    new ArtifactConfig('cactus_small', 50, 1623, 19),
    new ArtifactConfig('cactus_small', 50, 1663, 19),
    new ArtifactConfig('cactus_small', 50, 1703, 19),

    new ArtifactConfig('small_house', 692, 890, 31),
    new ArtifactConfig('small_house', 791, 932, 31),
    new ArtifactConfig('small_house', 2828, 900, 31),

    new ArtifactConfig('mysticflower', 2832, 88, 36),
    new ArtifactConfig('mysticflower', 2396, 72, 36),
    new ArtifactConfig('mysticflower', 2666, 240, 36),
    new ArtifactConfig('mysticflower', 2736, 1808, 36),
    new ArtifactConfig('mysticflower', 2450, 1932, 36),
    new ArtifactConfig('mysticflower', 2562, 2032, 36),

    new ArtifactConfig('big_lake', 3420, 385, 65),

    new ArtifactConfig('fence', 2592, 1568, 15),

    new ArtifactConfig('big_rock', 3530, 1796, 4),
    new ArtifactConfig('big_rock', 297, 2060, 5),

    new ArtifactConfig('stone_small', 3314, 1765, 5),

    new ArtifactConfig('island', 3528, 466, 466),

    new ArtifactConfig('big_tree', 3283, 1876, 51),

    new ArtifactConfig('bush', 420, 970, 970),
    new ArtifactConfig('bush', 1030, 584, 584),
    new ArtifactConfig('bush', 1100, 612, 612),
    new ArtifactConfig('bush', 96, 378, 378),
    new ArtifactConfig('bush', 164, 378, 378),
    new ArtifactConfig('bush', 238, 378, 378),
    new ArtifactConfig('bush', 308, 378, 378),
    new ArtifactConfig('bush', 126, 407, 407),
    new ArtifactConfig('bush', 200, 407, 407),
    new ArtifactConfig('bush', 273, 407, 407),
    new ArtifactConfig('bush', 264, 322, 322),
    new ArtifactConfig('bush', 318, 262, 262),
    new ArtifactConfig('bush', 404, 220, 220),
    new ArtifactConfig('bush', 436, 160, 160),
    new ArtifactConfig('bush', 370, 160, 160),
    new ArtifactConfig('bush', 302, 160, 160),
    new ArtifactConfig('bush', 234, 160, 160),
    new ArtifactConfig('bush', 168, 160, 160),
    new ArtifactConfig('bush', 100, 160, 160),
    new ArtifactConfig('bush', 484, 100, 100),
    new ArtifactConfig('bush', 338, 100, 100),
    new ArtifactConfig('bush', 191, 100, 100),
    new ArtifactConfig('bush', 1030, 584, 584),
    new ArtifactConfig('bush', 1098, 612, 612),
    new ArtifactConfig('bush', 420, 970, 970),

    new ArtifactConfig('bush_group', 3402, 874, 41),
    new ArtifactConfig('bush_group', 390, 70, 41),
    new ArtifactConfig('bush_group', 242, 70, 41),
    new ArtifactConfig('bush_group', 94, 70, 41),
    

    new ArtifactConfig('bush_big', 166, 236, -3),
    
    new ArtifactConfig('red_flower_l', 3184, 2018, 18),
    new ArtifactConfig('red_flower_l', 3048, 2030, 18),
    new ArtifactConfig('red_flower_l', 3006, 2060, 18),
    new ArtifactConfig('red_flower_l', 3732, 1382, 18),
    new ArtifactConfig('red_flower_l', 2656, 1306, 18),
    new ArtifactConfig('red_flower_l', 2602, 1306, 18),
    new ArtifactConfig('red_flower_l', 2548, 1306, 18),
    new ArtifactConfig('red_flower_l', 2494, 1306, 18),
    new ArtifactConfig('red_flower_l', 2642, 1220, 18),
    new ArtifactConfig('red_flower_l', 2588, 1220, 18),
    new ArtifactConfig('red_flower_l', 2534, 1220, 18),
    new ArtifactConfig('red_flower_l', 2480, 1220, 18),
    new ArtifactConfig('red_flower_l', 2252, 532, 18),
    new ArtifactConfig('red_flower_l', 2202, 532, 18),
    new ArtifactConfig('red_flower_l', 2152, 532, 18),
    new ArtifactConfig('red_flower_l', 51, 537, 18),
    new ArtifactConfig('red_flower_l', 123, 540, 18),
    new ArtifactConfig('red_flower_l', 53, 594, 18),
    new ArtifactConfig('red_flower_l', 124, 604, 18),
    new ArtifactConfig('red_flower_l', 53, 651, 27),
    new ArtifactConfig('red_flower_l', 127, 670, 28),

    new ArtifactConfig('red_flower_r', 2976, 2050, 18),
    new ArtifactConfig('red_flower_r', 2672, 1180, 18),
    new ArtifactConfig('red_flower_r', 2618, 1180, 18),
    new ArtifactConfig('red_flower_r', 2564, 1180, 18),
    new ArtifactConfig('red_flower_r', 2510, 1180, 18),
    new ArtifactConfig('red_flower_r', 2690, 1264, 18),
    new ArtifactConfig('red_flower_r', 2636, 1264, 18),
    new ArtifactConfig('red_flower_r', 2582, 1264, 18),
    new ArtifactConfig('red_flower_r', 2528, 1264, 18),
    new ArtifactConfig('red_flower_r', 73, 720 , 18),
    new ArtifactConfig('red_flower_r', 147, 720, 18),
    new ArtifactConfig('red_flower_r', 93, 760 , 18),
    new ArtifactConfig('red_flower_r', 167, 760, 18),
    new ArtifactConfig('red_flower_r', 73, 820 , 18),
    new ArtifactConfig('red_flower_r', 147, 820, 18),
    
    new ArtifactConfig('roses', 2894, 1968, 47),
    new ArtifactConfig('roses', 1911, 2054, 47),

    new ArtifactConfig('sign', 2598, 1496, 9),

    new ArtifactConfig('stone_green', 2144, 1674, 10),

    new ArtifactConfig('wood', 2122, 1856, 11),
    new ArtifactConfig('wood', 1958, 2020, 11),
    new ArtifactConfig('wood', 22, 2126, 11),
    new ArtifactConfig('wood', 86, 336, 11),
    new ArtifactConfig('wood', 3672, 1512, 11),
    new ArtifactConfig('wood', 338, 1458, 11),
    new ArtifactConfig('wood', 352, 1492, 11),
    new ArtifactConfig('wood', 358, 1502, 11),

    new ArtifactConfig('yellow_flower', 3262, 1954, 39),
    new ArtifactConfig('yellow_flower', 3132, 2038, 39),
    new ArtifactConfig('yellow_flower', 2960, 1994, 39),
    new ArtifactConfig('yellow_flower', 2914, 2016, 39),

    new ArtifactConfig('tree_long', 3718, 1480, 56),
    new ArtifactConfig('tree_long', 3734, 1572, 56),
    new ArtifactConfig('tree_long', 3620, 1588, 56),
    new ArtifactConfig('tree_long', 2036, 1688, 56),
    new ArtifactConfig('tree_long', 36, 1940, 56),
    new ArtifactConfig('tree_long', 36, 1940, 56),

    new ArtifactConfig('tree_3_together', 3536, 1500, 58),
    new ArtifactConfig('tree_3_together', 2246, 1648, 58),
    new ArtifactConfig('tree_3_together', 2176, 1886, 58),
    new ArtifactConfig('tree_3_together', 2066, 2040, 58),
    new ArtifactConfig('tree_3_together', -38, 2015, 58),
    new ArtifactConfig('tree_3_together', -38, 2015, 58),

    new ArtifactConfig('tree_group', 1854, 1766, 77),
    new ArtifactConfig('tree_group', 2380, 558, 77),
    new ArtifactConfig('tree_group', 3585, 2018, 77),
    new ArtifactConfig('tree_group', 429, 1925, 77),
    new ArtifactConfig('tree_group', 41, 903, 77),
    new ArtifactConfig('tree_group', 3387, 32, 77),
    new ArtifactConfig('tree_group', 1938, 1560, 77),
    new ArtifactConfig('tree_group', 591, 90, 77),
    new ArtifactConfig('tree_group', 2000, 30, 77),

    new ArtifactConfig('tree_round', 2676, 662, 59),
    new ArtifactConfig('tree_round', 2283, 841, 59),
    new ArtifactConfig('tree_round', 3664, 1548, 59),
    new ArtifactConfig('tree_round', 2082, 1914, 59),
    new ArtifactConfig('tree_round', 2010, 1952, 59),
    new ArtifactConfig('tree_round', 158, 2104, 59),
    new ArtifactConfig('tree_round', 64, 2064, 59),
    new ArtifactConfig('tree_round', -23, 1893, 59),

    new ArtifactConfig('lake_dino', 846, 202, 8, 'T8'),
    
    new ArtifactConfig('poison_mush', 2220, 940, 57),
    new ArtifactConfig('poison_mush', 774, 1153, 57),
    new ArtifactConfig('poison_mush', 750, 1128, 57),
    new ArtifactConfig('poison_mush', 612, 232, 57),
    new ArtifactConfig('poison_mush', 505, 269, 57),
    new ArtifactConfig('poison_mush', 3273, 80, 57),
    new ArtifactConfig('poison_mush', 3325, 69, 57),
    new ArtifactConfig('poison_mush', 383, 2027, 57),
    new ArtifactConfig('poison_mush', 1734, 1393, 57),

    new ArtifactConfig('poison_mush_2', 262, 793, 57),
    new ArtifactConfig('poison_mush_2', 786, 1134, 57),
    new ArtifactConfig('poison_mush_2', 1490, 2072, 57),

    new ArtifactConfig('grow_mush', 880, 1150, 97),
    new ArtifactConfig('grow_mush', 860, 1160, 97),
    new ArtifactConfig('grow_mush', 840, 1180, 97),
    new ArtifactConfig('grow_mush', 44, 1232, 97),
    new ArtifactConfig('grow_mush', 82, 1553, 97),
    new ArtifactConfig('grow_mush', 50, 1473, 97),
    new ArtifactConfig('grow_mush', 88, 1394, 97),
    new ArtifactConfig('grow_mush', 3548, 2073, 97),
    new ArtifactConfig('grow_mush', 3449, 2094, 97),
    new ArtifactConfig('grow_mush', 770, 1123, 97),
    new ArtifactConfig('grow_mush', 716, 1152, 97),
    new ArtifactConfig('grow_mush', 757, 1189, 97),
    new ArtifactConfig('grow_mush', 3344, 2069, 97),
  
    new ArtifactConfig('mole', 998, 1001, 57),
    new ArtifactConfig('mole', 2034, 441, 57),
    new ArtifactConfig('mole', 3747, 1896, 57),
 
    new ArtifactConfig('lake_house', 2840, 374, 126, 'M4'),

    new ArtifactConfig('MagicForest_R', 1690, 580, 897),
    new ArtifactConfig('MagicForest_L', 1090, 580, 897),
    new ArtifactConfig('MagicForest_Road', 1590, 750, -273),

    new ArtifactConfig('blue_gem', 2337, 1089, 57),
    new ArtifactConfig('blue_gem', 2112, 408, 57),
    new ArtifactConfig('blue_gem', 682, 1700, 57),

    new ArtifactConfig('yellow_gem', 1745, 1310, 57),
    new ArtifactConfig('yellow_gem', 1408, 1828, 57),
    new ArtifactConfig('yellow_gem', 904, 581, 57),


];

export const TutorialArtifacts = [
    new ArtifactConfig('t_candle', 1169, 122, 159),
    new ArtifactConfig('t_candle', 1205, 134, 1766),
    new ArtifactConfig('t_candle', 879, 112, 1788),
    new ArtifactConfig('t_candle', 843, 100, 1800),
    new ArtifactConfig('t_candle', 533, 106, 1794),
    new ArtifactConfig('t_candle', 501, 118, 1782),
    new ArtifactConfig('t_candle', 175, 112, 1788),
    new ArtifactConfig('t_candle', 143, 112, 1788),

    new ArtifactConfig('t_cat', 1248, 286, 1614),

    new ArtifactConfig('t_cactus_small', 1019, 68, 1832),
    new ArtifactConfig('t_cactus_big', 678, 374, 1526),
    new ArtifactConfig('t_book_1', 782, 382, 1518),
    new ArtifactConfig('t_book_2', 828, 384, 1516),
];

export default Artifacts;