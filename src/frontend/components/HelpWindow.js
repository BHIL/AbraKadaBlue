import React from "react";
import { Scrollbars } from 'react-custom-scrollbars';


export default function HelpWindow() {
    return (
        <div id="help_window" className="bordered_window">
            <Scrollbars autoHide autoHideTimeout={600} autoHideDuration={200}>            
                <h2>Intro</h2>
                <p>
                    Welcome to the Abra KadaBlue league! Here are some things you should know in order to avoid immediately sucking at this game.
                </p>
                
                <h2>Items</h2>
                <p>
                    In order to save the Kingdom of Fluff you will need to obtain rare and powerful magical items.<br />
                    These items will aid you in winning trolling duels and restoring good vibes to the kingdom.<br />
                    You can only have up to five unique items in your inventory at any given time since you don’t have magical pockets.
                </p>

                <h2>Trade</h2>
                <p>
                    New items can be acquired by trading.<br />
                    You can offer up items and receive other items in return.<br />
                    You can trade with other players as well as with our traders.<br />
                    The map is filled with batty brokers and tacky traders for you to find.<br />
                    <img src='/static/frontend/sprites/ui/help/conversation_with_broker.png'/><br />
                    In order to get the items you wish, tell the brokers and traders your terms of the trade.<br />
                </p>
                <h3>For example:</h3>
                <p>
                    If you want to give a Honk Honk <b>or</b> a Snooze Best and in return you would like<br />
                    to get a Fork This <b>and</b> 2 Ominous Onions,<br />
                    you can easily specify that by dragging items into groups of “and” and “or”.<br />
                    <img src='/static/frontend/sprites/ui/help/Trade.png'/>
                </p>

                <h2>Match Making</h2>
                <p>
                    When you feel ready for a challenge, a real test of your supposed skills, go to one of the<br />
                    arenas and find the arena master.<br />
                    Name the item you wish to win and the item you’re willing to risk for it.<br />
                    <img src='/static/frontend/sprites/ui/help/match_making.png'/>
                </p>

                <h2>Duel</h2>
                <p>
                    During a duel, your goal is to troll your opponent using the most absurd items.<br />
                    In each turn, either you or your opponent will be the one doing the trolling while the other tries to defend themselves.<br />
                    Whoever was on the defensive will have the chance to troll back in the next turn.<br />
                    <br />
                    During your turn you can pick up three items to be used for either  <a href="https://github.com/BHIL/AbraKadaBlue/blob/main/src/config/Items.py">attack or defense</a> and hit send.<br />
                    <img src='/static/frontend/sprites/ui/help/duel.png'/><br />

                    <br />
                    After 10 turns, the duel will be over and the player with most trollerance points will be the victor and will be given their desired item..<br />
                    Be aware of your energy level, as it will affect your <a href="https://github.com/BHIL/AbraKadaBlue/blob/main/src/workers/GameEngine.py#L170">strength</a>.
                </p>

                <h2>Unlock</h2>
                <p>
                    Some of the kingdom’s residents need your help to rebuild the village and restore the kingdom to its former glory.<br />
                    Feel free to offer them your help and set them free by giving them the items they need.<br />
                    <img src='/static/frontend/sprites/ui/help/unlock.png'/>
                </p>

                <h2>Score</h2>
                <p>
                    Each item you possess and each duelist you defeat will score you <a href="https://github.com/BHIL/AbraKadaBlue/blob/main/src/config/Scores.py">points</a>.
                </p>

                <h2>Winning</h2>
                <p>
                    The player who achieves the highest score by the end of the game while being able to explain how they did it will be well rewarded.<br />
                </p>
            </Scrollbars>
        </div>
    );
}
