import axios from 'axios';

export const instance = axios.create({
    withCredentials: true,
    baseURL: window.location.protocol + '//' + window.location.host + '/api/',
});

export const urls = {
    pathToUsersPhotos: 'https://vasilekblob.blob.core.windows.net/users-photos/',
    pathToFilesPinnedToMessage: 'https://vasilekblob.blob.core.windows.net/files-pinned-to-messages/',
};

export enum ResponseCodes {
    Success = 0,
    Error = 1
}







