import type { ListContent} from "@/model"
export interface Banner {
    id: number
    title: string
    url_course: string
    content: string
    lang: string
    url_image: string
    created_at: string
    updated_at: string
    list_contents: ListContent[] | null
}

