import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Faq, Paginate } from '@/model'

interface FaqState {
    faq: Faq[];
    faqDetail: Faq | null;
    paginate: Paginate | null;
}

export const useFaqStore = defineStore('faq', {
    state: (): FaqState => ({
        faq: [],
        faqDetail: null,
        paginate: null
    }),

    actions: {
        async fetchFaq(params) {
            this.faq = [];
            this.paginate = null;
            const response = await ApiService.query('faq', params);
            this.faq = response.data.data.data || [];
            this.paginate = response.data.data.paginate || null
        },

        async getFaqDetail(id: number) {
            const response = await ApiService.get(`faq`, id);
            this.faqDetail = response.data.data || null;
        },

        async saveFaq(faq: Faq) {
            if (faq.id) {
                const response = await ApiService.update('faq', faq.id, faq);
                return response.data;
            } else {
                const response = await ApiService.post('faq', faq);
                return response.data;
            }
        },

        async deleteFaq(id: number) {
            const response = await ApiService.delete('faq', id);
            return response.data.status === 1;
        },


    },
})
