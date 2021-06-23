import React from "react";
import classNames from 'classnames/bind';
import Inventory from 'components/Inventory';
import {OPPONENT} from 'utils/utils';
import Items from 'config/Items';
import {is_equal_list} from 'utils/utils';

function Bar({kind, value}) {
    return (
        <div className={classNames('bar', kind)}>
            <div className="icon" />
            <div className={classNames('value', `value-${Math.ceil(value / 10)}`)} />
        </div>
    );
}

function PlayerCard({inventory, player_stats, invert, on_item_click, selected_items, show_send_btn, on_send_click, character, is_attacking, game_end, is_winner}) {
    let character_name, character_class, game_end_class;
    if (character == 'Crusty' || character == 'Rusty') {
        character_name = character;
        character_class = character;
    }
    else {
        character_name = character.name;
        character_class = character.graphics.sprite;
    }

    if (game_end) {
        game_end_class = is_winner ? 'win' : 'cry infinite';
    }

    return (
        <div className={classNames('player_card', {rtl: invert})}>
            <div className={classNames('side', {attack: is_attacking, defence: !is_attacking})}>
                {show_send_btn && <a className='button white' onClick={on_send_click}>Commit</a>}
            </div>
            <div>
                <Bar value={player_stats.trollerance} kind='trollerance'/>
                <Bar value={player_stats.energy} kind='energy'/>
                <div>
                    <div className={classNames('reaction', character_class, player_stats.reaction, game_end_class, {'sugerrush': player_stats.energy > 95})} />
                    <div className={classNames('name')}>{character_name}</div>
                </div>
                <Inventory inventory={inventory} on_item_click={on_item_click} selected_items={selected_items}/>
            </div>
        </div>
    );
}

function DuelItem({item_id, is_attacking, invert}) {
    return (
        <div className={classNames('duel_item', {attack: is_attacking, defence: !is_attacking, invert: invert}, Items[item_id]?.classname)} />
    );
}

const REACTION_DELAY = 500;
const REACTION_DURATION = 1200;
const RESPITE_DURATION = 1500;

export default class DuelWindow extends React.Component {
    constructor(props) {
        super(props);

        const player = this.props.duel[this.props.duel_player];
        const opponent = this.props.duel[OPPONENT[this.props.duel_player]];

        this.state = {
            current_shown_turn: -1,
            last_shown_step: -1,
            is_animating: false,
            player_current_stats: player,
            opponent_current_stats: opponent,
            player_item: '',
            opponent_item: '',
            selected_items: props.duel_selected_items,
            game_end: false,
            is_winner: false,
        };

        this.timer_id = null;
    }

    static getDerivedStateFromProps(props, state) {
        // If the last shown turn is not the last one
        if (state.current_shown_turn < props.duel.turn_num) {
            return {
                // When we start showing new turn, we want to reset the selected items
                selected_items: props.duel_selected_items,
                current_shown_turn: props.duel.turn_num,
                last_shown_step: -1,
            };
        }

        return null;
    }

    componentWillUnmount() {
        if (this.timer_id != null) {
            clearTimeout(this.timer_id);
            this.timer_id = null;
        }
    }

    animate_step(i) {
        this.setState({last_shown_step: i, is_animating: true});
        
        let time_to_next_step = -1;
        const last_turn = this.props.duel.last_turn;

        const attacker_item = last_turn.attacker == this.props.duel_player ? 'player_item' : 'opponent_item';
        const defender_item = last_turn.attacker != this.props.duel_player ? 'player_item' : 'opponent_item';

        if (i < last_turn.attacks.length) {
            time_to_next_step = this.animate_attack_step(last_turn.attacks[i], attacker_item, defender_item);
        }
        else {
            const di = i - last_turn.attacks.length;
            if (di < last_turn.defences.length) {
                const defender_stats = (last_turn.attacker != this.props.duel_player) ? 'player_current_stats' : 'opponent_current_stats';
                time_to_next_step = this.animate_defence_step(last_turn.defences[di], attacker_item, defender_item, defender_stats);
            }
            else {
                // If the game is over
                if (this.props.duel[this.props.duel_player]['trollerance'] <= 0 || this.props.duel[OPPONENT[this.props.duel_player]]['trollerance'] <= 0) {
                    const is_winner = this.props.duel[this.props.duel_player]['trollerance'] > this.props.duel[OPPONENT[this.props.duel_player]]['trollerance'];
                    this.setState({
                        player_current_stats: this.props.duel[this.props.duel_player],
                        opponent_current_stats: this.props.duel[OPPONENT[this.props.duel_player]],
                        player_item: '',
                        opponent_item: '',
                        game_end: true,
                        is_winner: is_winner,
                    });
                }
                else {
                    // Set the final state of this turn
                    this.setState({
                        player_current_stats: this.props.duel[this.props.duel_player],
                        opponent_current_stats: this.props.duel[OPPONENT[this.props.duel_player]],
                        player_item: '',
                        opponent_item: '',
                        is_animating: false,
                    });
                }
            }
        }

        if (time_to_next_step >= 0) {
            this.timer_id = setTimeout(() => {this.animate_step(i + 1);}, time_to_next_step);
        }
    }

    animate_defence_step(step, attacker_item, defender_item, defender_stats) {
        console.log('d step', step);

        // Reset items
        this.setState({
            [attacker_item]: '',
            [defender_item]: '',
        });

        // Show the step only if something happen during this step
        if (step.energy == this.state[defender_stats].energy && step.trollerance == this.state[defender_stats].trollerance) {
            return 0;
        }
        
        // Show the defence item
        this.setState({
            [defender_item]: step.defence,
        });

        // Show trollerance and energy in delay
        setTimeout(_ => {
            this.setState({
                [defender_stats]: {
                    energy: step.energy,
                    trollerance: step.trollerance,
                    reaction: step.reaction,
                },
            });
        }, REACTION_DELAY + REACTION_DURATION);

        return REACTION_DELAY + REACTION_DURATION;
    }

    animate_attack_step(step, attacker_item, defender_item) {
        console.log('a step', step);

        const stats_to_update = (step.attacked == this.props.duel_player) ? 'player_current_stats' : 'opponent_current_stats';

        // Show attack and defence items, reset reaction
        this.setState({
            [stats_to_update]: {
                energy: this.state[stats_to_update].energy,
                trollerance: this.state[stats_to_update].trollerance,
                // TODO: in case of a replay, this is not the correct value to start the animation from
                reaction: '',
            },
            [attacker_item]: step.attack,
            [defender_item]: step.defence,
        });
        // Show reaction in delay
        setTimeout(_ => {
            this.setState({
                [stats_to_update]: {
                    energy: this.state[stats_to_update].energy,
                    trollerance: this.state[stats_to_update].trollerance,
                    reaction: step.reaction,
                },
            });
        }, REACTION_DELAY);

        // Show trollerance and energy in delay
        setTimeout(_ => {
            this.setState({
                [stats_to_update]: {
                    energy: step.energy,
                    trollerance: step.trollerance,
                },
            });
        }, REACTION_DELAY + REACTION_DURATION);

        return REACTION_DELAY + REACTION_DURATION + RESPITE_DURATION;
    }

    on_item_click(item_id) {
        const selected_items = this.state.selected_items;
        const index = selected_items.indexOf(item_id);
        if (index == -1) {
            if (selected_items.length < 3) {
                selected_items.push(item_id);
            }
        }
        else {
            selected_items.splice(index, 1);
        }
        this.setState({selected_items: selected_items});
    }

    render() {
        const player = this.props.duel[this.props.duel_player];
        const opponent = this.props.duel[OPPONENT[this.props.duel_player]];

        if (this.state.current_shown_turn >= 0 && this.state.last_shown_step == -1) {
            if (this.timer_id != null) {
                clearTimeout(this.timer_id);
            }
            this.timer_id = setTimeout(() => {this.animate_step(0);});
        }

        return (
            <div id="duel_window">
                <PlayerCard inventory={player.inventory} 
                            character={this.props.is_rusty ? 'Rusty' : 'Crusty'}
                            player_stats={this.state.player_current_stats} 
                            on_item_click={this.on_item_click.bind(this)} 
                            selected_items={this.state.selected_items} 
                            is_winner={this.state.is_winner}
                            game_end={this.state.game_end}
                            show_send_btn={is_equal_list(this.props.duel_selected_items, this.state.selected_items) == false}
                            is_attacking={(this.props.duel.current_attacker != this.props.duel_player) == this.state.is_animating}
                            on_send_click={_ => {this.props.select_items_callback(this.state.selected_items)}}
                />
                <DuelItem item_id={this.state.player_item} is_attacking={this.props.duel.current_attacker != this.props.duel_player} />
                <DuelItem item_id={this.state.opponent_item} is_attacking={this.props.duel.current_attacker == this.props.duel_player} invert={true} />
                <PlayerCard inventory={opponent.inventory}
                            character={this.props.npc || (this.props.is_rusty ? 'Crusty' : 'Rusty')}
                            player_stats={this.state.opponent_current_stats}
                            is_winner={!this.state.is_winner}
                            game_end={this.state.game_end}
                            is_attacking={(this.props.duel.current_attacker == this.props.duel_player) == this.state.is_animating}
                            invert={true}
                />
                <span className='description'>
                    <a onClick={_ => {this.setState({last_shown_step: -1, game_end: false})}}>Replay Turn</a>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {JSON.stringify(this.props.duel.last_turn)}
                </span>
                <span />
                <span>
                    {this.state.game_end && <a className='button' onClick={_ => this.props.onCloseClick()}>Close Window</a>}
                </span>
            </div>
        );
    }
}
