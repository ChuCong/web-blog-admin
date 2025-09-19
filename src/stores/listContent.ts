import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { ListContent, Paginate } from '@/model'
import { log } from 'console';

interface ListContentState {
    listContents: ListContent[];
    listContentDetail: ListContent | null;
    paginate: Paginate | null;
}

export const useListContentStore = defineStore('listContent', {
    state: (): ListContentState => ({
        listContents: [],
        listContentDetail: null,
        paginate: null
    }),

    actions: {
        async getListContentDetail(id: number) {
            const response = await ApiService.get(`list-contents`, id);
            this.listContentDetail = response.data.data || null;
        },

        async saveListContent(listContentItem: ListContent) {
            if (listContentItem.id) {
                const response = await ApiService.update('list-contents', listContentItem.id, listContentItem);
                return response.data;
            }
        },

        async deleteListContent(id: number) {
            const response = await ApiService.delete('list-contents', id);
            return response.data.status === 1;
        },

    }
})
