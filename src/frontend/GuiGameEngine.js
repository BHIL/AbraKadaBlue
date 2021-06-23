import React from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import TradeWindow from 'components/TradeWindow';
import FindDuelWindow from 'components/FindDuelWindow';
import PendingWindow from 'components/PendingWindow';
import DuelWindow from 'components/DuelWindow';
import MenuWindow from 'components/MenuWindow';
import HelpWindow from 'components/HelpWindow';
import AboutWindow from 'components/AboutWindow';
import CreditsWindow from 'components/CreditsWindow';
import StatusBar from 'components/StatusBar';
import {ButtonEvents, NPC_TYPE} from 'enums';
import MapView from 'components/MapView';
import RoadMap from 'utils/RoadMap';
import classNames from 'classnames';
import {TUTORIAL_NPC} from 'consts';

const SPEED = 10,
      IDLE_TIMEOUT = 1500;

export default class GuiGameEngine extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            character: {
                x: 0,
                y: 0,
                direction: '',
                is_rusty: this.props.game_state.is_rusty,
            },
            map: {
                width: 0,
                height: 0,
            },
            is_tutorial: null,
            conversation: this.is_in_tutorial() ? this.new_conversation(TUTORIAL_NPC) : null,
            window_type: null,
            last_shown_duel: null,
        };

        this.road_map = new RoadMap();
    }

    static getDerivedStateFromProps(props, state) {
        
        let state_changes = {};
        
        if (props.game_state.status == 'waiting_for_broker' || props.game_state.status == 'waiting_for_trader') {
            // Show pending window if we are waiting for broker/trader
            state_changes.window_type = 'pending_trade';
        }
        else if (props.game_state.status == 'waiting_for_duel') {
            // Show pending window if we are waiting for duel
            state_changes.window_type = 'pending_duel';
        }
        else if (props.game_state.status == 'in_duel') {
            // Show duel window if we are during a duel
            state_changes.window_type = 'duel';
        }
        else if (props.game_state.status == 'map' && props.game_state.last_action_result?.action == 'duel' && state.last_shown_duel != props.game_state.last_action_result.id) {
            // Show duel window if we just finished a duel and didn't close the window since
            state_changes.window_type = 'duel';
        }
        else if (props.game_state.status != 'waiting_for_broker' && props.game_state.status != 'waiting_for_trader' && state.window_type == 'pending_trade') {
            // Return to the map if we are not waiting for market but the pending windows is shown
            state_changes.window_type = null;
        }
        else if (props.game_state.status != 'waiting_for_duel' && state.window_type == 'pending_duel') {
            // Return to the map if we are not waiting for duel but the pending windows is shown
            state_changes.window_type = null;
        }
        else if (props.game_state.status != 'in_duel' && state.window_type == 'duel') {
            // Return to the map if we are not in a duel but the duel windows is shown
            state_changes.window_type = null;
        }

        const is_tutorial = GuiGameEngine._is_in_tutorial(props);
        if (state.is_tutorial != is_tutorial) {
            state_changes.is_tutorial = is_tutorial;
            state_changes.map = {
                width: is_tutorial ? 1400 : 3840,
                height: is_tutorial ? 1000 : 2160,
            };
            state_changes.character = {
                x: is_tutorial ? 700 : 1920,
                y: is_tutorial ? 500 : 1080,
                direction: '',
                is_rusty: props.game_state.is_rusty,
            };
        }

        return state_changes;
    }

    move(dx, dy) {
        if (this.road_map.is_empty(this.is_in_tutorial(), this.state.character.x + dx, this.state.character.y + dy)) {
            this.state.character.x += dx;
            this.state.character.y += dy;
        }
    }

    handleKeyDown(key, e) {
        switch (key) {
            case 'a':
            case 'left':
                if (this.state.conversation) {
                    const num_of_buttons = $('#conversation_buttons .button').length;
                    this.state.conversation.selected_button = (this.state.conversation.selected_button + num_of_buttons - 1) % (num_of_buttons + 1);
                    this.setState({conversation: this.state.conversation});
                }
                else {
                    this.state.character.direction = 'left';
                    this.move(-SPEED, 0);
                    this.setState({character: this.state.character});
                }
                break;
            case 's':
            case 'down':
                if (!this.state.conversation) {
                    this.state.character.direction = 'down';
                    this.move(0, SPEED);
                    this.setState({character: this.state.character});
                }
                break;
            case 'd':
            case 'right':
                if (this.state.conversation) {
                    const num_of_buttons = $('#conversation_buttons .button').length;
                    this.state.conversation.selected_button = (this.state.conversation.selected_button + 1) % (num_of_buttons + 1);
                    this.setState({conversation: this.state.conversation});
                }
                else {
                    this.state.character.direction = 'right';
                    this.move(SPEED, 0);
                    this.setState({character: this.state.character});
                }
                break;
            case 'w':
            case 'up':
                if (!this.state.conversation) {
                    this.state.character.direction = 'up';
                    this.move(0, -SPEED);
                    this.setState({character: this.state.character});
                }
                break;
            case 'enter':
            case 'space':
                this.on_button_click();
                break;
            case 'esc':
                if (this.state.window_type) {
                    this.setState({
                        window_type: null,
                        last_shown_duel: this.props.game_state.last_action_result.id,
                    });
                }
                else if (this.state.conversation) {
                    this.setState({conversation: null});
                }
                break;
        }

        // Reset to idle after a while with no movement
        if (this.state.character.timer_id !== null) {
            clearTimeout(this.state.character.timer_id);
        }
        this.state.character.timer_id = setTimeout(() => {
            this.state.character.direction = '';
            this.setState({character: this.state.character});
        }, IDLE_TIMEOUT);
    }
    
    on_button_click(e=null) {
        // If we are in a conversation already, advance to the next msg
        if (this.state.conversation) {
            const num_of_buttons = $('#conversation_buttons .button').length;
            if (num_of_buttons > 0) {
                let btn_event;
                if (e) {
                    let $target = $(e.target);
                    if ($target.hasClass('button') == false) {
                        $target = $target.parents('.button');
                    }
                    btn_event = $target.data('event');
                }
                else {
                    btn_event = $('#conversation_buttons .button.selected').data('event');
                }

                switch (btn_event) {
                    case ButtonEvents.UNLOCK_NPC:
                        this.props.unlock_npc_callback(this.state.conversation.npc.id);
                        this.setState({ conversation: null });
                        break;
                    case ButtonEvents.CLOSE_CONVERSATION:
                        this.setState({ conversation: null });
                        break;
                    case ButtonEvents.OPEN_WINDOW:
                        if (this.state.conversation.npc.type == NPC_TYPE.BROKER || this.state.conversation.npc.type == NPC_TYPE.TRADER) {
                            this.setState({ window_type: 'trade' });
                        }

                        if (this.state.conversation.npc.type == NPC_TYPE.ARENA_MASTER) {
                            this.setState({ window_type: 'find_duel' });
                        }
                        break;
                }
            }
            else {
                this.state.conversation.msg_index++;

                // If we done with this conversation
                if (this.state.conversation.msg_index >= this.state.conversation.npc.get_conversation(this.state.conversation.is_locked).length) {
                    this.state.conversation = null;
                }
                this.setState({ conversation: this.state.conversation });
            }
        }
        else {
            // Check if we are close to an npc to start conversation with
            const $character = $('#character'),
                cx = this.state.character.x + $character.width() / 2,
                cy = this.state.character.y + $character.height() / 2;
            let closest_npc_id = null,
                shortest_distance2 = 10000;
            $('.npc').each((i, npc) => {
                const $npc = $(npc),
                    x = parseInt(npc.style.left) + $npc.width() / 2,
                    y = parseInt(npc.style.top) + $npc.height() / 2,
                    distance2 = (x - cx) * (x - cx) + (y - cy) * (y - cy);
                if (shortest_distance2 > distance2) {
                    shortest_distance2 = distance2;
                    closest_npc_id = $npc.data('npc-id');
                }
            });
            if (closest_npc_id) {
                this.setState({
                    conversation: this.new_conversation(closest_npc_id)
                });
            }
        }
    }

    new_conversation(npc_id) {
        return {
            is_locked: (this.props.game_state.locked_npcs.indexOf(npc_id) >= 0),
            npc: (this.is_in_tutorial()) ? this.props.tutorial_npcs[npc_id] : this.props.npcs[npc_id],
            msg_index: 0,
            selected_button: 0,
        };
    }

    is_in_tutorial() {
        return GuiGameEngine._is_in_tutorial(this.props);
    }

    static _is_in_tutorial(props) {
        return (props.game_state.locked_npcs.indexOf(TUTORIAL_NPC) >= 0);
    }

    render() {
        const is_tutorial = this.is_in_tutorial();
        const artifacts = is_tutorial ? this.props.tutorial_artifacts : this.props.artifacts;
        const npcs = is_tutorial ? this.props.tutorial_npcs : this.props.npcs;

        return (
            <>
                <MapView 
                    map={this.state.map}
                    character={this.state.character}
                    window_size={this.props.window_size}
                    artifacts={artifacts}
                    npcs={npcs}
                    locked_npcs={this.props.game_state.locked_npcs}
                    conversation={this.state.conversation}
                    inventory={this.props.game_state.inventory}
                    onClick={this.on_button_click.bind(this)}
                    className={classNames({tutorial: is_tutorial})}
                    />

                {(() => {
                    if (this.state.window_type) {
                        let window;
                        switch (this.state.window_type) {
                            case 'trade':
                                window = <TradeWindow
                                    npc={this.state.conversation.npc}
                                    submit_trade_callback={trade => this.props.submit_trade_callback(this.state.conversation.npc.id, trade)}
                                />;
                                break;
                            case 'pending_trade':
                                window = <PendingWindow
                                    cancel_pending_callback={this.props.cancel_pending_callback}
                                    suggested_trade={this.props.game_state.suggested_trade}
                                    npc={this.props.npcs[this.props.game_state.trade_npc]}
                                    cancel_pending={this.props.game_state.cancel_pending}
                                />;
                                break;
                            case 'find_duel':
                                window = <FindDuelWindow
                                    npc={this.state.conversation.npc}
                                    submit_duel_offer_callback={(risked_item, desired_item) => this.props.submit_duel_offer_callback({npc: this.state.conversation.npc.id, risked_item, desired_item})}
                                />;
                                break;
                            case 'pending_duel':
                                window = <PendingWindow
                                    cancel_pending_callback={this.props.cancel_pending_callback}
                                    duel_offer={this.props.game_state.duel_offer}
                                    npc={this.props.npcs[this.props.game_state.duel_npc]}
                                    cancel_pending={this.props.game_state.cancel_pending}
                                />;
                                break;
                            case 'duel':
                                window = <DuelWindow
                                    duel_player={this.props.game_state.duel_player}
                                    is_rusty={this.props.game_state.is_rusty}
                                    duel={this.props.game_state.duel_state}
                                    duel_selected_items={this.props.game_state.duel_selected_items}
                                    select_items_callback={this.props.select_items_callback}
                                    npc={this.props.npcs[this.props.game_state.opponent_character]}
                                    onCloseClick={_ => this.setState({
                                        window_type: null,
                                        last_shown_duel: this.props.game_state.last_action_result.id
                                    })}
                                />;
                                break;
                            case 'menu':
                                window = <MenuWindow
                                    onBtnClick={window_name => this.setState({ window_type: window_name })}
                                    reset_inventory_callback={this.props.reset_inventory_callback}
                                    />
                                break;
                            case 'help':
                                window = <HelpWindow />
                                break;
                            case 'about':
                                window = <AboutWindow />
                                break;
                            case 'credits':
                                window = <CreditsWindow />
                                break;
                        }

                        return <div id='window_container' onClick={(e) => {if (e.target == e.currentTarget) {this.setState({window_type: null});}}}>
                            {window}
                        </div>
                    }
                })()}

                <StatusBar
                    game_state={this.props.game_state}
                    onOpenMenu={() => this.setState({ window_type: 'menu' })}
                    />

                <KeyboardEventHandler
                    handleKeys={['w', 'a', 's', 'd', 'left', 'right', 'up', 'down', 'enter', 'space', 'esc']}
                    onKeyEvent={this.handleKeyDown.bind(this)} />
            </>
        );
    }
}