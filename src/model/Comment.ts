
import type { Lesson, Course} from '@/model'
export interface Comment {
  id: number
  lesson_id: number
  course_id: number
  user_id: number
  content?: string
  parent_id?: number 
  created_at: string
  updated_at: string
  tag_user_id:number
  reply_count: number
  lesson: Lesson
  course: Course
}