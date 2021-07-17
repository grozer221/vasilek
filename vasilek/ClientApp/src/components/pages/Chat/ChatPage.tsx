import React, {RefObject, useEffect, useRef, useState} from 'react';
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {useDispatch, useSelector} from "react-redux";
import {getIsAuth} from "../../../redux/users-selectors";
import {message} from 'antd';
import s from './ChatPage.module.css';
import photo from '../../../assets/images/man.png';
import {Link} from 'react-router-dom';
import {ResponseMessageType} from '../../../api/chat-api';
import {sendMessage, startMessagesListening, stopMessagesListening} from "../../../redux/chat-reducer";
import {AppStateType} from "../../../redux/redux-store";

let pathToFolderWithPhotos = 'https://vasilek.blob.core.windows.net/userphotoscontainer/';


const AddMessageForm = () => {
    const isAuth = useSelector(getIsAuth);
    const [_message, setMessage] = useState('');
    const dispatch = useDispatch();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isMessageProvided = _message && _message !== '';

        if (isMessageProvided && isAuth) {
            dispatch(sendMessage(_message));
            setMessage('');
        }
    }

    const onMessageUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    }

    return (
        <form className={s.form_input_message} onSubmit={onSubmit}>
            <div style={{width: '90%'}}>
                <textarea style={{width: '100%'}} onChange={onMessageUpdate} value={_message}></textarea>
            </div>
            <div style={{width: '10%'}}>
                <button style={{width: '100%'}}>Submit</button>
            </div>
        </form>
    )
};

const Message = (props: ResponseMessageType) => (
    <div style={{background: "#eee", borderRadius: '5px', padding: '0 10px'}}>
        <p>
            <Link to={'/profile/' + props.userId}>
                <img width={'100px'} src={props.avaPhoto === null ? photo : pathToFolderWithPhotos + props.avaPhoto}/>
                <strong>{props.userFirstName} {props.userLastName}</strong>
            </Link>
        </p>
        <p>{props.messageText}</p>
    </div>
);

const Messages = () => {
    const messages = useSelector((state: AppStateType) => state.chat.messages);
    return (
        <div className={s.window_chat}>
            {messages.map(m => <Message
                key={Date.now() * Math.random()}
                userId={m.userId}
                userFirstName={m.userFirstName}
                userLastName={m.userLastName}
                avaPhoto={m.avaPhoto}
                messageText={m.messageText}
            />)}
        </div>
    )
};

export const ChatPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(startMessagesListening());
        return () => {
            dispatch(stopMessagesListening());
        }
    }, []);

    return (
        <div>
            <Messages/>
            <AddMessageForm/>
        </div>
    );
};