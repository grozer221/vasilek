import ProfileStatusWithHooks from './ProfileStatusWithHooks';
import React from 'react';
import { createField, Input } from '../../common/FormsControls/FormsControls';
import { reduxForm } from 'redux-form';

const ProfileDataForm = ({status, updateStatus, handleSubmit}) => {
  return(
    <form onSubmit={handleSubmit}>
      <button>Save</button>
      <div><b>First name</b>: {createField('FirstName', 'firstName', [], Input)}</div>
      <div><b>Last name</b>: {createField('LastName', 'lastName', [], Input)}</div>
      <div><b>Status</b>: <ProfileStatusWithHooks status={status} updateStatus={updateStatus}/></div>
      <div><b>City</b>: {createField('City', 'city', [], Input)}</div>
      <div><b>Country</b>: {createField('Country', 'country', [], Input)}</div>
    </form>
  );
}

const ProfileDataReduxForm = reduxForm({form: 'edit-profile'})(ProfileDataForm);

export default ProfileDataReduxForm;