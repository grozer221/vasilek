import React, {useEffect} from 'react';
import s from './Users.module.css';
import Paginator from '../common/Paginator/Paginator';
import User from './User';
import {UsersSearchForm} from "./UsersSearchForm";
import {follow, getFollowedUsers, requestUsers, unfollow} from "../../redux/users-reducer";
import {useDispatch, useSelector} from "react-redux";
import {
    getCurrentPage,
    getFilter,
    getFollowedUsersSelector,
    getFollowingInProgress,
    getIsAuth,
    getIsFetching,
    getPageSize,
    getUsers,
    getUsersCount
} from "../../redux/users-selectors";
import Loading from "../common/Loading/Loading";
import {useHistory} from 'react-router-dom';
import * as queryString from "querystring";


type QueryParamsType = { term?: string, page?: string, friends?: string };
export const Users: React.FC = (props) => {
    const usersCount = useSelector(getUsersCount);
    const currentPage = useSelector(getCurrentPage);
    const pageSize = useSelector(getPageSize);
    const isAuth = useSelector(getIsAuth);
    const followingInProgress = useSelector(getFollowingInProgress);
    const users = useSelector(getUsers);
    const followedUsers = useSelector(getFollowedUsersSelector);
    const filter = useSelector(getFilter);
    const isFetching = useSelector(getIsFetching);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        const parsed = queryString.parse(history.location.search.substr(1)) as QueryParamsType;

        let actualPage = currentPage;
        if(!!parsed.page) actualPage = Number(parsed.page);
        let actualFilter = filter;
        if(!!parsed.term) actualFilter = {...actualFilter, Term: parsed.term as string};
        if(parsed.friends === 'true')
            actualFilter = {...actualFilter, Friends: true};
        else
            actualFilter = {...actualFilter, Friends: false};


        dispatch(requestUsers(actualPage, pageSize, actualFilter));
        dispatch(getFollowedUsers());
    }, []);

    useEffect(() => {
        debugger
        const query: QueryParamsType = {}
        if(!!filter.Term) query.term = filter.Term;
        if(filter.Friends) query.friends = String(filter.Friends);
        if(currentPage !== 1) query.page = String(currentPage);
        history.push({
            pathname: '/users',
            search: queryString.stringify(query),
        })
    }, [filter, currentPage, history.location.search])

    const onPageChanged = (pageNumber: number) => {
        dispatch(requestUsers(pageNumber, pageSize, filter));
        dispatch(getFollowedUsers());
    };

    const onTermChanged = (term: string) => {
        dispatch(requestUsers(1, pageSize, {...filter, Term: term}));
        dispatch(getFollowedUsers());
    }

    const _follow = (userId: number) => {
        dispatch(follow(userId));
    }
    const _unfollow = (userId: number) => {
        dispatch(unfollow(userId));
    }

    return (
        <>
            {
                isFetching
                    ? <Loading/>
                    : <div className={s.wrapper}>
                        <UsersSearchForm onTermChanged={onTermChanged}/>
                        <div className={s.wrapper_users}>
                            {users.map(obj =>
                                <User User={obj}
                                      key={obj.Id}
                                      followingInProgress={followingInProgress}
                                      follow={_follow}
                                      unfollow={_unfollow}
                                      followedUsers={followedUsers}
                                      isAuth={isAuth}
                                />
                            )}
                        </div>
                        <Paginator currentPage={currentPage} onPageChanged={onPageChanged}
                                   itemsCount={usersCount} pageSize={pageSize}/>
                    </div>
            }
        </>

    );
};