import React from 'react';
import s from './Messages.module.css'
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentDialogId, s_getDialogs} from "../../redux/dialogs-selectors";
import Avatar from "antd/es/avatar/avatar";
import {urls} from "../../api/api";
import userWithoutPhoto from '../../assets/images/man.png';
import {Link} from 'react-router-dom';
import {actions} from "../../redux/dialoginfo-reducer";
import {actions as appActions} from "../../redux/app-reducer";
import {useMediaQuery} from "react-responsive";
import {ArrowLeftOutlined} from "@ant-design/icons";

export const Actions: React.FC = () => {
    const isPhone = useMediaQuery({query: '(max-width: 900px)'})
    const dialogs = useSelector(s_getDialogs);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const currentDialog = dialogs?.find((dialog => dialog?.id === currentDialogId));
    const dispatch = useDispatch();

    const clickHandler = () => {
        dispatch(actions.setCurrentDialogInfoId(currentDialogId as number))
        dispatch(appActions.setPageOpened('info'));
    }

    return (
        <div className={s.actions}>
            {currentDialogId &&
            <Link to={'/dialoginfo'} onClick={clickHandler}>
                <div className={s.dialogsPhotoAndName}>
                    {isPhone &&
                    <button onClick={() => dispatch(appActions.setPageOpened('dialogs'))}>
                        <Avatar icon={<ArrowLeftOutlined/>}/>
                    </button>}
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

