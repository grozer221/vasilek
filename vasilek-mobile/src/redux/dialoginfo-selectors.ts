import { AppStateType } from './redux-store';

export const s_getCurrentDialogInfoId = (state: AppStateType) => {
  return state.dialogInfo.currentDialogInfoId;
}


