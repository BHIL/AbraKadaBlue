import React from "react";
import classNames from 'classnames/bind';


export default function ProfilePic({npc, character}) {    
    return (
        <div className={classNames('profile_picture', npc ? npc.graphics.sprite : character)}></div>
    );
}
