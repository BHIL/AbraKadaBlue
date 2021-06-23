#![forbid(unsafe_code)]

mod defs;

use crate::defs::*;
use smallvec::SmallVec;

#[macro_use]
extern crate strum_macros;

use std::error::Error;
use std::io;
use std::collections::HashSet;

fn evaluate_item_potential(item: Item, duel_input: &DuelInput) -> f64 {
    let mut score = item.score();

    if duel_input.player_selected_items.contains(&item) {
        score -= REPLICA_BONUS;
    }

    if LOW_ENERGY_ITEMS.contains(&item) {
        if duel_input.state.player.energy < LOW_ENERGY_THRESHOLD {
            score -= LOW_ENERGY_BONUS;    
        }
    }

    if HIGH_ENERGY_ITEMS.contains(&item) {
        if duel_input.state.player.energy > HIGH_ENERGY_THRESHOLD {
            score -= HIGH_ENERGY_BONUS;    
        }
    }

    if LOW_TROLLERANCE_ITEMS.contains(&item) {
        if duel_input.state.player.trollerance < LOW_TROLLERANCE_THRESHOLD {
            score -= LOW_TROLLERANCE_BONUS;    
        }
    }

    if HIGH_TROLLERANCE_ITEMS.contains(&item) {
        if duel_input.state.player.trollerance > HIGH_TROLLERANCE_THRESHOLD {
            score -= HIGH_TROLLERANCE_BONUS;    
        }
    }

    score
}

fn is_good_item(item: &ItemPair, score: f64) -> bool {
    if score > SCORE_THRESHOLD {
        return true;
    }

    if item.amount > LARGE_AMOUNT_THRESHOLD {
        return true;
    }

    false
}

fn do_step(duel_input: &mut DuelInput) -> Vec<Item> {
    let items = [Item::PocketHole,
                    Item::HolyMoly,
                    Item::SlitheringSoup,
                    Item::CloakKent,
                    Item::DurianGrey];

    let mut npc_items: SmallVec<[std::option::Option<ItemPair>; 1]> = SmallVec::new();
    for id in &items {
        npc_items.push( Some(ItemPair {item_id: *id, amount: 1}) );
    }
  
    let mut npc_inventory: ItemSet = SmallVec::new();
    for id in &items {
        npc_inventory.push( ItemPair { item_id: *id, amount: 1 });
    }
    
    let mut scores: SmallVec<[f64;1]> = SmallVec::new();
    for item in &items {
        scores.push(evaluate_item_potential(*item, &duel_input));
    }

    let mut zip = npc_items.iter_mut().map(|item: &mut std::option::Option<ItemPair>| {

        if let Some(pos) = npc_inventory.iter().position(|&i| i.item_id == item.unwrap().item_id) {
            let item_pair = npc_inventory.get_mut(pos).unwrap();
            if item_pair.amount > 0 {
                item_pair.amount -= 1;
            } else  {
                *item = Some(ItemPair {item_id: Item::InvalidItem, amount: 0});
            }
        }

        item
    }).zip(&scores);

    let mut chosen_items: HashSet<&ItemPair> = HashSet::new();
    while chosen_items.len() < MAX_ITEMS_PER_TURN - 1 {
        if let Some(scored_item) = zip.next_back() {
            if is_good_item(scored_item.0.as_ref().unwrap(), *scored_item.1) {
                chosen_items.insert(scored_item.0.as_ref().unwrap());    
            }
        } else {
            panic!("not enough good items!");
        }
    }
    
    // no way I'm giving up on PocketHole
    if let Some(pocket_hole) = zip.next() {
        chosen_items.insert(pocket_hole.0.as_ref().unwrap());    
    }

    let mut selected_items: Vec<Item> = Vec::new();
    for item in chosen_items {
        selected_items.push(item.item_id);
    }

    selected_items.sort();
    return selected_items;
}

fn main() -> Result<(), Box<dyn Error>> {
    let mut data = String::new();
    io::stdin().read_line(&mut data)?;

    let mut duel_input: DuelInput = serde_json::from_str::<DuelInput>(data.as_str()).unwrap();

    let selected_items: Vec<Item> = do_step(&mut duel_input);

    if let Ok(json_output) = serde_json::to_string(&selected_items) {
        println!("{}", json_output);
        return Ok(());
    }

    return Err("Could not format result!".into());

}

