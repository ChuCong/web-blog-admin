import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Paginate, Permission } from '@/model'

interface PermissionState {
    permissionDetail: Permission | null;
    permissions: Permission[] | null;
    paginate: Paginate | null;
}

export const usePermissionStore = defineStore('permission', {
    state: (): PermissionState => ({
        permissionDetail: null,
        permissions: null,
        paginate: null
    }),

    actions: {
        async fetchPermission() {
            this.permissions = [];
            this.paginate = null;
            const response = await ApiService.get('/permissions');
            this.permissions = response.data.data || [];
            this.paginate = response.data.data?.paginate || null;
        }
    }
})
