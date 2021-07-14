import React from 'react';
import s from './Dialogs.module.css';
import Dialog from './Dialog/Dialog';
import Message from './Message/Message';
import {InjectedFormProps, reduxForm} from 'redux-form';
import {createField, Textarea} from '../common/FormsControls/FormsControls';
import {maxLengthCreator, required} from '../../utills/validators/validators';
import {InitialStateType} from "../../redux/dialogs-reducer";

const maxLength100 = maxLengthCreator(100);

type OwnPropsType = {
    dialogsPage: InitialStateType
    sendMessage: (newMessageBody: string) => void
};
type PropsType = {}

export type NewMessageFormValuesType = {
    newMessageBody: string
}
export type NewMessageFormValuesTypeKeys = Extract<keyof NewMessageFormValuesType, string>;

const Dialogs: React.FC<OwnPropsType> = (props) => {
    let addNewMessage = (values: { newMessageBody: string }) => {
        props.sendMessage(values.newMessageBody);
    };

    return (
        <div className={s.wrapper_dialogs}>
            <div className={s.dialogs}>
                {props.dialogsPage.dialogs.map(obj => <Dialog key={obj.id} id={obj.id} login={obj.login}/>)}
            </div>
            <div className={s.messages}>
                <div>{props.dialogsPage.messages.map(obj => <Message key={obj.id} message={obj.message}/>)}</div>
                <AddMessageFormRedux onSubmit={addNewMessage}/>
            </div>
        </div>
    );
};

const AddMessageForm: React.FC<InjectedFormProps<NewMessageFormValuesType, PropsType> & PropsType> = ({handleSubmit, error}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                {createField<NewMessageFormValuesTypeKeys>("Enter your message", "newMessageBody", [required, maxLength100], Textarea)}
            </div>
            <div>
                <button>Send</button>
            </div>
        </form>
    );
};

const AddMessageFormRedux = reduxForm<NewMessageFormValuesType>({form: 'dialogMessageForm'})(AddMessageForm);

export default Dialogs;
