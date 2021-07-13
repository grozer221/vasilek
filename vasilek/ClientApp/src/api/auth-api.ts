import {instance, ResponseCodes} from "./api";

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