import React, {EventHandler, KeyboardEventHandler, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getIsAuth} from "../../../redux/users-selectors";
import s from './ChatPage.module.css';
import photo from '../../../assets/images/man.png';
import {Link} from 'react-router-dom';
import {ResponseMessageType} from '../../../api/chat-api';
import {sendMessage} from "../../../redux/chat-reducer";
import {AppStateType} from "../../../redux/redux-store";
import {urls} from "../../../api/api";

const AddMessageForm = () => {
    const isAuth = useSelector(getIsAuth);
    const [_message, setMessage] = useState('');
    const status = useSelector((state: AppStateType) => state.chat.status);

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

    const onEnterPress = (e: any) => {
        if(e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            onSubmit(e);
        }
    }

    return (
        <form className={s.form_input_message} onSubmit={onSubmit}>
            <div>
                <textarea onKeyDown={onEnterPress} cols={50} className="editor" onChange={onMessageUpdate} value={_message}/>
            </div>
            <div>
                <button disabled={status !== 'ready'}>Submit</button>
            </div>
        </form>
    )
};

const Message: React.FC<ResponseMessageType> = React.memo((props) => {
    console.log('message')
    return (
        <div className={s.message}>
            <div>
                <Link to={'/profile/' + props.userId}>
                    <img width={'100px'} src={props.avaPhoto === null ? photo : urls.pathToUsersPhotos + props.avaPhoto}
                         alt="avatar"/>
                    <strong>{props.userFirstName} {props.userLastName}</strong>
                </Link>
            </div>
            <div>{props.messageText}</div>
            <div>
                <small>{props.time}</small>
            </div>
        </div>
    );
});

const Messages: React.FC = () => {
    console.log('messages')
    const messages = useSelector((state: AppStateType) => state.chat.messages);
    const messagesAnchorRef = useRef<HTMLDivElement>(null);
    const [isAutoScroll, setIsAutoScroll] = useState(false);
    useEffect(() => {
        if (isAutoScroll)
            messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages])
    const scrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        if (Math.abs(element.scrollHeight - element.scrollTop) - element.clientHeight < 100)
            !isAutoScroll && setIsAutoScroll(true);
        else
            isAutoScroll && setIsAutoScroll(false);
    };
    return (
        <div className={s.window_chat} onScroll={scrollHandler}>
            {messages.map(m => <Message
                key={m.id}
                id={m.id}
                userId={m.userId}
                userFirstName={m.userFirstName}
                userLastName={m.userLastName}
                avaPhoto={m.avaPhoto}
                messageText={m.messageText}
                date={m.date}
                time={m.time}
            />)}
            <div ref={messagesAnchorRef}/>
        </div>
    )
};

export const ChatPage = () => {
    return (
        <div>
            <Messages/>
            <AddMessageForm/>
        </div>
    );
};