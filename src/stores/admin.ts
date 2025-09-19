import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Paginate, Admin } from '@/model'

interface AdminState {
    admins: Admin[];
    adminDetail: Admin | null;
    roleAdminAuth: Admin | null;
    paginate: Paginate | null;
}

export const useAdminStore = defineStore('admin', {
    state: (): AdminState => ({
        admins: [],
        adminDetail: null,
        roleAdminAuth: null,
        paginate: null
    }),

    actions: {
        async fetchAdmin(params) {
            this.admins = [];
            this.paginate = null;
            const response = await ApiService.query('/admins', params);
            this.admins = response.data.data.data || [];
            this.paginate = response.data.data?.paginate || null;
        },

        async getAdminDetail(id: number) {
            this.adminDetail = null;
            const response = await ApiService.get(`admins`, id);
            this.adminDetail = response.data.data || null;
        },

        async saveAdmin(adminItem: Admin) {
            if (adminItem.id) {
                const response = await ApiService.update('admins', adminItem.id, adminItem);
                return response.data;
            } else {
                const response = await ApiService.post('admins', adminItem);
                return response.data;
            }
        },

        async deleteAdmin(id: number) {
            const response = await ApiService.delete('admins', id);
            return response.data.status === 1;
        },

        async getRoleAuth() {
            this.roleAdminAuth = null;
            const response = await ApiService.get(`auth/me`);
            this.roleAdminAuth = response.data.data || null;
        },

        async sendEmail(params) {
            const response = await ApiService.post('/send-email', params);
            return response.data;
        },
        async changePassword(params) {
            const response = await ApiService.post('/change-password', params);
            return response.data;
        },
    }
})
