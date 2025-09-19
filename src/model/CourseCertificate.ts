import type { Course, CertificateTemplate } from "@/model"

export interface CourseCertificate {
    id?: number
    course_id: number
    certificate_template_id: number
    created_at?: string
    updated_at?: string
    course?: Course
    certificate_template?: CertificateTemplate
}