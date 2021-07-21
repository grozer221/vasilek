import React, {useEffect, useState} from 'react';
import s from './Dialogs.module.css';
import Message from './Message/Message';
import {actions, sendMessage} from "../../redux/dialogs-reducer";
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentDialogId, s_getDialogs} from "../../redux/dialogs-selectors";
import {Menu} from "antd";
import {Link, useHistory} from "react-router-dom";
import queryString from "querystring";
import TextArea from "antd/es/input/TextArea";
import {s_getIsAuth} from "../../redux/auth-selectors";


const Dialogs: React.FC = () => {
    const dialogs = useSelector(s_getDialogs);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const history = useHistory();
    const dispatch = useDispatch();

    const updateDialogId = () => {
        const parsed = queryString.parse(history.location.search.substr(1)) as QueryParamsType;
        if (!!parsed.id)
            dispatch(actions.setCurrentDialogId(+parsed.id));
    }

    useEffect(() => {
        updateDialogId();
    }, []);

    useEffect(() => {
        updateDialogId();
    }, [history.location.search])

    return (
        <div className={s.wrapper_dialogs}>
            <div className={s.dialogs}>
                <Menu theme="light" mode="vertical" style={{width: 300}}>
                    {dialogs.map(obj => (
                            <Menu.Item key={obj.id}>
                                <Link to={'/dialogs?id=' + obj.id}>{obj.dialogName}</Link>
                            </Menu.Item>
                        )
                    )}
                </Menu>
            </div>
            <div className={s.messages}>
                {
                    dialogs && currentDialogId && (
                        <div>
                            {dialogs?.find((dialog => dialog?.id === currentDialogId))?.messages.map(obj => <Message key={obj.id} message={obj.messageText}/>)}
                            <AddMessageForm/>
                        </div>
                    )

                }
            </div>
        </div>
    );
};

type QueryParamsType = {
    id?: number
}

const AddMessageForm: React.FC = () => {
    const isAuth = useSelector(s_getIsAuth);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const [_message, setMessage] = useState('');
    const history = useHistory();

    const dispatch = useDispatch();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const parsed = queryString.parse(history.location.search.substr(1)) as QueryParamsType;
        if (!!parsed.id) {
            e.preventDefault();
            const isMessageProvided = _message && _message !== '';
            if (isMessageProvided && isAuth && currentDialogId) {
                dispatch(sendMessage(currentDialogId, _message));
                setMessage('');
            }
        }

    }

    const onMessageUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    }

    const onEnterPress = (e: any) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            onSubmit(e);
        }
    }
    return (
        <form className={s.form_input_message} onSubmit={onSubmit}>
            <div>
                <TextArea
                    placeholder="Input message"
                    onKeyDown={onEnterPress}
                    allowClear
                    onChange={onMessageUpdate}
                    value={_message}
                    cols={132}
                />
            </div>
            <div>
                <button>Submit</button>
            </div>
        </form>
    );
};

export default Dialogs;
