import React, {useEffect} from 'react';
import s from './Profile.module.css';
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentUser} from "../../../redux/auth-selectors";
import {useHistory} from "react-router-dom";
import queryString from "querystring";
import {actions, getUserProfile} from "../../../redux/profile-reducer";
import {actions as actionDialogs} from "../../../redux/dialogs-reducer";
import {Avatar} from "antd";
import {urls} from "../../../api/api";
import man from "../../../assets/images/man.png";
import ProfileStatus from "./ProfileStatus";
import {s_getProfile} from "../../../redux/profile-selectors";
import {ProfileType} from "../../../types/types";
import {CloseOutlined} from "@ant-design/icons";

export const Profile: React.FC = () => {
    const currentUser = useSelector(s_getCurrentUser);
    const profile = useSelector(s_getProfile);
    const history = useHistory();
    const dispatch = useDispatch();

    const updateProfile = () => {
        const parsed = queryString.parse(history.location.search.substr(1)) as QueryParamsType;
        if (parsed.id !== undefined)
            dispatch(getUserProfile(parsed.id));
        else
            dispatch(actions.setUserProfile(currentUser as ProfileType));
    }

    useEffect(() => {
        updateProfile();
    }, [])
    useEffect(() => {
        updateProfile();
    }, [history.location.search])

    return (
        <div className={s.wrapper_profile}>
            <div className={s.wrapper_photo}>
                <Avatar size={128} className={s.photo}
                        src={profile?.avaPhoto ? urls.pathToUsersPhotos + profile.avaPhoto : man}/>
            </div>
            <div className={s.wrapper_nick}>
                <strong>{profile?.nickName}</strong>
            </div>
            <div className={s.wrapper_info}>
                <div><ProfileStatus/></div>
                <div>
                    <div>City:</div>
                    <div>{profile?.city}</div>
                </div>
                <div>
                    <div>Country:</div>
                    <div>{profile?.country}</div>
                </div>
            </div>
        </div>
    );
}

type QueryParamsType = {
    id: number | undefined
}

