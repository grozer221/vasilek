import {instance, ResponseCodes} from "./api";
import {ProfileType} from "../types/types";

export const profileAPI = {
    getProfile(userId: number) {
        return instance.get<UserType>('profile/get/' + userId)
            .then(res => res.data);
    },
    updateStatus(status: string) {
        return instance.put<UpdateType>('profile/status/' + status)
            .then(res => res.data);
    },
    savePhoto(photo: any) {
        let formData = new FormData;
        formData.append("photo", photo);
        return instance.post<UpdateType>('profile/photo', formData, {
            headers: {'Content-Type': 'multipart-form-data'}
        })
            .then(res => res.data);
    },
    updateProfile(profile: ProfileType) {
        return instance.put<UserType>('profile/put', profile)
            .then(res => res.data);
    }
}

type UpdateType = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: string
}
type UserType = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: ProfileType
}