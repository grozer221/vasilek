import React from 'react';
import s from './Users.module.css';
import userWithoutPhoto from '../../../assets/images/man.png';
import {Link} from 'react-router-dom';
import {ProfileType} from "../../../types/types";
import {urls} from "../../../api/api";
import {Avatar} from "antd";
import {EditOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {getDialogByUserId} from "../../../redux/dialogs-reducer";

type PropsType = {
    user: ProfileType
}

export const User: React.FC<PropsType> = ({user}) => {
    const dispatch = useDispatch();

    return (
        <div className={s.user}>
            <Link to={'/profile?id=' + user.id}>
                <Avatar size={48}
                        src={user.avaPhoto !== null ? urls.pathToUsersPhotos + user.avaPhoto : userWithoutPhoto}/>
                <div>{user.nickName}</div>
            </Link>
            <button>
                <Avatar icon={<EditOutlined onClick={() => dispatch(getDialogByUserId(user.id))}/>}/>
            </button>
        </div>
    );
};
