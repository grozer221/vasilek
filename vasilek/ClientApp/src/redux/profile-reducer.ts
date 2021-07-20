import {ResponseCodes} from '../api/api';
import {PostType, ProfileType} from '../types/types';
import {profileAPI} from "../api/profile-api";
import {BaseThunkType, InferActionsTypes} from "./redux-store";

let initialState = {
    Posts: [
        {Id: 1, LikesCount: 1, Message: 'ааааа'},
        {Id: 2, LikesCount: 2, Message: 'ббббб'},
        {Id: 2, LikesCount: 3, Message: 'ввввв'}
    ] as Array<PostType>,
    Profile: null as ProfileType | null,
    Status: null as string | null,
};

const profileReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'ADD_POST':
            let newPost = {
                Id: 5,
                Message: action.newPostText,
                LikesCount: 0
            };
            return {
                ...state,
                Posts: [...state.Posts, newPost],
            };
        case 'SET_USER_PROFILE':
            if (action.profile === null)
                return {...state, Profile: action.profile};
            return {...state, Profile: action.profile, Status: action.profile.Status};
        case 'SET_STATUS':
            return {...state, Status: action.status};
        case 'DELETE_POST':
            return {...state, Posts: state.Posts.filter(p => p.Id != action.postId)};
        case 'SAVE_PHOTO_SUCCESS':
            return {...state, Profile: {...state.Profile, AvaPhoto: action.avaPhoto} as ProfileType};

        default:
            return state;
    }
};

export const actions = {
    addPostActionCreator: (newPostText: string) => ({type: 'ADD_POST', newPostText} as const),
    setUserProfile: (profile: ProfileType) => ({type: 'SET_USER_PROFILE', profile: profile} as const),
    setStatus: (status: string | null) => ({type: 'SET_STATUS', status: status} as const),
    deletePost: (postId: number) => ({type: 'DELETE_POST', postId} as const),
    savePhotoSuccess: (avaPhoto: string) => ({type: 'SAVE_PHOTO_SUCCESS', avaPhoto: avaPhoto} as const),
}



export const getUserProfile = (userId: number | undefined): ThunkType => async (dispatch) => {
    let data = await profileAPI.getProfile(userId);
    if (data.ResultCode === ResponseCodes.Success)
        dispatch(actions.setUserProfile(data.Data));
};

export const updateStatus = (status: string | null): ThunkType => async (dispatch) => {
    let data = await profileAPI.updateStatus(status);
    if (data.ResultCode === ResponseCodes.Success)
        dispatch(actions.setStatus(status));
};

export const savePhoto = (file: File): ThunkType => async (dispatch) => {
    let data = await profileAPI.savePhoto(file);
    if (data.ResultCode === ResponseCodes.Success)
        dispatch(actions.savePhotoSuccess(data.Data));
};

export const updateProfile = (profile: ProfileType): ThunkType => async (dispatch) => {
    let data = await profileAPI.updateProfile(profile);
    if (data.ResultCode === ResponseCodes.Success)
        dispatch(actions.setUserProfile(data.Data));
};

export default profileReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;