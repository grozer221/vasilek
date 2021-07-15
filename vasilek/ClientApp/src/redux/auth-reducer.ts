import {FormAction, stopSubmit} from 'redux-form';
import {ResponseCodes} from '../api/api';
import {authAPI} from "../api/auth-api";
import {BaseThunkType, InferActionsTypes} from "./redux-store";

let initialState = {
    UserId: null as number | null,
    Login: null as string | null,
    FirstName: null as string | null,
    LastName: null as string | null,
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
    setAuthUserData: (UserId: number | null, Login: string | null, FirstName: string | null, LastName: string | null, IsAuth: boolean) => ({
        type: 'SET_USER_DATA',
        payload: {UserId, Login, FirstName, LastName, IsAuth}
    } as const),
}



export const getAuthUserData = (): ThunkType => async (dispatch) => {
    let data = await authAPI.isAuth();
    if (data.ResultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(data.Data.Id, data.Data.Login, data.Data.FirstName, data.Data.LastName, true));
};

export const login = (login: string, password: string): ThunkType => async (dispatch) => {
    let data = await authAPI.login(login, password);
    if (data.ResultCode === ResponseCodes.Success)
        await dispatch(getAuthUserData());
    else
        dispatch(stopSubmit('login', {_error: data.Messages}));
};

export const logout = (): ThunkType => async (dispatch) => {
    let data = await authAPI.logout();
    if (data.ResultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(null, null, null, null, false));
};

export default authReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType | FormAction>;