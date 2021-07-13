import {stopSubmit} from 'redux-form';
import {authAPI, ResponseCodes} from '../api/api';

const SET_USER_DATA = 'SET_USER_DATA';

export type InitialStateType = {
    userId: number | null,
    login: string | null,
    firstName: string | null,
    lastName: string | null,
    isAuth: boolean
}

let initialState: InitialStateType = {
    userId: null,
    login: null,
    firstName: null,
    lastName: null,
    isAuth: false
};

const authReducer = (state = initialState, action: any): InitialStateType => {
    switch (action.type) {
        case SET_USER_DATA:
            return {
                ...state,
                ...action.payload,
            };

        default:
            return state;
    }
};

type SetAuthUserDataType = {
    type: typeof SET_USER_DATA,
    payload: InitialStateType
}

export const setAuthUserData = (userId: number | null, login: string | null, firstName: string | null, lastName: string | null, isAuth: boolean): SetAuthUserDataType => ({
    type: SET_USER_DATA,
    payload: {userId, login, firstName, lastName, isAuth}
});

export const getAuthUserData = () => async (dispatch: any) => {
    let data = await authAPI.isAuth();
    debugger
    if (data.resultCode === ResponseCodes.Success)
        dispatch(setAuthUserData(data.data.id, data.data.login, data.data.firstName, data.data.lastName, true));
};

export const login = (login: string, password: string, rememberMe: boolean) => async (dispatch: any) => {
    let data = await authAPI.login(login, password, rememberMe);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(getAuthUserData());
    else
        dispatch(stopSubmit('login', {_error: data.messages}));
};

export const logout = () => async (dispatch: any) => {
    let data = await authAPI.logout();
    if (data.resultCode === ResponseCodes.Success)
        dispatch(setAuthUserData(null, null, null, null, false));
};

export default authReducer;