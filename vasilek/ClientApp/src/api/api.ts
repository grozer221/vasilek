import axios from 'axios';

export const instance = axios.create({
    withCredentials: true,
    //baseURL: 'https://vasilek.azurewebsites.net/api/',
    baseURL: 'https://localhost:44353/api/',
});

export enum ResponseCodes {
    Success = 0,
    Error = 1
}







