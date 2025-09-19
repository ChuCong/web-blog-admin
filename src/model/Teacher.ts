import type { Admin } from "@/model"
export interface Teacher {
  id: number
  email?: string
  full_name?: string
  gender?: number          
  phone_number?: string
  avatar_url?: string
  avatar_full_url?: string
  age?: number
  position?: string
  organization?: string
  biography?: string
  area_of_expertise?: string
  skills: string
  linkedin_link: string
  zalo_link: string
  fb_link: string
  status: number
  user_id: number
  birthday?: string        
  level?: number         
  type?: number
  country?: string
  info_content?: string
  video_id?: number
  yt_link?: string
  insta_link?: string
  pinterest_link?: string
  affiliate_id?: number
  created_at?: string
  updated_at?: string
  admin?: Admin
}