import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {profileAPI} from "../api/profile-api";
import {ResponseCodes} from "../api/api";
import {dialogsAPI} from "../api/dialogs-api";

let initialState = {
    currentDialogInfoId: null as number | null,
};


export const dialogInfoReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case 'SET_CURRENT_DIALOG_INFO_ID':
            return {
                ...state,
                currentDialogInfoId: action.id,
            };
        default:
            return state;
    }
};

export const actions = {
    setCurrentDialogInfoId: (id: number) => ({
        type: 'SET_CURRENT_DIALOG_INFO_ID',
        id: id,
    } as const),
}

export const addUsersToDialog = (dialogId: number, usersIds: number[]): ThunkType => async (dispatch) => {
    dialogsAPI.addUsersToDialog(dialogId, usersIds);
};

export type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>
type ThunkType = BaseThunkType<ActionsTypes>;
