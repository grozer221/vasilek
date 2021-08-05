import {instance, ResponseCodes} from "./api";
import {PhotoType, ProfileType} from "../types/types";
import {ChangePassType} from "../components/Info/Settings/Settings";

export const profileAPI = {
    getProfile(userId: number | undefined) {
        return instance.get<UserType>('profile/get/' + userId)
            .then(res => res.data);
    },
    updateStatus(status: string | null) {
        return instance.put<UpdateType>('profile/status/' + status)
            .then(res => res.data);
    },
    savePhoto(photo: File) {
        let formData = new FormData;
        formData.append("photo", photo);
        return instance.post<SavePhotoType>('profile/photo', formData, {
            headers: {'Content-Type': 'multipart-form-data'}
        })
            .then(res => res.data);
    },
    deletePhotoFromUser(photoName: string) {
        return instance.delete<UserType>('profile/photo/' + photoName)
            .then(res => res.data);
    },
    setAvaPhotoForUser(photo: PhotoType | null) {
        return instance.put<UserType>('profile/photo', photo)
            .then(res => res.data);
    },
    updateProfile(profile: ProfileType) {
        return instance.put<UserType>('profile/put', profile)
            .then(res => res.data);
    },
    changePassword(changePass: ChangePassType) {
        return instance.put<UserType>('profile/password', changePass)
            .then(res => res.data);
    },
}

type UpdateType = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: string
}

type SavePhotoType = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: PhotoType
}

type UserType = {
    resultCode: ResponseCodes,
    messages: Array<string>
    data: ProfileType
}