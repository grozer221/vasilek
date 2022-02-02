import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {dialogsAPI, DialogType, MessageType} from "../api/dialogs-api";
import {Dispatch} from "redux";
import {ProfileType} from "../types/types";
import {actions as appActions} from "./app-reducer";
import {Instance, SignalData} from "simple-peer";

let initialState = {
    dialogs: [] as Array<DialogType>,
    currentDialogId: null as number | null,
    ///
    isInCall: false,
    isInitiator: false,
    isCallAccepted: false,
    inCallWithDialogId: null as null | number,
    receivingCallFromDialogId: null as null | number,
    usersInCall: [] as ProfileForCallType[],

    myPeer: null as null | Instance,
    otherPeer: null as null | Instance,

    mySignal: null as null | SignalData,
    otherSignal: null as null | SignalData,

    myStream: null as null | MediaStream,
    otherStream: null as null | MediaStream,

    isOnAudio: true,
    isOnVideo: false
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
        case 'DELETE_MESSAGE':
            return {
                ...state,
                dialogs: state.dialogs.map(dialog => {
                    if(dialog.messages.some(message => message.id === action.messageId)){
                        dialog.messages = dialog.messages.filter(m => m.id !== action.messageId);
                        return dialog;
                    }
                    return dialog;
                })
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
        // case 'REMOVE_DIALOG':
        //     return {
        //         ...state,
        //         dialogs: state.dialogs.filter(d => d.id !== action.dialogId)
        //     };
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
        case 'MAKE_MESSAGE_READ':
            return {
                ...state,
                dialogs: state.dialogs.map(dialog =>
                    dialog.id === action.dialogId
                        ? {
                            ...dialog,
                            messages: dialog.messages.map(message =>
                                message.id === action.messageId
                                    ? {
                                        ...message,
                                        usersUnReadMessage: message.usersUnReadMessage.filter(user => user.login !== action.userLogin),
                                    }
                                    : message
                            )
                        }
                        : dialog
                )
            };
        case 'SET_RECEIVING_CALL_FROM_DIALOG_ID':
            return {
                ...state,
                receivingCallFromDialogId: action.dialogId,
            };
        case 'SET_IS_IN_CALL':
            return {
                ...state,
                isInCall: action.flag,
            };
        case 'SET_IN_CALL_WITH_DIALOG_ID':
            return {
                ...state,
                inCallWithDialogId: action.dialogId,
            };
        case 'SET_USERS_FOR_CALL':
            return {
                ...state,
                usersInCall: action.users,
            };

        case 'SET_MY_PEER':
            return {
                ...state,
                myPeer: action.peer,
            };
        case 'SET_OTHER_PEER':
            return {
                ...state,
                otherPeer: action.peer,
            };

        case 'SET_MY_SIGNAL':
            return {
                ...state,
                mySignal: action.signal,
            };
        case 'SET_OTHER_SIGNAL':
            return {
                ...state,
                otherSignal: action.signal,
            };

        case 'SET_MY_STREAM':
            return {
                ...state,
                myStream: action.stream,
            };
        case 'SET_OTHER_STREAM':
            return {
                ...state,
                otherStream: action.stream,
            };
        case 'SET_IS_INITIATOR':
            return {
                ...state,
                isInitiator: action.flag,
            };
        case 'SET_IS_CALL_ACCEPTED':
            return {
                ...state,
                isCallAccepted: action.flag,
            };
        case 'CHANGE_CALL_STATUS_ON':
            return {
                ...state,
                usersInCall: state.usersInCall.map(user =>
                    user.login === action.login
                        ? {...user, callStatus: action.callStatus} as ProfileForCallType
                        : user
                ),
            };
        case 'SET_IS_ON_AUDIO':
            return {
                ...state,
                isOnAudio: action.flag,
            };
        case 'SET_IS_ON_VIDEO':
            return {
                ...state,
                isOnVideo: action.flag,
            };
        case 'TOGGLE_VIDEO_IN_CALL':
            return {
                ...state,
                usersInCall: state.usersInCall.map(user =>
                    user.id === action.userId
                        ? {...user, isOnVideo: action.isOnVideo}
                        : user
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
    deleteMessage: (messageId: number) => ({
        type: 'DELETE_MESSAGE',
        messageId: messageId,
    } as const),
    addUsersToDialog: (dialogId: number, usersInDialog: ProfileType[]) => ({
        type: 'ADD_USERS_TO_DIALOG',
        dialogId: dialogId,
        usersInDialog: usersInDialog,
    } as const),
    // removeDialog: (dialogId: number) => ({
    //     type: 'REMOVE_DIALOG',
    //     dialogId: dialogId,
    // } as const),

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
    makeMessageRead: (dialogId: number, messageId: number, userLogin: string) => ({
        type: 'MAKE_MESSAGE_READ',
        dialogId: dialogId,
        messageId: messageId,
        userLogin: userLogin,
    } as const),
    ///
    setReceivingCallFromDialogId: (dialogId: number | null) => ({
        type: 'SET_RECEIVING_CALL_FROM_DIALOG_ID',
        dialogId: dialogId,
    } as const),
    setIsInCall: (flag: boolean) => ({
        type: 'SET_IS_IN_CALL',
        flag: flag,
    } as const),
    setInCallWithDialogId: (dialogId: number | null) => ({
        type: 'SET_IN_CALL_WITH_DIALOG_ID',
        dialogId: dialogId,
    } as const),
    setUsersInCall: (users: ProfileForCallType[]) => ({
        type: 'SET_USERS_FOR_CALL',
        users: users,
    } as const),
    setMyPeer: (peer: Instance | null) => ({
        type: 'SET_MY_PEER',
        peer: peer,
    } as const),
    setOtherPeer: (peer: Instance | null) => ({
        type: 'SET_OTHER_PEER',
        peer: peer,
    } as const),

    setMySignal: (signal: SignalData | null) => ({
        type: 'SET_MY_SIGNAL',
        signal: signal,
    } as const),
    setOtherSignal: (signal: SignalData | null) => ({
        type: 'SET_OTHER_SIGNAL',
        signal: signal,
    } as const),

    setMyStream: (stream: MediaStream | null) => ({
        type: 'SET_MY_STREAM',
        stream: stream,
    } as const),
    setOtherStream: (stream: MediaStream | null) => ({
        type: 'SET_OTHER_STREAM',
        stream: stream,
    } as const),
    setIsInitiator: (flag: boolean) => ({
        type: 'SET_IS_INITIATOR',
        flag: flag,
    } as const),
    setIsCallAccepted: (flag: boolean) => ({
        type: 'SET_IS_CALL_ACCEPTED',
        flag: flag,
    } as const),
    changeCallStatusOn: (login: string, callStatus: string) => ({
        type: 'CHANGE_CALL_STATUS_ON',
        login: login,
        callStatus: callStatus,
    } as const),
    setIsOnAudio: (flag: boolean) => ({
        type: 'SET_IS_ON_AUDIO',
        flag: flag,
    } as const),
    setIsOnVideo: (flag: boolean) => ({
        type: 'SET_IS_ON_VIDEO',
        flag: flag,
    } as const),
    toggleVideoInCall: (userId: number, isOnVideo: boolean) => ({
        type: 'TOGGLE_VIDEO_IN_CALL',
        userId: userId,
        isOnVideo: isOnVideo,
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

let _deleteMessageHandler: ((messageId: number) => void) | null = null
const deleteMessageHandlerCreator = (dispatch: Dispatch) => {
    if (_deleteMessageHandler === null) {
        _deleteMessageHandler = (messageId) => {
            dispatch(actions.deleteMessage(messageId));
        }
    }
    return _deleteMessageHandler
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

// let _removeDialogHandler: ((dialogId: number) => void) | null = null
// const removeDialogHandlerCreator = (dispatch: Dispatch) => {
//     if (_removeDialogHandler === null) {
//         _removeDialogHandler = (dialogId) => {
//             dispatch(actions.removeDialog(dialogId));
//         }
//     }
//     return _removeDialogHandler
// }



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

let _receiveNotificationHandler: ((message: MessageType) => void) | null = null
const receiveNotificationHandlerCreator = (dispatch: Dispatch) => {
    if (_receiveNotificationHandler === null) {
        _receiveNotificationHandler = (message) => {
            dispatch(appActions.setMessageReceived(message));
        }
    }
    return _receiveNotificationHandler
}

let _makeMessageReadHandler: ((dialogId: number, messageId: number, userLogin: string) => void) | null = null
const makeMessageReadHandlerCreator = (dispatch: Dispatch) => {
    if (_makeMessageReadHandler === null) {
        _makeMessageReadHandler = (dialogId, messageId, userLogin) => {
            dispatch(actions.makeMessageRead(dialogId, messageId, userLogin));
        }
    }
    return _makeMessageReadHandler
}

////
let _receiveCallHandler: ((dialogId: number) => void) | null = null
const receiveCallHandlerCreator = (dispatch: Dispatch) => {
    if (_receiveCallHandler === null) {
        _receiveCallHandler = (dialogId) => {
            dispatch(actions.setReceivingCallFromDialogId(dialogId))
        }
    }
    return _receiveCallHandler
}

let _receiveSignalHandler: ((signal: SignalData) => void) | null = null
const receiveSignalHandlerCreator = (dispatch: Dispatch) => {
    if (_receiveSignalHandler === null) {
        _receiveSignalHandler = (signal) => {
            dispatch(actions.setOtherSignal(signal))
        }
    }
    return _receiveSignalHandler
}

let _setUsersInCallHandler: ((users: ProfileForCallType[]) => void) | null = null
const setUsersInCallHandlerCreator = (dispatch: Dispatch) => {
    if (_setUsersInCallHandler === null) {
        _setUsersInCallHandler = (users) => {
            dispatch(actions.setUsersInCall(users));
        }
    }
    return _setUsersInCallHandler
}

let _changeCallStatusOnHandler: ((login: string, callStatus: string) => void) | null = null
const changeCallStatusOnHandlerCreator = (dispatch: Dispatch) => {
    if (_changeCallStatusOnHandler === null) {
        _changeCallStatusOnHandler = (login, callStatus) => {
            dispatch(actions.changeCallStatusOn(login, callStatus));
        }
    }
    return _changeCallStatusOnHandler
}

let _endCallHandler: (() => void) | null = null
const endCallHandlerCreator = (dispatch: Dispatch) => {
    if (_endCallHandler === null) {
        _endCallHandler = () => {
            dispatch(actions.setIsInCall(false));
            dispatch(actions.setIsInitiator(false));
            dispatch(actions.setIsCallAccepted(false));
            dispatch(actions.setInCallWithDialogId(null));
            dispatch(actions.setReceivingCallFromDialogId(null));
            dispatch(actions.setUsersInCall([]));
            dispatch(actions.setMyPeer(null));
            dispatch(actions.setOtherPeer(null));
            dispatch(actions.setMySignal(null));
            dispatch(actions.setOtherSignal(null));
            dispatch(actions.setMyStream(null));
            dispatch(actions.setOtherStream(null));
        }
    }
    return _endCallHandler
}

let _toggleVideoInCallHandler: ((userId: number, isOnVideo: boolean) => void) | null = null
const toggleVideoInCallHandlerCreator = (dispatch: Dispatch) => {
    if (_toggleVideoInCallHandler === null) {
        _toggleVideoInCallHandler = (userId, isOnVideo) => {
            dispatch(actions.toggleVideoInCall(userId, isOnVideo))
        }
    }
    return _toggleVideoInCallHandler
}
///

export const startDialogsListening = (): ThunkType => async (dispatch) => {
    dialogsAPI.start();
    dialogsAPI.subscribe('DIALOGS_RECEIVED', newDialogsHandlerCreator(dispatch));
    dialogsAPI.subscribe('DIALOG_RECEIVED', newDialogHandlerCreator(dispatch));
    dialogsAPI.subscribe('DIALOG_ID_RECEIVED', newDialogIdHandlerCreator(dispatch));
    dialogsAPI.subscribe('SET_CURRENT_DIALOG_ID', _setCurrentDialogIdHandlerCreator(dispatch));
    dialogsAPI.subscribe('MESSAGE_RECEIVED', newMessageHandlerCreator(dispatch));
    dialogsAPI.subscribe('DELETE_DIALOG', deleteDialogHandlerCreator(dispatch));
    dialogsAPI.subscribe('DELETE_MESSAGE', deleteMessageHandlerCreator(dispatch));
    dialogsAPI.subscribe('ADD_USER_TO_DIALOG', addUsersToDialogHandlerCreator(dispatch));
    // dialogsAPI.subscribe('REMOVE_DIALOG', removeDialogHandlerCreator(dispatch));
    // dialogsAPI.subscribe('REMOVE_MESSAGE', removeMessageHandlerCreator(dispatch));
    dialogsAPI.subscribe('REMOVE_USER_FROM_DIALOG', removeUserFromDialogHandlerCreator(dispatch));
    dialogsAPI.subscribe('CHANGE_GROUP_NAME', changeGroupNameHandlerCreator(dispatch));
    dialogsAPI.subscribe('TOGGLE_USER_ONLINE', toggleUserOnlineHandlerCreator(dispatch));
    dialogsAPI.subscribe('SET_DATE_LAST_ONLINE', setDateLastOnlineHandlerCreator(dispatch));
    dialogsAPI.subscribe('RECEIVE_NOTIFICATION', receiveNotificationHandlerCreator(dispatch));
    dialogsAPI.subscribe('MAKE_MESSAGE_READ', makeMessageReadHandlerCreator(dispatch));
    ///
    dialogsAPI.subscribe('RECEIVE_CALL', receiveCallHandlerCreator(dispatch));
    dialogsAPI.subscribe('RECEIVE_SIGNAL', receiveSignalHandlerCreator(dispatch));
    dialogsAPI.subscribe('SET_USERS_IN_CALL', setUsersInCallHandlerCreator(dispatch));
    dialogsAPI.subscribe('CHANGE_CALL_STATUS_ON', changeCallStatusOnHandlerCreator(dispatch));
    dialogsAPI.subscribe('END_CALL', endCallHandlerCreator(dispatch));
    dialogsAPI.subscribe('TOGGLE_VIDEO_IN_CALL', toggleVideoInCallHandlerCreator(dispatch));
};

export const stopDialogsListening = (): ThunkType => async (dispatch) => {
    dialogsAPI.unsubscribe('DIALOGS_RECEIVED', newDialogsHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('DIALOG_RECEIVED', newDialogHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('DIALOG_ID_RECEIVED', newDialogIdHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('SET_CURRENT_DIALOG_ID', _setCurrentDialogIdHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('MESSAGE_RECEIVED', newMessageHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('DELETE_DIALOG', deleteDialogHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('ADD_USER_TO_DIALOG', addUsersToDialogHandlerCreator(dispatch));
    // dialogsAPI.unsubscribe('DELETE_MESSAGE', removeDialogHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('REMOVE_USER_FROM_DIALOG', removeUserFromDialogHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('CHANGE_GROUP_NAME', changeGroupNameHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('TOGGLE_USER_ONLINE', toggleUserOnlineHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('SET_DATE_LAST_ONLINE', setDateLastOnlineHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('RECEIVE_NOTIFICATION', receiveNotificationHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('MAKE_MESSAGE_READ', makeMessageReadHandlerCreator(dispatch));
    ///
    dialogsAPI.unsubscribe('RECEIVE_CALL', receiveCallHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('RECEIVE_SIGNAL', receiveSignalHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('SET_USERS_IN_CALL', setUsersInCallHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('CHANGE_CALL_STATUS_ON', changeCallStatusOnHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('END_CALL', endCallHandlerCreator(dispatch));
    dialogsAPI.unsubscribe('TOGGLE_VIDEO_IN_CALL', toggleVideoInCallHandlerCreator(dispatch));
};

export const sendMessage = (dialogId: number, messageText: string, files: File[]): ThunkType => async (dispatch) => {
    await dialogsAPI.sendMessage(dialogId, messageText, files);
};

export const getDialogByUserId = (userId: number): ThunkType => async (dispatch) => {
    dialogsAPI.getDialogByUserId(userId);
};

export const deleteDialog = (dialogId: number): ThunkType => async (dispatch) => {
    dialogsAPI.deleteDialog(dialogId);
    dispatch(actions.setCurrentDialogId(null));
};

export const deleteMessage = (messageId: number): ThunkType => async (dispatch) => {
    dialogsAPI.deleteMessage(messageId);
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

export const makeMessageRead = (dialogId: number, messageId: number): ThunkType => async (dispatch) => {
    dialogsAPI.makeMessageRead(dialogId, messageId);
};

///
export const callToDialog = (dialogId: number, users: ProfileType[]): ThunkType => async (dispatch) => {
    dialogsAPI.callToDialog(dialogId, users);
};

export const sendMySignal = (dialogId: number, signal: SignalData): ThunkType => async (dispatch) => {
    dialogsAPI.sendMySignal(dialogId, signal);
};

export const acceptCall = (dialogId: number): ThunkType => async (dispatch) => {
    dialogsAPI.acceptCall(dialogId);
};

export const leaveCall = (dialogId: number): ThunkType => async (dispatch) => {
    dialogsAPI.leaveCall(dialogId);
};

export const endCall = (dialogId: number): ThunkType => async (dispatch) => {
    dialogsAPI.endCall(dialogId);
};

export const toggleVideoInCall = (dialogId: number, userId: number, isOnVideo: boolean): ThunkType => async (dispatch) => {
    dialogsAPI.toggleVideoInCall(dialogId, userId, isOnVideo);
};
////

export default dialogsReducer;

type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsTypes>;

export interface ProfileForCallType extends ProfileType {
    callStatus: 'pending' | 'accepted' | 'declined',
    isOnVideo: boolean,
    isOnAudio: boolean,
}
