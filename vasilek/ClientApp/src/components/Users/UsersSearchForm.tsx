import React from "react";
import s from "./Users.module.css";
import {FilterType} from "../../redux/users-reducer";
import {Field, Form, Formik} from "formik";

type PropsType = {
    filter: FilterType
    onTermChanged: (term: string) => void
}


export const UsersSearchForm: React.FC<PropsType> = React.memo((props) => {
    const submit = (values: { term: string }, {setSubmitting}: { setSubmitting: (setSubmitting: boolean) => void }) => {
        props.onTermChanged(values.term);
        setSubmitting(false)
    }

    const usersSearchFormValidate = (values: any) => {
        const errors = {};
        return errors;
    }

    return (
        <div className={s.wrapper_users_search_form}>
            <div className={s.users_search_form}>
                <Formik
                    enableReinitialize
                    initialValues={{term: props.filter.Term}}
                    validate={usersSearchFormValidate}
                    onSubmit={submit}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <Field type="text"
                                   name="term"
                                   onInput={(e: any) => props.onTermChanged(e.currentTarget.value)}
                            />
                        </Form>
                    )}

                </Formik>
            </div>
        </div>
    );
});

