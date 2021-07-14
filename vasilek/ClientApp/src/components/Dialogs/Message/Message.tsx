import React from 'react';
import s from './Message.module.css'

type PropsType = {
    message: string
}

const Message: React.FC<PropsType> = (props) => {
    return (
        <div className="message">{props.message}</div>
    );
}

export default Message;
