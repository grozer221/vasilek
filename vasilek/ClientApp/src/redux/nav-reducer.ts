import {BaseThunkType, InferActionsTypes} from "./redux-store";

let initialState = {
}

const navReducer = (state = initialState, action: any/*ActionsType*/): InitialStateType => {
    switch (action.type) {
        default:
            return state;
    }
};

export const actions = {
}


export default navReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
//type ThunkType = BaseThunkType<ActionsType>;