import React, {useEffect, useRef, useState} from 'react';
import s from './Messages.module.css'
import {useDispatch, useSelector} from "react-redux";
import {s_getIsAuth} from "../../redux/auth-selectors";
import {s_getCurrentDialogId, s_getDialogs} from "../../redux/dialogs-selectors";
import {useHistory} from "react-router-dom";
import {sendMessage} from "../../redux/dialogs-reducer";
import TextArea from "antd/es/input/TextArea";
import Message from "./Message";


export const Messages: React.FC = () => {
    const dialogs = useSelector(s_getDialogs);
    const currentDialogId = useSelector(s_getCurrentDialogId);

    const [isAutoScroll, setIsAutoScroll] = useState(false);
    const messagesAnchorRef = useRef<HTMLDivElement>(null);

    const scroll = () => {
        messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'});
    }

    useEffect(() => {
        if (isAutoScroll)
            scroll();
    }, [dialogs])

    useEffect(() => {
        scroll();
    }, [])

    useEffect(() => {
        scroll();
    }, [currentDialogId])

    const scrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        if (Math.abs(element.scrollHeight - element.scrollTop) - element.clientHeight < 100)
            !isAutoScroll && setIsAutoScroll(true);
        else
            isAutoScroll && setIsAutoScroll(false);
    };

    return (
        <>
            {dialogs && currentDialogId &&
            <>
                <div className={s.messagesAndForm}>
                    <div className={s.messages}>
                        <div className={s.messages} onScroll={scrollHandler}>
                            {dialogs?.find((dialog => dialog?.id === currentDialogId))?.messages.map(message =>
                                <Message key={message.id} message={message}/>)}
                            <div ref={messagesAnchorRef}/>
                        </div>
                    </div>
                    <AddMessageForm/>
                </div>
            </>
            }
        </>
    );
}

const AddMessageForm: React.FC = () => {
    const isAuth = useSelector(s_getIsAuth);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const [_message, setMessage] = useState('');
    const dispatch = useDispatch();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isMessageProvided = _message && _message !== '';
        if (isMessageProvided && isAuth && currentDialogId) {
            dispatch(sendMessage(currentDialogId, _message));
            setMessage('');
        }
    }

    const onMessageUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    }

    const onEnterPress = (e: any) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            onSubmit(e);
        }
    }

    return (
        <div className={s.form_input_message}>
            <form onSubmit={onSubmit}>
                <TextArea
                    placeholder="Input message"
                    onKeyDown={onEnterPress}
                    allowClear
                    onChange={onMessageUpdate}
                    value={_message}
                />
            </form>
        </div>
    );
};
