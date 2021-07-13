import {ProfileType} from "../types/types";
import {instance, ResponseCodes} from "./api";

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

};

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
