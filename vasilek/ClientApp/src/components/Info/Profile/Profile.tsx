import React, {useEffect} from 'react';
import s from './Profile.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {s_getCurrentUser} from '../../../redux/auth-selectors';
import {useHistory} from 'react-router-dom';
import queryString from 'querystring';
import {actions, getUserProfile} from '../../../redux/profile-reducer';
import {Avatar, Carousel} from 'antd';
import {urls} from '../../../api/api';
import man from '../../../assets/images/man.png';
import {s_getProfile} from '../../../redux/profile-selectors';
import {ProfileType} from '../../../types/types';
import {actions as appActions} from '../../../redux/app-reducer';
import {getDialogByUserId} from '../../../redux/dialogs-reducer';
import {MessageOutlined} from '@ant-design/icons';

export const Profile: React.FC = () => {
    const currentUser = useSelector(s_getCurrentUser);
    const profile = useSelector(s_getProfile) as ProfileType;
    const history = useHistory();
    const dispatch = useDispatch();

    const updateProfile = () => {
        const parsed = queryString.parse(history.location.search.substr(1)) as { id: number | undefined };
        if (parsed.id !== undefined)
            dispatch(getUserProfile(parsed.id));
        else
            dispatch(actions.setUserProfile(currentUser as ProfileType));
    };

    useEffect(() => {
        updateProfile();
    }, []);
    useEffect(() => {
        updateProfile();
    }, [history.location.search]);

    return (
        <div className={s.wrapper_profile}>
            <div className={s.wrapper_photos}>
                <Carousel className={s.carousel}>
                    <Avatar size={200} className={s.photo}
                            src={profile?.avaPhoto ? urls.pathToUsersPhotos + profile.avaPhoto : man}/>
                    {profile?.photos?.filter(p => p.photoName !== profile.avaPhoto).map(p =>
                        <div className={s.wrapper_photo}>
                            <Avatar size={200} src={urls.pathToUsersPhotos + p.photoName}/>
                        </div>)}
                </Carousel>
            </div>
            <div className={s.wrapper_nick}>
                <div className={s.nick}>{profile?.nickName}</div>
                <div className={s.online_status}>
                    {profile?.isOnline
                        ? <small>Online</small>
                        : <small>Last
                            seen {profile?.dateLastOnline.toString().substr(5, 5)} {profile?.dateLastOnline.toString().substr(11, 5)}</small>
                    }
                </div>
                <button className={'classic '} onClick={() => {
                    dispatch(appActions.setPageOpened('messages'));
                    dispatch(getDialogByUserId(profile.id));
                }}>
                    <Avatar icon={<MessageOutlined/>}/>
                </button>

            </div>
            <div className={s.wrapper_info}>
                {profile?.status &&
                <div>
                    <div>Status:</div>
                    <div>{profile?.status}</div>
                </div>
                }
                {profile?.country &&
                <div>
                    <div>Country:</div>
                    <div>{profile?.country}</div>
                </div>
                }
            </div>
        </div>
    );
};
