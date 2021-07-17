import {FormAction, stopSubmit} from 'redux-form';
import {ResponseCodes} from '../api/api';
import {authAPI} from "../api/auth-api";
import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {ProfileType} from "../types/types";
import {chatApi, ResponseMessageType} from "../api/chat-api";
import {Dispatch} from "redux";

let initialState = {
    messages: [] as ResponseMessageType[],
};

const chatReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'MESSAGES_RECEIVED':
            return {
                ...state,
                messages: [...state.messages, ...action.payload.messages],
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

export const startMessagesListening = (): ThunkType => async (dispatch) => {
    chatApi.start();
    chatApi.subscribe(newMessageHandlerCreator(dispatch))
};

export const stopMessagesListening = (): ThunkType => async (dispatch) => {
    chatApi.subscribe(newMessageHandlerCreator(dispatch))
};

export const sendMessage = (messageText: string): ThunkType => async (dispatch) => {
    chatApi.sendMessage(messageText);
};

export default chatReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType | FormAction>;