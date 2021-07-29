import React, {ChangeEvent} from "react";
import s from "./Users.module.css";
import {useDispatch, useSelector} from "react-redux";
import {requestUsers} from "../../../redux/users-reducer";
import {s_getPageSize, s_getTerm} from "../../../redux/users-selectors";
import {useFormik} from "formik";
import {Input} from "antd";

export const UsersSearchForm: React.FC = React.memo(() => {
    const pageSize = useSelector(s_getPageSize);
    const term = useSelector(s_getTerm);
    const dispatch = useDispatch();

    const changeHandlerInput = (e: ChangeEvent<HTMLInputElement>) => {
        let term = e.currentTarget.value;
        dispatch(requestUsers(1, pageSize, term));
    };

    const {handleSubmit, handleChange, values, touched} = useFormik({
        initialValues: {
            term: term
        },
        enableReinitialize: true,
        onSubmit: ({term}) => {
            alert(term)
        }

    });

    return (
        <div className={s.users_search_form}>
            <form onSubmit={handleSubmit}>
                <Input name="term"
                       placeholder="Search"
                       allowClear
                       onChange={changeHandlerInput}/>
            </form>
        </div>
    );
});

