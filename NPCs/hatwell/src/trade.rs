use serde::{Deserialize, Serialize};
use serde_repr::{Deserialize_repr, Serialize_repr};
use smallvec::SmallVec;

#[repr(C)]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct ItemPair {
    #[serde(skip)]
    pub is_gift: u32,
    pub item_id: Item,
    pub quantity: u32,
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

#[derive(Serialize_repr, Deserialize_repr, Debug, Clone)]
#[repr(u32)]
pub(crate) enum Item {
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

        (offer_value - desire_value).clamp(-10000_f64, 10000_f64)
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
            Item::FattyPatty => 2.0,
            Item::CactusJack => 4.0,
            Item::ForkThis => 4.0,
            Item::SnoozeBest => 5.0,
            Item::Smellmonell => 8.0,
            Item::CalciumFancium => 16.0,
            Item::SugarCrush => 20.0,
            Item::TonyStank => 75.0,
            Item::DurianGrey => 3900000000.0,
            Item::Grooviton => 4000000000.0,
            Item::RainbowMunch => 4100000000.0,

            _ => { panic!("Item not permitted") }
        }
    }
}