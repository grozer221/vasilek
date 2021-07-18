import {FormAction} from 'redux-form';
import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {chatApi, ResponseMessageType, StatusType} from "../api/chat-api";
import {Dispatch} from "redux";

let initialState = {
    messages: [] as ResponseMessageType[],
    status: 'pending' as StatusType,
};

const chatReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'MESSAGES_RECEIVED':
            return {
                ...state,
                messages: [...state.messages, ...action.payload.messages].filter((m, index, array) => index >= array.length - 50)
            };
        case 'STATUS_CHANGED':
            return {
                ...state,
                status: action.payload.status,
            };

        default:
            return state;
    }
};

export const actions = {
    messagesReceived: (messages: ResponseMessageType[]) => ({
        type: 'MESSAGES_RECEIVED',
        payload: {messages}
    } as const),
    statusChanged: (status: StatusType) => ({
        type: 'STATUS_CHANGED',
        payload: {status}
    } as const),
}

let _newMessageHandler: ((messages: ResponseMessageType[]) => void) | null = null
const newMessageHandlerCreator = (dispatch: Dispatch) => {
    if (_newMessageHandler === null) {
        _newMessageHandler = (messages) => {
            dispatch(actions.messagesReceived(messages));
        }
    }
    return _newMessageHandler
}

let _statusChangedHandler: ((status: StatusType) => void) | null = null
const statusChangedHandlerCreator = (dispatch: Dispatch) => {
    if (_statusChangedHandler === null) {
        _statusChangedHandler = (status) => {
            dispatch(actions.statusChanged(status));
        }
    }
    return _statusChangedHandler
}

export const startMessagesListening = (): ThunkType => async (dispatch) => {
    chatApi.start();
    chatApi.subscribe('MESSAGES_RECEIVED', newMessageHandlerCreator(dispatch))
    // @ts-ignore
    chatApi.subscribe('STATUS_CHANGED', statusChangedHandlerCreator(dispatch))
};

export const stopMessagesListening = (): ThunkType => async (dispatch) => {
    chatApi.unsubscribe('MESSAGES_RECEIVED', newMessageHandlerCreator(dispatch))
    // @ts-ignore
    chatApi.unsubscribe('STATUS_CHANGED', statusChangedHandlerCreator(dispatch))
};

export const sendMessage = (messageText: string): ThunkType => async (dispatch) => {
    chatApi.sendMessage(messageText);
};

export default chatReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType | FormAction>;

