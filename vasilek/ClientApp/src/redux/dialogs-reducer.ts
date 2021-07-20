import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {usersAPI} from "../api/users-api";
import {ResponseCodes} from "../api/api";
import {FilterType} from "./users-reducer";

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

const dialogsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case 'SEND_MESSAGE':
            let body = action.newMessageBody;
            return {
                ...state,
                Messages: [...state.Messages, {Id: 4, Message: body}]
            };
        case 'GET_DIALOG_WITH_USER':
                return {
                    ...state,

                }
        default:
            return state;
    }
};

export const actions = {
    sendMessage: (newMessageBody: string) => ({type: 'SEND_MESSAGE', newMessageBody} as const),
    setDialogWithUser: (dialog: DialogType) => ({type: 'GET_DIALOG_WITH_USER', dialog} as const),
}

export const getAndSetDialogByUserId = (page: number, pageSize: number, filter: FilterType): ThunkType =>
    async (dispatch) => {

    };

export default dialogsReducer;

type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsTypes>;