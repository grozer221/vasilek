import React from 'react';
import s from './Dialogs.module.css';
import Message from './Message/Message';
import {InjectedFormProps, reduxForm} from 'redux-form';
import {createField, Textarea} from '../common/FormsControls/FormsControls';
import {maxLengthCreator, required} from '../../utills/validators/validators';
import {actions} from "../../redux/dialogs-reducer";
import {useDispatch, useSelector} from "react-redux";
import {s_getDialogs, s_getMessages} from "../../redux/dialogs-selectors";
import {Menu} from "antd";
import {Link} from "react-router-dom";

const maxLength100 = maxLengthCreator(100);


export type NewMessageFormValuesType = {
    newMessageBody: string
}
export type NewMessageFormValuesTypeKeys = Extract<keyof NewMessageFormValuesType, string>;

const Dialogs: React.FC = () => {
    const dialogs = useSelector(s_getDialogs);
    const messages = useSelector(s_getMessages);
    const dispatch = useDispatch();
    let addNewMessage = (values: { newMessageBody: string }) => {
        dispatch(actions.sendMessage(values.newMessageBody));
    };

    return (
        <div className={s.wrapper_dialogs}>
            <div className={s.dialogs}>
                <Menu theme="light" mode="vertical" defaultSelectedKeys={['1']}>
                    {dialogs.map(obj => (
                            <Menu.Item key={obj.Id}>
                                <Link to={'/dialogs/' + obj.Id}>{obj.Login}</Link>
                            </Menu.Item>
                        )
                    )}
                </Menu>
            </div>
            <div className={s.messages}>
                <div>{messages.map(obj => <Message key={obj.Id} message={obj.Message}/>)}</div>
                <AddMessageFormRedux onSubmit={addNewMessage}/>
            </div>
        </div>
    );
};

const AddMessageForm: React.FC<InjectedFormProps<NewMessageFormValuesType>> = ({handleSubmit, error}) => {
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
