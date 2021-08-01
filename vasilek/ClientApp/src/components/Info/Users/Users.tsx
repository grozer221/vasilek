import React, {useEffect} from 'react';
import s from './Users.module.css';
import {User} from './User';
import {UsersSearchForm} from "./UsersSearchForm";
import {actions, requestAndAddUsers, requestAndSetUsers} from "../../../redux/users-reducer";
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentPage, s_getPageSize, s_getTerm, s_getUsers, s_getUsersCount} from "../../../redux/users-selectors";
import {message} from "antd";


export const Users: React.FC = () => {
    const usersCount = useSelector(s_getUsersCount);
    const currentPage = useSelector(s_getCurrentPage);
    const pageSize = useSelector(s_getPageSize);
    const users = useSelector(s_getUsers);
    const term = useSelector(s_getTerm);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(requestAndSetUsers(currentPage, pageSize, term));
        return () => {
            dispatch(actions.setCurrentPage(1))
        };
    }, []);


    useEffect(() => {
        if (users.length && users.length < usersCount)
            dispatch(requestAndAddUsers(currentPage, pageSize, term));
    }, [currentPage])

    useEffect(() => {
        dispatch(requestAndSetUsers(1, pageSize, term));
    }, [term])


    const scrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        if (Math.abs(element.scrollHeight - element.scrollTop) - element.clientHeight <= 0.5
            && users.length > 0
            && users.length < usersCount) {
            dispatch(actions.setCurrentPage(currentPage + 1));
        }
    };

    return (
        <div className={s.wrapper_users_and_form}>
            <UsersSearchForm/>
            <div className={s.wrapper_users} onScroll={scrollHandler}>
                <div className={s.users}>
                    {users.map(user =>
                        <User user={user}
                              key={user.id}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};