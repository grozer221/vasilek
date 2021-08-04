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
import {OnlineIndicator} from "../../common/OnlineIndicator/OnlineIndicator";

type PropsType = {
    user: ProfileType
}

export const User: React.FC<PropsType> = ({user}) => {
    const dispatch = useDispatch();

    return (
        <div className={s.user} key={user.id}>
            <Link to={'/profile?id=' + user.id}>
                <div className={s.user_info}>
                    <div className={s.user_ava}>
                        <Avatar size={48}
                                src={user.avaPhoto !== null ? urls.pathToUsersPhotos + user.avaPhoto : userWithoutPhoto}/>
                        {user.isOnline && <OnlineIndicator backgroundColor='white' width='15px' height='15px' left='33px' bottom='0'/>}
                    </div>
                    <div>{user.nickName}</div>
                </div>
            </Link>
            <button>
                <Avatar icon={<EditOutlined onClick={() => dispatch(getDialogByUserId(user.id))}/>}/>
            </button>
        </div>
    );
};
