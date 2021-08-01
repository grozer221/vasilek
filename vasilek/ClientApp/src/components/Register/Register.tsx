import React from 'react';
import {Button, Form, Input} from 'antd';
import s from './Register.module.css';
import {register} from "../../redux/auth-reducer";
import {useDispatch, useSelector} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {s_getIsAuth} from "../../redux/auth-selectors";
import {s_getFormError, s_getFormSuccess} from "../../redux/app-selectors";
import {actions as appActions} from "../../redux/app-reducer";

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

export const Register = () => {
    const isAuth = useSelector(s_getIsAuth);
    const formError = useSelector(s_getFormError);
    const formSuccess = useSelector(s_getFormSuccess);
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const onFinish = (values: { login: string, password: string, confirmPassword: string, nickName: string }) => {
        dispatch(register(values.login, values.password, values.confirmPassword, values.nickName));
    };

    if (isAuth)
        return <Redirect to='/'/>

    return (
        <div className={s.wrapper_register_form}>
            <div className={s.form_register_background}>
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    scrollToFirstError
                    className={s.register_form}
                >
                    <Form.Item
                        name="login"
                        label="Login"
                    >
                        <Input onChange={() => dispatch(appActions.setFormError(''))}/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password onChange={() => dispatch(appActions.setFormError(''))}/>
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password onChange={() => dispatch(appActions.setFormError(''))}/>
                    </Form.Item>

                    <Form.Item
                        name="nickName"
                        label="Nickname"
                        tooltip="What do you want others to call you?"
                        rules={[{required: true, message: 'Please input your nickname!', whitespace: true}]}
                    >
                        <Input onChange={() => dispatch(appActions.setFormError(''))}/>
                    </Form.Item>

                    <div className={s.form_error}>{formError}</div>

                    <Form.Item {...tailFormItemLayout}>
                        <Button className={s.button_submit} type="primary" htmlType="submit">
                            Register
                        </Button>
                        Or <Link to="/login">login now!</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};