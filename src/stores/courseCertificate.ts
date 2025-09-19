import { defineStore } from 'pinia'
import ApiService from '@/common/api.service'
import type { CourseCertificate } from '@/model/CourseCertificate'

interface CourseCertificateState {
  courseCertificates: CourseCertificate[]
  courseCertificateDetail: CourseCertificate | null
  paginate: any
}

export const useCourseCertificateStore = defineStore('courseCertificate', {
  state: (): CourseCertificateState => ({
    courseCertificates: [],
    courseCertificateDetail: null,
    paginate: null
  }),

  actions: {
    async fetchCourseCertificates(params?: any) {
      const response = await ApiService.query('course-certificates', params)
      this.courseCertificates = response.data.data.data || []
      this.paginate = response.data.data.paginate || null
    },

    async getCourseCertificateDetail(id: number) {
      const response = await ApiService.get(`course-certificates/${id}`)
      this.courseCertificateDetail = response.data.data || null
    },

    async saveCourseCertificate(data: CourseCertificate) {
      if (data.id) {
        const response = await ApiService.update('course-certificates', data.id, data)
        return response.data
      } else {
        const response = await ApiService.post('course-certificates', data)
        return response.data
      }
    },

    async deleteCourseCertificate(id: number) {
      const response = await ApiService.delete('course-certificates', id)
      return response.data.status === 1
    }
  }
})