import React from 'react';
import s from './Dialogs.module.css';
import Dialog from './Dialog/Dialog';
import Message from './Message/Message';
import { Redirect } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { Textarea } from '../common/FormsControls/FormsControls';
import { maxLengthCreator, required } from '../../utills/validators/validators';

const maxLength100 = maxLengthCreator(100);

const Dialogs = (props) => {
  let addNewMessage = (values) => {
    props.sendMessage(values.newMessageBody);
  };

  if (!props.isAuth)
    return <Redirect to={'/login'}/>;

  return (
    <div className={s.wrapper_dialogs}>
      <div className={s.dialogs}>
        {props.dialogsPage.dialogs.map(obj => <Dialog key={obj.id} id={obj.id} name={obj.name}/>)}
      </div>
      <div className={s.messages}>
        <div>{props.dialogsPage.messages.map(obj => <Message key={obj.id} message={obj.message}/>)}</div>
        <AddMessageFormRedux onSubmit={addNewMessage} />
      </div>
    </div>
  );
};

const AddMessageForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        <Field component={Textarea} validate={[required, maxLength100]} name="newMessageBody" placeholder="Enter your message"/>
      </div>
      <div>
        <button>Send</button>
      </div>
    </form>
  );
};

const AddMessageFormRedux = reduxForm({ form: 'dialogMessageForm' })(AddMessageForm);

export default Dialogs;
