import React from 'react';
import s from './Profile.module.css';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import PostsContainer from './Posts/PostsContainer';
import {ProfileType} from "../../types/types";

type PropsType = {
    updateProfile: (profile: ProfileType) => void
    savePhoto: (file: File) => void
    isOwner: boolean
    profile: ProfileType | null
    status: string
    updateStatus: (status: string) => void
}

const Profile: React.FC<PropsType> = props => {
    return (
        <div>
            <ProfileInfo updateProfile={props.updateProfile}
                         savePhoto={props.savePhoto}
                         isOwner={props.isOwner}
                         profile={props.profile}
                         status={props.status}
                         updateStatus={props.updateStatus}/>
            <PostsContainer/>
        </div>
    );
}

export default Profile;
