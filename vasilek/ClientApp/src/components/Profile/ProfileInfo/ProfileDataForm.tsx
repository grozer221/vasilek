import ProfileStatusWithHooks from './ProfileStatusWithHooks';
import React from 'react';
import {createField, GetStringKeys, Input, LoginFormValuesType} from '../../common/FormsControls/FormsControls';
import {InjectedFormProps, reduxForm} from 'redux-form';
import {ProfileType} from "../../../types/types";

type PropsType = {
    status: string
    updateStatus: (status: string) => void
}
type ProfileTypeKeys = GetStringKeys<ProfileType>;

const ProfileDataForm: React.FC<InjectedFormProps<ProfileType, PropsType> & PropsType> = ({status, updateStatus, handleSubmit}) => {
    return (
        <form onSubmit={handleSubmit}>
            <button>Save</button>
            <div><b>First name</b>: {createField<ProfileTypeKeys>('FirstName', 'firstName', [], Input)}</div>
            <div><b>Last name</b>: {createField<ProfileTypeKeys>('LastName', 'lastName', [], Input)}</div>
            <div><b>Status</b>: <ProfileStatusWithHooks status={status} updateStatus={updateStatus}/></div>
            <div><b>City</b>: {createField<ProfileTypeKeys>('City', 'city', [], Input)}</div>
            <div><b>Country</b>: {createField<ProfileTypeKeys>('Country', 'country', [], Input)}</div>
        </form>
    );
}

const ProfileDataReduxForm = reduxForm<ProfileType, PropsType>({form: 'edit-profile'})(ProfileDataForm);

export default ProfileDataReduxForm;