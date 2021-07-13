import {ResponseCodes} from '../api/api';
import {PostType, ProfileType} from '../types/types';
import {profileAPI} from "../api/profile-api";
import {BaseThunkType, InferActionsTypes} from "./redux-store";

let initialState = {
    posts: [
        {id: 1, likesCount: 1, message: 'ааааа'},
        {id: 2, likesCount: 2, message: 'ббббб'},
        {id: 2, likesCount: 3, message: 'ввввв'}
    ] as Array<PostType>,
    profile: null as ProfileType | null,
    status: '',
    newPostText: ''
};

const profileReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'ADD_POST':
            let newPost = {
                id: 5,
                message: action.newPostText,
                likesCount: 0
            };
            return {
                ...state,
                posts: [...state.posts, newPost],
                newPostText: ''
            };
        case 'SET_USER_PROFILE':
            if (action.profile === null)
                return {...state, profile: action.profile};
            return {...state, profile: action.profile, status: action.profile.status};
        case 'SET_STATUS':
            return {...state, status: action.status};
        case 'DELETE_POST':
            return {...state, posts: state.posts.filter(p => p.id != action.postId)};
        case 'SAVE_PHOTO_SUCCESS':
            return {...state, profile: {...state.profile, avaPhoto: action.avaPhoto} as ProfileType};

        default:
            return state;
    }
};

export const actions = {
    addPostActionCreator: (newPostText: string) => ({type: 'ADD_POST', newPostText} as const),
    setUserProfile: (profile: ProfileType) => ({type: 'SET_USER_PROFILE', profile} as const),
    setStatus: (status: string) => ({type: 'SET_STATUS', status} as const),
    deletePost: (postId: number) => ({type: 'DELETE_POST', postId} as const),
    savePhotoSuccess: (avaPhoto: string) => ({type: 'SAVE_PHOTO_SUCCESS', avaPhoto: avaPhoto} as const),
}



export const getUserProfile = (userId: number): ThunkType => async (dispatch) => {
    let data = await profileAPI.getProfile(userId);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setUserProfile(data.data));
};

export const updateStatus = (status: string): ThunkType => async (dispatch) => {
    let data = await profileAPI.updateStatus(status);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setStatus(status));
};

export const savePhoto = (file: File): ThunkType => async (dispatch) => {
    let data = await profileAPI.savePhoto(file);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.savePhotoSuccess(data.data));
};

export const updateProfile = (profile: ProfileType): ThunkType => async (dispatch) => {
    let data = await profileAPI.updateProfile(profile);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setUserProfile(data.data));
};

export default profileReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;