import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Banner, Paginate } from '@/model'
import { log } from 'console';

interface BannerState {
    banners: Banner[];
    bannerDetail: Banner | null;
    paginate: Paginate | null;
}

export const useBannerStore = defineStore('banner', {
    state: (): BannerState => ({
        banners: [],
        bannerDetail: null,
        paginate: null
    }),

    actions: {
        async fetchBanners(params) {
            this.banners = [];
            this.paginate = null;
            const response = await ApiService.query('/banners', params);
            this.banners = response.data.data.data || [];
            this.paginate = response.data.data?.paginate || null;
        },

        async getBannerDetail(id: number) {
            const response = await ApiService.get(`banners`, id);
            this.bannerDetail = response.data.data || null;
        },

        async saveBanner(bannerItem: Banner) {
            if (bannerItem.id) {
                const response = await ApiService.update('banners', bannerItem.id, bannerItem);
                return response.data;
            } else {
                const response = await ApiService.post('banners', bannerItem);
                return response.data;
            }
        },

        async deleteBanner(id: number) {
            const response = await ApiService.delete('banners', id);
            return response.data.status === 1;
        },
        async uploadNewImage(payload) {
            const data = await ApiService.post('/banners-upload', payload);
            return data.data.data;
        },
    }
})
