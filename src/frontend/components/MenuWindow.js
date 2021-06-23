import React from "react";


export default function MenuWindow({onBtnClick, reset_inventory_callback}) {
    function onResetInventory() {
        const expected_answer = 'reset_my_inventory';
        const answer = prompt(`Are you sure you want to reset your inventory to the initial inventory? type '${expected_answer}' to approve`);
        if (answer == expected_answer) {
            reset_inventory_callback();
        }
    }

    return (
        <div id="menu_window" className="bordered_window">
            <a onClick={() => {onBtnClick('help')}} className='button'>Help</a>
            <a onClick={() => {onBtnClick('about')}} className='button'>About</a>
            <a onClick={() => {onBtnClick('credits')}} className='button'>Credits</a>
            <a onClick={onResetInventory} className='button'>Reset Inventory</a>
        </div>
    );
}
