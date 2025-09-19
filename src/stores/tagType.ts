import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { TagType } from '@/model'

interface TagTypeState {
  tagTypes: TagType[];
  tagTypeDetail: TagType | null;
}

export const useTagTypeStore = defineStore('tagType', {
  state: (): TagTypeState => ({
    tagTypes: [],
    tagTypeDetail: null,
  }),

  actions: {
    async fetchTagTypes() {
      const response = await ApiService.get('tagTypes');
      this.tagTypes = response.data.data || [];
    },

    async getTagTypeDetail(id: number) {
      const response = await ApiService.get(`tagTypes`, id);
      this.tagTypeDetail = response.data.data || null;
    },

    async saveTagType(tagType: TagType) {
      if (tagType.id) {
        const response = await ApiService.update('tagTypes', tagType.id, tagType);
        return response.data;
      } else {
        const response = await ApiService.post('tagTypes', tagType);
        return response.data;
      }
    },

    async deleteTagType(id: number) {
      const response = await ApiService.delete('tagTypes', id);
      return response.data.status === 1;
    }
  }
})
