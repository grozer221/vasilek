import React from 'react';
import s from './Messages.module.css'
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentDialogId, s_getDialogs} from "../../redux/dialogs-selectors";
import Avatar from "antd/es/avatar/avatar";
import {urls} from "../../api/api";
import userWithoutPhoto from '../../assets/images/man.png';
import {Link} from 'react-router-dom';
import {actions} from "../../redux/dialoginfo-reducer";

export const Actions: React.FC = () => {
    const dialogs = useSelector(s_getDialogs);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const currentDialog = dialogs?.find((dialog => dialog?.id === currentDialogId));
    const dispatch = useDispatch();
    return (
        <div className={s.actions}>
            {currentDialogId &&
            <Link to={'/dialoginfo?id=' + currentDialogId} onClick={() => dispatch(actions.setCurrentDialogInfoId(currentDialogId))}>
                <div className={s.dialogsPhotoAndName}>
                    <div>
                        <Avatar
                            src={currentDialog?.dialogPhoto
                                ? urls.pathToUsersPhotos + currentDialog?.dialogPhoto
                                : userWithoutPhoto}/>
                    </div>
                    <div>
                        <strong>{currentDialog?.dialogName} </strong>
                    </div>
                </div>
            </Link>}
        </div>
    );
}

