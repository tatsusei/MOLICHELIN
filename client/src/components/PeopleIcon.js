import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import React from "react";

export default ({size, color, onClick}) =>  (
    <EmojiPeopleIcon 
        onClick={onClick} 
        style={{ fontSize: size, color }}
    />
);
