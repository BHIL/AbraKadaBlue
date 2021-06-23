import React from "react";
import Inventory from 'components/Inventory';
import LastAction from 'components/LastAction';


export default function StatusBar({game_state, onOpenMenu}) {
    return (
        <div id="status_bar" className="bordered_window">
            <Inventory inventory={game_state.inventory} />
            <span>Score: {game_state.score}</span>
            <LastAction last_action_result={game_state.last_action_result} />
            <a onClick={onOpenMenu} className='button'>Menu</a>
        </div>
    );
}
