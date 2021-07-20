import React, {ChangeEvent} from 'react';
import s from './ProfileInfo.module.css';
import Loading from '../../common/Loading/Loading';
import man from '../../../assets/images/man.png';
import ProfileStatusWithHooks from './ProfileStatusWithHooks';
import {urls} from "../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {s_getProfile} from "../../../redux/profile-selectors";
import {savePhoto} from "../../../redux/profile-reducer";

type PropsType = {
    userId: number | undefined
}

const ProfileInfo: React.FC<PropsType> = (props) => {
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
            <div>
                <div><img className={s.photo}
                          src={profile.AvaPhoto ? urls.pathToUsersPhotos + profile.AvaPhoto : man}/>
                </div>
                <div>
                    <input type="file" onChange={onMainPhotoSelected}/>
                </div>
            </div>
            <ProfileData/>
        </div>
    );
}

const ProfileData: React.FC = () => {
    const profile = useSelector(s_getProfile);
    return (
        <div>
            <div><b>NickName</b>: {profile?.NickName}</div>
            <div><ProfileStatusWithHooks/></div>
            <div><b>City</b>: {profile?.City}</div>
            <div><b>Country</b>: {profile?.Country}</div>
        </div>
    );
}

export default ProfileInfo;
