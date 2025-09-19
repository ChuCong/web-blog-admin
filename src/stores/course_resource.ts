import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { CourseResource, Paginate } from '@/model'

interface CourseResourceState {
    resource: CourseResource[];
    resourceDetail: CourseResource | null;
    paginate: Paginate | null;
}

export const useCourseResourceStore = defineStore('course_resource', {
    state: (): CourseResourceState => ({
        resource: [],
        resourceDetail: null,
        paginate: null
    }),

    actions: {
        async fetchResource(params) {
            this.resource = [];
            this.paginate = null;
            const response = await ApiService.query('course-resources', params);
            this.resource = response.data.data.data || [];
            this.paginate = response.data.data.paginate || null
        },

        async getResourceDetail(id: number) {
            const response = await ApiService.get(`course-resources`, id);
            this.resourceDetail = response.data.data || null;
        },

        async saveResource(resource: CourseResource) {
            if (resource.id) {
                const response = await ApiService.update('course-resources', resource.id, resource);
                return response.data;
            } else {
                const response = await ApiService.post('course-resources', resource);
                return response.data;
            }
        },

        async deleteResource(id: number) {
            const response = await ApiService.delete('course-resources', id);
            return response.data.status === 1;
        },
        
        async uploadResourceImage(payload) {
            const data = await ApiService.post('course-resources/upload-image', payload);
            return data.data.data;
        },
       
    },
})
