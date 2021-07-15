import {instance, ResponseCodes} from "./api";
import {ProfileType} from "../types/types";

export const authAPI = {
    isAuth() {
        return instance.get<IsAuthType>('account/isauth')
            .then(res => res.data);
    },
    login(login: string, password: string) {
        return instance.post<LoginType>('account/login', {'login': login, 'password': password})
            .then(res => res.data);
    },
    logout() {
        return instance.delete<LogoutType>('account/logout')
            .then(res => res.data);
    }
};

type IsAuthType = {
    ResultCode: ResponseCodes,
    Messages: Array<string>
    Data: ProfileType
}

type LoginType = {
    ResultCode: ResponseCodes,
    Messages: Array<string>
    Data: {
        Login: string
        Password: string
    }
}

type LogoutType = {
    ResultCode: ResponseCodes
}