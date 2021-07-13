import React from 'react';
import s from './Login.module.css';
import sForm from './../common/FormsControls/FormsControls.module.css';
import {Field, InjectedFormProps, reduxForm} from 'redux-form';
import { Input } from '../common/FormsControls/FormsControls';
import { required } from '../../utills/validators/validators';
import { connect } from 'react-redux';
import { login } from '../../redux/auth-reducer';
import { Redirect } from 'react-router-dom';
import {AppStateType} from "../../redux/redux-store";

let LoginForm: React.FC<InjectedFormProps<LoginFormValuesType>> = ({ handleSubmit, error }) => {
  return(
      <form onSubmit={handleSubmit}>
        <div>
          <Field placeholder={'Login'} validate={[required]} component={Input} name={'login'}/>
        </div>
        <div>
          <Field type="password" validate={[required]} placeholder={'Password'} component={Input} name={'password'}/>
        </div>
        <div>
          <Field type='checkbox' validate={[]} component={Input} name={'rememberMe'} /> remember me
        </div>
        {error &&
          <div className={sForm.from_summary_error}>
            {error}
          </div>
        }
        <div>
          <button>Sign in</button>
        </div>
      </form>
  )
};

const LoginReduxFrom = reduxForm<LoginFormValuesType>({ form: 'login'})(LoginForm)

type MapStatePropsType = {
    isAuth: boolean
}
type MapDispatchPropsType = {
    login: (login: string, password: string, rememberMe: boolean) => void
}
type LoginFormValuesType = {
    login: string
    password: string
    rememberMe: boolean
}
let Login: React.FC<MapStatePropsType & MapDispatchPropsType> = (props) => {
  const onSubmit = (formData: any) => {
    props.login(formData.login, formData.password, formData.rememberMe);
  }

  if(props.isAuth)
    return <Redirect to='/profile' />

  return(
    <div>
      <h1>LOGIN</h1>
      <LoginReduxFrom onSubmit={onSubmit} />
    </div>
  )
};

const mapStateToProps = (state: AppStateType):MapStatePropsType => ({isAuth: state.auth.isAuth})

export default connect(mapStateToProps, {login})(Login);