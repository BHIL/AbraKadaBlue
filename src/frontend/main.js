import React from 'react';
import ReactDOM from 'react-dom';
import GuiGameEngine from 'GuiGameEngine';
import Backend from 'Backend';
import {Events} from 'enums';
import Items from 'config/Items';
import NPCs, {TutorialNPCs} from 'config/NPCs';
import Artifacts, {TutorialArtifacts} from 'config/Artifacts';


import Eventable from 'utils/Eventable';
class GuiGameEngineWrapper extends Eventable {
    constructor(game_state) {
        super();

        const window_size = {
            height: $(window).height(),
            width: $(window).width(),
        }

        const domContainer = $('<div>').attr('id', 'stage').appendTo(document.body).get(0);
        this.render(game_state, window_size, domContainer);

        this.set_timer(game_state);

        this.on(Events.STATE_CHANGE, new_state => {
            console.log('STATE_CHANGE fire', new_state);
            this.render(new_state, window_size, domContainer);

            this.set_timer(new_state);
        });
    }

    render(game_state, window_size, domContainer) {
        ReactDOM.render(<GuiGameEngine
            game_state={game_state}
            window_size={window_size}
            artifacts={Artifacts}
            tutorial_artifacts={TutorialArtifacts}
            npcs={NPCs}
            tutorial_npcs={TutorialNPCs}
            unlock_npc_callback={this.unlock_npc_callback.bind(this)}
            submit_trade_callback={this.submit_trade_callback.bind(this)}
            submit_duel_offer_callback={this.submit_duel_offer_callback.bind(this)}
            cancel_pending_callback={this.cancel_pending_callback.bind(this)}
            select_items_callback={this.select_items_callback.bind(this)}
            reset_inventory_callback={this.reset_inventory_callback.bind(this)} />, domContainer);
    }

    set_timer(state) {
        if (state.ttt) {
            if (this.timer_id) {
                clearTimeout(this.timer_id);
            }
            
            this.timer_id = setTimeout(() => {
                this.timer_id = null; 
                this.emit(Events.STATE_CHANGE_CHECK);
            }, state.ttt);
        }
    }

    unlock_npc_callback(npc_id) {
        this.emit(Events.UNLOCK_NPC, npc_id);
    }

    submit_trade_callback(npc_id, trade) {
        this.emit(Events.SUGGEST_TRADE, {trade: JSON.stringify(trade), npc: npc_id});
    }

    submit_duel_offer_callback(challenge) {
        this.emit(Events.MAKE_CHALLENGE, challenge);
    }

    cancel_pending_callback() {
        this.emit(Events.CANCEL_PENDING);
    }

    select_items_callback(selected_items) {
        this.emit(Events.SELECT_DUEL_ITEMS, {items: JSON.stringify(selected_items)});
    }

    reset_inventory_callback() {
        this.emit(Events.RESET_INVENTORY);
    }
}

function main() {
    Backend.get_state().done(game_state => {
        window.Items = Items
        window.NPCs = NPCs
        window.TutorialNPCs = TutorialNPCs
        console.log({game_state, Items, NPCs, TutorialNPCs});

        const game = new GuiGameEngineWrapper(game_state);

        game.on(Events.SUGGEST_TRADE, trade => {
            console.log('fire SUGGEST_TRADE', trade);
            Backend.suggest_trade(trade).done(new_state => {
                game.emit(Events.STATE_CHANGE, new_state);
            })
            .fail(({responseText}) => {console.error('API failed', responseText); alert(`API failed:\n${responseText}`)});
        });

        game.on(Events.MAKE_CHALLENGE, challenge => {
            console.log('fire MAKE_CHALLENGE', challenge);
            Backend.suggest_duel(challenge).done(new_state => {
                game.emit(Events.STATE_CHANGE, new_state);
            })
            .fail(({responseText}) => {console.error('API failed', responseText); alert(`API failed:\n${responseText}`)});
        });

        game.on(Events.UNLOCK_NPC, npc_id => {
            console.log('fire UNLOCK_NPC', npc_id);
            Backend.unlock_npc(npc_id).done(new_state => {
                game.emit(Events.STATE_CHANGE, new_state);
            })
            .fail(({responseText}) => {console.error('API failed', responseText); alert(`API failed:\n${responseText}`)});
        });

        game.on(Events.SELECT_DUEL_ITEMS, items => {
            console.log('fire SELECT_DUEL_ITEMS', items);
            Backend.select_duel_items(items).done(new_state => {
                game.emit(Events.STATE_CHANGE, new_state);
            })
            .fail(({responseText}) => {console.error('API failed', responseText); alert(`API failed:\n${responseText}`)});
        });

        game.on(Events.CANCEL_PENDING, _ => {
            console.log('fire CANCEL_PENDING');
            Backend.cancel_pending().done(new_state => {
                game.emit(Events.STATE_CHANGE, new_state);
            })
            .fail(({responseText}) => {console.error('API failed', responseText); alert(`API failed:\n${responseText}`)});
        });

        game.on(Events.RESET_INVENTORY, _ => {
            console.log('fire RESET_INVENTORY');
            Backend.reset_inventory().done(new_state => {
                game.emit(Events.STATE_CHANGE, new_state);
            })
            .fail(({responseText}) => {console.error('API failed', responseText); alert(`API failed:\n${responseText}`)});
        });

        game.on(Events.STATE_CHANGE_CHECK, _ => {
            console.log('fire STATE_CHANGE_CHECK');
            Backend.get_state().done(new_state => {
                game.emit(Events.STATE_CHANGE, new_state);
            })
            .fail(({responseText}) => {console.error('API failed', responseText); alert(`API failed:\n${responseText}`)});
        })
    }).fail(({responseText}) => {console.error('API failed', responseText); alert(`API failed:\n${responseText}`)});;
}

main();