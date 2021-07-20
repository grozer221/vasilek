import React from 'react';
import s from './Login.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../redux/auth-reducer';
import {Redirect} from 'react-router-dom';
import {s_getIsAuth} from "../../redux/auth-selectors";
import {Form, Input, Button, Checkbox} from 'antd';

export let Login: React.FC = () => {
    const isAuth = useSelector(s_getIsAuth);
    const dispatch = useDispatch();

    const onFinish = (values: { login: string, password: string }) => {
        console.log('Success:', values);
        dispatch(login(values.login, values.password));
    };

    return (
        isAuth
            ? <Redirect to='/profile'/>
            : (
                <div className={s.login_form_wrapper}>
                    <div>
                        <Form
                            name="login"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 16}}
                            initialValues={{remember: true}}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label="Login"
                                name="login"
                                rules={[{required: true, message: 'Please input your Login!'}]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{required: true, message: 'Please input your Password!'}]}
                            >
                                <Input.Password/>
                            </Form.Item>
                            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                                <Button type="primary" htmlType="submit">Submit</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )
    );
};
