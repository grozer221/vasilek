import React from 'react';
import s from './FormsControls.module.css';
import {Field, WrappedFieldMetaProps, WrappedFieldProps} from 'redux-form';
import {FieldValidatorType, required} from '../../../utills/validators/validators';

type FormControlPropsType = {
    meta: WrappedFieldMetaProps
}

const FormControl: React.FC<FormControlPropsType> = ({meta: {touched, error}, children}) => {
    const hasError = touched && error;
    return (
        <div className={s.form_control + ' ' + (hasError ? s.error : '')}>
            <div>
                {children}
            </div>
            <div>
                {hasError && <span>{error}</span>}
            </div>
        </div>
    );
};


export const Textarea: React.FC<WrappedFieldProps> = (props) => {
    const {input, meta, ...restProps} = props;
    return <FormControl {...props}><textarea {...props.input} {...restProps} /></FormControl>;
};

export const Input: React.FC<WrappedFieldProps> = (props) => {
    const {input, meta, ...restProps} = props;
    return <FormControl {...props}><input {...props.input} {...restProps} /></FormControl>;
};

export type LoginFormValuesType = {
    login: string
    password: string
    rememberMe: boolean
};

export type LoginFormValuesTypeKeys = GetStringKeys<LoginFormValuesType>;

export function createField<FormKeysType extends string>(placeholder: string | undefined,
                                                         name: FormKeysType,
                                                         validators: Array<FieldValidatorType>,
                                                         component: React.FC<WrappedFieldProps>,
                                                         props = {}, text = "") {
    return (
        <div>
            <Field placeholder={placeholder}
                   name={name}
                   validate={validators}
                   component={component}
                   {...props}
            />{text}
        </div>
    )
};

export type GetStringKeys<T> = Extract<keyof T, string>;
