export interface CertificateTemplate {
  id: number
  name: string
  image?: string
  image_url?: string
  fields?: {
    [key: string]: { top: number; left: number }
  }
  is_default: boolean
  created_at?: string
  updated_at?: string
}