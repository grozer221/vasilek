import {ResponseCodes} from '../api/api';
import {ProfileType} from '../types/types';
import {BaseThunkType, InferActionsTypes} from './redux-store';
import {Dispatch} from 'react';
import {usersAPI} from "../api/users-api";

const initialState = {
    Users: [] as Array<ProfileType>,
    PageSize: 16,
    UsersCount: 0,
    CurrentPage: 1,
    IsFetching: false,
    FollowingInProgress: [] as Array<number>,
    Filter: {
        Term: '',
        Friends: false
    }
};


const usersReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case 'SET_USERS':
            return {...state, Users: action.users, UsersCount: action.usersCount};
        case 'SET_CURRENT_PAGE':
            return {...state, CurrentPage: action.currentPage};
        case 'TOGGLE_IS_FETCHING':
            return {...state, IsFetching: action.isFetching};
        case 'TOGGLE_IS_FOLLOWING_PROGRESS':
            return {
                ...state,
                FollowingInProgress: action.isFetching
                    ? [...state.FollowingInProgress, action.userId]
                    : state.FollowingInProgress.filter(id => id !== action.userId)
            };
        case 'SET_FILTER' :
            return {...state, Filter: action.payload}

        default:
            return state;
    }
};


export const actions = {
    setUsers: (users: Array<ProfileType>, usersCount: number) => ({type: 'SET_USERS', users, usersCount} as const),
    setCurrentPage: (currentPage: number) => ({type: 'SET_CURRENT_PAGE', currentPage} as const),
    toggleIsFetching: (isFetching: boolean) => ({type: 'TOGGLE_IS_FETCHING', isFetching} as const),
    toggleFollowingProgress: (isFetching: boolean, userId: number) => ({
        type: 'TOGGLE_IS_FOLLOWING_PROGRESS',
        isFetching,
        userId
    } as const),
    toggleShowFriends: (showFriends: boolean) => ({type: 'TOGGLE_SHOW_FRIENDS', ShowFriends: showFriends} as const),
    setFilter: (filter: FilterType) => ({type: 'SET_FILTER', payload: filter} as const)
}

export const getFriends = (page: number, pageSize: number): ThunkType =>
    async (dispatch) => {
        dispatch(actions.toggleIsFetching(true));
        dispatch(actions.setCurrentPage(page));
        let data = await usersAPI.getFriends(page, pageSize);
        if (data.ResultCode === ResponseCodes.Success) {
            dispatch(actions.toggleIsFetching(false));
            dispatch(actions.setUsers(data.Data.Users, data.Data.Count));
        }
    };

export const requestUsers = (page: number, pageSize: number, filter: FilterType): ThunkType =>
    async (dispatch) => {
        dispatch(actions.toggleIsFetching(true));
        dispatch(actions.setCurrentPage(page));
        dispatch(actions.setFilter(filter));
        let data = await usersAPI.getUsers(page, pageSize, filter.Term, filter.Friends);
        if (data.ResultCode === ResponseCodes.Success) {
            dispatch(actions.toggleIsFetching(false));
            dispatch(actions.setUsers(data.Data.Users, data.Data.Count));
        }
    };

const _followUnfollowFlow = async (dispatch: Dispatch<ActionsTypes>, userId: number, apiMethod: any, users: ProfileType[], usersCount: number) => {
    dispatch(actions.toggleFollowingProgress(true, userId));
    let data = await apiMethod(userId);
    if (data.ResultCode === ResponseCodes.Success) {
        for (let i = 0; i < users.length; i++)
            if (users[i].Id === userId)
                users[i].IsFollowed = !users[i].IsFollowed
        dispatch(actions.setUsers(users, usersCount));
    }
    dispatch(actions.toggleFollowingProgress(false, userId));
};

export const follow = (userId: number, users: ProfileType[], usersCount: number): ThunkType =>
    async (dispatch) => {
        await _followUnfollowFlow(dispatch, userId, usersAPI.followUser.bind(usersAPI), users, usersCount);
    };

export const unfollow = (userId: number, users: ProfileType[], usersCount: number): ThunkType =>
    async (dispatch) => {
        await _followUnfollowFlow(dispatch, userId, usersAPI.unFollowUser.bind(usersAPI), users, usersCount);
    };

export default usersReducer;

type InitialStateType = typeof initialState;
export type FilterType = typeof initialState.Filter;
type ActionsTypes = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsTypes>;
