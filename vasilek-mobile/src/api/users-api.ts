import {ProfileType} from "../types/types";
import {instance, ResponseCodes} from "./api";

export const usersAPI = {
    getUsers(currentPage = 1, pageSize = 5, term = '') {
        return instance.get<UsersType>(`users?page=${currentPage}&count=${pageSize}` + (term === '' ? '' : `&term=${term}`))
            .then(res => res.data);
    },
};

export type UsersType = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: DataUsersType
}

type DataUsersType = {
    users: Array<ProfileType>
    count: number
}
