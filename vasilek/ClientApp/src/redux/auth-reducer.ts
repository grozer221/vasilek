import {FormAction, stopSubmit} from 'redux-form';
import {ResponseCodes} from '../api/api';
import {authAPI} from "../api/auth-api";
import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {ProfileType} from "../types/types";

let initialState = {
    CurrentUser: {} as ProfileType | null,
    IsAuth: false as boolean
};

const authReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'SET_USER_DATA':
            return {
                ...state,
                ...action.payload,
            };

        default:
            return state;
    }
};

export const actions = {
    setAuthUserData: (user: ProfileType | null, isAuth: boolean) => ({
        type: 'SET_USER_DATA',
        payload: {CurrentUser: user, IsAuth: isAuth}
    } as const),
}


export const getAuthUserData = (): ThunkType => async (dispatch) => {
    let data = await authAPI.isAuth();
    if (data.ResultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(data.Data, true));
};

export const login = (login: string, password: string): ThunkType => async (dispatch) => {
    let data = await authAPI.login(login, password);
    if (data.ResultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(data.Data, true));
    else
        dispatch(stopSubmit('login', {_error: data.Messages}));
};

export const logout = (): ThunkType => async (dispatch) => {
    let data = await authAPI.logout();
    if (data.ResultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(null, false));
};

export default authReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType | FormAction>;