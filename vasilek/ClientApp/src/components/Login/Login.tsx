import React from 'react';
import s from './Login.module.css';
import sForm from './../common/FormsControls/FormsControls.module.css';
import {InjectedFormProps, reduxForm} from 'redux-form';
import {createField, Input, LoginFormValuesType, LoginFormValuesTypeKeys} from '../common/FormsControls/FormsControls';
import {required} from '../../utills/validators/validators';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../redux/auth-reducer';
import {Redirect} from 'react-router-dom';
import {getIsAuth} from "../../redux/users-selectors";

let LoginForm: React.FC<InjectedFormProps<LoginFormValuesType>>
    = ({handleSubmit, error}) => {
    return (
        <form onSubmit={handleSubmit} className={s.login_form}>
            <div className={s.wrapper_form_content}>
                <h1>LOGIN</h1>
                <div className={s.control}>
                    {createField<LoginFormValuesTypeKeys>("Login", "login", [required], Input)}
                </div>
                <div className={s.control}>
                    {createField<LoginFormValuesTypeKeys>("Password", "password", [required], Input, {type: "password"})}
                </div>
                {error &&
                <div className={sForm.from_summary_error}>
                    {error}
                </div>
                }
                <div>
                    <button className={s.button}>Sign in</button>
                </div>
            </div>
        </form>
    )
};

const LoginReduxFrom = reduxForm<LoginFormValuesType>({form: 'login'})(LoginForm)


export let Login: React.FC = (props) => {
    const isAuth = useSelector(getIsAuth);
    const dispatch = useDispatch();

    const onSubmit = (formData: any) =>
        dispatch(login(formData.login, formData.password));

    return (
        isAuth
            ? <Redirect to='/profile'/>
            : <LoginReduxFrom onSubmit={onSubmit}/>
    );
};
