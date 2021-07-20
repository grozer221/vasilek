import { AppStateType } from './redux-store';

export const s_getCurrentUserId = (state: AppStateType) => {
  return state.auth.CurrentUser?.Id;
}

export const s_getCurrentUser = (state: AppStateType) => {
  return state.auth.CurrentUser;
}

export const s_getIsAuth = (state: AppStateType) => {
  return state.auth.IsAuth;
}

