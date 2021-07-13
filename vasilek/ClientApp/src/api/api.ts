import React from 'react';
import axios from 'axios';
import {ProfileType} from "../types/types";

const instance = axios.create({
    withCredentials: true,
    //baseURL: 'https://vasilek.azurewebsites.net/api/',
    baseURL: 'https://localhost:44353/api/',
});

export enum ResponseCodes{
    Success = 0,
    Error = 1
}

type UserType = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: ProfileType
}
type UsersType = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: Array<ProfileType>
}
type GetUsersCountType = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: number
}
type FollowType = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: Array<number>
}
type UpdateType = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: string
}

export const usersAPI = {
    getUsers(currentPage = 1, pageSize = 5) {
        return instance.get<UsersType>(`users/${currentPage}/${pageSize}`)
            .then(res => res.data);
    },
    getUsersCount() {
        return instance.get<GetUsersCountType>('users/count')
            .then(res => res.data);
    },
    getFollowedUsers() {
        return instance.get<FollowType>('followuser')
            .then(res => res.data);
    },
    followUser(userId: number) {
        return instance.put<FollowType>('followuser/' + userId)
            .then(res => res.data);
    },
    unFollowUser(userId: number) {
        return instance.delete<FollowType>('followuser/' + userId)
            .then(res => res.data);
    },
    getProfile(userId: number) {
        return instance.get<UserType>('profile/get/' + userId)
            .then(res => res.data);
    },
    updateStatus(status: string) {
        return instance.put<UpdateType>('profile/status/' + status)
            .then(res => res.data);
    },
    savePhoto(photo: any) {
        let formData = new FormData;
        formData.append("photo", photo);
        return instance.post<UpdateType>('profile/photo', formData, {
            headers: {'Content-Type': 'multipart-form-data'}
        })
            .then(res => res.data);
    },
    updateProfile(profile: ProfileType) {
        return instance.put<UserType>('profile/put', profile)
            .then(res => res.data);
    }
};

type MeType = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: {
        id: number
        login: string
        firstName: string
        lastName: string
    }
}

type LoginType = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: {
        login: string
    }
}

type LogoutType = {
    resultCode: ResponseCodes,
}

export const authAPI = {
    isAuth() {
        return instance.get<MeType>('account/isauth')
            .then(res => res.data);
    },
    login(login: string, password: string, rememberMe = false) {
        return instance.post<LoginType>('account/login', {'login': login, 'password': password})
            .then(res => res.data);
    },
    logout() {
        return instance.delete<LogoutType>('account/logout')
            .then(res => res.data);
    }
};



