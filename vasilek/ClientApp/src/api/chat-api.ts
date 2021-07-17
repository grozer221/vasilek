import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {message} from "antd";

let subscribers = [] as SubscriberType[]

let connection: HubConnection | null = null;

const createConnection = () => {
    connection = new HubConnectionBuilder()
        .withUrl(window.location.protocol + '//' + window.location.host + '/api/chat')
        .withAutomaticReconnect()
        .build();

    connection.start()
        .then(() => {
            message.success('Connected!')

            connection?.on('ReceiveMessage', (message: ResponseMessageType[]) => {
                subscribers.forEach(s => s(message))
            });
        })
        .catch((e: any) => message.error('Connection failed: ', e));
}

export const chatApi = {
    start() {
        createConnection();
    },
    subscribe(callback: SubscriberType) {
        subscribers.push(callback);
        return () => {
            subscribers = subscribers.filter(s => s !== callback);
        }
    },
    unsubscribe(callback: SubscriberType) {
        subscribers = subscribers.filter(s => s !== callback);
    },
    sendMessage(messageText: string) {
        connection?.send('SendMessage', messageText);
    }
}

type SubscriberType = (messages: ResponseMessageType[]) => void

export type ResponseMessageType = {
    userId: number
    userFirstName: string
    userLastName: string
    avaPhoto: string
    messageText: string
}