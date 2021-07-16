import {Field, Form, Formik} from "formik";
import React from "react";
import {useSelector} from "react-redux";
import {getFilter} from "../../redux/users-selectors";

const usersSearchFormValidate = (values: any) => {
    const errors = {};
    return errors;
}

type PropsType = {
    onTermChanged: (term: string) => void
}

export const UsersSearchForm: React.FC<PropsType> = React.memo((props) => {
    const filter = useSelector(getFilter);

    const submit = (values: {term: string}, {setSubmitting}: { setSubmitting: (setSubmitting: boolean) => void }) => {
        props.onTermChanged(values.term);
        setSubmitting(false)
    }
    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={{term: filter.Term}}
                validate={usersSearchFormValidate}
                onSubmit={submit}
            >
                {({isSubmitting}) => (
                    <Form>
                        <Field type="text" name="term"/>
                        <button type="submit" disabled={isSubmitting}>
                            Find
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
});