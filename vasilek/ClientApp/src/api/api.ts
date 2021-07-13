import React from 'react';
import * as axios from 'axios';

const instance = axios.create({
    withCredentials: true,
    //baseURL: 'https://vasilek.azurewebsites.net/api/',
    baseURL: 'https://localhost:44353/api/',
});

export const usersAPI = {
    getUsers(currentPage = 1, pageSize = 5) {
        return instance.get(`users/${currentPage}/${pageSize}`)
            .then(response => {
                return response.data;
            });
    },
    getUsersCount() {
        return instance.get('users')
            .then(response => {
                return response.data;
            });
    },
    getFollowedUsers() {
        return instance.get('followuser')
            .then(response => {
                return response.data;
            });
    },
    followUser(userId) {
        return instance.put('followuser/' + userId)
            .then(response => {
                return response.data;
            });
    },
    unFollowUser(userId) {
        return instance.delete('followuser/' + userId)
            .then(response => {
                return response.data;
            });
    },
    getProfile(userId) {
        return instance.get('profile/get/' + userId)
            .then(response => {
                return response.data;
            });
    },
    updateStatus(status) {
        return instance.put('profile/status/' + status)
            .then(response => {
                return response.data
            });
    },
    savePhoto(photo) {
        let formData = new FormData;
        formData.append("photo", photo);
        return instance.post('profile/photo', formData, {
            headers: {
                'Content-Type': 'multipart-form-data'
            }
        })
            .then(response => {
                return response.data
            });
    },
    updateProfile(profile) {
        return instance.put('profile/put', profile)
            .then(response => {
                return response.data
            });
    }
};

export const authAPI = {
    isAuth() {
        return instance.get('account/isauth')
            .then(response => {
                return response.data;
            });
    },
    login(login, password, rememberMe = false) {
        return instance.post('account/login', {'login': login, 'password': password})
            .then(response => {
                return response.data;
            })
    },
    logout() {
        return instance.get('account/logout')
            .then(response => {
                return response.data;
            });
    },

};



