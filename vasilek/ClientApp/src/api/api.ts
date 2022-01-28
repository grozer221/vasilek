import axios from 'axios';

export const instance = axios.create({
    withCredentials: true,
    baseURL: window.location.protocol + '//' + window.location.host + '/api/',
});

export const urls = {
    pathToUsersPhotos: 'https://vasilekblobstorage.blob.core.windows.net/users-photos/',
    pathToFilesPinnedToMessage: 'https://vasilekblobstorage.blob.core.windows.net/files-pinned-to-messages/',
    //pathToUsersPhotos: window.location.protocol + '//' + window.location.host + '/media/UsersPhotos/',
    //pathToFilesPinnedToMessage: window.location.protocol + '//' + window.location.host + '/media/FilesPinnedToMessages/',
};

export enum ResponseCodes {
    Success = 0,
    Error = 1
}







