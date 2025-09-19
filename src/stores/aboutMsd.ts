import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { AboutMsd, Paginate } from '@/model'
import { log } from 'console';

interface AboutMsdState {
    aboutMsd: AboutMsd[];
    aboutMsdDetail: AboutMsd | null;
    paginate: Paginate | null;
}

export const useAboutMsdStore = defineStore('aboutMsd', {
    state: (): AboutMsdState => ({
        aboutMsd: [],
        aboutMsdDetail: null,
        paginate: null
    }),

    actions: {
        async fetchAboutMsd(params) {
            this.aboutMsd = [];
            this.paginate = null;
            const response = await ApiService.query('/about-msd', params);
            this.aboutMsd = response.data.data.data || [];
            this.paginate = response.data.data?.paginate || null;
        },

        async getAboutMsdDetail(id: number) {
            const response = await ApiService.get(`/about-msd`, id);
            this.aboutMsdDetail = response.data.data || null;
        },

        async saveAboutMsd(aboutMsdItem: AboutMsd) {
            if (aboutMsdItem.id) {
                const response = await ApiService.update('/about-msd', aboutMsdItem.id, aboutMsdItem);
                return response.data;
            } else {
                const response = await ApiService.post('/about-msd', aboutMsdItem);
                return response.data;
            }
        },

        async deleteAboutMsd(id: number) {
            const response = await ApiService.delete('/about-msd', id);
            return response.data.status === 1;
        },
        async uploadAboutMsdImage(payload) {
            const data = await ApiService.post('/about-msd-upload', payload);
            return data.data.data;
        },
    }
})
