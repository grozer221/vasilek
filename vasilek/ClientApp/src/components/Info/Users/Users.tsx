import React, {useEffect} from 'react';
import s from './Users.module.css';
import Paginator from '../../common/Paginator/Paginator';
import {User} from './User';
import {UsersSearchForm} from "./UsersSearchForm";
import {requestUsers} from "../../../redux/users-reducer";
import {useDispatch, useSelector} from "react-redux";
import {
    s_getCurrentPage,
    s_getTerm,
    s_getIsFetching,
    s_getPageSize,
    s_getUsers,
    s_getUsersCount
} from "../../../redux/users-selectors";
import Loading from "../../common/Loading/Loading";
import {useHistory} from 'react-router-dom';
import * as queryString from "querystring";

type QueryParamsType = { term?: string, page?: string, friends?: string };

export const Users: React.FC = () => {
        const usersCount = useSelector(s_getUsersCount);
        const currentPage = useSelector(s_getCurrentPage);
        const pageSize = useSelector(s_getPageSize);
        const users = useSelector(s_getUsers);
        const term = useSelector(s_getTerm);
        const isFetching = useSelector(s_getIsFetching);

        const dispatch = useDispatch();
        const history = useHistory();

        useEffect(() => {
            const parsed = queryString.parse(history.location.search.substr(1)) as QueryParamsType;
            let actualPage = currentPage;
            if (!!parsed.page) actualPage = Number(parsed.page);
            let actualTerm = term;
            if (!!parsed.term) actualTerm = parsed.term as string;

            dispatch(requestUsers(actualPage, pageSize, actualTerm));
        }, []);

        useEffect(() => {
            const query: QueryParamsType = {}
            if (!!term) query.term = term;
            if (currentPage !== 1) query.page = String(currentPage);
            history.push({
                pathname: '/users',
                search: queryString.stringify(query),
            })
            dispatch(requestUsers(currentPage, pageSize, term));
        }, [term, currentPage, history.location.search])

        const onPageChanged = (pageNumber: number) => {
            dispatch(requestUsers(pageNumber, pageSize, term));
        };


        return (
            <div className={s.wrapper_users_and_form}>
                <UsersSearchForm/>
                {isFetching
                    ? <Loading/>
                    : <div className={s.wrapper_users}>

                        <div className={s.users}>
                            {users.map(obj =>
                                <User user={obj}
                                      key={obj.id}
                                />
                            )}
                        </div>
                        <Paginator currentPage={currentPage} onPageChanged={onPageChanged}
                                   itemsCount={usersCount} pageSize={pageSize}/>
                    </div>
                }
            </div>
        );
    }
;