import axios from 'axios';

export const instance = axios.create({
    withCredentials: true,
    baseURL: window.location.protocol + '//' + window.location.host + '/api/',
});

export const urls = {
    pathToUsersPhotos: 'https://vasilek.blob.core.windows.net/userphotoscontainer/',
};

export enum ResponseCodes {
    Success = 0,
    Error = 1
}







