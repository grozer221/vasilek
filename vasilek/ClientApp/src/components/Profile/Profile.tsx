import React from 'react';
import s from './Profile.module.css';
import ProfileInfo from './ProfileInfo/ProfileInfo';
import PostsContainer from './Posts/PostsContainer';
import {ProfileType} from "../../types/types";

type PropsType = {
    IsOwner: boolean
    Status: string
    Profile: ProfileType | null
    updateProfile: (profile: ProfileType) => void
    savePhoto: (file: File) => void
    updateStatus: (status: string) => void
}

const Profile: React.FC<PropsType> = props => {
    return (
        <div>
            <ProfileInfo updateProfile={props.updateProfile}
                         savePhoto={props.savePhoto}
                         isOwner={props.IsOwner}
                         profile={props.Profile}
                         status={props.Status}
                         updateStatus={props.updateStatus}/>
            <PostsContainer/>
        </div>
    );
}

export default Profile;
