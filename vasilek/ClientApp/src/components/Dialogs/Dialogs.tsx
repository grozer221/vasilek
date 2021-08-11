import React from 'react';
import s from './Dialogs.module.css';
import {actions, deleteDialog} from "../../redux/dialogs-reducer";
import {actions as appActions} from "../../redux/app-reducer";
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentDialogId, s_getDialogs} from "../../redux/dialogs-selectors";
import {Avatar, Badge, Modal} from "antd";
import {urls} from "../../api/api";
import userWithoutPhoto from "../../assets/images/man.png";
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {Link} from 'react-router-dom';
import {s_getCurrentUser, s_getCurrentUserId} from "../../redux/auth-selectors";
import {OnlineIndicator} from "../common/OnlineIndicator/OnlineIndicator";
import {MessageType} from "../../api/dialogs-api";
import {useMediaQuery} from "react-responsive";

const {confirm} = Modal;

export const Dialogs: React.FC = () => {
    const isPhone = useMediaQuery({query: '(max-width: 900px)'});
    const dialogs = useSelector(s_getDialogs);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const currentUserId = useSelector(s_getCurrentUserId);
    const currentUser = useSelector(s_getCurrentUser);
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

    const countUnReadMessages = (messages: MessageType[]): number => {
        let count = 0;
        messages?.forEach(message => {
            if (message.usersUnReadMessage?.find(user => user.id === currentUserId))
                count++;
        });
        return count;
    }

    return (
        <div className={s.wrapper_dialogs_page}>
            <div className={s.myProfile}></div>
            <div className={s.dialogs}>
                {dialogs.length > 0
                    ? dialogs.map(dialog => (
                            <button key={dialog.id}
                                    className={[s.dialog, currentDialogId === dialog.id ? s.active : ''].join(' ')}
                                    onClick={() => clickHandler(dialog.id)}>
                                <div className={s.dialog_info}>
                                    <Badge count={countUnReadMessages(dialog.messages)} size='small'
                                           style={{right: '13px', top: '3px'}}>
                                        <Avatar size={48}
                                                src={dialog.dialogPhoto ? urls.pathToUsersPhotos + dialog.dialogPhoto : userWithoutPhoto}
                                                className={s.dialog_avatar}/>
                                    </Badge>
                                    {dialog.isDialogBetween2 && dialog.users.filter(user => user.id !== currentUserId)[0]?.isOnline &&
                                    <OnlineIndicator backgroundColor='white' width='15px' height='15px' bottom='0'
                                                     left='33px'/>
                                    }
                                    <div className={s.name_and_last_message}>
                                        <div className={s.dialog_name}>{dialog.dialogName}</div>
                                        {dialog.messages && dialog.messages.length > 0 &&
                                        <div className={s.last_message}>
                                            <div>
                                                {dialog.messages[dialog.messages.length - 1]?.user.id === currentUser.id
                                                    ? 'You:'
                                                    : dialog.messages[dialog.messages.length - 1]?.user.nickName.length > 15
                                                        ? dialog.isDialogBetween2 || dialog.messages[dialog.messages.length - 1]?.user.nickName.substr(0, 15) + '... : '
                                                        : dialog.isDialogBetween2 || dialog.messages[dialog.messages.length - 1]?.user.nickName.substr(0, 15) + ': '
                                                }
                                            </div>
                                            <div>
                                                {isPhone
                                                    ? dialog.messages[dialog.messages.length - 1]?.messageText.substr(0, 30)
                                                    : dialog.messages[dialog.messages.length - 1]?.messageText.substr(0, 20)
                                                }
                                                {dialog.messages[dialog.messages.length - 1]?.messageText.length > 20 && '...'}
                                            </div>
                                        </div>
                                        }
                                    </div>
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
                    : <div className={s.message_when_no_dialogs}
                           onClick={() => dispatch(appActions.setPageOpened('info'))}>
                        Go to <Link to={'/users'}>users page</Link> <br/> and <br/> write anyone)
                    </div>
                }
            </div>
        </div>
    );
};

