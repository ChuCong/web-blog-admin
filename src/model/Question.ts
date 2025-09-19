import type { Answer } from "@/model"

export interface Question {
  id: number
  content?: string
  question_type: number
  index: number
  score: number
  level: number
  audio_id?: number
  group_question_id: number
  exam_type?: number
  explanation?: string
  score_or_not: boolean | true
  answers: Answer[]
  essay_answer?: string
  created_at?: string
  updated_at?: string
  random_id?: number
}