import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {dialogsAPI, DialogType} from "../api/dialogs-api";
import {Dispatch} from "redux";
import {ProfileType} from "../types/types";
import {ResponseCodes} from "../api/api";
import {usersAPI} from "../api/users-api";

let initialState = {
    Dialogs: [] as Array<DialogType>,
    CurrentDialogId: null as number | null,
};

const dialogsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case 'SET_CURRENT_DIALOG_ID':
            return{
                ...state,
                CurrentDialogId: action.id
            };
        case 'DIALOGS_RECEIVED':
            return {
                ...state,
                Dialogs: action.dialogs
            };
        default:
            return state;
    }
};

export const actions = {
    setCurrentDialogId: (id: number) => ({
        type: 'SET_CURRENT_DIALOG_ID',
        id: id
    } as const),
    dialogsReceived: (dialogs: DialogType[]) => ({
        type: 'DIALOGS_RECEIVED',
        dialogs: dialogs
    } as const),
}

let _newDialogsHandler: ((dialogs: DialogType[]) => void) | null = null
const newDialogsHandlerCreator = (dispatch: Dispatch) => {
    if (_newDialogsHandler === null) {
        _newDialogsHandler = (dialogs) => {
            dispatch(actions.dialogsReceived(dialogs));
        }
    }
    return _newDialogsHandler
}

export const requestCurrentDialogId = (userId: number): ThunkType =>
    async (dispatch) => {
        let data = await dialogsAPI.getCurrentDialogId(userId);
        if (data.ResultCode === ResponseCodes.Success) {
            dispatch(actions.setCurrentDialogId(data.Data));
        }
    };

export const startDialogsListening = (): ThunkType => async (dispatch) => {
    dialogsAPI.start();
    dialogsAPI.subscribe('DIALOGS_RECEIVED', newDialogsHandlerCreator(dispatch));
};

export const stopDialogsListening = (): ThunkType => async (dispatch) => {
    dialogsAPI.unsubscribe('DIALOGS_RECEIVED', newDialogsHandlerCreator(dispatch));
};

export const sendMessage = (messageText: string): ThunkType => async (dispatch) => {
    dialogsAPI.sendMessage(messageText);
};

export default dialogsReducer;

type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsTypes>;