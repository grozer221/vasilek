import {AppStateType} from './redux-store';

export const s_getDialogs = (state: AppStateType) => {
    return state.dialogsPage.dialogs;
}

export const s_getCurrentDialogId = (state: AppStateType) => {
    return state.dialogsPage.currentDialogId;
}
