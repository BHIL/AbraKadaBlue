import React from 'react';
import classNames from 'classnames/bind';
import Items from 'config/Items';

export default class ItemIcon extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popover: false,
        };

        this.timer_id = null;
    }

    onMouseEnter(e) {
        this.timer_id = setTimeout(() => {
            this.setState({popover: true});
        }, 600);
    }

    onMouseLeave(e) {
        this.setState({popover: false});
        clearTimeout(this.timer_id);
        this.timer_id = null;
    }

    render() {
        const item_id = this.props.item_id;
        
        return (
            <>
                <div className={classNames('item_icon', Items[item_id]?.classname, {popover: this.state.popover, disabled: this.props.disabled})} onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
                    <span className='amount'>{this.props.amount}</span>
                    {Items[item_id] && <div className='item_popover bordered_window'>
                        <h2>{Items[item_id].name}</h2>
                        <p>{Items[item_id].description}</p>
                    </div>}
                </div>
            </>
        );
    }
}