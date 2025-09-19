import type { Question } from "@/model"

export interface GroupQuestion {
  id?: number
  lesson_id: number | string
  title: string
  questions: Question[]
  time: number 
  index: number
  created_at?: string
  updated_at?: string
}