import { defineStore } from 'pinia'
import ApiService from '@/common/api.service'
import type { CertificateTemplate } from '@/model/CertificateTemplate'

interface CertificateTemplateState {
  templates: CertificateTemplate[]
  templateDetail: CertificateTemplate | null
  paginate: any
}

export const useCertificateTemplateStore = defineStore('certificateTemplate', {
  state: (): CertificateTemplateState => ({
    templates: [],
    templateDetail: null,
    paginate: null,
  }),

  actions: {
    async fetchTemplates(params?: any) {
      const response = await ApiService.query('certificate-templates', params)
      this.templates = response.data.data.data || []
      this.paginate = response.data.data.paginate || null
    },

    async getTemplateDetail(id: number) {
      const response = await ApiService.get(`certificate-templates/${id}`)
      this.templateDetail = response.data.data || null
    },

    async saveTemplate(template: CertificateTemplate) {
      if (template.id) {
        const response = await ApiService.update('certificate-templates', template.id, template)
        return response.data
      } else {
        const response = await ApiService.post('certificate-templates', template)
        return response.data
      }
    },

    async deleteTemplate(id: number) {
      const response = await ApiService.delete('certificate-templates', id)
      return response.data.status === 1
    },

    async uploadImage(formData: FormData) {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      const response = await ApiService.post('certificate-templates/upload-image', formData, config)
      return response.data?.data
    },

    async previewTemplate(template: CertificateTemplate) {
      const response = await ApiService.post('certificate-templates/preview', template)
      return response.data
    },

    async fetchAllTemplates() {
      const response = await ApiService.get('certificate-templates/all');
      return response.data.data || [];
    }
  }
})