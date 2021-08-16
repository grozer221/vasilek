import React, {useEffect} from "react";
import s from './Call.module.css';
import {useDispatch, useSelector} from "react-redux";
import {
    s_getInCallWithDialogId,
    s_getIsCallAccepted,
    s_getIsInCall, s_getMyStream,
    s_getReceivingCallFromDialogId,
    s_getUsersInCall
} from "../../redux/dialogs-selectors";
import {ReceivingCall} from "./ReceivingCall";
import {Call} from "./Call";
import {actions, endCall} from "../../redux/dialogs-reducer";

export const CallWrapper: React.FC = () => {
    const dispatch = useDispatch();
    const isCallAccepted = useSelector(s_getIsCallAccepted);
    const usersInCall = useSelector(s_getUsersInCall);
    const receivingCallFromDialogId = useSelector(s_getReceivingCallFromDialogId);
    const isInCall = useSelector(s_getIsInCall);
    const inCallWithDialogId = useSelector(s_getInCallWithDialogId);
    const myStream = useSelector(s_getMyStream);

    useEffect(() => {
        if(!isInCall && myStream)
            stopTracks(myStream);
    }, [isInCall])

    useEffect(() => {
        let countAcceptedUsers: number = 0;
        let countPendingUsers: number = 0;
        usersInCall.forEach(user => {
            if (user.callStatus === 'accepted')
                countAcceptedUsers++;
            if (user.callStatus === 'pending')
                countPendingUsers++;
        })
        if (countAcceptedUsers > 1)
            dispatch(actions.setIsCallAccepted(true));
        else if (isCallAccepted)
            dispatch(actions.setIsCallAccepted(false));

        if((countAcceptedUsers === 1 && countPendingUsers === 0) || countAcceptedUsers < 1 && inCallWithDialogId)
            dispatch(endCall(inCallWithDialogId as number));


    }, [usersInCall]);

    if (receivingCallFromDialogId)
        return <ReceivingCall/>

    if (isInCall)
        return <Call/>

    return null;
}

export const stopTracks = (stream: MediaStream) => {
    stream.getTracks().forEach(track => track.stop());
}