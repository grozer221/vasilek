import React, {ChangeEvent, useState} from 'react';
import s from './ProfileInfo.module.css';
import {useDispatch, useSelector} from "react-redux";
import {updateStatus} from "../../../redux/profile-reducer";
import {s_getStatus} from "../../../redux/profile-selectors";


const ProfileStatusWithHooks: React.FC<any> = () => {
    const status = useSelector(s_getStatus);
    const dispatch = useDispatch();

    let [editMode, setEditMode] = useState(false);
    let [_status, setStatus] = useState(status as string | null);

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
            {editMode
                ? <input onChange={onStatusChange} autoFocus={true} onBlur={deactivateEditMode} value={_status === null ? '' : _status}/>
                : <span onDoubleClick={activateEditMode}>{status || '--'}</span>
            }
        </>
    );
};

export default ProfileStatusWithHooks;
