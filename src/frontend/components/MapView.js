import React from 'react';
import Artifact from 'components/Artifact';
import Character from 'components/Character';
import NPC from 'components/NPC';
import Conversation from 'components/Conversation';

const VIEWPORT = 0.2;
export default class MapView extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            x: this.props.character.x - this.props.window_size.width / 2,
            y: this.props.character.y - this.props.window_size.height / 2,
            unlocking_npcs: new Set(),
            locked_npcs: this.props.locked_npcs,
        };
    }

    static getDerivedStateFromProps(props, state) {
        let state_changes = {};

        if (props.character.x - state.x < props.window_size.width * VIEWPORT) {
            state_changes.x = props.character.x - props.window_size.width * VIEWPORT;
        }
        else if (props.character.x - state.x > props.window_size.width * (1 - VIEWPORT)) {
            state_changes.x = props.character.x - props.window_size.width * (1 - VIEWPORT);
        }

        if (props.character.y - state.y < props.window_size.height * VIEWPORT) {
            state_changes.y = props.character.y - props.window_size.height * VIEWPORT;
        }
        else if (props.character.y - state.y > props.window_size.height * (1 - VIEWPORT)) {
            state_changes.y = props.character.y - props.window_size.height * (1 - VIEWPORT);
        }

        state.locked_npcs.forEach(x => {
            if (props.locked_npcs.indexOf(x) == -1) {
                state.unlocking_npcs.add(x);
            }
        });

        state_changes.unlocking_npcs = state.unlocking_npcs;
        state_changes.locked_npcs = props.locked_npcs;

        return state_changes;
    }
    
    render() {
        const style = {
            left: -this.state.x,
            top: -this.state.y,
            width: this.props.map.width,
            height: this.props.map.height,
        };

        return (
            <div style={style} id="MapView" onClick={this.props.onClick} className={this.props.className}>
                <Character character={this.props.character} />
                {this.props.artifacts.map((artifact, index) => 
                    <Artifact
                        artifact={artifact}
                        locked_npcs={this.props.locked_npcs}
                        unlocking_npcs={this.state.unlocking_npcs}
                        onAnimationEnd={_ => {this.state.unlocking_npcs.delete(artifact.assosiated_npc); this.setState({unlocking_npcs: this.state.unlocking_npcs});}}
                        key={index}
                        />
                )}
                {Object.values(this.props.npcs).map((npc, index) => 
                    <NPC
                        npc={npc}
                        key={npc.id}
                        is_paused={npc.id == this.props.conversation?.npc?.id}
                        is_locked={this.props.locked_npcs.indexOf(npc.id) >= 0}
                        is_unlocking={this.state.unlocking_npcs.has(npc.id)}
                    />
                )}

                {this.props.conversation && <Conversation conversation={this.props.conversation} character={this.props.character} inventory={this.props.inventory} />}
            </div>
        );
    }
}