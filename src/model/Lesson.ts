import type { Media, GroupQuestion, Question } from "@/model"

export interface Lesson {
  id: number
  title: string
  description?: string
  lesson_index?: number
  status: number // 0 | 1  // 0: Lock, 1: Unlock
  type: number // 0 | 1 | 2 | 3  // 0: init, 1: video, 2: text, 3: excercise, 4: flashcard
  allow_video_rewind: number
  content?: string
  slug?: string
  reference_id?: number
  course_id: number
  order: number
  is_free: number  // 0 | 1
  active: boolean
  seo_key?: string
  seo_title?: string
  seo_description?: string
  time: string
  medias?: Media[]
  parent?: Lesson,
  questions?: Question[],
  group_questions?: GroupQuestion[]
  encrypt_process: any
  created_at: string
  updated_at: string
  open?: boolean
  children?: Lesson[]
}

export enum LessonStatus {
  Lock = 0,
  Unlock = 1,
}

export enum LessonType {
  Init = 0,
  Content = 1,
  Exercise = 2,
  Flashcard = 3,
}

export interface LessonList {
  id: number
  title: string
}