import type { Media } from "@/model"
export interface News {
    id: number
    title: string
    link: string
    description: string
    lang: string
    media_id:number
    media:Media
    created_at: string
    updated_at: string
}

