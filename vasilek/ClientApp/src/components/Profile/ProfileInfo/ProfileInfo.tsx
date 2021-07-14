import React, {ChangeEvent, useState} from 'react';
import s from './ProfileInfo.module.css';
import Loading from '../../common/Loading/Loading';
import man from '../../../assets/images/man.png';
import ProfileStatusWithHooks from './ProfileStatusWithHooks';
import ProfileDataForm from './ProfileDataForm';
import {ProfileType} from "../../../types/types";

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

    let pathToFolderWithPhotos = 'https://vasilek.blob.core.windows.net/userphotoscontainer/';

    return (
        <div className={s.wrapper_profile}>
            <div>
                <div><img className={s.photo}
                          src={profile.avaPhoto ? pathToFolderWithPhotos + profile.avaPhoto : man}/>
                </div>
                {isOwner && <div><input type="file" onChange={onMainPhotoSelected}/></div>}
            </div>
            {editMode
                ? <ProfileDataForm onSubmit={onSubmit} initialValues={profile} status={status}
                                   updateStatus={updateStatus}/>
                : <ProfileData goToEditMode={() => {
                    setEditMode(true)
                }} profile={profile} status={status} updateStatus={updateStatus} isOwner={isOwner}/>}
        </div>
    );
}

type ProfileDataType = {
    profile: ProfileType
    status: string
    updateStatus: (status: string) => void
    isOwner: boolean
    goToEditMode: () => void
}

const ProfileData: React.FC<ProfileDataType> = ({profile, status, updateStatus, isOwner, goToEditMode}) => {
    return (
        <div>
            {isOwner && <button onClick={goToEditMode}>Edit</button>}
            <div><b>First name</b>: {profile.firstName}</div>
            <div><b>Last name</b>: {profile.lastName}</div>
            <div><ProfileStatusWithHooks status={status} updateStatus={updateStatus}/></div>
            <div><b>City</b>: {profile.city}</div>
            <div><b>Country</b>: {profile.country}</div>
        </div>
    );
}

export default ProfileInfo;
