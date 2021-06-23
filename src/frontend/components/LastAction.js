import React from 'react';
import ItemIcon from 'components/ItemIcon';
import classNames from 'classnames/bind';

export default function LastAction({last_action_result}) {
    if (last_action_result?.buy) {
        return (
            <div id="last_action_results">
                <div>
                    {last_action_result.sell.map(item =>
                        <ItemIcon key={item.item_id} item_id={item.item_id} amount={item.quantity} />
                    )}
                </div>
                 - 
                <div>
                    {last_action_result.buy.map(item =>
                        <ItemIcon key={item.item_id} item_id={item.item_id} amount={item.quantity} />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            {JSON.stringify(last_action_result)}
        </div>
    );
}