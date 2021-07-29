import React, {useEffect, useRef, useState} from 'react';
import s from './Messages.module.css'
import {useDispatch, useSelector} from "react-redux";
import {s_getIsAuth} from "../../redux/auth-selectors";
import {s_getCurrentDialogId, s_getDialogs} from "../../redux/dialogs-selectors";
import {actions, sendMessage} from "../../redux/dialogs-reducer";
import TextArea from "antd/es/input/TextArea";
import Message from "./Message";
import {Actions} from "./Actions";
import Avatar from "antd/es/avatar/avatar";
import {PaperClipOutlined, SmileOutlined} from "@ant-design/icons";
import {Upload} from 'antd';
import 'emoji-mart/css/emoji-mart.css';
import {EmojiData, Picker} from 'emoji-mart';

export const Messages: React.FC = () => {
    const dialogs = useSelector(s_getDialogs);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const dispatch = useDispatch();

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
        return () => {
            dispatch(actions.setCurrentDialogId(null));
        }
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
        <div className={s.wrapper_messages_page}>
            <Actions/>
            <div className={s.messagesAndForm}>
                {dialogs && currentDialogId
                    ? <>
                        <div className={s.messages} onScroll={scrollHandler}>
                            {dialogs?.find((dialog => dialog?.id === currentDialogId))?.messages?.map(message =>
                                <Message key={message.id} message={message}/>)}
                            <div ref={messagesAnchorRef}/>
                        </div>
                        <AddMessageForm/>
                    </>
                    : <div className={s.selectADialog}>
                        Select a dialog
                    </div>
                }
            </div>
        </div>
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

    const addEmoji = (emojiTag: EmojiData) => {
        setMessage(_message + emojiTag.colons);
    }
    const clickHandler = () => {
        setIsOpenEmoji(!isOpenEmoji);
    }

    const [isOpenEmoji, setIsOpenEmoji] = useState(false);

    return (
        <div className={s.form_input_message}>
            <form onSubmit={onSubmit}>
                <button>
                    <Upload maxCount={1000}
                            multiple>
                        <Avatar size={40} icon={<PaperClipOutlined/>}/>
                    </Upload>
                </button>
                <button type={'button'} className={s.emoji_button} onClick={clickHandler}>
                    <Avatar size={40} icon={<SmileOutlined/>}/>
                    <div className={[s.emoji, isOpenEmoji ? '' : 'displayNone'].join(' ')} onBlur={() => setIsOpenEmoji(false)}>
                        <Picker onSelect={addEmoji} set='apple'/>
                    </div>
                </button>
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
