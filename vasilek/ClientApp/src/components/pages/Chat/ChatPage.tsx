import React, {FC, useEffect, useState} from "react";
import s from './ChatPage.module.css'
import {useSelector} from "react-redux";

const ws = new WebSocket('');
export type ChatMessageType = {
    Message: string
    AvaPhoto: string
    UserId: number
    UserName: string
}

export const ChatPage: FC = () => {
    return (
        <div>
            <Chat/>
        </div>
    );
};

export const Chat: FC = () => {

    return (
        <div>
            <Messages/>
            <AddMessageForm/>
        </div>
    );
};

export const Messages: FC = () => {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    useEffect(() => {
        ws.addEventListener('message', e => {
            let newMessages = JSON.parse(e.data);
            setMessages((prevMessages) => [...prevMessages, ...newMessages]);
        });
    }, []);
    return (
        <div className={s.messages}>
            {messages.map((m, index) => <Message key={index} message={m}/>)}
        </div>
    );
};

export const Message: FC<{ message: ChatMessageType }> = (props) => {
    return (
        <div>
            <img src={props.message.AvaPhoto}/> <b>{props.message.UserName}</b>
            <br/>
            {props.message.Message}
            <hr/>
        </div>
    );
};

export const AddMessageForm: FC = () => {
    const [message, setMessage] = useState('');
    const sendMessage = () => {
        if(!message)
            return;
        ws.send(message);
        setMessage('');
    }
    return (
        <div>
            <textarea onChange={(e) => setMessage(e.currentTarget.value)} value={message}></textarea>
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};