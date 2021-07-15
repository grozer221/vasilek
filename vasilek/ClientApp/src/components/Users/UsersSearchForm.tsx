import {Field, Form, Formik} from "formik";
import React from "react";
import {FilterFormType} from "../../redux/users-reducer";

const usersSearchFormValidate = (values: any) => {
    const errors = {};
    return errors;
}

type PropsType = {
    onFilterChanged: (term: string) => void
}

export const UsersSearchForm: React.FC<PropsType> = React.memo((props) => {
    const submit = (values: {Term: string}, {setSubmitting}: { setSubmitting: (setSubmitting: boolean) => void }) => {
        props.onFilterChanged(values.Term);
        setSubmitting(false)
    }
    return (
        <div>
            <Formik
                initialValues={{Term: '', Friends: false}}
                validate={usersSearchFormValidate}
                onSubmit={submit}
            >
                {({isSubmitting}) => (
                    <Form>
                        <Field type="text" name="Term"/>
                        <button type="submit" disabled={isSubmitting}>
                            Find
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
});