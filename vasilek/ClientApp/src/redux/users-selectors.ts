import { AppStateType } from './redux-store';

export const s_getUsers = (state: AppStateType) => {
  return state.usersPage.Users;
}

export const s_getPageSize = (state: AppStateType) => {
  return state.usersPage.PageSize;
}

export const s_getUsersCount = (state: AppStateType) => {
  return state.usersPage.UsersCount;
}

export const s_getCurrentPage = (state: AppStateType) => {
  return state.usersPage.CurrentPage;
}

export const s_getIsFetching = (state: AppStateType) => {
  return state.usersPage.IsFetching;
}

export const s_getFollowingInProgress = (state: AppStateType) => {
  return state.usersPage.FollowingInProgress;
}

export const s_getFilter = (state: AppStateType) => {
    return state.usersPage.Filter;
}



