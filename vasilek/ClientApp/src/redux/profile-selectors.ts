import { AppStateType } from './redux-store';

export const s_getProfile = (state: AppStateType) => {
  return state.profilePage.profile;
}

export const s_getStatus = (state: AppStateType) => {
  return state.profilePage.profile?.status;
}
