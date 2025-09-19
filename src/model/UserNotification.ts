import type { User } from '@/model/User'
import type { Notification } from '@/model/Notification'

export interface UserNotification {
  id: number
  user_id: number
  notification_id: number
  title: string
  image?: string
  message?: string
  is_read: boolean
  read_at?: string
  created_at?: string
  updated_at?: string
  user?: User
  notification?: Notification
}