import { stopSubmit } from 'redux-form';
import { authAPI } from '../api/api';

const SET_USER_DATA = 'SET_USER_DATA';

export type InitialStateType = {
  userId: number | null,
  login: string | null,
  name: string | null,
  isAuth: boolean
}

let initialState:InitialStateType = {
  userId: null,
  login: null,
  name: null,
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

export const setAuthUserData = (userId: number | null, login: string | null, name: string | null, isAuth: boolean): SetAuthUserDataType => ({
  type: SET_USER_DATA,
  payload: { userId, login, name, isAuth }
});

export const getAuthUserData = () => async (dispatch: any) => {
  let data = await authAPI.isAuth();
  if (data.id !== 0)
    dispatch(setAuthUserData(data.id, data.login, data.firstname, true));
};

export const login = (login: string, password: string, rememberMe: boolean) => async (dispatch: any) => {
  let data = await authAPI.login(login, password, rememberMe);
  if (data)
    dispatch(getAuthUserData());
  else
    dispatch(stopSubmit('login', { _error: data.message }));
};

export const logout = () => async (dispatch: any) => {
  let data = await authAPI.logout();
  if (data)
    dispatch(setAuthUserData(null, null, null, false));
};

export default authReducer;