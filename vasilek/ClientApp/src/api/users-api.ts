import {ProfileType} from "../types/types";
import {instance, ResponseCodes} from "./api";

export const usersAPI = {
    getUsers(currentPage = 1, pageSize = 5, term = '', friends: boolean = false) {
        return instance.get<UsersType>(`users?page=${currentPage}&count=${pageSize}`+ (term === '' ? '' : `&term=${term}`) + (!friends ? '' : `&friends=${friends}`))
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
    getFriends(currentPage = 1, pageSize = 5) {
        return instance.get<UsersType>(`users?page=${currentPage}&count=${pageSize}&friends=true`)
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
type FollowType = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: Array<number>
}
