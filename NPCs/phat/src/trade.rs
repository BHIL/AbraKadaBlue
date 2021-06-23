use serde::{Deserialize, Serialize};
use serde_repr::{Deserialize_repr, Serialize_repr};
use num_enum::IntoPrimitive;
use num_enum::TryFromPrimitive;
use smallvec::SmallVec;

#[repr(C)]
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub(crate) struct ItemPair {
    pub item_id: Item,
    pub quantity: u8,
}


impl ItemPair {
    pub fn value(&self) -> f64 {
        self.item_id.value() * f64::from(self.quantity)
    }
}

pub(crate) type ItemSet = SmallVec<[ItemPair; 1]>;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct TraderInput {
    pub offers: SmallVec<[ItemSet; 1]>,
    pub desires: SmallVec<[ItemSet; 1]>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct Trade {
    pub offer: ItemSet,
    pub desire: ItemSet,
}

#[derive(Serialize_repr, Deserialize_repr, Debug, Clone, Copy, IntoPrimitive, TryFromPrimitive)]
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

impl PartialEq for Item {
    fn eq(&self, other: &Self) -> bool {
        *self as u8 == *other as u8
    } 
}

impl Trade {
    pub fn new() -> Self {
        Trade {
            offer: ItemSet::new(),
            desire: ItemSet::new(),
        }
    }

    pub fn value(&self) -> f64 {
        let offer_value = self.offer.iter().map(|i| i.value()).sum::<f64>();
        let desire_value = self.desire.iter().map(|i| i.value()).sum::<f64>();

        offer_value - desire_value
    }
}

trait SmallVecAlias {
    fn new() -> Self;
}

impl SmallVecAlias for ItemSet {
    fn new() -> Self {
        SmallVec::new()
    }
}

impl Item {
    pub fn value(&self) -> f64 {
        match *self {
            Item::GongLong => 1.0,
            Item::SugarCrush => 1.0,
            Item::NastyNoodles => 1.0,
            Item::ClementEye => 1.0,
            Item::CalciumFancium => 1.0,
            Item::WonderWall => 1.0,
            Item::HonkHonk => 24.0,
            Item::SnoozeBest => 24.0,
            Item::ForkThis => 22.0,
            Item::ShimmerGlimmer => 20.0,
            Item::OminousOnion => 14.0,
            Item::CactusJack => 12.0,
            Item::FattyPatty => 19.0,
            _ => { panic!("Item not permitted") }
        }
    }
}
