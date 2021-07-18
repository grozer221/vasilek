import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {Avatar, message, notification} from "antd";
import {urls} from "./api";
import photo from "../assets/images/man.png";
import React from "react";

const subscribers = {
    'MESSAGES_RECEIVED': [] as MessagesReceivedSubscriberType[],
    'STATUS_CHANGED': [] as StatusChangedSubscriberType[],
}

let connection: HubConnection | null = null;

const createConnection = () => {
    connection = new HubConnectionBuilder()
        .withUrl(window.location.protocol + '//' + window.location.host + '/api/chat')
        .withAutomaticReconnect()
        .build();

    connection.start()
        .then(() => {
            message.success('Connected!')
            subscribers['STATUS_CHANGED'].forEach(s => s('ready'))

            connection?.on('ReceiveMessage', (messages: ResponseMessageType[]) => {
                subscribers['MESSAGES_RECEIVED'].forEach(s => s(messages))
            });

            connection?.on('ReceiveNotification', (messages: ResponseMessageType[]) => {
                const lastMessage = messages[messages.length - 1];
                if (lastMessage) {
                    notification.open({
                        message: lastMessage.userFirstName + ' ' + lastMessage.userLastName,
                        description: (
                            <div>
                                <div>{lastMessage.messageText}</div>
                                <div><small>{lastMessage.time}</small></div>
                            </div>),
                        icon: <Avatar shape="square" size={32} icon={<img
                            src={lastMessage.avaPhoto ? urls.pathToUsersPhotos + lastMessage.avaPhoto : photo}/>}/>,
                        duration: 10,
                        placement: "bottomRight"
                    });
                }
            });
        })
        .catch((e: any) => message.error('Connection failed: ', e));
}

export const chatApi = {
    start() {
        createConnection();
    },
    subscribe(eventName: EventsNamesType, callback: MessagesReceivedSubscriberType | StatusChangedSubscriberType) {
        // @ts-ignore
        subscribers[eventName].push(callback);
        return () => {
            // @ts-ignore
            subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
        }
    },
    unsubscribe(eventName: EventsNamesType, callback: MessagesReceivedSubscriberType | StatusChangedSubscriberType) {
        // @ts-ignore
        subscribers[eventName] = subscribers[eventName].filter(s => s !== callback);
    },
    sendMessage(messageText: string) {
        connection?.send('SendMessage', messageText);
    }
}

type MessagesReceivedSubscriberType = (messages: ResponseMessageType[]) => void
type StatusChangedSubscriberType = (status: StatusType) => void

export type ResponseMessageType = {
    id: number
    userId: number
    userFirstName: string
    userLastName: string
    avaPhoto: string
    messageText: string
    date: string
    time: string
}

type EventsNamesType = 'MESSAGES_RECEIVED' | 'STATUS_CHANGED'
export type StatusType = 'pending' | 'ready' | 'error';
