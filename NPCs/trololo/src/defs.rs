#![forbid(unsafe_code)]

use serde::{Deserialize, Serialize};
use serde_repr::{Deserialize_repr, Serialize_repr};

use smallvec::SmallVec;

use num_enum::IntoPrimitive;
use num_enum::TryFromPrimitive;

use std::cmp::Ordering;

pub const MAX_ITEMS_PER_TURN: usize = 3;

pub const REPLICA_BONUS: f64 = 20.1;

pub const LOW_ENERGY_BONUS: f64 = 9.0;
pub const LOW_ENERGY_THRESHOLD: f32 = 25.0;
pub const LOW_ENERGY_ITEMS: [Item; 2] = [Item::HolyMoly, Item::PocketHole];

pub const HIGH_ENERGY_BONUS: f64 = 11.0;
pub const HIGH_ENERGY_THRESHOLD: f32 = 65.0;
pub const HIGH_ENERGY_ITEMS: [Item; 2] = [Item::SlitheringSoup, Item::CloakKent];

pub const LOW_TROLLERANCE_BONUS: f64 = 13.37;
pub const LOW_TROLLERANCE_THRESHOLD: f32 = 35.0;
pub const LOW_TROLLERANCE_ITEMS: [Item; 3] = [Item::PocketHole, Item::SlitheringSoup, Item::DurianGrey];

pub const HIGH_TROLLERANCE_BONUS: f64 = 8.0;
pub const HIGH_TROLLERANCE_THRESHOLD: f32 = 75.0;
pub const HIGH_TROLLERANCE_ITEMS: [Item; 2] = [Item::SlitheringSoup, Item::CloakKent];

pub const LARGE_AMOUNT_THRESHOLD: u32 = 5;

pub const SCORE_THRESHOLD: f64 = 62.73;


#[repr(C)]
#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct ItemPair {
    pub item_id: Item,
    pub amount: u32,
}

impl PartialEq<u8> for ItemPair {
    fn eq(&self, other: &u8) -> bool {
        self.item_id.eq(other)
    }
}

impl PartialOrd<u8> for ItemPair {
    fn partial_cmp(&self, other: &u8) -> Option<Ordering> {
        self.item_id.partial_cmp(other)
    }
}

#[derive(Serialize_repr, Deserialize_repr, Debug, Clone, Copy, Ord, PartialOrd, IntoPrimitive, TryFromPrimitive, PartialEq, Eq, Hash)]
#[repr(u8)]
pub enum Item {
    TeleFart = 1,
    TonyStank,
    Grooviton,
    Flashfunk,
    HonkHonk,
    GongLong,
    SugarCrush,
    PlantPlug,
    SnoozeBest,
    PocketHole,
    Smellmonell,
    NastyNoodles,
    ForkThis,
    ClementEye,
    DeFeeters,
    Hypnomon,
    ShimmerGlimmer,
    DurianGrey,
    OminousOnion,
    Skelebowl,
    HolyMoly,
    CalciumFancium,
    StingySullivan,
    BlingRing,
    CactusJack,
    DiamondDough,
    SlitheringSoup,
    MirrorMirror,
    NosyNolan,
    CloakKent,
    FoxyBoxy,
    FattyPatty,
    RainbowMunch,
    WonderWall,
    InvalidItem = 0xff,
}

impl Default for Item {
    fn default() -> Self { Item::InvalidItem }
}

impl PartialEq<u8> for Item {
    fn eq(&self, other: &u8) -> bool {
        (*self as u8).eq(other)
    }
}

impl Item {
    pub fn score(&self) -> f64 {
        match *self {
            Item::HolyMoly => 89.1,
            Item::SlitheringSoup => 87.3,
            Item::CloakKent => 91.7,
            Item::DurianGrey => 93.5,
            Item::PocketHole => 97.0,
            Item::InvalidItem => 0.0,
            _ => 0.0,
        }
    }
}

impl PartialOrd<u8> for Item {
    fn partial_cmp(&self, other: &u8) -> Option<Ordering> {
        (*self as u8).partial_cmp(other)
    }
}

pub type ItemSet = SmallVec<[ItemPair; 1]>;
pub type TurnSteps = SmallVec<[TurnStep; 1]>;

#[derive(EnumString, Serialize, Deserialize, Debug, Clone, Copy)]
pub enum Player {
    none = 0,
    npc,
    player,
}


impl Default for Player {
    fn default() -> Self { Player::none }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PlayerState {
    pub trollerance: f32,
    pub energy: f32,
    #[serde(default)] 
    pub inventory: SmallVec<[ItemPair; 1]>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DuelInput {
    pub player_selected_items: SmallVec<[Item; 1]>,
    pub state: DuelState,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DuelState {
    pub current_attacker: Player,
    pub id: u32,
    pub npc: PlayerState,
    pub player: PlayerState,
    pub last_turn: Option<Turn>,
    pub turn_num: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Turn {
    pub attacker: Player,
    pub attacks: TurnSteps,
    pub defences: TurnSteps,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TurnStep {
    #[serde(default)]
    pub attack: Item,
    pub defence: Option<Item>,
    #[serde(default)]
    pub victim: Player,
    pub trollerance: f32,
    pub energy: f32,
    #[serde(default)] 
    pub reaction: String,
}