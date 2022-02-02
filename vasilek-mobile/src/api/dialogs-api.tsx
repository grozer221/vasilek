import {ProfileType, ResponseType} from '../types/types';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {instance} from './api';
import {ProfileForCallType} from '../redux/dialogs-reducer';
import {SignalData} from 'simple-peer';

let connection: HubConnection | null = null;

const subscribers = {
    'DIALOGS_RECEIVED': [] as DialogsReceivedSubscriberType[],
    'DIALOG_RECEIVED': [] as DialogReceivedSubscriberType[],
    'MESSAGE_RECEIVED': [] as MessageReceivedSubscriberType[],
    'DIALOG_ID_RECEIVED': [] as DialogIdReceivedSubscriberType[],
    'SET_CURRENT_DIALOG_ID': [] as SetCurrentDialogIdSubscriberType[],
    'DELETE_DIALOG': [] as DeleteDialogSubscriberType[],
    'DELETE_MESSAGE': [] as DeleteMessageSubscriberType[],
    'ADD_USER_TO_DIALOG': [] as AddUsersToDialogSubscriberType[],
    'REMOVE_DIALOG': [] as RemoveDialogSubscriberType[],
    'REMOVE_USER_FROM_DIALOG': [] as RemoveUserFromDialogSubscriberType[],
    'CHANGE_GROUP_NAME': [] as ChangeGroupNameSubscriberType[],
    'TOGGLE_USER_ONLINE': [] as ToggleUserOnlineSubscriberType[],
    'SET_DATE_LAST_ONLINE': [] as SetDateLastOnlineSubscriberType[],
    'RECEIVE_NOTIFICATION': [] as ReceiveNotificationSubscriberType[],
    'MAKE_MESSAGE_READ': [] as MakeMessageReadSubscriberType[],

    'RECEIVE_CALL': [] as ReceiveCallSubscriberType[],
    'RECEIVE_SIGNAL': [] as ReceiveSignalSubscriberType[],
    'SET_USERS_IN_CALL': [] as SetUsersInCallSubscriberType[],
    'CHANGE_CALL_STATUS_ON': [] as ChangeCallStatusOnSubscriberType[],
    'END_CALL': [] as EndCallSubscriberType[],
    'TOGGLE_VIDEO_IN_CALL': [] as ToggleVideoInCallSubscriberType[],
};

const createConnection = () => {
    connection = new HubConnectionBuilder()
        .withUrl('https://vasilek.herokuapp.com/socket/dialogs')
        .withAutomaticReconnect()
        .build();

    connection.start()
        .then(() => {
            connection?.on('ReceiveNotification', (message: MessageType) => {
                subscribers['RECEIVE_NOTIFICATION'].forEach(s => s(message));
            });

            connection?.on('ReceiveMessage', (dialogId: number, message: MessageType) => {
                subscribers['MESSAGE_RECEIVED'].forEach(s => s(dialogId, message));
            });

            connection?.on('ReceiveDialogs', (dialogs: DialogType[]) => {
                subscribers['DIALOGS_RECEIVED'].forEach(s => s(dialogs));
            });

            connection?.on('ReceiveDialog', (dialog: DialogType) => {
                subscribers['DIALOG_RECEIVED'].forEach(s => s(dialog));
            });

            connection?.on('ReceiveDialogId', (dialogId: number) => {
                subscribers['DIALOG_ID_RECEIVED'].forEach(s => s(dialogId));
            });

            connection?.on('SetCurrentDialogId', (dialogId: number) => {
                subscribers['SET_CURRENT_DIALOG_ID'].forEach(s => s(dialogId));
            });

            connection?.on('DeleteDialog', (dialogId: number) => {
                subscribers['DELETE_DIALOG'].forEach(s => s(dialogId));
            });

            connection?.on('DeleteMessage', (messageId: number) => {
                subscribers['DELETE_MESSAGE'].forEach(s => s(messageId));
            });

            connection?.on('AddUsersToDialog', (dialogId: number, usersInDialog: ProfileType[]) => {
                subscribers['ADD_USER_TO_DIALOG'].forEach(s => s(dialogId, usersInDialog));
            });

            connection?.on('RemoveDialog', (dialogId: number) => {
                subscribers['REMOVE_DIALOG'].forEach(s => s(dialogId));
            });

            connection?.on('RemoveUserFromDialog', (dialogId: number, userId: number) => {
                subscribers['REMOVE_USER_FROM_DIALOG'].forEach(s => s(dialogId, userId));
            });

            connection?.on('ChangeGroupName', (dialogId: number, newGroupName: string) => {
                subscribers['CHANGE_GROUP_NAME'].forEach(s => s(dialogId, newGroupName));
            });

            connection?.on('ToggleUserOnline', (userLogin: string, isOnline: boolean) => {
                subscribers['TOGGLE_USER_ONLINE'].forEach(s => s(userLogin, isOnline));
            });

            connection?.on('SetDateLastOnline', (userLogin: string, dateLastOnline: Date) => {
                subscribers['SET_DATE_LAST_ONLINE'].forEach(s => s(userLogin, dateLastOnline));
            });

            connection?.on('MakeMessageRead', (dialogId: number, messageId: number, userLogin: string) => {
                subscribers['MAKE_MESSAGE_READ'].forEach(s => s(dialogId, messageId, userLogin));
            });

            ///
            connection?.on('ReceiveCall', (dialogId: number) => {
                subscribers['RECEIVE_CALL'].forEach(s => s(dialogId));
            });
            connection?.on('ReceiveSignal', (signal: SignalData) => {
                subscribers['RECEIVE_SIGNAL'].forEach(s => s(signal));
            });
            connection?.on('SetUsersInCall', (users: ProfileForCallType[]) => {
                subscribers['SET_USERS_IN_CALL'].forEach(s => s(users));
            });
            connection?.on('ChangeCallStatusOn', (login: string, callStatus: string) => {
                subscribers['CHANGE_CALL_STATUS_ON'].forEach(s => s(login, callStatus));
            });
            connection?.on('EndCall', () => {
                subscribers['END_CALL'].forEach(s => s());
            });
            connection?.on('ToggleVideoInCall', (userId: number, isOnVideo: boolean) => {
                subscribers['TOGGLE_VIDEO_IN_CALL'].forEach(s => s(userId, isOnVideo));
            });
            ///
        });
};

export const dialogsAPI = {
    start() {
        createConnection();
    },
    subscribe(eventName: EventsNamesType, callback: CallbackType) {
        // @ts-ignore
        subscribers[eventName].push(callback);
        return () => {
            // @ts-ignore
            subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
        };
    },
    unsubscribe(eventName: EventsNamesType, callback: CallbackType) {
        // @ts-ignore
        subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
    },
    async sendMessage(dialogId: number, messageText: string, filesPinnedToMessage: File[]) {
        let files: FileType[] = [];
        for (const file of filesPinnedToMessage) {
            let extension = file.name.split('.').pop();
            let date = new Date().toString();
            date = date.replace(/ /g, '_').substring(0, 31);
            let newFileName = date + '_' + (Math.random() * (9999999999 - 1000000000) + 1000000000).toFixed(0) + '_' + file.name.replace(`.${extension}`, '') + '.' + extension;
            files.push({id: 0, name: newFileName, size: file.size, type: file.type, message: {} as MessageType});

            let formData = new FormData;
            formData.append('file', file, newFileName);
            await instance.post<ResponseType>('dialogs/file', formData, {
                headers: {'Content-Type': 'multipart-form-data'},
            });
        }
        connection?.send('SendMessage', dialogId, messageText, files);
    },
    getDialogByUserId(userId: number) {
        connection?.send('GetDialogByUserId', userId);
    },
    deleteDialog(dialogId: number) {
        connection?.send('DeleteDialog', dialogId);
    },
    deleteMessage(messageId: number) {
        connection?.send('DeleteMessage', messageId);
    },
    addUsersToDialog(dialogId: number, usersIds: number[]) {
        connection?.send('AddUsersToDialog', dialogId, usersIds);
    },
    deleteUserFromDialog(dialogId: number, userId: number) {
        connection?.send('RemoveUserFromDialog', dialogId, userId);
    },
    changeGroupName(dialogId: number, newGroupName: string) {
        connection?.send('ChangeGroupName', dialogId, newGroupName);
    },
    makeMessageRead(dialogId: number, messageId: number) {
        connection?.send('MakeMessageRead', dialogId, messageId);
    },
    ///
    callToDialog(dialogId: number, users: ProfileType[]) {
        connection?.send('CallToDialog', dialogId, users);
    },
    sendMySignal(dialogId: number, signal: SignalData) {
        connection?.send('SendMySignal', dialogId, signal);
    },
    acceptCall(dialogId: number) {
        connection?.send('AcceptCall', dialogId);
    },
    leaveCall(dialogId: number) {
        connection?.send('LeaveCall', dialogId);
    },
    endCall(dialogId: number) {
        connection?.send('EndCall', dialogId);
    },
    toggleVideoInCall(dialogId: number, userId: number, isOnVideo: boolean) {
        connection?.send('ToggleVideoInCall', dialogId, userId, isOnVideo);
    },
    ////
};

type DialogsReceivedSubscriberType = (dialogs: DialogType[]) => void
type DialogReceivedSubscriberType = (dialog: DialogType) => void
type DialogIdReceivedSubscriberType = (dialogId: number) => void
type SetCurrentDialogIdSubscriberType = (dialogId: number) => void
type MessageReceivedSubscriberType = (dialogId: number, message: MessageType) => void
type DeleteDialogSubscriberType = (dialogId: number) => void
type DeleteMessageSubscriberType = (messageId: number) => void
type AddUsersToDialogSubscriberType = (dialogId: number, usersInDialog: ProfileType[]) => void
type RemoveDialogSubscriberType = (dialogId: number) => void
type RemoveUserFromDialogSubscriberType = (dialogId: number, userId: number) => void
type ChangeGroupNameSubscriberType = (dialogId: number, newGroupName: string) => void
type ToggleUserOnlineSubscriberType = (userLogin: string, isOnline: boolean) => void
type SetDateLastOnlineSubscriberType = (userLogin: string, dateLastOnline: Date) => void
type ReceiveNotificationSubscriberType = (message: MessageType) => void
type MakeMessageReadSubscriberType = (dialogId: number, messageId: number, userLogin: string) => void

type ReceiveCallSubscriberType = (dialogId: number) => void
type ReceiveSignalSubscriberType = (signal: SignalData) => void
type SetUsersInCallSubscriberType = (user: ProfileForCallType[]) => void
type ChangeCallStatusOnSubscriberType = (login: string, callStatus: string) => void
type EndCallSubscriberType = () => void
type ToggleVideoInCallSubscriberType = (userId: number, isOnVideo: boolean) => void

type EventsNamesType =
    'DIALOGS_RECEIVED'
    | 'MESSAGE_RECEIVED'
    | 'DIALOG_RECEIVED'
    | 'DIALOG_ID_RECEIVED'
    | 'SET_CURRENT_DIALOG_ID'
    | 'DELETE_DIALOG'
    | 'DELETE_MESSAGE'
    | 'ADD_USER_TO_DIALOG'
    // | 'REMOVE_DIALOG'
    // | 'REMOVE_MESSAGE'
    | 'REMOVE_USER_FROM_DIALOG'
    | 'CHANGE_GROUP_NAME'
    | 'TOGGLE_USER_ONLINE'
    | 'SET_DATE_LAST_ONLINE'
    | 'RECEIVE_NOTIFICATION'
    | 'MAKE_MESSAGE_READ'

    | 'RECEIVE_CALL'
    | 'RECEIVE_SIGNAL'
    | 'SET_USERS_IN_CALL'
    | 'CHANGE_CALL_STATUS_ON'
    | 'END_CALL'
    | 'TOGGLE_VIDEO_IN_CALL'

type CallbackType =
    DialogsReceivedSubscriberType
    | MessageReceivedSubscriberType
    | DialogReceivedSubscriberType
    | DialogIdReceivedSubscriberType
    | SetCurrentDialogIdSubscriberType
    | DeleteDialogSubscriberType
    | DeleteMessageSubscriberType
    | AddUsersToDialogSubscriberType
    // | RemoveDialogSubscriberType
    | RemoveUserFromDialogSubscriberType
    | ChangeGroupNameSubscriberType
    | ToggleUserOnlineSubscriberType
    | SetDateLastOnlineSubscriberType
    | ReceiveNotificationSubscriberType
    | MakeMessageReadSubscriberType

    | ReceiveCallSubscriberType
    | ReceiveSignalSubscriberType
    | SetUsersInCallSubscriberType
    | ChangeCallStatusOnSubscriberType
    | EndCallSubscriberType
    | ToggleVideoInCallSubscriberType


export type DialogType = {
    id: number
    authorId: number
    dialogName: string
    dialogPhoto: string
    isDialogBetween2: boolean
    users: ProfileType[]
    messages: MessageType[]
    dateCreate: Date
    dateChanged: Date
}

export type MessageType = {
    id: number
    files: FileType[]
    messageText: string
    dateCreate: Date
    user: ProfileType
    usersUnReadMessage: ProfileType[]
}

export type FileType = {
    id: number,
    name: string,
    size: number,
    type: string,
    message: MessageType,
}
