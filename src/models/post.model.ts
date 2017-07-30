export interface POST {
    user_id : string,
    name: string,
    profile_url: string,
    description: string,
    id: string,
    timestamp: string,
    status?: string,
    photo_url?: string,
    likes?: Array<string>
}
