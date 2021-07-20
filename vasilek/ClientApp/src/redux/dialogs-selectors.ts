import { AppStateType } from './redux-store';

export const s_getDialogs = (state: AppStateType) => {
  return state.dialogsPage.Dialogs;
}

export const s_getMessages = (state: AppStateType) => {
  return state.dialogsPage.Messages;
}
