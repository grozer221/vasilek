import React from 'react';
import s from './FormsControls.module.css';
import { Field } from 'redux-form';
import { required } from '../../../utills/validators/validators';

const FormControl = ({ input, meta: { touched, error }, children }) => {
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

export const Textarea = (props) => {
  const { input, meta, element, ...restProps } = props;
  return <FormControl {...props}><textarea {...props.input} {...restProps} /></FormControl>;
};

export const Input = (props) => {
  const { input, meta, element, ...restProps } = props;
  return <FormControl {...props}><input {...props.input} {...restProps} /></FormControl>;
};

export const createField = (placeholder, name, validators, component) => (
  <div>
    <Field placeholder={placeholder}
           name={name}
           validate={validators}
           component={component}/>
  </div>
);