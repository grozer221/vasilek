import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import s from './Messages.module.css'
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentUserId, s_getIsAuth} from "../../redux/auth-selectors";
import {s_getCurrentDialogId, s_getDialogs} from "../../redux/dialogs-selectors";
import {makeMessageRead, sendMessage} from "../../redux/dialogs-reducer";
import TextArea from "antd/es/input/TextArea";
import {Message} from "./Message";
import {Actions} from "./Actions";
import Avatar from "antd/es/avatar/avatar";
import {LinkOutlined, SmileOutlined} from "@ant-design/icons";
import 'emoji-mart/css/emoji-mart.css';
import {EmojiData, Picker} from 'emoji-mart';
import {DialogType} from "../../api/dialogs-api";
import {SelectFiles} from "../common/SelectFiles/SelectFiles";
import Peer from "simple-peer";

export const Messages: React.FC = () => {
    const dialogs = useSelector(s_getDialogs);
    const currentDialogId = useSelector(s_getCurrentDialogId) as number;
    const currentUserId = useSelector(s_getCurrentUserId);
    const currentDialog = dialogs.find(dialog => dialog.id === currentDialogId) as DialogType;
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

    }, [])

    useEffect(() => {
        scroll();

    }, [currentDialogId])

    const scrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        let scrollPosition = Math.abs(element.scrollHeight - element.scrollTop) - element.clientHeight;
        //console.log(scrollPosition)
        if (scrollPosition < 100)
            !isAutoScroll && setIsAutoScroll(true);
        else
            isAutoScroll && setIsAutoScroll(false);

        if (scrollPosition < 15)
            checkIfReadMessages()
    };

    const checkIfReadMessages = () => {
        currentDialog?.messages?.forEach(message => {
            message.usersUnReadMessage?.forEach(user => {
                if (user.id === currentUserId) {
                    dispatch(makeMessageRead(currentDialogId, message.id))
                    //console.log(message.user.nickName + ': ' + message.messageText)
                }
            });
        });
    };

    return (
        <div className={s.wrapper_messages_page}>
            {/*<div className={s.audio_recorder}>*/}
            {/*    /!*<NativeStream/>*!/*/}
            {/*</div>*/}
            <Actions/>
            <div className={s.messagesAndForm}>
                {dialogs && currentDialogId
                    ? <>
                        <div className={s.messages} onScroll={scrollHandler}>
                            {dialogs?.find((dialog => dialog?.id === currentDialogId))?.messages?.map(message =>
                                <Message key={message.id} message={message}
                                         isDialogBetween2={currentDialog.isDialogBetween2}/>)}
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

////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////


// const NativeStream: React.FC = () => {
//     const dispatch = useDispatch();
//     const [playing, setPlaying] = useState(false);
//     const videoRef = useRef<HTMLVideoElement>(null);
//     let [mediaStream, setMediaStream] = useState(new MediaStream());
//     const startVideo = () => {
//         setPlaying(true);
//         navigator.getUserMedia(
//             {
//                 audio: true,
//                 video: true
//             },
//             (stream) => {
//                 dispatch(sendVideoAndAudio(stream));
//                 setMediaStream(stream)
//                 if (videoRef.current) {
//                     console.log(stream)
//                     videoRef.current.srcObject = stream;
//                 }
//             },
//             (err) => console.error(err)
//         );
//     };
//
//     const stopVideo = () => {
//         mediaStream.getTracks().forEach(track => track.stop());
//         setPlaying(false);
//         if (videoRef.current)
//             videoRef.current.srcObject = null;
//     };
//
//     return (
//         <div className="app">
//             <video
//                 ref={videoRef}
//                 autoPlay
//             />
//             {playing
//                 ? <button onClick={stopVideo}>Stop</button>
//                 : <button onClick={startVideo}>Start</button>
//             }
//         </div>
//     );
// }

const AddMessageForm: React.FC = () => {
    const isAuth = useSelector(s_getIsAuth);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const [_message, setMessage] = useState('');
    const [isOpenEmoji, setIsOpenEmoji] = useState(false);
    const [files, setFiles] = useState([] as File[]);
    const dispatch = useDispatch();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let result = _message.match(/^\s*$/);
        const isMessageProvided = !result || files.length > 0
        if (isMessageProvided && isAuth && currentDialogId) {
            dispatch(sendMessage(currentDialogId, _message, files));
            setMessage('');
            setFiles([]);
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

    const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            files && files.length > 0
                ? setFiles([...Array.from(files), ...Array.from(e.target.files)])
                : setFiles(Array.from(e.target.files))
        }
    };

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
                <div className={s.pin_files}>
                    <input type="file" id="file" multiple style={{display: "none"}} onChange={fileChangeHandler}/>
                    <label className={s.label_file} htmlFor="file">
                        <Avatar icon={<LinkOutlined/>}/>
                    </label>
                    <SelectFiles displayNone={!(files && files.length > 0)} files={files} setFiles={setFiles}/>
                </div>
                <button type={'button'} className={s.emoji_button} onClick={clickHandler}>
                    <Avatar size={40} icon={<SmileOutlined/>}/>
                    <div className={[s.emoji, isOpenEmoji ? '' : 'displayNone'].join(' ')}
                         onBlur={() => setIsOpenEmoji(false)}>
                        <Picker onSelect={addEmoji} set='apple'/>
                    </div>
                </button>
            </form>
        </div>
    );
};