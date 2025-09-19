import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Resource, Paginate } from '@/model'

interface ResourceState {
    resource: Resource[];
    resourceDetail: Resource | null;
    paginate: Paginate | null;
}

export const useResourceStore = defineStore('resource', {
    state: (): ResourceState => ({
        resource: [],
        resourceDetail: null,
        paginate: null
    }),

    actions: {
        async fetchResource(params) {
            this.resource = [];
            this.paginate = null;
            const response = await ApiService.query('resource', params);
            this.resource = response.data.data.data || [];
            this.paginate = response.data.data.paginate || null
        },

        async getResourceDetail(id: number) {
            const response = await ApiService.get(`resource`, id);
            this.resourceDetail = response.data.data || null;
        },

        async saveResource(resource: Resource) {
            if (resource.id) {
                const response = await ApiService.update('resource', resource.id, resource);
                return response.data;
            } else {
                const response = await ApiService.post('resource', resource);
                return response.data;
            }
        },

        async deleteResource(id: number) {
            const response = await ApiService.delete('resource', id);
            return response.data.status === 1;
        },
        async uploadResource(payload) {
            const data = await ApiService.post('resource/upload', payload);
            return data.data.data;
        },
       
    },
})
