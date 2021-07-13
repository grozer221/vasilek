import {ResponseCodes} from '../api/api';
import {ProfileType} from '../types/types';
import {AppStateType, BaseThunkType, InferActionsTypes} from './redux-store';
import {Dispatch} from 'react';
import {ThunkAction} from 'redux-thunk';
import {usersAPI} from "../api/users-api";

const initialState = {
    users: [] as Array<ProfileType>,
    pageSize: 5,
    usersCount: 0,
    currentPage: 1,
    isFetching: false,
    followingInProgress: [] as Array<number>,
    followedUsers: [] as Array<number>
};


const usersReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case 'SET_FOLLOWED_USERS':
            return {...state, followedUsers: action.followedUsers};
        case 'SET_USERS':
            return {...state, users: action.users};
        case 'SET_CURRENT_PAGE':
            return {...state, currentPage: action.currentPage};
        case 'SET_USERS_COUNT':
            return {...state, usersCount: action.count};
        case 'TOGGLE_IS_FETCHING':
            return {...state, isFetching: action.isFetching};
        case 'TOGGLE_IS_FOLLOWING_PROGRESS':
            return {
                ...state,
                followingInProgress: action.isFetching
                    ? [...state.followingInProgress, action.userId]
                    : state.followingInProgress.filter(id => id !== action.userId)
            };

        default:
            return state;
    }
};


export const actions = {
    setUsers: (users: Array<ProfileType>) => ({type: 'SET_USERS', users} as const),
    setCurrentPage: (currentPage: number) => ({type: 'SET_CURRENT_PAGE', currentPage} as const),
    setUsersCount: (count: number) => ({type: 'SET_USERS_COUNT', count} as const),
    toggleIsFetching: (isFetching: boolean) => ({type: 'TOGGLE_IS_FETCHING', isFetching} as const),
    toggleFollowingProgress: (isFetching: boolean, userId: number) => ({
        type: 'TOGGLE_IS_FOLLOWING_PROGRESS',
        isFetching,
        userId
    } as const),
    setFollowedUsers: (followedUsers: Array<number>) => ({type: 'SET_FOLLOWED_USERS', followedUsers} as const),
}


export const getFollowedUsers = (): ThunkType =>
    async (dispatch) => {
        let data = await usersAPI.getFollowedUsers();
        if (data.resultCode === ResponseCodes.Success)
            dispatch(actions.setFollowedUsers(data.data));
    };

export const requestUsers = (page: number, pageSize: number): ThunkType =>
    async (dispatch) => {
        dispatch(actions.toggleIsFetching(true));
        dispatch(actions.setCurrentPage(page));
        let users = await usersAPI.getUsers(page, pageSize);
        let userCount = await usersAPI.getUsersCount();
        if (users.resultCode === ResponseCodes.Success && userCount.resultCode === ResponseCodes.Success) {
            dispatch(actions.toggleIsFetching(false));
            dispatch(actions.setUsers(users.data));
            dispatch(actions.setUsersCount(userCount.data));
        }
    };

const _followUnfollowFlow = async (dispatch: Dispatch<ActionsTypes>, userId: number, apiMethod: any) => {
    dispatch(actions.toggleFollowingProgress(true, userId));
    let data = await apiMethod(userId);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setFollowedUsers(data.data));
    dispatch(actions.toggleFollowingProgress(false, userId));
};

export const follow = (userId: number): ThunkType =>
    async (dispatch) => {
        _followUnfollowFlow(dispatch, userId, usersAPI.followUser.bind(usersAPI));
    };

export const unfollow = (userId: number): ThunkType =>
    async (dispatch) => {
        _followUnfollowFlow(dispatch, userId, usersAPI.unFollowUser.bind(usersAPI));
    };

export default usersReducer;

type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsTypes>;
