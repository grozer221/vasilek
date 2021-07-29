import React from 'react';
import s from './Messages.module.css'
import {useSelector} from "react-redux";
import {s_getCurrentDialogId, s_getDialogs} from "../../redux/dialogs-selectors";
import Avatar from "antd/es/avatar/avatar";
import {urls} from "../../api/api";
import userWithoutPhoto from '../../assets/images/man.png';

export const Actions: React.FC = () => {
    const dialogs = useSelector(s_getDialogs);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const currentDialogs = dialogs?.find((dialog => dialog?.id === currentDialogId));
    return (
        <div className={s.actions}>
            {currentDialogId &&
            <div className={s.dialogsPhotoAndName}>
                <div>
                    <Avatar
                        src={currentDialogs?.dialogPhoto
                            ? urls.pathToUsersPhotos + currentDialogs?.dialogPhoto
                            : userWithoutPhoto}/>
                </div>
                <div>
                    <strong>{currentDialogs?.dialogName} </strong>
                </div>
            </div>}
        </div>
    );
}

