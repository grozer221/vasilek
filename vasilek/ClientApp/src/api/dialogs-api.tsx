import {ProfileType, ResponseType} from "../types/types";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {message} from "antd";
import React from "react";
import {instance} from "./api";

let connection: HubConnection | null = null;

const subscribers = {
    'DIALOGS_RECEIVED': [] as DialogsReceivedSubscriberType[],
    'DIALOG_RECEIVED': [] as DialogReceivedSubscriberType[],
    'MESSAGE_RECEIVED': [] as MessageReceivedSubscriberType[],
    'DIALOG_ID_RECEIVED': [] as DialogIdReceivedSubscriberType[],
    'SET_CURRENT_DIALOG_ID': [] as SetCurrentDialogIdSubscriberType[],
    'DELETE_DIALOG': [] as DeleteDialogSubscriberType[],
    'ADD_USER_TO_DIALOG': [] as AddUsersToDialogSubscriberType[],
    'REMOVE_DIALOG': [] as RemoveDialogSubscriberType[],
    'REMOVE_USER_FROM_DIALOG': [] as RemoveUserFromDialogSubscriberType[],
    'CHANGE_GROUP_NAME': [] as ChangeGroupNameSubscriberType[],
    'TOGGLE_USER_ONLINE': [] as ToggleUserOnlineSubscriberType[],
    'SET_DATE_LAST_ONLINE': [] as SetDateLastOnlineSubscriberType[],
    'RECEIVE_NOTIFICATION': [] as ReceiveNotificationSubscriberType[],
    'MAKE_MESSAGE_READ': [] as MakeMessageReadSubscriberType[],
}

const createConnection = () => {
    connection = new HubConnectionBuilder()
        .withUrl(window.location.protocol + '//' + window.location.host + '/socket/dialogs')
        .withAutomaticReconnect()
        .build();

    connection.start()
        .then(() => {
            message.success('Connected!')

            connection?.on('ReceiveNotification', (message: MessageType) => {
                subscribers['RECEIVE_NOTIFICATION'].forEach(s => s(message))
            });

            connection?.on('ReceiveMessage', (dialogId: number, message: MessageType) => {
                subscribers['MESSAGE_RECEIVED'].forEach(s => s(dialogId, message))
            });

            connection?.on('ReceiveDialogs', (dialogs: DialogType[]) => {
                subscribers['DIALOGS_RECEIVED'].forEach(s => s(dialogs))
            });

            connection?.on('ReceiveDialog', (dialog: DialogType) => {
                subscribers['DIALOG_RECEIVED'].forEach(s => s(dialog))
            });

            connection?.on('ReceiveDialogId', (dialogId: number) => {
                subscribers['DIALOG_ID_RECEIVED'].forEach(s => s(dialogId))
            });

            connection?.on('SetCurrentDialogId', (dialogId: number) => {
                subscribers['SET_CURRENT_DIALOG_ID'].forEach(s => s(dialogId))
            });

            connection?.on('DeleteDialog', (dialogId: number) => {
                subscribers['DELETE_DIALOG'].forEach(s => s(dialogId))
            });

            connection?.on('AddUsersToDialog', (dialogId: number, usersInDialog: ProfileType[]) => {
                subscribers['ADD_USER_TO_DIALOG'].forEach(s => s(dialogId, usersInDialog))
            });

            connection?.on('RemoveDialog', (dialogId: number) => {
                subscribers['REMOVE_DIALOG'].forEach(s => s(dialogId))
            });

            connection?.on('RemoveUserFromDialog', (dialogId: number, userId: number) => {
                subscribers['REMOVE_USER_FROM_DIALOG'].forEach(s => s(dialogId, userId))
            });

            connection?.on('ChangeGroupName', (dialogId: number, newGroupName: string) => {
                subscribers['CHANGE_GROUP_NAME'].forEach(s => s(dialogId, newGroupName))
            });

            connection?.on('ToggleUserOnline', (userLogin: string, isOnline: boolean) => {
                subscribers['TOGGLE_USER_ONLINE'].forEach(s => s(userLogin, isOnline))
            });

            connection?.on('SetDateLastOnline', (userLogin: string, dateLastOnline: Date) => {
                subscribers['SET_DATE_LAST_ONLINE'].forEach(s => s(userLogin, dateLastOnline))
            });

            connection?.on('MakeMessageRead', (dialogId: number, messageId: number, userLogin: string) => {
                subscribers['MAKE_MESSAGE_READ'].forEach(s => s(dialogId, messageId, userLogin))
            });
        })
        .catch((e: any) => message.error('Connection failed: ', e));
}

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
        }
    },
    unsubscribe(eventName: EventsNamesType, callback: CallbackType) {
        // @ts-ignore
        subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
    },
    sendMessage(dialogId: number, messageText: string, filesPinnedToMessage: File[]) {
        let files: FileType[] = [];
        filesPinnedToMessage.forEach(file => {
            files.push({id: 0, name: file.name, size: file.size, type: file.type, message: {} as MessageType});
        });
        connection?.send('SendMessage', dialogId, messageText, files);
        filesPinnedToMessage.forEach((file) => {
            let formData = new FormData;
            formData.append("file", file);
            instance.post<ResponseType>('dialogs/file', formData, {
                headers: {'Content-Type': 'multipart-form-data'}
            })
                .then(res => res.data);
        })
    },
    getDialogByUserId(userId: number) {
        connection?.send('GetDialogByUserId', userId);
    },
    deleteDialog(dialogId: number) {
        connection?.send('DeleteDialog', dialogId);
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
}

type DialogsReceivedSubscriberType = (dialogs: DialogType[]) => void
type DialogReceivedSubscriberType = (dialog: DialogType) => void
type DialogIdReceivedSubscriberType = (dialogId: number) => void
type SetCurrentDialogIdSubscriberType = (dialogId: number) => void
type MessageReceivedSubscriberType = (dialogId: number, message: MessageType) => void
type DeleteDialogSubscriberType = (dialogId: number) => void
type AddUsersToDialogSubscriberType = (dialogId: number, usersInDialog: ProfileType[]) => void
type RemoveDialogSubscriberType = (dialogId: number) => void
type RemoveUserFromDialogSubscriberType = (dialogId: number, userId: number) => void
type ChangeGroupNameSubscriberType = (dialogId: number, newGroupName: string) => void
type ToggleUserOnlineSubscriberType = (userLogin: string, isOnline: boolean) => void
type SetDateLastOnlineSubscriberType = (userLogin: string, dateLastOnline: Date) => void
type ReceiveNotificationSubscriberType = (message: MessageType) => void
type MakeMessageReadSubscriberType = (dialogId: number, messageId: number, userLogin: string) => void

type EventsNamesType =
    'DIALOGS_RECEIVED'
    | 'MESSAGE_RECEIVED'
    | 'DIALOG_RECEIVED'
    | 'DIALOG_ID_RECEIVED'
    | 'SET_CURRENT_DIALOG_ID'
    | 'DELETE_DIALOG'
    | 'ADD_USER_TO_DIALOG'
    | 'REMOVE_DIALOG'
    | 'REMOVE_USER_FROM_DIALOG'
    | 'CHANGE_GROUP_NAME'
    | 'TOGGLE_USER_ONLINE'
    | 'SET_DATE_LAST_ONLINE'
    | 'RECEIVE_NOTIFICATION'
    | 'MAKE_MESSAGE_READ'

type CallbackType =
    DialogsReceivedSubscriberType
    | MessageReceivedSubscriberType
    | DialogReceivedSubscriberType
    | DialogIdReceivedSubscriberType
    | SetCurrentDialogIdSubscriberType
    | DeleteDialogSubscriberType
    | AddUsersToDialogSubscriberType
    | RemoveDialogSubscriberType
    | RemoveUserFromDialogSubscriberType
    | ChangeGroupNameSubscriberType
    | ToggleUserOnlineSubscriberType
    | SetDateLastOnlineSubscriberType
    | ReceiveNotificationSubscriberType
    | MakeMessageReadSubscriberType

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
