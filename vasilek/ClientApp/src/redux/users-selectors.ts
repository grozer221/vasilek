import { AppStateType } from './redux-store';

export const s_getUsers = (state: AppStateType) => {
  return state.usersPage.users;
}

export const s_getPageSize = (state: AppStateType) => {
  return state.usersPage.pageSize;
}

export const s_getUsersCount = (state: AppStateType) => {
  return state.usersPage.usersCount;
}

export const s_getCurrentPage = (state: AppStateType) => {
  return state.usersPage.currentPage;
}

export const s_getIsFetching = (state: AppStateType) => {
  return state.usersPage.isFetching;
}

export const s_getFollowingInProgress = (state: AppStateType) => {
  return state.usersPage.followingInProgress;
}

export const s_getFilter = (state: AppStateType) => {
    return state.usersPage.filter;
}



