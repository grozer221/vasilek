import {FormAction} from 'redux-form';
import {ResponseCodes} from '../api/api';
import {authAPI} from "../api/auth-api";
import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {PhotoType, ProfileType} from "../types/types";
import {profileAPI} from "../api/profile-api";
import {ChangePassType} from "../components/Info/Settings/Settings";
import {actions as appActions} from './app-reducer';

let initialState = {
    currentUser: {} as ProfileType,
    isAuth: false,
    isFetching: false,
};

const authReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'SET_USER_DATA':
            return {
                ...state,
                ...action.payload,
            };
        case 'DELETE_USER_PHOTO':
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    photos: [...state.currentUser.photos.filter(p => p.photoName !== action.photoName)]
                }
            };
        case 'SET_USER_AVA_PHOTO':
            return {
                ...state,
                currentUser: {...state.currentUser, avaPhoto: action.photoName}
            };
        case 'ADD_PHOTO_TO_USER':
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    photos: state.currentUser !== null && state.currentUser.photos.length > 0
                        ? [...state.currentUser.photos, action.photo]
                        : [action.photo],
                } as ProfileType
            };
        case 'SET_IS_FETCHING':
            return {
                ...state,
                isFetching: action.isFetching,
            };

        default:
            return state;
    }
};

export const actions = {
    setAuthUserData: (user: ProfileType, isAuth: boolean) => ({
        type: 'SET_USER_DATA',
        payload: {currentUser: user, isAuth: isAuth}
    } as const),
    addPhotoToUser: (photo: PhotoType) => ({type: 'ADD_PHOTO_TO_USER', photo: photo} as const),
    deleteUserPhoto: (photoName: string) => ({
        type: 'DELETE_USER_PHOTO',
        photoName: photoName
    } as const),
    setUserAvaPhoto: (photoName: string | null) => ({
        type: 'SET_USER_AVA_PHOTO',
        photoName: photoName
    } as const),
    setIsFetching: (isFetching: boolean) => ({
        type: 'SET_IS_FETCHING',
        isFetching: isFetching
    } as const),
}

export const addPhotoForUser = (file: File): ThunkType => async (dispatch) => {
    let data = await profileAPI.savePhoto(file);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.addPhotoToUser(data.data));
};

export const deletePhotoFromUser = (photoName: string): ThunkType => async (dispatch) => {
    let data = await profileAPI.deletePhotoFromUser(photoName);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.deleteUserPhoto(photoName));
};

export const setAvaPhotoForUser = (photo: PhotoType | null): ThunkType => async (dispatch) => {
    let data = await profileAPI.setAvaPhotoForUser(photo);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setUserAvaPhoto(photo ? photo.photoName : null))
};

export const updateProfile = (profile: ProfileType): ThunkType => async (dispatch) => {
    let data = await profileAPI.updateProfile(profile);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(data.data, true));
};

export const changePassword = (changePass: ChangePassType): ThunkType => async (dispatch) => {
    let data = await profileAPI.changePassword(changePass);
    if (data.resultCode === ResponseCodes.Success) {
        dispatch(appActions.setFormSuccess(true));
    } else if (data.resultCode === ResponseCodes.Error) {
        dispatch(appActions.setFormSuccess(false));
        dispatch(appActions.setFormError(data.messages[0]));
    }

};

export const getAuthUserData = (): ThunkType => async (dispatch) => {
    let data = await authAPI.isAuth();
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(data.data, true));
};

export const login = (login: string, password: string): ThunkType => async (dispatch) => {
    dispatch(actions.setIsFetching(true));
    let data = await authAPI.login(login, password);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(data.data, true));
    else if (data.resultCode === ResponseCodes.Error) {
        dispatch(appActions.setFormSuccess(false));
        dispatch(appActions.setFormError(data.messages[0]));
    }
    dispatch(actions.setIsFetching(false));
};

export const register = (login: string, password: string, confirmPassword: string, nickName: string): ThunkType => async (dispatch) => {
    dispatch(actions.setIsFetching(true));
    let data = await authAPI.register(login, password, confirmPassword, nickName);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData(data.data, true));
    else if (data.resultCode === ResponseCodes.Error) {
        dispatch(appActions.setFormSuccess(false));
        dispatch(appActions.setFormError(data.messages[0]));
    }
    dispatch(actions.setIsFetching(false));
};

export const logout = (): ThunkType => async (dispatch) => {
    let data = await authAPI.logout();
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setAuthUserData({} as ProfileType, false));
};

export default authReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType | FormAction>;