export interface LessonProcess {
  id: number
  user_id: number
  lesson_id?: number
  course_id?: number
  percent: number 
  created_at: string
  updated_at: string
}