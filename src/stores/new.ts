import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { News, Paginate } from '@/model'
import { log } from 'console';

interface NewsState {
    news: News[];
    newDetail: News | null;
    paginate: Paginate | null;
}

export const useNewsStore = defineStore('news', {
    state: (): NewsState => ({
        news: [],
        newDetail: null,
        paginate: null
    }),

    actions: {
        async fetchNews(params) {
            this.news = [];
            this.paginate = null;
            const response = await ApiService.query('/news', params);
            this.news = response.data.data.data || [];
            this.paginate = response.data.data?.paginate || null;
        },

        async getNewDetail(id: number) {
            const response = await ApiService.get(`news`, id);
            this.newDetail = response.data.data || null;
        },

        async saveNew(newsItem: News) {
            if (newsItem.id) {
                const response = await ApiService.update('news', newsItem.id, newsItem);
                return response.data;
            } else {
                const response = await ApiService.post('news', newsItem);
                return response.data;
            }
        },

        async deleteNew(id: number) {
            const response = await ApiService.delete('news', id);
            return response.data.status === 1;
        },
        async uploadNewImage(payload) {
            const data = await ApiService.post('/news-upload', payload);
            return data.data.data;
        },
    }
})
