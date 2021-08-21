import React, {useEffect, useRef, useState} from "react";
import s from './Call.module.css';
import {useDispatch, useSelector} from "react-redux";
import {s_getDialogs, s_getReceivingCallFromDialogId} from "../../redux/dialogs-selectors";
import {DialogType} from "../../api/dialogs-api";
import {Avatar} from "antd";
import {PhoneOutlined} from "@ant-design/icons";
import {acceptCall, actions, leaveCall} from "../../redux/dialogs-reducer";
import {urls} from "../../api/api";
import userWithoutPhoto from "../../assets/images/man.png";

export const ReceivingCall: React.FC = () => {
    const receivingCallFromDialogId = useSelector(s_getReceivingCallFromDialogId);
    const dialogs = useSelector(s_getDialogs);
    const receivingCallFromDialog = dialogs.find(dialog => dialog.id === receivingCallFromDialogId) as DialogType;
    const dispatch = useDispatch();

    const acceptHandler = () => {
        dispatch(actions.setReceivingCallFromDialogId(null));
        dispatch(acceptCall(receivingCallFromDialogId as number));
        dispatch(actions.setIsInCall(true));
        dispatch(actions.setInCallWithDialogId(receivingCallFromDialogId));
        dispatch(actions.setIsInitiator(false));
        dispatch(actions.setIsOnAudio(true));
        dispatch(actions.setIsOnVideo(false));
    }

    const leaveHandler = () => {
        dispatch(leaveCall(receivingCallFromDialogId as number));
        dispatch(actions.setReceivingCallFromDialogId(null));
    }

    return (
        <div className={s.wrapper_call}>
            <Avatar size={128}
                    src={receivingCallFromDialog.dialogPhoto
                        ? urls.pathToUsersPhotos + receivingCallFromDialog.dialogPhoto
                        : userWithoutPhoto}
            />
            <div className={s.nick}>{receivingCallFromDialog.dialogName}</div>
            <div className={s.receive_buttons}>
                <button className={s.button_accept + ' ' + s.button} onClick={acceptHandler}>
                    <Avatar size={64} icon={<PhoneOutlined/>}/>
                </button>
                <button className={s.button_decline + ' ' + s.button} onClick={leaveHandler}>
                    <Avatar size={64} icon={<PhoneOutlined/>}/>
                </button>
            </div>
        </div>
    );
}