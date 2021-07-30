import {InferActionsTypes} from "./redux-store";

let initialState = {
    currentDialogInfoId: null as number | null,
};


export const dialogInfoReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case 'SET_CURRENT_DIALOG_INFO_ID':
            return {
                ...state,
                currentDialogInfoId: action.id,
            };
        default:
            return state;
    }
};

export const actions = {
    setCurrentDialogInfoId: (id: number) => ({
        type: 'SET_CURRENT_DIALOG_INFO_ID',
        id: id,
    } as const),
}

export type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>
