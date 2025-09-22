export interface Article {
  id: number
  title: string
  slug: string
  description?: string
  content?: string,
  category_id?: number,
  url?: string
  active?: number,
  seo_key?: string,
  seo_description?: string,
  seo_title?: string,
  created_at: string
  updated_at: string
}