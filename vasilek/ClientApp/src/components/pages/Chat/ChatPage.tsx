import React, {useEffect, useRef, useState} from 'react';
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {useSelector} from "react-redux";
import {getCurrentUser, getIsAuth} from "../../../redux/users-selectors";
import {message} from 'antd';
import s from './ChatPage.module.css';
import photo from '../../../assets/images/man.png';
import {Link} from 'react-router-dom';

let pathToFolderWithPhotos = 'https://vasilek.blob.core.windows.net/userphotoscontainer/';

type RequestType = {
    userId: number
    messageText: string
}

type ResponseType = {
    userId: number
    userFirstName: string
    userLastName: string
    avaPhoto: string
    messageText: string
}

const AddMessageForm = (props: { sendMessage: (res: RequestType) => void }) => {
    const user = useSelector(getCurrentUser);
    const isAuth = useSelector(getIsAuth);
    const [_message, setMessage] = useState('');

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isMessageProvided = _message && _message !== '';

        if (isMessageProvided && isAuth) {
            if (user) {
                const res: RequestType = {
                    userId: user.Id,
                    messageText: _message
                }
                props.sendMessage(res);
                setMessage('');
            }
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

const Message = (props: ResponseType) => (
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

const Messages = (props: { chat: ResponseType[] }) => {
    return (
        <div className={s.window_chat}>
            {props.chat
                .map(m => <Message
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
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [chat, setChat] = useState([]);
    const latestChat = useRef<any>(null);

    latestChat.current = chat;

    useEffect(() => {
        const newConnection: HubConnection = new HubConnectionBuilder()
            .withUrl(window.location.protocol + '//' + window.location.host + '/api/chat')
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    message.success('Connected!')

                    connection.on('ReceiveMessage', (message: RequestType) => {
                        const updatedChat: any = [...latestChat.current];
                        updatedChat.push(message);

                        setChat(updatedChat);
                    });
                })
                .catch((e: any) => message.error('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = async (res: RequestType) => {
        // @ts-ignore
        if (connection.connectionStarted) {
            try {
                await connection?.send('SendMessage', res);
            } catch (e) {
                message.error(e);
            }
        } else
            message.error('No connection to server yet.');
    }

    return (
        <div>
            <Messages chat={chat}/>
            <AddMessageForm sendMessage={sendMessage}/>
        </div>
    );
};