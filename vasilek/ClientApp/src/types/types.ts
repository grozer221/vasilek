export type PostType = {
    id: number
    likesCount: number
    message: string
}
export type ProfileType = {
    id: number
    login: string
    password: string
    nickName: string
    status: string
    city: string
    country: string
    avaPhoto: string
    isFollowed: boolean
}