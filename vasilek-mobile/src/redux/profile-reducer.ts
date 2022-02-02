import {ResponseCodes} from '../api/api';
import {PhotoType, ProfileType} from '../types/types';
import {profileAPI} from "../api/profile-api";
import {BaseThunkType, InferActionsTypes} from "./redux-store";

let initialState = {
    profile: null as ProfileType | null,
};

const profileReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'SET_USER_PROFILE':
            return {...state, profile: action.profile};

        default:
            return state;
    }
};

export const actions = {
    setUserProfile: (profile: ProfileType | null) => ({type: 'SET_USER_PROFILE', profile: profile} as const),
    setStatus: (status: string | null) => ({type: 'SET_STATUS', status: status} as const),
}


export const getUserProfile = (userId: number | undefined): ThunkType => async (dispatch) => {
    let data = await profileAPI.getProfile(userId);
    if (data.resultCode === ResponseCodes.Success)
        dispatch(actions.setUserProfile(data.data));
};



export default profileReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;
