import React from 'react';
import s from './Users.module.css';
import photo from '../../assets/images/man.png';
import {NavLink} from 'react-router-dom';
import {ProfileType} from "../../types/types";

type PropsType = {
    User: ProfileType
    followedUsers: Array<number>
    isAuth: boolean
    followingInProgress: Array<number>
    follow: (userId: number) => void
    unfollow: (userId: number) => void
}

let User: React.FC<PropsType> = ({User, followingInProgress, follow, unfollow, followedUsers, isAuth}) => {
    let pathToFolderWithPhotos = 'https://vasilek.blob.core.windows.net/userphotoscontainer/';
    return (
        <div className={s.wrapper_user}>
            <div className={s.photoANDbtn}>
                <div>
                    <NavLink to={'/profile/' + User.Id}>
                        <img src={User.AvaPhoto !== null ? pathToFolderWithPhotos + User.AvaPhoto : photo}/>
                    </NavLink>
                </div>
                <div>
                    {
                        isAuth && (
                            followedUsers.some(Id => Id === User.Id)
                                ? <button disabled={followingInProgress
                                    .some(id => id === User.Id)} onClick={() => unfollow(User.Id)}
                                >UnFollow</button>

                                : <button disabled={followingInProgress
                                    .some(id => id === User.Id)} onClick={() => follow(User.Id)}
                                >Follow</button>
                        )
                    }
                </div>
            </div>
            <div className={s.userInfo}>
                <div>
                    <div>{User.Login}</div>
                    <div>{User.FirstName}</div>
                    <div>{User.LastName}</div>
                    <div>{User.Status}</div>
                </div>
                <div>
                    <div>{User.City}</div>
                    <div>{User.Country}</div>
                </div>
            </div>
        </div>
    );
};

export default User;