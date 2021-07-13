import {FormAction, stopSubmit} from 'redux-form';
import {ResponseCodes} from '../api/api';
import {authAPI} from "../api/auth-api";
import {BaseThunkType, InferActionsTypes} from "./redux-store";

const SET_USER_DATA = 'SET_USER_DATA';

let initialState = {
    userId: null as number | null,
    login: null as string | null,
    firstName: null as string | null,
    lastName: null as string | null,
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
    setAuthUserData: (userId: number | null, login: string | null, firstName: string | null, lastName: string | null, isAuth: boolean) => ({
        type: 'SET_USER_DATA',
        payload: {userId, login, firstName, lastName, isAuth}
    } as const),
}



export const getAuthUserData = (): ThunkType => async (dispatch) => {
    let data = await authAPI.isAuth();
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(data.data.id, data.data.login, data.data.firstName, data.data.lastName, true));
};

export const login = (login: string, password: string, rememberMe: boolean): ThunkType => async (dispatch) => {
    let data = await authAPI.login(login, password, rememberMe);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(getAuthUserData());
    else
        dispatch(stopSubmit('login', {_error: data.messages}));
};

export const logout = (): ThunkType => async (dispatch) => {
    let data = await authAPI.logout();
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(null, null, null, null, false));
};

export default authReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType | FormAction>;