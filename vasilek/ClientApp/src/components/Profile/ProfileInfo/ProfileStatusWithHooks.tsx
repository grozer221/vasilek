import React, {ChangeEvent, useState} from 'react';
import s from './ProfileInfo.module.css';

type PropsType = {
    status: string
    updateStatus: (newStatus: string) => void
}

const ProfileStatusWithHooks: React.FC<PropsType> = (props) => {
    let [editMode, setEditMode] = useState(false);
    let [status, setStatus] = useState(props.status);
    const activateEditMode = () => {
        setEditMode(true);
    };
    const deactivateEditMode = () => {
        setEditMode(false);
        props.updateStatus(status);
    };
    const onStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
        setStatus(e.currentTarget.value);
    };

    return (
        <div>
            <span><b>Status</b>: </span>
            {!editMode &&
            <span onDoubleClick={activateEditMode}>{props.status || '--'}</span>
            }
            {editMode &&
            <input onChange={onStatusChange} autoFocus={true} onBlur={deactivateEditMode} value={status}/>
            }
        </div>
    );
};

export default ProfileStatusWithHooks;
