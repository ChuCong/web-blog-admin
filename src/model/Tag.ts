export interface Tag {
    id?: number
    name?: string
    tag_type_id?: string
    tag_type?: any
    created_at?: string
    updated_at?: string
}

export interface TagType {
    id?: number
    name?: string,
    show_in_course? : boolean
    created_at?: string
    updated_at?: string
}