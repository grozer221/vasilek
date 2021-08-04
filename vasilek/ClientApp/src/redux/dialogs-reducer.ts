import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {dialogsAPI, DialogType, MessageType} from "../api/dialogs-api";
import {Dispatch} from "redux";
import {ProfileType} from "../types/types";

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
        case 'MESSAGE_RECEIVED':
            return {
                ...state,
                dialogs: state.dialogs.map((d) => d.id === action.dialogId
                    ? {
                        ...d,
                        messages: d.messages ? [...d.messages, action.message] : [action.message]
                    }
                    : d
                ).sort((prev: DialogType, next: DialogType) => next.dateChanged.toString().localeCompare(prev.dateChanged.toString()))
            };
        case 'ADD_USERS_TO_DIALOG':
            return {
                ...state,
                dialogs: state.dialogs.map(dialog =>
                    dialog.id === action.dialogId
                        ? {
                            ...dialog,
                            users: [...dialog.users, ...action.usersInDialog]
                        }
                        : dialog
                ).sort((prev: DialogType, next: DialogType) => next.dateChanged.toString().localeCompare(prev.dateChanged.toString()))
            };
        case 'REMOVE_DIALOG':
            return {
                ...state,
                dialogs: state.dialogs.filter(d => d.id !== action.dialogId)
            };
        case 'REMOVE_USER_FROM_DIALOG':
            return {
                ...state,
                dialogs: state.dialogs.map(dialog =>
                    dialog.id === action.dialogId
                        ? {
                            ...dialog,
                            users: dialog.users.filter(user => user.id !== action.userId)
                        }
                        : dialog
                )
            };
        case 'CHANGE_GROUP_NAME':
            return {
                ...state,
                dialogs: state.dialogs.map(dialog =>
                    dialog.id === action.dialogId
                        ? {
                            ...dialog,
                            dialogName: action.newGroupName
                        }
                        : dialog)
            };
        case 'TOGGLE_USER_ONLINE':
            return {
                ...state,
                dialogs: state.dialogs.map(dialog =>
                    dialog.users.filter(user => user.login === action.userLogin).length > 0
                        ? {
                            ...dialog,
                            users: dialog.users.map(user =>
                                user.login === action.userLogin
                                    ? {
                                        ...user,
                                        isOnline: action.online,
                                    }
                                    : user
                            )
                        }
                        : dialog
                )
            };
        case 'SET_DATE_LAST_ONLINE':
            return {
                ...state,
                dialogs: state.dialogs.map(dialog =>
                    dialog.users.filter(user => user.login === action.userLogin).length > 0
                        ? {
                            ...dialog,
                            users: dialog.users.map(user =>
                                user.login === action.userLogin
                                    ? {
                                        ...user,
                                        dateLastOnline: action.dateLastOnline,
                                    }
                                    : user
                            )
                        }
                        : dialog
                )
            };
        default:
            return state;
    }
};

export const actions = {
    setCurrentDialogId: (id: number | null) => ({
        type: 'SET_CURRENT_DIALOG_ID',
        id: id,
    } as const),
    dialogsReceived: (dialogs: DialogType[]) => ({
        type: 'DIALOGS_RECEIVED',
        dialogs: dialogs,
    } as const),
    dialogReceived: (dialog: DialogType) => ({
        type: 'DIALOG_RECEIVED',
        dialog: dialog,
    } as const),
    messageReceived: (dialogId: number, message: MessageType) => ({
        type: 'MESSAGE_RECEIVED',
        dialogId: dialogId,
        message: message,
    } as const),
    deleteDialog: (dialogId: number) => ({
        type: 'DELETE_DIALOG',
        dialogId: dialogId,
    } as const),
    addUsersToDialog: (dialogId: number, usersInDialog: ProfileType[]) => ({
        type: 'ADD_USERS_TO_DIALOG',
        dialogId: dialogId,
        usersInDialog: usersInDialog,
    } as const),
    removeDialog: (dialogId: number) => ({
        type: 'REMOVE_DIALOG',
        dialogId: dialogId,
    } as const),
    removeUserFromDialog: (dialogId: number, userId: number) => ({
        type: 'REMOVE_USER_FROM_DIALOG',
        dialogId: dialogId,
        userId: userId,
    } as const),
    changeGroupName: (dialogId: number, newGroupName: string) => ({
        type: 'CHANGE_GROUP_NAME',
        dialogId: dialogId,
        newGroupName: newGroupName,
    } as const),
    toggleUserOnline: (userLogin: string, online: boolean) => ({
        type: 'TOGGLE_USER_ONLINE',
        userLogin: userLogin,
        online: online,
    } as const),
    setDateLastOnline: (userLogin: string, dateLastOnline: Date) => ({
        type: 'SET_DATE_LAST_ONLINE',
        userLogin: userLogin,
        dateLastOnline: dateLastOnline,
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

let _addUsersToDialogDialogHandler: ((dialogId: number, usersInDialog: ProfileType[]) => void) | null = null
const addUsersToDialogHandlerCreator = (dispatch: Dispatch) => {
    if (_addUsersToDialogDialogHandler === null) {
        _addUsersToDialogDialogHandler = (dialogId, usersInDialog) => {
            dispatch(actions.addUsersToDialog(dialogId, usersInDialog));
        }
    }
    return _addUsersToDialogDialogHandler
}

let _removeDialogHandler: ((dialogId: number) => void) | null = null
const removeDialogHandlerCreator = (dispatch: Dispatch) => {
    if (_removeDialogHandler === null) {
        _removeDialogHandler = (dialogId) => {
            dispatch(actions.removeDialog(dialogId));
        }
    }
    return _removeDialogHandler
}

let _removeUserFromDialogHandler: ((dialogId: number, userId: number) => void) | null = null
const removeUserFromDialogHandlerCreator = (dispatch: Dispatch) => {
    if (_removeUserFromDialogHandler === null) {
        _removeUserFromDialogHandler = (dialogId, userId) => {
            dispatch(actions.removeUserFromDialog(dialogId, userId));
        }
    }
    return _removeUserFromDialogHandler
}

let _changeGroupNameHandler: ((dialogId: number, newGroupName: string) => void) | null = null
const changeGroupNameHandlerCreator = (dispatch: Dispatch) => {
    if (_changeGroupNameHandler === null) {
        _changeGroupNameHandler = (dialogId, newGroupName) => {
            dispatch(actions.changeGroupName(dialogId, newGroupName));
        }
    }
    return _changeGroupNameHandler
}

let _toggleUserOnlineHandler: ((userLogin: string, isOnline: boolean) => void) | null = null
const toggleUserOnlineHandlerCreator = (dispatch: Dispatch) => {
    if (_toggleUserOnlineHandler === null) {
        _toggleUserOnlineHandler = (userLogin, isOnline) => {
            dispatch(actions.toggleUserOnline(userLogin, isOnline));
        }
    }
    return _toggleUserOnlineHandler
}

let _setDateLastOnlineHandler: ((userLogin: string, dateLastOnline: Date) => void) | null = null
const setDateLastOnlineHandlerCreator = (dispatch: Dispatch) => {
    if (_setDateLastOnlineHandler === null) {
        _setDateLastOnlineHandler = (userLogin, dateLastOnline) => {
            dispatch(actions.setDateLastOnline(userLogin, dateLastOnline));
        }
    }
    return _setDateLastOnlineHandler
}

export const startDialogsListening = (): ThunkType => async (dispatch) => {
    dialogsAPI.start();
    dialogsAPI.subscribe('DIALOGS_RECEIVED', newDialogsHandlerCreator(dispatch));
    dialogsAPI.subscribe('DIALOG_RECEIVED', newDialogHandlerCreator(dispatch));
    dialogsAPI.subscribe('DIALOG_ID_RECEIVED', newDialogIdHandlerCreator(dispatch));
    dialogsAPI.subscribe('SET_CURRENT_DIALOG_ID', _setCurrentDialogIdHandlerCreator(dispatch));
    dialogsAPI.subscribe('MESSAGE_RECEIVED', newMessageHandlerCreator(dispatch));
    dialogsAPI.subscribe('DELETE_DIALOG', deleteDialogHandlerCreator(dispatch));
    dialogsAPI.subscribe('ADD_USER_TO_DIALOG', addUsersToDialogHandlerCreator(dispatch));
    dialogsAPI.subscribe('REMOVE_DIALOG', removeDialogHandlerCreator(dispatch));
    dialogsAPI.subscribe('REMOVE_USER_FROM_DIALOG', removeUserFromDialogHandlerCreator(dispatch));
    dialogsAPI.subscribe('CHANGE_GROUP_NAME', changeGroupNameHandlerCreator(dispatch));
    dialogsAPI.subscribe('TOGGLE_USER_ONLINE', toggleUserOnlineHandlerCreator(dispatch));
    dialogsAPI.subscribe('SET_DATE_LAST_ONLINE', setDateLastOnlineHandlerCreator(dispatch));
};

export const stopDialogsListening = (): ThunkType => async (dispatch) => {
    dialogsAPI.unsubscribe('DIALOGS_RECEIVED', newDialogsHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('DIALOG_RECEIVED', newDialogHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('DIALOG_ID_RECEIVED', newDialogIdHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('SET_CURRENT_DIALOG_ID', _setCurrentDialogIdHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('MESSAGE_RECEIVED', newMessageHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('DELETE_DIALOG', deleteDialogHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('ADD_USER_TO_DIALOG', addUsersToDialogHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('REMOVE_DIALOG', removeDialogHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('REMOVE_USER_FROM_DIALOG', removeUserFromDialogHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('CHANGE_GROUP_NAME', changeGroupNameHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('TOGGLE_USER_ONLINE', toggleUserOnlineHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('SET_DATE_LAST_ONLINE', setDateLastOnlineHandlerCreator(dispatch));
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

export const addUsersToDialog = (dialogId: number, usersId: number[]): ThunkType => async (dispatch) => {
    dialogsAPI.addUsersToDialog(dialogId, usersId);
};

export const deleteUsersFromDialog = (dialogId: number, userId: number): ThunkType => async (dispatch) => {
    dialogsAPI.deleteUserFromDialog(dialogId, userId);
};

export const changeGroupName = (dialogId: number, newGroupName: string): ThunkType => async (dispatch) => {
    dialogsAPI.changeGroupName(dialogId, newGroupName);
};

export default dialogsReducer;

type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsTypes>;