#![forbid(unsafe_code)]

mod trade;
use crate::trade::{Item, ItemPair, ItemSet, Trade, TraderInput};

use std::error::Error;
use std::io;

use itertools::iproduct;

const GIFTS: &'static [Item] = &[Item::GongLong, 
                                 Item::SugarCrush,
                                 Item::NastyNoodles,
                                 Item::ClementEye,
                                 Item::CalciumFancium,
                                 Item::WonderWall];

const WORTH_GIFTS_IDS: &'static [Item] = &[Item::HonkHonk,
                                           Item::SnoozeBest,
                                           Item::ForkThis,
                                           Item::ShimmerGlimmer,
                                           Item::OminousOnion,
                                           Item::CactusJack,
                                           Item::FattyPatty];

const GIFT_FACTOR: f64 = 0.75;

fn add_gifts(desire: &mut ItemSet, quantity: u8) {
    for gift in GIFTS {
        let mut gave_gift = false;
        for item in desire.into_iter() {
            if item.item_id == *gift {
                item.quantity += quantity;
                gave_gift = true;
                break;
            }
        }

        if gave_gift == false {
            desire.push(ItemPair { item_id: *gift, quantity: quantity} );
        }
    }
}

fn give_gifts(trade: &mut Trade, trade_value: f64) {	
    add_gifts(&mut trade.desire, 1);

    let gifts_count: u8 = (trade_value * GIFT_FACTOR + 1.0) as u8;
    for offered_item in &trade.offer {
        if WORTH_GIFTS_IDS.contains(&offered_item.item_id) {
            add_gifts(&mut trade.desire, gifts_count);
        }
    }
}

fn main() -> Result<(), Box<dyn Error>> {
    let mut data = String::new();
    io::stdin().read_line(&mut data)?;

    let chosen_trade: Trade;
    if let Ok(input_trades) = serde_json::from_str::<TraderInput>(data.as_str()) {
    	let mut best_value: f64 = 0.0;
        let mut best_trade: Trade = Trade {
            offer: ItemSet::new(),
            desire: ItemSet::new(),
        };

        for (offer, desire) in iproduct!(input_trades.offers, input_trades.desires) {
            let mut trade = Trade::new();

            trade.offer.insert_many(0, offer.clone());
            trade.desire.insert_many(0, desire.clone());

            if best_value < trade.value() {
                best_value = trade.value();
                best_trade = trade;
            }
        }

        give_gifts(&mut best_trade, best_value);

        chosen_trade = Trade {
            offer: best_trade.desire.clone(),
            desire: best_trade.offer.clone(),
        };

    } else {
        return Err("Could not parse input JSON".into());
    }

    if let Ok(json_output) = serde_json::to_string(&chosen_trade) {
        println!("{}", json_output);
        return Ok(());
    } else {
        return Err("Could not format result!".into());
    }
}
