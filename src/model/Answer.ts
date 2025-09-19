export interface Answer {
  id: number
  content?: string
  is_correct?: number  // 1: đúng, 0: sai (có thể dùng boolean thay thế)
  question_id: number
  image_id?: number
  index_correct?: number
  created_at: string
  updated_at: string
}