import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { User } from '@/model/User';

interface UserState {
  users: User[];
  paginate: any;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    paginate: null
  }),
  actions: {
    async fetchUsers(params: any) {
      const res = await ApiService.query('user', params);
      this.users = res.data.data.data || [];
      this.paginate = res.data.data.paginate || null;
    },
    async fetchAllUsers() {
      const res = await ApiService.get('user/all');
      return res.data.data || [];
    },
    async updateStatus(userId: number, status: number) {
      const res = await ApiService.update('user/status', userId, { status: status});
      return res.data.status === 1;
    },
    async exportExcel() {
      const res = await ApiService.export('user/export');
      if (res.data) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        return true;
      } else {
        return false;
      }
    }
  }
});