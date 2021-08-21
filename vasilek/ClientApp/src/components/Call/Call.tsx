import React, {useEffect, useRef} from "react";
import s from './Call.module.css';
import {
    s_getDialogs,
    s_getInCallWithDialogId,
    s_getIsCallAccepted,
    s_getIsInitiator,
    s_getIsOnAudio,
    s_getIsOnVideo,
    s_getMyPeer,
    s_getMySignal,
    s_getMyStream,
    s_getOtherPeer,
    s_getOtherSignal,
    s_getOtherStream,
    s_getUsersInCall
} from "../../redux/dialogs-selectors";
import {useDispatch, useSelector} from "react-redux";
import {dialogsAPI, DialogType} from "../../api/dialogs-api";
import {s_getCurrentUser, s_getCurrentUserId} from "../../redux/auth-selectors";
import {actions, leaveCall, sendMySignal, toggleVideoInCall} from "../../redux/dialogs-reducer";
import Peer from "simple-peer";
import {Avatar, Spin} from "antd";
import {AudioOutlined, LineOutlined, LoadingOutlined, PhoneOutlined, VideoCameraOutlined} from "@ant-design/icons";
import {stopTracks} from "./CallWrapper";
import {urls} from "../../api/api";
import userWithoutPhoto from "../../assets/images/man.png";

export const Call: React.FC = () => {
    const dispatch = useDispatch();

    const currentUserId = useSelector(s_getCurrentUserId);
    const currentUser = useSelector(s_getCurrentUser);
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

    const isOnAudio = useSelector(s_getIsOnAudio);
    const isOnVideo = useSelector(s_getIsOnVideo);

    const myVideoRef = useRef<HTMLVideoElement>(null);
    const otherVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (myStream)
            stopTracks(myStream);

        navigator.mediaDevices.getUserMedia(
            {
                audio: true,
                video: true,
            })
            .then(stream => {
                if (!isOnVideo) {
                    const videoTrack = stream.getVideoTracks()[0];
                    videoTrack.enabled = !videoTrack?.enabled;
                }
                dispatch(actions.setMyStream(stream));
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

    const clickLeaveHandler = () => {
        dispatch(leaveCall(inCallWithDialogId as number));
        if (myStream)
            stopTracks(myStream);
    }

    const clickAudioButtonHandler = () => {
        if (myStream) {
            const audioTrack = myStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack?.enabled;
            dispatch(actions.setIsOnAudio(audioTrack.enabled))
        }
    }

    const clickVideoButtonHandler = () => {
        if (myStream) {
            const videoTrack = myStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack?.enabled;
            dispatch(actions.setIsOnVideo(videoTrack.enabled));
            dispatch(toggleVideoInCall(inCallWithDialogId as number, currentUserId, videoTrack.enabled));
        }
        // if (isOnVideo) {
        //     if (myStream) {
        //         const videoTrack = myStream.getVideoTracks()[0];
        //         videoTrack.stop();
        //         myStream?.removeTrack(videoTrack);
        //         dispatch(actions.setIsOnVideo(false));
        //         dispatch(toggleVideoInCall(inCallWithDialogId as number, currentUserId, false));
        //     }
        // }
        // else {
        //     navigator.mediaDevices.getUserMedia(
        //         {
        //             video: true,
        //         })
        //         .then(stream => {
        //             const videoTrack = stream.getVideoTracks()[0];
        //             myStream?.addTrack(videoTrack);
        //             if (myVideoRef.current)
        //                 myVideoRef.current.srcObject = myStream;
        //         })
        //         .catch(err => console.error(err))
        //     dispatch(actions.setIsOnVideo(true));
        //     dispatch(toggleVideoInCall(inCallWithDialogId as number, currentUserId, true));
        // }
    }

    return (
        <div className={s.wrapper_call}>
            <div className={s.wrapper_users}>
                <div className={s.wrapper_user}>
                    <div className={s.wrapper_video}>
                        <video className={[s.video, isOnVideo ? '' : s.opacity_0].join(' ')} muted autoPlay
                               ref={myVideoRef}/>
                        {!isOnVideo
                        && <div className={s.wrapper_ava}>
                            <Avatar className={s.ava}
                                    size={256}
                                    src={currentUser.avaPhoto
                                        ? urls.pathToUsersPhotos + currentUser.avaPhoto
                                        : userWithoutPhoto}/>
                        </div>
                        }
                    </div>
                    <div className={s.nick}>You</div>
                </div>
                {usersInCallExceptMe.map(user =>
                    <div className={s.wrapper_user} key={user.id}>
                        <div className={s.wrapper_video}>
                            <video className={[s.video, user.isOnVideo ? '' : s.opacity_0].join(' ')} autoPlay
                                   ref={otherVideoRef}/>
                            {(user.callStatus === 'pending' || (user.callStatus === 'accepted' && !user.isOnVideo))
                            && <div className={s.wrapper_ava}>
                                <Avatar className={s.ava}
                                        size={256}
                                        src={user.avaPhoto
                                            ? urls.pathToUsersPhotos + user.avaPhoto
                                            : userWithoutPhoto}/>
                                {user.callStatus === 'pending'
                                &&
                                <Spin className={s.spin} indicator={<LoadingOutlined style={{fontSize: 280}} spin/>}/>
                                }
                            </div>
                            }
                        </div>
                        <div className={s.nick}>{user.nickName}</div>
                    </div>
                )}
            </div>
            <div className={s.nav}>
                <button className={s.button} onClick={clickAudioButtonHandler}>
                    <Avatar size={64} icon={<AudioOutlined/>}/>
                    {isOnAudio || <Avatar size={128} className={s.degree_45_line} icon={<LineOutlined/>}/>}
                </button>
                <button className={s.button} onClick={clickVideoButtonHandler}>
                    <Avatar size={64} icon={<VideoCameraOutlined/>}/>
                    {isOnVideo || <Avatar size={128} className={s.degree_45_line} icon={<LineOutlined/>}/>}
                </button>
                <button className={s.button_decline + ' ' + s.button} onClick={clickLeaveHandler}>
                    <Avatar size={64} icon={<PhoneOutlined/>}/>
                </button>
            </div>
        </div>
    );
}

