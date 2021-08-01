import {ResponseCodes} from '../api/api';
import {ProfileType} from '../types/types';
import {BaseThunkType, InferActionsTypes} from './redux-store';
import {usersAPI} from "../api/users-api";

const initialState = {
    users: [] as Array<ProfileType>,
    pageSize: 12,
    usersCount: 0,
    currentPage: 1,
    isFetching: false,
    term: '',
};


const usersReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case 'SET_USERS':
            return {
                ...state,
                users: [...action.users],
                usersCount: action.usersCount
            };
        case 'ADD_USERS':
            return {
                ...state,
                users: state.users.length > 0 ? [...state.users, ...action.users] : [...action.users],
                usersCount: action.usersCount
            };
        case 'SET_CURRENT_PAGE':
            return {...state, currentPage: action.currentPage};
        case 'TOGGLE_IS_FETCHING':
            return {...state, isFetching: action.isFetching};
        case 'SET_TERM' :
            return {...state, term: action.payload}

        default:
            return state;
    }
};


export const actions = {
    setUsers: (users: Array<ProfileType>, usersCount: number) => ({type: 'SET_USERS', users, usersCount} as const),
    addUsers: (users: Array<ProfileType>, usersCount: number) => ({type: 'ADD_USERS', users, usersCount} as const),
    setCurrentPage: (currentPage: number) => ({type: 'SET_CURRENT_PAGE', currentPage} as const),
    toggleIsFetching: (isFetching: boolean) => ({type: 'TOGGLE_IS_FETCHING', isFetching} as const),
    toggleFollowingProgress: (isFetching: boolean, userId: number) => ({
        type: 'TOGGLE_IS_FOLLOWING_PROGRESS',
        isFetching,
        userId
    } as const),
    toggleShowFriends: (showFriends: boolean) => ({type: 'TOGGLE_SHOW_FRIENDS', ShowFriends: showFriends} as const),
    setTerm: (term: string) => ({type: 'SET_TERM', payload: term} as const)
}

export const requestAndSetUsers = (page: number, pageSize: number, term: string): ThunkType =>
    async (dispatch) => {
        let data = await usersAPI.getUsers(page, pageSize, term);
        if (data.resultCode === ResponseCodes.Success) {
            dispatch(actions.setUsers(data.data.users, data.data.count));
        }
    };

export const requestAndAddUsers = (page: number, pageSize: number, term: string): ThunkType =>
    async (dispatch) => {
        let data = await usersAPI.getUsers(page, pageSize, term);
        if (data.resultCode === ResponseCodes.Success) {
            dispatch(actions.addUsers(data.data.users, data.data.count));
        }
    };

export default usersReducer;

type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsTypes>;
