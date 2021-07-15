import React, {ChangeEvent, useState} from 'react';
import s from './ProfileInfo.module.css';

type PropsType = {
    Status: string
    updateStatus: (newStatus: string) => void
}

const ProfileStatusWithHooks: React.FC<PropsType> = (props) => {
    let [editMode, setEditMode] = useState(false);
    let [status, setStatus] = useState(props.Status);
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
            {editMode
                ? <input onChange={onStatusChange} autoFocus={true} onBlur={deactivateEditMode} value={status}/>
                : <span onDoubleClick={activateEditMode}>{props.Status || '--'}</span>
            }
        </div>
    );
};

export default ProfileStatusWithHooks;
