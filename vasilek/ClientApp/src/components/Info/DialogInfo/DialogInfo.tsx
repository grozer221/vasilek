import React, {useState} from 'react';
import s from './DialogInfo.module.css';
import {s_getCurrentDialogInfoId} from "../../../redux/dialoginfo-selectors";
import {useDispatch, useSelector} from "react-redux";
import {s_getDialogs} from "../../../redux/dialogs-selectors";
import {Avatar, message, Modal} from "antd";
import {urls} from "../../../api/api";
import userWithoutPhoto from '../../../assets/images/man.png';
import {DeleteOutlined, ExclamationCircleOutlined, StarFilled, UserAddOutlined} from "@ant-design/icons";
import {Link, Redirect, useHistory} from 'react-router-dom';
import {SelectUsers} from "../../common/SelectUsers/SelectUsers";
import {s_getCurrentUser} from "../../../redux/auth-selectors";
import {deleteUsersFromDialog} from "../../../redux/dialogs-reducer";

const {confirm} = Modal;

export const DialogInfo: React.FC = () => {
    const currentDialogInfoId = useSelector(s_getCurrentDialogInfoId);
    const currentUser = useSelector(s_getCurrentUser);
    const dialogs = useSelector(s_getDialogs);
    const currentDialogInfo = useSelector(s_getDialogs).filter(d => d.id === currentDialogInfoId)[0];
    const dispatch = useDispatch();
    const [isOpenSelectUser, setIsOpenSelectUser] = useState(false);
    const history = useHistory();

    const showConfirm = (userId: number, userLogin: string, dialogId:number, dialogName: string) => {
        confirm({
            title: <div>Do you want to delete <strong>{userLogin}</strong> from dialog-group <strong>{dialogName}</strong>?</div>,
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                dispatch(deleteUsersFromDialog(dialogId, userId))
            },
        });
    }

    if (!currentDialogInfoId || dialogs.find(d => d.id === currentDialogInfoId) === undefined)
        return <Redirect to={'/'}/>

    return (
        <div className={s.wrapper_dialog_info}>
            <div>
                <Avatar size={200}
                        src={currentDialogInfo.dialogPhoto ? urls.pathToUsersPhotos + currentDialogInfo.dialogPhoto : userWithoutPhoto}/>
            </div>
            <h3>{currentDialogInfo.dialogName}</h3>
            <div className={s.members_and_users}>
                <div className={s.members}>
                    <div>{currentDialogInfo.users.length} members</div>
                    <button onClick={() => setIsOpenSelectUser(!isOpenSelectUser)}>
                        <Avatar icon={<UserAddOutlined/>}/>
                    </button>
                </div>
                <div className={s.wrapper_users}>
                    {currentDialogInfo.users.map(u =>
                        <div className={s.user}>
                            <Link to={'/profile?id=' + u.id} key={u.id}>
                                <div className={s.user_info}>

                                    <Avatar src={u.avaPhoto ? urls.pathToUsersPhotos + u.avaPhoto : userWithoutPhoto}/>
                                    <div className={s.name_and_who_is_author}>
                                        <div>{u.nickName}</div>
                                        {u.id === currentDialogInfo.authorId &&
                                        <Avatar size={16} icon={<StarFilled/>}/>}
                                    </div>

                                </div>
                            </Link>

                            {currentUser.id === currentDialogInfo.authorId
                            && u.id !== currentUser.id
                            && !currentDialogInfo.isDialogBetween2
                            && <button onClick={() => showConfirm(u.id, u.login, currentDialogInfo.id, currentDialogInfo.dialogName)}>
                                <Avatar src={<DeleteOutlined/>}/>
                            </button>
                            }
                        </div>
                    )}
                </div>
            </div>
            {isOpenSelectUser && <SelectUsers setIsOpenSelectUser={setIsOpenSelectUser}/>}
        </div>
    );
};
