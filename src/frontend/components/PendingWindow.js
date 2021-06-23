import React, { useState } from "react";
import ItemIcon from 'components/ItemIcon';
import ProfilePic from 'components/ProfilePic';
import classNames from 'classnames/bind';


export default function PendingWindow({cancel_pending_callback, cancel_pending, suggested_trade, duel_offer, npc}) {
    let content;
    if (suggested_trade) {
        content = <div>{JSON.stringify(suggested_trade)}</div>;
    }
    else {
        content = <div id='pending_duel_offer'>
            <ProfilePic npc={npc} />
            <div>
                I'm looking for an opponent worth your skills.
            </div>
            <div>
                If you win, you will gain <ItemIcon item_id={duel_offer.desired_item} /> But if you lose, you will have one <ItemIcon item_id={duel_offer.risked_item} /> less...
            </div>
        </div>
    }

    return (
        <div id="pending_window" className="bordered_window">
            {content}
            <a onClick={() => {cancel_pending_callback()}} className={classNames('button', {disabled: cancel_pending})}>{cancel_pending ? 'Canceling...' : 'Cancel'}</a>
        </div>
    );
}
