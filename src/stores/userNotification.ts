import { defineStore } from 'pinia'
import ApiService from '@/common/api.service'
import type { Paginate, UserNotification } from '@/model'

interface UserNotificationState {
  usernotifications: UserNotification[]
  usernotificationDetail: UserNotification | null
  paginate: Paginate | null
}

export const useUserNotificationStore = defineStore('userNotification', {
  state: (): UserNotificationState => ({
    usernotifications: [],
    usernotificationDetail: null,
    paginate: null
  }),

  actions: {
    async fetchUserNotifications(params) {
      this.usernotifications = []
      this.paginate = null
      const response = await ApiService.query('user-notifications', params)
      this.usernotifications = response.data.data.data || []
      this.paginate = response.data.data.paginate || null
    },
    async getUserNotificationDetail(id: number) {
      const response = await ApiService.get(`user-notifications/${id}`)
      this.usernotificationDetail = response.data.data || null
    },
    async deleteUserNotification(id: number) {
      return await ApiService.delete('user-notifications', id)
    }
  }
})