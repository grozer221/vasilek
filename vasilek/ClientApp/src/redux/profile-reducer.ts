import { usersAPI } from '../api/api';
import { PostType, ProfileType } from '../types/types';

const ADD_POST = 'ADD-POST';
const SET_USER_PROFILE = 'SET_USER_PROFILE';
const SET_STATUS = 'SET_STATUS';
const DELETE_POST = 'DELETE_POST';
const SAVE_PHOTO_SUCCESS = 'SAVE_PHOTO_SUCCESS';


export type InitialStateType = typeof initialState;

let initialState = {
  posts: [
    { id: 1, likesCount: 1, message: 'ааааа' },
    { id: 2, likesCount: 2, message: 'ббббб' },
    { id: 2, likesCount: 3, message: 'ввввв' }
  ] as Array<PostType>,
  profile: null as ProfileType | null,
  status: '',
  newPostText: ''
};

const profileReducer = (state = initialState, action: any): InitialStateType => {
  switch (action.type) {
    case ADD_POST:
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
    case SET_USER_PROFILE:
      if (action.profile === null)
        return { ...state, profile: action.profile };
      return { ...state, profile: action.profile, status: action.profile.status };
    case SET_STATUS:
      return { ...state, status: action.status };
    case DELETE_POST:
      return { ...state, posts: state.posts.filter(p => p.id != action.postId) };
    case SAVE_PHOTO_SUCCESS:
      return { ...state, profile: {...state.profile, photo_small: action.photo_small} as ProfileType };

    default:
      return state;
  }
};

export type AddPostActionCreatorType = {
  type: typeof ADD_POST,
  newPostText: string
}
export const addPostActionCreator = (newPostText: string): AddPostActionCreatorType => ({ type: ADD_POST, newPostText });

export type SetUserProfileActionType = {
  type: typeof SET_USER_PROFILE
  profile: ProfileType
}
export const setUserProfile = (profile: ProfileType): SetUserProfileActionType => ({ type: SET_USER_PROFILE, profile });

export type SetStatusActionType = {
  type: typeof SET_STATUS
  status: string
}
export const setStatus = (status: string): SetStatusActionType => ({ type: SET_STATUS, status });

export type DeletePostActionType = {
  type: typeof DELETE_POST
  postId: number
}
export const deletePost = (postId: number): DeletePostActionType => ({ type: DELETE_POST, postId });

export type SavePhotoSuccessActionType = {
  type: typeof SAVE_PHOTO_SUCCESS
  photo_small: string
}
export const savePhotoSuccess = (photo_small: string): SavePhotoSuccessActionType => ({ type: SAVE_PHOTO_SUCCESS, photo_small });

export const getUserProfile = (userId: number) => async (dispatch: any) => {
  let data = await usersAPI.getProfile(userId);
  dispatch(setUserProfile(data));
};

export const updateStatus = (status: string) => async (dispatch: any) => {
  let data = await usersAPI.updateStatus(status);
  if (data)
    dispatch(setStatus(status));
};

export const savePhoto = (file: any) => async (dispatch: any) => {
  let data = await usersAPI.savePhoto(file);
  if (data)
    dispatch(savePhotoSuccess(data.photo_small));
};

export const updateProfile = (profile: ProfileType) => async (dispatch: any, getState: any) => {
  const userId = getState().auth.userId;
  let data = await usersAPI.updateProfile(profile);
  if (data)
    dispatch(setUserProfile(data));
};

export default profileReducer;