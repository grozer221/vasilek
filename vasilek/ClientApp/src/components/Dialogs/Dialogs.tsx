import React, {useEffect} from 'react';
import s from './Dialogs.module.css';
import {actions, deleteDialog} from "../../redux/dialogs-reducer";
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentDialogId, s_getDialogs} from "../../redux/dialogs-selectors";
import {Avatar, Modal} from "antd";
import {urls} from "../../api/api";
import userWithoutPhoto from "../../assets/images/man.png";
import {Link, useHistory} from 'react-router-dom';
import * as queryString from "querystring";
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {DialogType} from "../../api/dialogs-api";

const {confirm} = Modal;

type QueryParamsType = { id?: number }

export const Dialogs: React.FC = () => {
    const dialogs = useSelector(s_getDialogs);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const history = useHistory();
    const dispatch = useDispatch();

    const updateDialogId = () => {
        const parsed = queryString.parse(history.location.search.substr(1)) as QueryParamsType;
        let dialog: DialogType[] | null = dialogs.filter(dialog => dialog.id === Number(parsed.id))
        if (!!parsed.id && dialog.length > 0)
            dispatch(actions.setCurrentDialogId(+parsed.id));
        else
            history.push('/');
    }

    useEffect(() => {
        updateDialogId();
    }, []);

    useEffect(() => {
        if (!!history.location.search)
            updateDialogId();
    }, [history.location.search])

    const showConfirm = (dialogId: number, dialogName: string) => {
        confirm({
            title: <div>Do you want to delete dialog <strong>{dialogName}</strong>?</div>,
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                dispatch(deleteDialog(dialogId));
            },
        });
    }

    return (
        <div className={s.wrapper_dialogs_page}>
            <div className={s.myProfile}>1</div>
            <div className={s.dialogs}>
                {dialogs.map(dialog => (
                        <Link to={'/dialog?id=' + dialog.id} key={dialog.id}>
                            <button className={[s.dialog, currentDialogId === dialog.id ? s.active : ''].join(' ')}>
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
                                        : dialog.dateCreate.toString().substr(11, 5)}</small>
                                </div>
                            </button>
                        </Link>
                    )
                )}
            </div>
        </div>
    );
};

