#![forbid(unsafe_code)]

mod trade;

use crate::trade::{Item, ItemPair, ItemSet, Trade, TraderInput};

use std::error::Error;
use std::io;

use itertools::iproduct;

const COMMISSION: f64 = 0.15;

fn get_gift(item: ItemPair) -> ItemPair {
    
    let item_id = match item.item_id {
        Item::FattyPatty => Item::SnoozeBest,
        Item::Smellmonell => Item::ForkThis,
        Item::SugarCrush => Item::CalciumFancium,
        _ => { panic!("Invalid item") }
    };

    let gift = ItemPair {
                        item_id: item_id,
                        quantity: item.quantity,
                        is_gift: 1};
    gift
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

            let pre_gift_value = trade.value();
            if pre_gift_value < COMMISSION {
                continue;
            }

            // Today's sales: for each FattyPatty/Smellmonell/SugarCrush - get one free item
            let gifts = desire
                .into_iter()
                .filter(|i| matches!(i.item_id, Item::FattyPatty | Item::Smellmonell | Item::SugarCrush))
                .map(|i| get_gift(i));

            let big_spender_bonus = (pre_gift_value as u32 / 100).clamp(0, 4);
            if big_spender_bonus > 0 {
                // Big spender here! give extra CactusJack for each 100 points of value
                trade.desire.insert_many(0, gifts.chain(vec![
                    ItemPair {
                        item_id: Item::CactusJack,
                        quantity: big_spender_bonus,
                        is_gift: 1
                    }; 1
                ]));
            } else {
                trade
                    .desire
                    .insert_many(0, gifts.collect::<ItemSet>());
            }

            let gift_value = trade
                .desire
                .iter()
                .filter(|i| i.is_gift != 0)
                .map(|i| i.value())
                .sum::<f64>();
            if pre_gift_value > best_value && gift_value < 100.0 {
                best_value = pre_gift_value;
                best_trade = trade;
            }
        }

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
