import type { Media } from "@/model"

export interface Course {
  id: number
  title: string
  price: string
  description: string
  introduction: string
  status?: number //0 | 1  // 0: Lock, 1: Unlock
  lesson_number?: number
  number_month_expired: number
  image_id: number,
  image?: Media,
  is_recommend?: number
  slug: string
  meta: string
  responsive_image_id: number
  responsive_image?: Media
  active: boolean
  is_free: boolean  // 1: free, 0: no free
  url_lading_page?: string
  category_id: number
  teacher_id: number
  is_deal: boolean
  not_buy: boolean
  created_at: string
  updated_at: string,
  revenue: number,
  users_count: number
}
