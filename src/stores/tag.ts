import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Tag } from '@/model'

interface TagState {
  tags: Tag[];
  tagDetail: Tag | null;
  paginate: any;
}

export const useTagStore = defineStore('tag', {
  state: (): TagState => ({
    tags: [],
    tagDetail: null,
    paginate: null
  }),

  actions: {
    async fetchTags(params?: any) {
      const response = await ApiService.query('tags', params);
      this.tags = response.data.data.data || [];
      this.paginate = response.data.data.paginate || null;
    },

    async getTagDetail(id: number) {
      const response = await ApiService.get(`tags`, id);
      this.tagDetail = response.data.data || null;
    },

    async saveTag(tag: Tag) {
      if (tag.id) {
        const response = await ApiService.update('tags', tag.id, tag);
        return response.data;
      } else {
        const response = await ApiService.post('tags', tag);
        return response.data;
      }
    },

    async deleteTag(id: number) {
      const response = await ApiService.delete('tags', id);
      return response.data.status === 1;
    }
  }
})
