import React from 'react';
import classNames from 'classnames/bind';

export default class Character extends React.Component {
    render() {
        const style = {
            left: this.props.character.x,
            top: this.props.character.y,
            zIndex: this.props.character.y + 53,
        };

        return (
            <div id="character" className={classNames(this.props.character.direction, this.props.character.is_rusty ? 'Rusty' : 'Crusty')} style={style} />
        );
    }
}