import React from 'react';
import s from './Messages.module.css'
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentDialogId, s_getDialogs} from "../../redux/dialogs-selectors";
import Avatar from "antd/es/avatar/avatar";
import {urls} from "../../api/api";
import userWithoutPhoto from '../../assets/images/man.png';
import {Link} from 'react-router-dom';
import {actions as dialogInfoActions} from "../../redux/dialoginfo-reducer";
import {actions as appActions} from "../../redux/app-reducer";
import {useMediaQuery} from "react-responsive";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {OnlineIndicator} from "../common/OnlineIndicator/OnlineIndicator";
import {DialogType} from "../../api/dialogs-api";
import {s_getCurrentUserId} from "../../redux/auth-selectors";
import {ProfileType} from "../../types/types";

export const Actions: React.FC = () => {
    const isPhone = useMediaQuery({query: '(max-width: 900px)'})
    const dialogs = useSelector(s_getDialogs);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const currentDialog = dialogs?.find((dialog => dialog?.id === currentDialogId)) as DialogType;
    const currentUserId = useSelector(s_getCurrentUserId);
    const dispatch = useDispatch();

    const clickHandler = (currentDialogId: number) => {
        dispatch(dialogInfoActions.setCurrentDialogInfoId(currentDialogId))
        dispatch(appActions.setPageOpened('info'));
    }

    return (
        <div className={s.actions}>
            {currentDialogId &&
            <Link to={'/dialoginfo'} onClick={() => clickHandler(currentDialogId)}>
                <div className={s.dialogsPhotoAndName}>
                    {isPhone &&
                    <button onClick={() => dispatch(appActions.setPageOpened('dialogs'))}>
                        <Avatar icon={<ArrowLeftOutlined/>}/>
                    </button>}
                    <div className={s.user_ava}>
                        <Avatar size={48}
                                src={currentDialog?.dialogPhoto
                                    ? urls.pathToUsersPhotos + currentDialog?.dialogPhoto
                                    : userWithoutPhoto}/>
                        {currentDialog.isDialogBetween2 && currentDialog.users.filter(user => user.id !== currentUserId)[0].isOnline &&
                        <OnlineIndicator backgroundColor={'#EDF0F6'} width='15px' height='15px' bottom='0' left='33px'/>
                        }

                    </div>
                    <div className={s.user_nick_and_online_count}>
                        <div className={s.dialog_name}>{currentDialog?.dialogName} </div>
                        {currentDialog.isDialogBetween2 && !currentDialog.users.filter(user => user.id !== currentUserId)[0].isOnline &&
                            <small>
                                last seen {currentDialog.users.filter(user => user.id !== currentUserId)[0].dateLastOnline.toString().substr(5, 5)} {currentDialog.users.filter(user => user.id !== currentUserId)[0].dateLastOnline.toString().substr(11, 5)}
                            </small>
                        }
                        {!currentDialog.isDialogBetween2 &&
                        <small>
                            <div>{currentDialog.users.length} member, {countOnlineInDialog(currentDialog)} online</div>
                        </small>
                        }
                    </div>

                </div>
            </Link>}
        </div>
    );
}

export const countOnlineInDialog = (dialog: DialogType): number => {
    let onlineUserCount = 0;
    dialog.users.forEach(user => user.isOnline ? onlineUserCount++ : onlineUserCount)
    return onlineUserCount;
}

