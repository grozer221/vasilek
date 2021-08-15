import React, {useEffect, useRef} from "react";
import s from './Call.module.css';
import {
    s_getDialogs,
    s_getInCallWithDialogId, s_getIsCallAccepted, s_getIsInitiator,
    s_getMyPeer, s_getMySignal, s_getMyStream, s_getOtherPeer, s_getOtherSignal,
    s_getOtherStream,
    s_getUsersInCall
} from "../../redux/dialogs-selectors";
import {useDispatch, useSelector} from "react-redux";
import {DialogType} from "../../api/dialogs-api";
import {s_getCurrentUserId} from "../../redux/auth-selectors";
import {actions, endCall, leaveCall, sendMySignal} from "../../redux/dialogs-reducer";
import Peer from "simple-peer";
import {Avatar} from "antd";
import {PhoneOutlined} from "@ant-design/icons";

export const Call: React.FC = () => {
    const dispatch = useDispatch();

    const currentUserId = useSelector(s_getCurrentUserId);
    const inCallWithDialogId = useSelector(s_getInCallWithDialogId);
    const dialogs = useSelector(s_getDialogs);
    const inCallWithDialog = dialogs.find(dialog => dialog.id === inCallWithDialogId) as DialogType;
    const usersInCall = useSelector(s_getUsersInCall);
    const isInitiator = useSelector(s_getIsInitiator);
    const isCallAccepted = useSelector(s_getIsCallAccepted);
    const usersInCallExceptMe = usersInCall.filter(user => user.id !== currentUserId);

    const myPeer = useSelector(s_getMyPeer);
    const otherPeer = useSelector(s_getOtherPeer);

    const mySignal = useSelector(s_getMySignal);
    const otherSignal = useSelector(s_getOtherSignal);

    const myStream = useSelector(s_getMyStream);
    const otherStream = useSelector(s_getOtherStream);

    const myVideoRef = useRef<HTMLVideoElement>(null);
    const otherVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia(
            {
                audio: true,
                video: true
            })
            .then(stream => {
                const peer = new Peer({
                    initiator: isInitiator,
                    trickle: false,
                    stream: stream,
                })

                peer.on('signal', (signal) => {
                    dispatch(actions.setMySignal(signal));
                    dispatch(sendMySignal(inCallWithDialogId as number, signal))
                });


                dispatch(actions.setMyPeer(peer));

                if (myVideoRef.current) {
                    myVideoRef.current.srcObject = stream;
                }
            })
            .catch(err => console.error(err))

        return () => {
            dispatch(actions.setIsInitiator(false));
            dispatch(actions.setIsInCall(false));
            dispatch(actions.setInCallWithDialogId(null));
        }
    }, []);

    useEffect(() => {
        if (myPeer && otherSignal) {
            myPeer.signal(otherSignal);
            myPeer.on('stream', (stream) => {
                dispatch(actions.setOtherStream(stream));
                if (otherVideoRef.current)
                    otherVideoRef.current.srcObject = stream;
            });
        }
    }, [myPeer, otherSignal]);

    const leaveHandler = () => {
        dispatch(leaveCall(inCallWithDialogId as number));
    }

    return (
        <div className={s.wrapper_call}>
            <div className={s.wrapper_users}>
                {usersInCallExceptMe.map(user =>
                    <div className={s.wrapper_user}>
                        <div className={s.wrapper_video}>
                            <video className={s.video} autoPlay ref={otherVideoRef}/>
                        </div>
                        <div>{user.nickName}</div>
                    </div>
                )}
                <div className={s.wrapper_video}>
                    <video className={s.video} muted autoPlay ref={myVideoRef}/>
                </div>
            </div>
            <button className={'classic ' + s.button_decline} onClick={leaveHandler}>
                <Avatar icon={<PhoneOutlined/>}/>
            </button>
        </div>
    );
}