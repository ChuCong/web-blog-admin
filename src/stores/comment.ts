import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Paginate, Comment } from '@/model'

interface CommentState {
    comment: Comment[];
    commentDetail: Comment | null;
    paginate: Paginate | null;
}

export const useCommentStore = defineStore('comment', {
    state: (): CommentState => ({
        comment: [],
        commentDetail: null,
        paginate: null
    }),

    actions: {
        async fetchComment(params) {
            this.comment = [];
            this.paginate = null;
            const response = await ApiService.query('comment', params);
            this.comment = response.data.data.data || [];
            this.paginate = response.data.data.paginate || null
        },

        async deleteComment(id: number) {
            const response = await ApiService.delete('comment', id);
            return response.data.status === 1;
        },


    },
})
