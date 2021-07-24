import {ProfileType} from "../types/types";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {Avatar, message, notification} from "antd";
import React from "react";
import {instance, ResponseCodes, urls} from "./api";
import userWithoutPhoto from "../assets/images/man.png";

let connection: HubConnection | null = null;

const subscribers = {
    'DIALOGS_RECEIVED': [] as DialogsReceivedSubscriberType[],
    'MESSAGE_RECEIVED': [] as MessageReceivedSubscriberType[],
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
    subscribe(eventName: EventsNamesType, callback: DialogsReceivedSubscriberType | MessageReceivedSubscriberType) {
        // @ts-ignore
        subscribers[eventName].push(callback);
        return () => {
            // @ts-ignore
            subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
        }
    },
    unsubscribe(eventName: EventsNamesType, callback: DialogsReceivedSubscriberType | MessageReceivedSubscriberType) {
        // @ts-ignore
        subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
    },
    sendMessage(dialogId: number, messageText: string) {
        connection?.send('SendMessage', dialogId, messageText);
    },
    getCurrentDialogId(userId: number) {
        return instance.get<GetCurrentDialogId>(`dialogs?toid=` + userId)
            .then(res => res.data);
    },
}

type DialogsReceivedSubscriberType = (dialogs: DialogType[]) => void
type MessageReceivedSubscriberType = (dialogId: number, message: MessageType) => void
type EventsNamesType = 'DIALOGS_RECEIVED' | 'MESSAGE_RECEIVED'


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

type GetCurrentDialogId = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: number
}
