export type PostType = {
    Id: number
    LikesCount: number
    Message: string
}
export type ProfileType = {
    Id: number
    Login: string
    Password: string
    NickName: string
    Status: string
    City: string
    Country: string
    AvaPhoto: string
    IsFollowed: boolean
}