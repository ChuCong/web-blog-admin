
import type { Lesson, Course, User } from '@/model'
export interface UserLog {
  id: number
  lesson_id?: number
  course_id?: number
  user_id?: number
  created_at?: string
  updated_at?: string
  lesson?: Lesson
  course?: Course
  user?: User
}