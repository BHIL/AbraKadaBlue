import React from 'react';
import classNames from 'classnames/bind';
import {SPEAKER, NPC_TYPE, ButtonEvents} from 'enums';
import ProfilePic from 'components/ProfilePic';
import ItemIcon from 'components/ItemIcon';

export default class Conversation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            highlighted: 0
        }

        this.current_text = null;
        this.timer_id = null;
    }

    animate_text(i) {
        if (this.current_text != null) {
            this.setState({highlighted: i});

            if (i < this.current_text.split(' ').length) {
                this.timer_id = setTimeout(this.animate_text.bind(this, i + 1), 300);
            }
        }
    }

    componentWillUnmount() {
        if (this.timer_id != null) {
            clearTimeout(this.timer_id);
            this.timer_id = null;
        }
        this.current_text = null;
    }

    render() {
        const style = {
            left: this.props.character.x - 80,
            top: this.props.character.y - 153
        };

        const conversation = this.props.conversation.npc.get_conversation(this.props.conversation.is_locked);
        const {speaker, text} = conversation[this.props.conversation.msg_index];

        if (text != this.current_text) {
            this.current_text = text;
            if (this.timer_id != null) {
                clearTimeout(this.timer_id);
            }
            this.timer_id = setTimeout(() => {this.animate_text(0);});
        }

        const rendered_text = text.split(' ').map((word, i) => <span key={i} className={classNames('word', {'highlighted': this.state.highlighted == i})}>{word}</span>)
        let rendered_footer;

        // On the last message, we will show buttons
        if (this.props.conversation.msg_index < conversation.length - 1) {
            rendered_footer = <span id='conversation_arrow' />;
        }
        else {
            if (this.props.conversation.is_locked) {
                const has_unlocking_price = this.props.inventory.some(i => i.item_id == this.props.conversation.npc.unlock_price);
                rendered_footer = <div id='conversation_buttons'>
                    <span className={classNames('button', {'selected': this.props.conversation.selected_button == 1, 'disabled': !has_unlocking_price})} data-event={ButtonEvents.UNLOCK_NPC}><ItemIcon item_id={this.props.conversation.npc.unlock_price} disabled={!has_unlocking_price} /></span>
                    <span className={classNames('button', {'selected': this.props.conversation.selected_button == 2})} data-event={ButtonEvents.CLOSE_CONVERSATION}>Sorry</span>
                </div>;
            }
            else if (this.props.conversation.npc.type == NPC_TYPE.BROKER) {
                rendered_footer = <div id='conversation_buttons'>
                    <span className={classNames('button', {'selected': this.props.conversation.selected_button == 1})} data-event={ButtonEvents.OPEN_WINDOW}>Suggest Trade</span>
                    <span className={classNames('button', {'selected': this.props.conversation.selected_button == 2})} data-event={ButtonEvents.CLOSE_CONVERSATION}>Bye</span>
                </div>;
            }
            else if (this.props.conversation.npc.type == NPC_TYPE.ARENA_MASTER) {
                rendered_footer = <div id='conversation_buttons'>
                    <span className={classNames('button', {'selected': this.props.conversation.selected_button == 1})} data-event={ButtonEvents.OPEN_WINDOW}>Find Duel</span>
                    <span className={classNames('button', {'selected': this.props.conversation.selected_button == 2})} data-event={ButtonEvents.CLOSE_CONVERSATION}>Bye</span>
                </div>;
            }
            else if (this.props.conversation.npc.type == NPC_TYPE.TRADER) {
                rendered_footer = <div id='conversation_buttons'>
                    <span className={classNames('button', {'selected': this.props.conversation.selected_button == 1})} data-event={ButtonEvents.OPEN_WINDOW}>Suggest Trade</span>
                    <span className={classNames('button', {'selected': this.props.conversation.selected_button == 2})} data-event={ButtonEvents.CLOSE_CONVERSATION}>Bye</span>
                </div>;
            }
        }

        return (
            <div id='conversation' style={style}>
                {(speaker == SPEAKER.NPC) ? 
                    <ProfilePic npc={this.props.conversation.npc} />
                    :
                    <ProfilePic character={this.props.character.is_rusty ? 'Rusty' : 'Crusty'} />
                }
                <div id='conversation_text' className='bordered_window'>
                    {rendered_text}
                    {rendered_footer}
                </div>
            </div>
        );
    }
}