import React from 'react';
import s from './Dialogs.module.css';
import {actions} from "../../redux/dialogs-reducer";
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentDialogId, s_getDialogs} from "../../redux/dialogs-selectors";
import {Avatar} from "antd";
import {urls} from "../../api/api";
import userWithoutPhoto from "../../assets/images/man.png";


export const Dialogs: React.FC = () => {
    const dialogs = useSelector(s_getDialogs);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const dispatch = useDispatch();

    return (
        <div className={s.dialogs}>
            {dialogs.map(obj => (
                    <button key={obj.id} className={[s.dialog, currentDialogId === obj.id ? s.active : ''].join(' ')} onClick={() => {
                        dispatch(actions.setCurrentDialogId(obj.id))
                    }}>
                        <Avatar size={48} src={obj.dialogPhoto ? urls.pathToUsersPhotos + obj.dialogPhoto : userWithoutPhoto}
                                className={s.dialog_avatar}/>
                        <div>{obj.dialogName}</div>
                    </button>
                )
            )}
        </div>
    );
};

