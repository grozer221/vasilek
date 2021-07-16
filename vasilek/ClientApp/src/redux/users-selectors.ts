import { AppStateType } from './redux-store';

export const getUsers = (state: AppStateType) => {
  return state.usersPage.Users;
}

export const getPageSize = (state: AppStateType) => {
  return state.usersPage.PageSize;
}

export const getUsersCount = (state: AppStateType) => {
  return state.usersPage.UsersCount;
}

export const getCurrentPage = (state: AppStateType) => {
  return state.usersPage.CurrentPage;
}

export const getIsFetching = (state: AppStateType) => {
  return state.usersPage.IsFetching;
}

export const getFollowingInProgress = (state: AppStateType) => {
  return state.usersPage.FollowingInProgress;
}

export const getFollowedUsersSelector = (state: AppStateType) => {
    return state.usersPage.FollowedUsers;
}

export const getIsAuth = (state: AppStateType) => {
    return state.auth.IsAuth;
}

export const getFilter = (state: AppStateType) => {
    return state.usersPage.Filter;
}

export const getCurrentUser = (state: AppStateType) => {
    return state.auth.CurrentUser;
}

