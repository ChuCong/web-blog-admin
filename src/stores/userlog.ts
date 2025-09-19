import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Paginate, UserLog } from '@/model';

interface UserLogState {
  userlogs: UserLog[];
  userlogDetail: UserLog | null;
  paginate: Paginate | null;
}

export const useUserLogStore = defineStore('userlog', {
  state: (): UserLogState => ({
    userlogs: [],
    userlogDetail: null,
    paginate: null
  }),

  actions: {
    async fetchUserLogs(params) {
      this.userlogs = [];
      this.paginate = null;
      const response = await ApiService.query('user-log', params);
      this.userlogs = response.data.data.data || [];
      this.paginate = response.data.data.paginate || null;
    },
  },
});