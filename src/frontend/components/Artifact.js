import React from 'react';
import classNames from 'classnames/bind';

export default class Artifact extends React.Component {
    render() {
        const artifact = this.props.artifact;
        const style = {
            top: artifact.y,
            left: artifact.x,
            zIndex: artifact.z,
        }

        const is_locked = (this.props.artifact.assosiated_npc && this.props.locked_npcs.indexOf(this.props.artifact.assosiated_npc) >= 0);
        const is_animated_unlock = this.props.unlocking_npcs.has(this.props.artifact.assosiated_npc);

        return (
            <div className={classNames('artifact', artifact.sprite, {locked: is_locked, unlocking: is_animated_unlock})} style={style} onAnimationEnd={this.props.onAnimationEnd} />
        );
    }
}