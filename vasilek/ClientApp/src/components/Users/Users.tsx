import React, {useEffect} from 'react';
import s from './Users.module.css';
import Paginator from '../common/Paginator/Paginator';
import User from './User';
import {UsersSearchForm} from "./UsersSearchForm";
import {follow, requestUsers, unfollow} from "../../redux/users-reducer";
import {useDispatch, useSelector} from "react-redux";
import {
    s_getCurrentPage,
    s_getFilter,
    s_getFollowingInProgress,
    s_getIsFetching,
    s_getPageSize,
    s_getUsers,
    s_getUsersCount
} from "../../redux/users-selectors";
import Loading from "../common/Loading/Loading";
import {useHistory} from 'react-router-dom';
import * as queryString from "querystring";
import {s_getIsAuth} from "../../redux/auth-selectors";


type QueryParamsType = { term?: string, page?: string, friends?: string };
export const Users: React.FC = (props) => {
        const usersCount = useSelector(s_getUsersCount);
        const currentPage = useSelector(s_getCurrentPage);
        const pageSize = useSelector(s_getPageSize);
        const isAuth = useSelector(s_getIsAuth);
        const followingInProgress = useSelector(s_getFollowingInProgress);
        const users = useSelector(s_getUsers);
        const filter = useSelector(s_getFilter);
        const isFetching = useSelector(s_getIsFetching);

        const dispatch = useDispatch();
        const history = useHistory();

        useEffect(() => {
            const parsed = queryString.parse(history.location.search.substr(1)) as QueryParamsType;

            let actualPage = currentPage;
            if (!!parsed.page) actualPage = Number(parsed.page);
            let actualFilter = filter;
            if (!!parsed.term) actualFilter = {...actualFilter, term: parsed.term as string};
            if (parsed.friends === 'true')
                actualFilter = {...actualFilter, friends: true};
            else
                actualFilter = {...actualFilter, friends: false};

            if (!isAuth && parsed.friends === 'true') {
                history.push({pathname: '/login'});
                return;
            }

            dispatch(requestUsers(actualPage, pageSize, actualFilter));
        }, []);

        useEffect(() => {
            const query: QueryParamsType = {}
            if (!!filter.term) query.term = filter.term;
            if (filter.friends) query.friends = String(filter.friends);
            if (currentPage !== 1) query.page = String(currentPage);
            history.push({
                pathname: '/users',
                search: queryString.stringify(query),
            })
        }, [filter, currentPage, history.location.search])

        const onPageChanged = (pageNumber: number) => {
            dispatch(requestUsers(pageNumber, pageSize, filter));
        };

        const _follow = (userId: number) => {
            dispatch(follow(userId, users, usersCount));
        }
        const _unfollow = (userId: number) => {
            dispatch(unfollow(userId, users, usersCount));
        }

        const onTermChanged = (term: string) => {
            dispatch(requestUsers(1, pageSize, {...filter, term: term}));
            return new Promise(function (resolve, reject) {
            });
        }

        return (
            <div className={s.wrapper}>
                <UsersSearchForm onTermChanged={onTermChanged} filter={filter}/>
                {isFetching
                    ? <Loading/>
                    : <div>

                        <div className={s.wrapper_users}>
                            {users.map(obj =>
                                <User user={obj}
                                      key={obj.id}
                                      followingInProgress={followingInProgress}
                                      follow={_follow}
                                      unfollow={_unfollow}
                                      isAuth={isAuth}
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