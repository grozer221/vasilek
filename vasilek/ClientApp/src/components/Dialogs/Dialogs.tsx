import React from 'react';
import s from './Dialogs.module.css';
import {actions, deleteDialog} from "../../redux/dialogs-reducer";
import {actions as appActions} from "../../redux/app-reducer";
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentDialogId, s_getDialogs} from "../../redux/dialogs-selectors";
import {Avatar, Modal} from "antd";
import {urls} from "../../api/api";
import userWithoutPhoto from "../../assets/images/man.png";
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import { Link } from 'react-router-dom';

const {confirm} = Modal;

export const Dialogs: React.FC = () => {
    const dialogs = useSelector(s_getDialogs);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const dispatch = useDispatch();


    const showConfirm = (dialogId: number, dialogName: string) => {
        confirm({
            title: <div>Do you want to delete dialog <strong>{dialogName}</strong>?</div>,
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                dispatch(deleteDialog(dialogId));
            },
        });
    }

    const clickHandler = (dialogId: number) => {
        dispatch(actions.setCurrentDialogId(dialogId));
        dispatch(appActions.setPageOpened('messages'));
    }

    return (
        <div className={s.wrapper_dialogs_page}>
            <div className={s.myProfile}>             </div>
            <div className={s.dialogs}>
                {dialogs.length > 0
                    ? dialogs.map(dialog => (
                            <button key={dialog.id}
                                    className={[s.dialog, currentDialogId === dialog.id ? s.active : ''].join(' ')}
                                    onClick={() => clickHandler(dialog.id)}>
                                <div className={s.avaAndName}>
                                    <Avatar size={48}
                                            src={dialog.dialogPhoto ? urls.pathToUsersPhotos + dialog.dialogPhoto : userWithoutPhoto}
                                            className={s.dialog_avatar}/>
                                    <div>{dialog.dialogName}</div>
                                </div>
                                <div className={s.deleteAndLastChanged}>
                                    <button onClick={() => showConfirm(dialog.id, dialog.dialogName)}>
                                        <Avatar size={24} icon={<DeleteOutlined/>}/>
                                    </button>
                                    <small>{dialog.messages?.length > 0
                                        ? dialog?.messages[dialog.messages.length - 1]?.dateCreate.toString().substr(11, 5)
                                        : dialog.dateCreate.toString().substr(11, 5)}
                                    </small>
                                </div>
                            </button>
                        )
                    )
                    : <div className={s.message_when_no_dialogs}>Go to <Link to={'/users'}>users page</Link> <br/> and <br/> write anyone)</div>
                }
            </div>
        </div>
    );
};

