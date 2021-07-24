import React, {ChangeEvent} from 'react';
import s from './ProfileInfo.module.css';
import Loading from '../../common/Loading/Loading';
import man from '../../../assets/images/man.png';
import ProfileStatusWithHooks from './ProfileStatusWithHooks';
import {urls} from "../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {s_getProfile} from "../../../redux/profile-selectors";
import {savePhoto} from "../../../redux/profile-reducer";
import {Avatar} from "antd";

type PropsType = {
    userId: number | undefined
}

export const ProfileInfo: React.FC<PropsType> = (props) => {
    const profile = useSelector(s_getProfile);
    const dispatch = useDispatch();

    if (!profile)
        return <Loading/>;

    const onMainPhotoSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            dispatch(savePhoto(e.target.files[0]));
        }
    };

    return (
        <div className={s.wrapper_profile}>
            <div className={s.wrapper_photo}>
                <Avatar className={s.photo}
                     src={profile.avaPhoto ? urls.pathToUsersPhotos + profile.avaPhoto : man}/>
            </div>
            <div className={s.wrapper_nick}>
                <strong>{profile?.nickName}</strong>
            </div>
            <div className={s.wrapper_info}>
                <div><ProfileStatusWithHooks/></div>
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