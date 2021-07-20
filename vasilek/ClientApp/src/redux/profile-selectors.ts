import { AppStateType } from './redux-store';

export const s_getProfile = (state: AppStateType) => {
  return state.profilePage.Profile;
}

export const s_getStatus = (state: AppStateType) => {
  return state.profilePage.Status;
}
