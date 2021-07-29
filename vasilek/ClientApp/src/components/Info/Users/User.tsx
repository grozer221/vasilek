import React, {useEffect} from 'react';
import s from './Users.module.css';
import userWithoutPhoto from '../../../assets/images/man.png';
import {Link, useHistory} from 'react-router-dom';
import {ProfileType} from "../../../types/types";
import {urls} from "../../../api/api";
import {Avatar} from "antd";
import {EditOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentDialogId} from "../../../redux/dialogs-selectors";
import {getDialogByUserId} from "../../../redux/dialogs-reducer";

type PropsType = {
    user: ProfileType
}

export const User: React.FC<PropsType> = ({user}) => {
    const currentDialogsId = useSelector(s_getCurrentDialogId);
    const dispatch = useDispatch();
    const history = useHistory();

    const onClick = async () => {
        dispatch(getDialogByUserId(user.id));
    }

    useEffect(() => {
        if (currentDialogsId !== null)
            history.push('/dialog?id=' + currentDialogsId);
    }, [currentDialogsId]);

    return (
        <div className={s.user}>
            <Link to={'/profile?id=' + user.id}>
                <Avatar size={48}
                        src={user.avaPhoto !== null ? urls.pathToUsersPhotos + user.avaPhoto : userWithoutPhoto}/>
                <div>{user.nickName}</div>
            </Link>
            <button>
                <Avatar icon={<EditOutlined onClick={onClick}/>}/>
            </button>
        </div>
    );
};
