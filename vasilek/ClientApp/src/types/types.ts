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
    isFollowed: boolean
    photos: PhotoType[]
}