import React, {ChangeEvent, useState} from 'react';
import s from './ProfileInfo.module.css';
import Loading from '../../common/Loading/Loading';
import man from '../../../assets/images/man.png';
import ProfileStatusWithHooks from './ProfileStatusWithHooks';
import ProfileDataForm from './ProfileDataForm';
import {ProfileType} from "../../../types/types";
import {urls} from "../../../api/api";

type PropsType = {
    profile: ProfileType | null
    status: string
    updateStatus: (status: string) => void
    isOwner: boolean
    savePhoto: (file: File) => void
    updateProfile: (profile: ProfileType) => void
}

const ProfileInfo: React.FC<PropsType> = ({profile, status, updateStatus, isOwner, savePhoto, updateProfile}) => {
    let [editMode, setEditMode] = useState(false);

    if (!profile)
        return <Loading/>;

    const onMainPhotoSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            savePhoto(e.target.files[0]);
        }
    };

    const onSubmit = (formData: ProfileType) => {
        updateProfile(formData);
        setEditMode(false);
    }

    return (
        <div className={s.wrapper_profile}>
            <div>
                <div><img className={s.photo}
                          src={profile.AvaPhoto ? urls.pathToUsersPhotos + profile.AvaPhoto : man}/>
                </div>
                {isOwner && <div><input type="file" onChange={onMainPhotoSelected}/></div>}
            </div>
            {editMode
                ? <ProfileDataForm onSubmit={onSubmit} initialValues={profile} status={status}
                                   updateStatus={updateStatus}/>
                : <ProfileData goToEditMode={() => {
                    setEditMode(true)
                }} Profile={profile} Status={status} updateStatus={updateStatus} IsOwner={isOwner}/>}
        </div>
    );
}

type ProfileDataType = {
    Profile: ProfileType
    Status: string
    IsOwner: boolean
    updateStatus: (status: string) => void
    goToEditMode: () => void
}

const ProfileData: React.FC<ProfileDataType> = ({Profile, Status, updateStatus, IsOwner, goToEditMode}) => {
    return (
        <div>
            {IsOwner && <button onClick={goToEditMode}>Edit</button>}
            <div><b>First name</b>: {Profile.FirstName}</div>
            <div><b>Last name</b>: {Profile.LastName}</div>
            <div><ProfileStatusWithHooks Status={Status} updateStatus={updateStatus}/></div>
            <div><b>City</b>: {Profile.City}</div>
            <div><b>Country</b>: {Profile.Country}</div>
        </div>
    );
}

export default ProfileInfo;
