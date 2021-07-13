import {ResponseCodes, usersAPI} from '../api/api';
import { ProfileType } from '../types/types';
import { AppStateType } from './redux-store';
import { Dispatch } from 'react';
import { ThunkAction } from 'redux-thunk';

const SET_USERS = 'SET_USERS';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const SET_USERS_COUNT = 'SET_USERS_COUNT';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_FOLLOWING_PROGRESS = 'TOGGLE_IS_FOLLOWING_PROGRESS';
const SET_FOLLOWED_USERS = 'SET_FOLLOWED_USERS';

const initialState = {
  users: [] as Array<ProfileType>,
  pageSize: 5,
  usersCount: 0,
  currentPage: 1,
  isFetching: false,
  followingInProgress: [] as Array<number>,
  followedUsers: [] as Array<number>
};

type InitialStateType = typeof initialState;

const usersReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
  switch (action.type) {
    case SET_FOLLOWED_USERS:
      return { ...state, followedUsers: action.followedUsers };
    case SET_USERS:
      return { ...state, users: action.users };
    case SET_CURRENT_PAGE:
      return { ...state, currentPage: action.currentPage };
    case SET_USERS_COUNT:
      return { ...state, usersCount: action.count };
    case TOGGLE_IS_FETCHING:
      return { ...state, isFetching: action.isFetching };
    case TOGGLE_IS_FOLLOWING_PROGRESS:
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

type ActionsTypes = SetUsersType | SetCurrentPageType | SetUsersCountType
     | ToggleIsFetchingType | ToggleFollowingProgressType | SetFollowedUsersType

type SetUsersType = {
  type: typeof SET_USERS
  users: Array<ProfileType>
}
export const setUsers = (users: Array<ProfileType>): SetUsersType => ({ type: SET_USERS, users });
type SetCurrentPageType = {
  type: typeof SET_CURRENT_PAGE
  currentPage: number
}
export const setCurrentPage = (currentPage: number): SetCurrentPageType => ({ type: SET_CURRENT_PAGE, currentPage });
type SetUsersCountType = {
  type: typeof SET_USERS_COUNT
  count: number
}
export const setUsersCount = (count: number): SetUsersCountType => ({ type: SET_USERS_COUNT, count });
type ToggleIsFetchingType = {
  type: typeof TOGGLE_IS_FETCHING
  isFetching: boolean
}
export const toggleIsFetching = (isFetching: boolean): ToggleIsFetchingType => ({
  type: TOGGLE_IS_FETCHING,
  isFetching
});
type ToggleFollowingProgressType = {
  type: typeof TOGGLE_IS_FOLLOWING_PROGRESS
  isFetching: boolean
  userId: number
}
export const toggleFollowingProgress = (isFetching: boolean, userId: number): ToggleFollowingProgressType => ({
  type: TOGGLE_IS_FOLLOWING_PROGRESS,
  isFetching,
  userId
});
type SetFollowedUsersType = {
    type: typeof SET_FOLLOWED_USERS
    followedUsers: Array<number>
}
export const setFollowedUsers = (followedUsers: Array<number>): SetFollowedUsersType => ({
    type: SET_FOLLOWED_USERS,
    followedUsers: followedUsers
});

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>;

export const getFollowedUsers = (): ThunkType =>
    async (dispatch) => {
        let data = await usersAPI.getFollowedUsers();
        if(data.resultCode === ResponseCodes.Success)
            dispatch(setFollowedUsers(data.data));
    };

export const requestUsers = (page: number, pageSize: number): ThunkType =>
  async (dispatch) => {
    dispatch(toggleIsFetching(true));
    dispatch(setCurrentPage(page));
    let users = await usersAPI.getUsers(page, pageSize);
    let userCount = await usersAPI.getUsersCount();
    if(users.resultCode === ResponseCodes.Success && userCount.resultCode === ResponseCodes.Success)
    {
        dispatch(toggleIsFetching(false));
        dispatch(setUsers(users.data));
        dispatch(setUsersCount(userCount.data));
    }
  };

const _followUnfollowFlow = async (dispatch: Dispatch<ActionsTypes>, userId: number, apiMethod: any) => {
  dispatch(toggleFollowingProgress(true, userId));
  let data = await apiMethod(userId);
  if (data.resultCode === ResponseCodes.Success)
      dispatch(setFollowedUsers(data.data));
  dispatch(toggleFollowingProgress(false, userId));
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