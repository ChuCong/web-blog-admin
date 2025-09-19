import { defineStore } from 'pinia'
import ApiService from '@/common/api.service'

export const useImageStore = defineStore('image', {
  actions: {
    async uploadImage(formData: FormData) {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      const response = await ApiService.post('image/upload', formData, config)
      return response.data?.data
    }
  }
})