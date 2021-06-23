import React from 'react';
import ItemIcon from 'components/ItemIcon';
import classNames from 'classnames/bind';

export default function Inventory({inventory, on_item_click, selected_items}) {
    return (
        <div className={classNames('inventory')}>
            {inventory.map(({item_id, amount}) => (
                <div className="inventory_item" key={item_id} onClick={_ => {on_item_click && on_item_click(item_id)}}>
                    <ItemIcon item_id={item_id} />
                    <span className='amount'>{amount}</span>
                    {selected_items && selected_items.indexOf(item_id) >= 0 && <div className={classNames('number', `number-${selected_items.indexOf(item_id)}`)} />}
                </div>
            ))}
        </div>
    );
}