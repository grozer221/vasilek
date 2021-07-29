import {FormAction, stopSubmit} from 'redux-form';
import {ResponseCodes} from '../api/api';
import {authAPI} from "../api/auth-api";
import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {ProfileType} from "../types/types";

let initialState = {
    currentUser: {} as ProfileType | null,
    isAuth: false as boolean
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
        payload: {currentUser: user, isAuth: isAuth}
    } as const),
}


export const getAuthUserData = (): ThunkType => async (dispatch) => {
    let data = await authAPI.isAuth();
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(data.data, true));
};

export const login = (login: string, password: string): ThunkType => async (dispatch) => {
    let data = await authAPI.login(login, password);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(data.data, true));
};

export const register = (login: string, password: string, confirmPassword: string, nickName: string): ThunkType => async (dispatch) => {
    let data = await authAPI.register(login, password, confirmPassword, nickName);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(data.data, true));
};

export const logout = (): ThunkType => async (dispatch) => {
    let data = await authAPI.logout();
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(null, false));
};

export default authReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType | FormAction>;