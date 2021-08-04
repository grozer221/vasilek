import {ProfileType} from "../types/types";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {Avatar, message, notification} from "antd";
import React from "react";
import {urls} from "./api";
import userWithoutPhoto from "../assets/images/man.png";

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
}

const createConnection = () => {
    connection = new HubConnectionBuilder()
        .withUrl(window.location.protocol + '//' + window.location.host + '/socket/dialogs')
        .withAutomaticReconnect()
        .build();

    connection.start()
        .then(() => {
            message.success('Connected!')

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

            connection?.on('ReceiveNotification', (message: MessageType) => {
                if (message) {
                    notification.open({
                        message: message.user.nickName,
                        description: (
                            <div>
                                <div>{message.messageText}</div>
                                <div>
                                    <small>{message.dateCreate.toString().substr(11, 5)}</small>
                                </div>
                            </div>
                        ),
                        icon: <Avatar shape="square" size={32}
                                      src={message.user.avaPhoto ? urls.pathToUsersPhotos + message.user.avaPhoto : userWithoutPhoto}
                        />,
                        duration: 10,
                        placement: "topRight"
                    });
                }
            });

            connection?.on('ReceiveMessage', (dialogId: number, message: MessageType) => {
                if (message) {
                    subscribers['MESSAGE_RECEIVED'].forEach(s => s(dialogId, message))
                }
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
    sendMessage(dialogId: number, messageText: string) {
        connection?.send('SendMessage', dialogId, messageText);
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
    messageText: string
    dateCreate: Date
    user: ProfileType
}
