import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Notification } from '@/model/Notification';

interface NotificationState {
  notifications: Notification[];
  notificationDetail: Notification | null;
  paginate: any;
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [],
    notificationDetail: null,
    paginate: null,
  }),
  actions: {
    async fetchNotifications(params?: any) {
      const res = await ApiService.query('notifications', params);
      this.notifications = res.data.data.data || [];
      this.paginate = res.data.data.paginate || null;
    },
    async getNotificationDetail(id: number) {
      const res = await ApiService.get(`notifications/${id}`);
      this.notificationDetail = res.data.data || null;
    },
    async saveNotification(payload: Notification) {
      if (payload.id) {
        const res = await ApiService.update('notifications', payload.id, payload);
        return res.data;
      } else {
        const res = await ApiService.post('notifications', payload);
        return res.data;
      }
    },
    async deleteNotification(id: number) {
      const res = await ApiService.delete('notifications', id);
      return res.data.status === 1;
    },
    async updateNotificationStatus(id: number, status: number) {
      const res = await ApiService.update(`notifications/status`, id, { status: status });
      return res.data.status === 1;
    },
    async uploadImage(formData: FormData) {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      const response = await ApiService.post('notifications/upload-image', formData, config)
      return response.data?.data
    }
  }
});