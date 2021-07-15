import {InferActionsTypes} from "./redux-store";

type DialogType = {
    Id: number,
    Login: string,
}

type MessageType = {
    Id: number,
    Message: string,
}

let initialState = {
    Dialogs: [
        {Id: 1, Login: 'Grozer'},
        {Id: 2, Login: 'Prozer'},
        {Id: 3, Login: 'Zhozer'},
        {Id: 4, Login: 'Lozer'}
    ] as Array<DialogType>,
    Messages: [
        {Id: 1, Message: 'fffffff'},
        {Id: 2, Message: 'asrgrea'},
        {Id: 3, Message: 'ffffbbbbfagff'}
    ] as Array<MessageType>
};

const dialogsReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'SEND_MESSAGE':
            let body = action.newMessageBody;
            return {
                ...state,
                Messages: [...state.Messages, {Id: 4, Message: body}]
            };
        default:
            return state;
    }
};

export const actions = {
    sendMessage: (newMessageBody: string) => ({type: 'SEND_MESSAGE', newMessageBody} as const),
}

export default dialogsReducer;

export type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actions>