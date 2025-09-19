import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Faq, Paginate } from '@/model'

interface ReportState {
    data: any;
}

export const useReportStore = defineStore('report', {
    state: (): ReportState => ({
        data: {}
    }),

    actions: {
        async fetchData(params) {
            this.data = {};
            const response = await ApiService.query('report/dashboard', params);
            if (response.data.status) {
                this.data = response.data.data
                console.log(this.data)
            }
            console.log(response);
        }
    }
})
