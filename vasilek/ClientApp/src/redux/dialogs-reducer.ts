import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {dialogsAPI, DialogType, MessageType} from "../api/dialogs-api";
import {Dispatch} from "redux";

let initialState = {
    dialogs: [] as Array<DialogType>,
    currentDialogId: null as number | null,
};

const dialogsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case 'SET_CURRENT_DIALOG_ID':
            return {
                ...state,
                currentDialogId: action.id
            };
        case 'DIALOGS_RECEIVED':
            return {
                ...state,
                dialogs: action.dialogs.sort((prev: DialogType, next: DialogType) => next.dateChanged.toString().localeCompare(prev.dateChanged.toString()))
            };
        case 'DIALOG_RECEIVED':
            return {
                ...state,
                dialogs: [action.dialog, ...state.dialogs]
            };
        case 'DELETE_DIALOG':
            return {
                ...state,
                dialogs: state.dialogs.filter(d => d.id !== action.dialogId)
            };
        case
        'MESSAGE_RECEIVED':
            return {
                ...state,
                dialogs: state.dialogs.map((d) => d.id === action.dialogId
                    ? {
                        ...d,
                        messages: d.messages ? [...d.messages, action.message] : [action.message]
                    }
                    : d).sort((prev: DialogType, next: DialogType) => next.dateChanged.toString().localeCompare(prev.dateChanged.toString()))
            };
        default:
            return state;
    }
};

export const actions = {
    setCurrentDialogId: (id: number | null) => ({
        type: 'SET_CURRENT_DIALOG_ID',
        id: id
    } as const),
    dialogsReceived: (dialogs: DialogType[]) => ({
        type: 'DIALOGS_RECEIVED',
        dialogs: dialogs
    } as const),
    dialogReceived: (dialog: DialogType) => ({
        type: 'DIALOG_RECEIVED',
        dialog: dialog
    } as const),
    messageReceived: (dialogId: number, message: MessageType) => ({
        type: 'MESSAGE_RECEIVED',
        dialogId: dialogId,
        message: message
    } as const),
    deleteDialog: (dialogId: number) => ({
        type: 'DELETE_DIALOG',
        dialogId: dialogId,
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

let _newDialogHandler: ((dialog: DialogType) => void) | null = null
const newDialogHandlerCreator = (dispatch: Dispatch) => {
    if (_newDialogHandler === null) {
        _newDialogHandler = (dialog) => {
            dispatch(actions.dialogReceived(dialog));
        }
    }
    return _newDialogHandler
}

let _setCurrentDialogIdHandler: ((dialogId: number) => void) | null = null
const _setCurrentDialogIdHandlerCreator = (dispatch: Dispatch) => {
    if (_setCurrentDialogIdHandler === null) {
        _setCurrentDialogIdHandler = (dialogId) => {
            dispatch(actions.setCurrentDialogId(dialogId));
        }
    }
    return _setCurrentDialogIdHandler
}

let _newDialogIdHandler: ((dialogId: number) => void) | null = null
const newDialogIdHandlerCreator = (dispatch: Dispatch) => {
    if (_newDialogIdHandler === null) {
        _newDialogIdHandler = (dialogId) => {
            dispatch(actions.setCurrentDialogId(dialogId));
        }
    }
    return _newDialogIdHandler
}

let _newMessageHandler: ((dialogId: number, message: MessageType) => void) | null = null
const newMessageHandlerCreator = (dispatch: Dispatch) => {
    if (_newMessageHandler === null) {
        _newMessageHandler = (dialogId, message) => {
            dispatch(actions.messageReceived(dialogId, message));
        }
    }
    return _newMessageHandler
}

let _deleteDialogHandler: ((dialogId: number) => void) | null = null
const deleteDialogHandlerCreator = (dispatch: Dispatch) => {
    if (_deleteDialogHandler === null) {
        _deleteDialogHandler = (dialogId) => {
            dispatch(actions.deleteDialog(dialogId));
        }
    }
    return _deleteDialogHandler
}

export const startDialogsListening = (): ThunkType => async (dispatch) => {
    dialogsAPI.start();
    dialogsAPI.subscribe('DIALOGS_RECEIVED', newDialogsHandlerCreator(dispatch));
    dialogsAPI.subscribe('DIALOG_RECEIVED', newDialogHandlerCreator(dispatch));
    dialogsAPI.subscribe('DIALOG_ID_RECEIVED', newDialogIdHandlerCreator(dispatch));
    dialogsAPI.subscribe('SET_CURRENT_DIALOG_ID', _setCurrentDialogIdHandlerCreator(dispatch));
    dialogsAPI.subscribe('MESSAGE_RECEIVED', newMessageHandlerCreator(dispatch));
    dialogsAPI.subscribe('DELETE_DIALOG', deleteDialogHandlerCreator(dispatch));
};

export const stopDialogsListening = (): ThunkType => async (dispatch) => {
    dialogsAPI.unsubscribe('DIALOGS_RECEIVED', newDialogsHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('DIALOG_RECEIVED', newDialogHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('DIALOG_ID_RECEIVED', newDialogIdHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('SET_CURRENT_DIALOG_ID', _setCurrentDialogIdHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('MESSAGE_RECEIVED', newMessageHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('DELETE_DIALOG', deleteDialogHandlerCreator(dispatch));
};

export const sendMessage = (dialogId: number, messageText: string): ThunkType => async (dispatch) => {
    dialogsAPI.sendMessage(dialogId, messageText);
};

export const getDialogByUserId = (userId: number): ThunkType => async (dispatch) => {
    dialogsAPI.getDialogByUserId(userId);
};

export const deleteDialog = (dialogId: number): ThunkType => async (dispatch) => {
    dialogsAPI.deleteDialog(dialogId);
    dispatch(actions.setCurrentDialogId(null));
};

export default dialogsReducer;

type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsTypes>;