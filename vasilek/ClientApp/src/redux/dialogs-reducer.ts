import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {dialogsAPI, DialogType, MessageType} from "../api/dialogs-api";
import {Dispatch} from "redux";
import {ResponseCodes} from "../api/api";

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
        case 'MESSAGE_RECEIVED':
            return {
                ...state,
                dialogs: state.dialogs.map((d) => d.id === action.dialogId
                    ? {
                        ...d,
                        messages: [...d.messages, action.message]
                    }
                    : d).sort((prev: DialogType, next: DialogType) => next.dateChanged.toString().localeCompare(prev.dateChanged.toString()))
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
    messageReceived: (dialogId: number, message: MessageType) => ({
        type: 'MESSAGE_RECEIVED',
        dialogId: dialogId,
        message: message
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

let _newMessageHandler: ((dialogId: number, message: MessageType) => void) | null = null
const newMessageHandlerCreator = (dispatch: Dispatch) => {
    if (_newMessageHandler === null) {
        _newMessageHandler = (dialogId, message) => {
            dispatch(actions.messageReceived(dialogId, message));
        }
    }
    return _newMessageHandler
}

export const requestCurrentDialogId = (userId: number): ThunkType =>
    async (dispatch) => {
        let data = await dialogsAPI.getCurrentDialogId(userId);
        if (data.resultCode === ResponseCodes.Success) {
            dispatch(actions.setCurrentDialogId(data.data))
        }
    };

export const startDialogsListening = (): ThunkType => async (dispatch) => {
    dialogsAPI.start();
    dialogsAPI.subscribe('DIALOGS_RECEIVED', newDialogsHandlerCreator(dispatch));
    dialogsAPI.subscribe('MESSAGE_RECEIVED', newMessageHandlerCreator(dispatch));
};

export const stopDialogsListening = (): ThunkType => async (dispatch) => {
    dialogsAPI.unsubscribe('DIALOGS_RECEIVED', newDialogsHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('MESSAGE_RECEIVED', newMessageHandlerCreator(dispatch));
};

export const sendMessage = (dialogId: number, messageText: string): ThunkType => async (dispatch) => {
    dialogsAPI.sendMessage(dialogId, messageText);
};

export default dialogsReducer;

type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsTypes>;