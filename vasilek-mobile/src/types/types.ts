import {ResponseCodes} from "../api/api";

export type PhotoType = {
    id: number
    photoName: string
    user: ProfileType
}

export type ProfileType = {
    id: number
    login: string
    password: string
    nickName: string
    status: string
    country: string
    avaPhoto: string | null
    isOnline: boolean
    nickColor: string
    dateLastOnline: Date
    dateRegister: Date
    isFollowed: boolean
    photos: PhotoType[]
}

export type ResponseType = {
    ResultCode: ResponseCodes,
    Messages: string[],
}