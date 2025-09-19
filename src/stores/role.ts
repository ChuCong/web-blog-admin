import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Paginate, Role } from '@/model'

interface RoleState {
    roleDetail: Role | null;
    roles: Role[] | null;
    paginate: Paginate | null;
}

export const useRoleStore = defineStore('role', {
    state: (): RoleState => ({
        roleDetail: null,
        roles: null,
        paginate: null
    }),

    actions: {
        async fetchRole(params) {
            this.roles = [];
            this.paginate = null;
            const response = await ApiService.query('/roles', params);
            this.roles = response.data.data.data || [];
            this.paginate = response.data.data?.paginate || null;
        },

        async getRoleDetail(id: number) {
            this.roleDetail = null;
            const response = await ApiService.get(`roles`, id);
            this.roleDetail = response.data.data || null;
        },

        async saveRole(roleItem: Role) {
            // if (roleItem.id) {
            //     const response = await ApiService.update('roles', roleItem.id, roleItem);
            //     return response.data;
            // } else {
                const response = await ApiService.post('roles', roleItem);
                return response.data;
            // }
        },

        async updateRole(roleItem: Role) {
            const response = await ApiService.update('roles', roleItem.id, roleItem);
            return response.data;
        },

        async deleteRole(id: number) {
            const response = await ApiService.delete('roles', id);
            return response.data.status === 1;
        },

       
    }
})
