import React from 'react';
import s from './DialogInfo.module.css';
import {s_getCurrentDialogInfoId} from "../../../redux/dialoginfo-selectors";
import {useSelector} from "react-redux";
import {s_getDialogs} from "../../../redux/dialogs-selectors";
import {Avatar} from "antd";
import {urls} from "../../../api/api";
import userWithoutPhoto from '../../../assets/images/man.png';
import {StarFilled, UserAddOutlined} from "@ant-design/icons";
import {Link} from 'react-router-dom';

export const DialogInfo: React.FC = () => {
    const currentDialogInfoId = useSelector(s_getCurrentDialogInfoId);
    const currentDialogInfo = useSelector(s_getDialogs).filter(d => d.id === currentDialogInfoId)[0];
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
                    <button>
                        <Avatar icon={<UserAddOutlined/>}/>
                    </button>
                </div>
                <div className={s.wrapper_users}>
                    {currentDialogInfo.users.map(u =>
                        <Link to={'/profile?id=' + u.id}>
                            <div className={s.wrapper_user}>
                                <Avatar src={u.avaPhoto ? urls.pathToUsersPhotos + u.avaPhoto : userWithoutPhoto}/>
                                <div className={s.name_and_who_is_author}>
                                    <div>{u.nickName}</div>
                                    {u.id === currentDialogInfo.authorId && <Avatar size={16} icon={<StarFilled/>}/>}
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};
