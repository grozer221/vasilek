import React, {ChangeEvent, useState} from 'react';
import s from './Profile.module.css';
import {useDispatch, useSelector} from "react-redux";
import {updateStatus} from "../../../redux/profile-reducer";
import {s_getProfile, s_getStatus} from "../../../redux/profile-selectors";
import {s_getCurrentUserId} from "../../../redux/auth-selectors";


const ProfileStatus: React.FC = () => {
    const profile = useSelector(s_getProfile);
    const profileStatus = useSelector(s_getStatus);

    const currentUserId = useSelector(s_getCurrentUserId);
    const dispatch = useDispatch();

    let [editMode, setEditMode] = useState(false);
    let [_status, setStatus] = useState(profile?.status as string | null);

    const activateEditMode = () => {
        setEditMode(true);
    };

    const deactivateEditMode = () => {
        setEditMode(false);
        dispatch(updateStatus(_status));
    };

    const onStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
        setStatus(e.currentTarget.value);
    };

    return (
        <>
            <div>Status:</div>
            {profile?.id !== currentUserId
                ? <span onDoubleClick={activateEditMode}>{profileStatus || '--'}</span>
                : editMode
                    ? <input onChange={onStatusChange} autoFocus={true} onBlur={deactivateEditMode}
                             value={_status === null ? '' : _status}/>
                    : <span onDoubleClick={activateEditMode}>{profileStatus || '--'}</span>
            }
        </>
    );
}
;

export default ProfileStatus;
