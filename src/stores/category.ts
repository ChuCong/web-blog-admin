import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Category } from '@/model'

interface CategoryState {
  categories: Category[];
  categoryDetail: Category | null;
  paginate: any;
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    categories: [],
    categoryDetail: null,
    paginate: null
  }),

  actions: {
    async fetchCategories(params?: any) {
      const response = await ApiService.query('categories', params);
      console.log(response.data);
      this.categories = response.data.data.data || [];
      this.paginate = response.data.data.paginate || null;
    },

    async getCategoryDetail(id: number) {
      const response = await ApiService.get(`categories`, id);
      this.categoryDetail = response.data.data || null;
    },

    async saveCategory(category: Category) {
      console.log(category)
      if (category.id) {
        const response = await ApiService.update('categories', category.id, category);
        return response.data;
      } else {
        const response = await ApiService.post('categories', category);
        return response.data;
      }
    },

    async deleteCategory(id: number) {
      const response = await ApiService.delete('categories', id);
      return response.data.status === 1;
    },

    async uploadImage(formData: FormData) {
      const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
      };
      const response = await ApiService.post('categories/upload-image', formData, config);
      return response.data?.data;
    },
  },
})
