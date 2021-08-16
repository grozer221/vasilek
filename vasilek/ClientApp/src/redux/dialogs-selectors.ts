import {AppStateType} from './redux-store';

export const s_getDialogs = (state: AppStateType) => {
    return state.dialogsPage.dialogs;
}

export const s_getCurrentDialogId = (state: AppStateType) => {
    return state.dialogsPage.currentDialogId;
}

////

export const s_getReceivingCallFromDialogId = (state: AppStateType) => {
    return state.dialogsPage.receivingCallFromDialogId;
}

export const s_getIsInCall = (state: AppStateType) => {
    return state.dialogsPage.isInCall;
}

export const s_getInCallWithDialogId = (state: AppStateType) => {
    return state.dialogsPage.inCallWithDialogId;
}

export const s_getUsersInCall = (state: AppStateType) => {
    return state.dialogsPage.usersInCall;
}

export const s_getIsInitiator = (state: AppStateType) => {
    return state.dialogsPage.isInitiator;
}

export const s_getIsCallAccepted = (state: AppStateType) => {
    return state.dialogsPage.isCallAccepted;
}

export const s_getMyPeer = (state: AppStateType) => {
    return state.dialogsPage.myPeer;
}
export const s_getOtherPeer = (state: AppStateType) => {
    return state.dialogsPage.otherPeer;
}

export const s_getMySignal = (state: AppStateType) => {
    return state.dialogsPage.mySignal;
}
export const s_getOtherSignal = (state: AppStateType) => {
    return state.dialogsPage.otherSignal;
}

export const s_getMyStream = (state: AppStateType) => {
    return state.dialogsPage.myStream;
}
export const s_getOtherStream = (state: AppStateType) => {
    return state.dialogsPage.otherStream;
}

export const s_getIsOnAudio = (state: AppStateType) => {
    return state.dialogsPage.isOnAudio;
}
export const s_getIsOnVideo = (state: AppStateType) => {
    return state.dialogsPage.isOnVideo;
}
