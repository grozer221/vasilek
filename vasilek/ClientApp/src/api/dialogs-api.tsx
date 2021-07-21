import {ProfileType} from "../types/types";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {message} from "antd";
import React from "react";
import {instance, ResponseCodes} from "./api";

let connection: HubConnection | null = null;

const subscribers = {
    'DIALOGS_RECEIVED': [] as DialogsReceivedSubscriberType[],
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
                debugger
                subscribers['DIALOGS_RECEIVED'].forEach(s => s(dialogs))
            });

            // connection?.on('ReceiveNotification', (messages) => {
            //     const lastMessage = messages[messages.length - 1];
            //     if (lastMessage) {
            //         notification.open({
            //             message: lastMessage.userNickName,
            //             description: (
            //                 <div>
            //                     <div>{lastMessage.messageText}</div>
            //                     <div><small>{lastMessage.time}</small></div>
            //                 </div>),
            //             icon: <Avatar shape="square" size={32}
            //                           icon={<img
            //                               src={lastMessage.avaPhoto ? urls.pathToUsersPhotos + lastMessage.avaPhoto : userWithoutPhoto}/>}
            //             />,
            //             duration: 10,
            //             placement: "bottomRight"
            //         });
            //     }
            // });
        })
        .catch((e: any) => message.error('Connection failed: ', e));
}

export const dialogsAPI = {
    start() {
        createConnection();
    },
    subscribe(eventName: EventsNamesType, callback: DialogsReceivedSubscriberType) {
        // @ts-ignore
        subscribers[eventName].push(callback);
        return () => {
            // @ts-ignore
            subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
        }
    },
    unsubscribe(eventName: EventsNamesType, callback: DialogsReceivedSubscriberType) {
        // @ts-ignore
        subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
    },
    sendMessage(messageText: string) {
        connection?.send('SendMessage', messageText);
    },
    getCurrentDialogId(userId: number) {
        return instance.get<GetCurrentDialogId>(`dialogs?toid=` + userId)
            .then(res => res.data);
    },
}

type DialogsReceivedSubscriberType = (dialogs: DialogType[]) => void
type EventsNamesType = 'DIALOGS_RECEIVED'


export type DialogType = {
    Id: number
    AuthorId: number
    DialogName: string
    Users: ProfileType[]
    Messages: MessageType[]
    DateCreate: Date
}

export type MessageType = {
    Id: number
    MessageText: string
    DateCreate: Date
}

type GetCurrentDialogId = {
    ResultCode: ResponseCodes,
    Messages: Array<string>
    Data: number
}
