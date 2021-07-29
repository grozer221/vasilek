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
}

type DialogsReceivedSubscriberType = (dialogs: DialogType[]) => void
type DialogReceivedSubscriberType = (dialog: DialogType) => void
type DialogIdReceivedSubscriberType = (dialogId: number) => void
type SetCurrentDialogIdSubscriberType = (dialogId: number) => void
type MessageReceivedSubscriberType = (dialogId: number, message: MessageType) => void
type DeleteDialogSubscriberType = (dialogId: number) => void

type EventsNamesType =
    'DIALOGS_RECEIVED'
    | 'MESSAGE_RECEIVED'
    | 'DIALOG_RECEIVED'
    | 'DIALOG_ID_RECEIVED'
    | 'SET_CURRENT_DIALOG_ID'
    | 'DELETE_DIALOG'

type CallbackType =
    DialogsReceivedSubscriberType
    | MessageReceivedSubscriberType
    | DialogReceivedSubscriberType
    | DialogIdReceivedSubscriberType
    | SetCurrentDialogIdSubscriberType
    | DeleteDialogSubscriberType


export type DialogType = {
    id: number
    authorId: number
    dialogName: string
    dialogPhoto: string
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
