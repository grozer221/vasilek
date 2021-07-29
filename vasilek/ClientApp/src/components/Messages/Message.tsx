import React from 'react';
import s from './Messages.module.css'
import {MessageType} from "../../api/dialogs-api";
import {useSelector} from "react-redux";
import {s_getCurrentUserId} from "../../redux/auth-selectors";
import reactStringReplace from 'react-string-replace';
import {Emoji} from "emoji-mart";


type PropsType = {
    message: MessageType
}

const Message: React.FC<PropsType> = ({message}) => {
    const currentUserId = useSelector(s_getCurrentUserId);
    const isMyMessage = (userId: number) => {
        return currentUserId === userId
    }

    return (
        <div className={[s.wrapper_message, isMyMessage(message.user.id) ? s.my_message : s.others_message].join(' ')}>
            <div className={[s.message, isMyMessage(message.user.id) ? s.my_message_border : s.others_message_border].join(' ')}>
                <div className={s.message_content}>
                    <div className={s.message_text}>{reactStringReplace(message.messageText,
                        /:(.+?):/,
                        (match, i) => (
                        <Emoji size={26} emoji={match} set='apple'/>
                    ))}</div>
                    <div>
                        <small>{message.dateCreate.toString().substr(11, 5)}</small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Message;
