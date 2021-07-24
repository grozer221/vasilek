import React from 'react';
import s from './Login.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../redux/auth-reducer';
import {Form, Input, Button, Checkbox} from 'antd';
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {s_getIsAuth} from "../../redux/auth-selectors";
import {Redirect} from "react-router-dom";

export let Login: React.FC = () => {
    const isAuth = useSelector(s_getIsAuth);
    const dispatch = useDispatch();

    const onFinish = (values: { login: string, password: string }) => {
        console.log('Success:', values);
        dispatch(login(values.login, values.password));
    };

    if(isAuth)
        return <Redirect to='/'/>

    return (
        <div className={s.login_form_wrapper}>
            <Form
                name="login_form"
                className={s.login_form}
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="login"
                    rules={[{ required: true, message: 'Please input your Login!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Login" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className={s.login_form_forgot} href="">
                        Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className={s.login_form_button}>
                        Log in
                    </Button>
                    Or <a href="">register now!</a>
                </Form.Item>
            </Form>
        </div>
    );
};
