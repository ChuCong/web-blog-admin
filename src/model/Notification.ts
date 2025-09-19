import { NOTIFICATION_TYPE, AUDIENCE_TYPE, SEND_TYPE, SCHEDULE_TYPE } from '@/config/constant'

export interface Notification {
  id?: number,
  title: string,
  image?: string,
  image_url?: string,
  message?: string,
  link?: string,
  type: typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE],
  audience: typeof AUDIENCE_TYPE[keyof typeof AUDIENCE_TYPE],
  target_ids?: number[],
  send_time_type?: typeof SCHEDULE_TYPE[keyof typeof SCHEDULE_TYPE] | null,
  specific_date?: string,
  send_day?: number[] | null,
  start_date?: string,
  end_date?: string,
  notification_times?: NotificationTimes[],
  send_type:  typeof SEND_TYPE[keyof typeof SEND_TYPE],
  status: number,
  created_at?: string,
  updated_at?: string
}

export interface NotificationTimes {
  notification_id?: number, 
  time: string
}