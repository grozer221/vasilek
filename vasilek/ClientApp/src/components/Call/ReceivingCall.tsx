import React from "react";
import s from './Call.module.css';
import {useDispatch, useSelector} from "react-redux";
import {s_getDialogs, s_getReceivingCallFromDialogId} from "../../redux/dialogs-selectors";
import {DialogType} from "../../api/dialogs-api";
import {Avatar} from "antd";
import {PhoneOutlined} from "@ant-design/icons";
import {acceptCall, actions, leaveCall} from "../../redux/dialogs-reducer";

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
    }

    const leaveHandler = () => {
        dispatch(leaveCall(receivingCallFromDialogId as number));
        dispatch(actions.setReceivingCallFromDialogId(null));
    }

    return (
        <div className={s.wrapper_call}>
            <div>{receivingCallFromDialog.dialogName}</div>
            <button className={'classic ' + s.button_accept} onClick={acceptHandler}>
                <Avatar icon={<PhoneOutlined/>}/>
            </button>
            <button className={'classic ' + s.button_decline} onClick={leaveHandler}>
                <Avatar icon={<PhoneOutlined/>}/>
            </button>
        </div>
    );
}