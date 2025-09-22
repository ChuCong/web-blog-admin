import { defineStore } from 'pinia';
import ApiService from '@/common/api.service';
import type { Category } from '@/model'
import { Article } from '@/model/Article';

interface ArticleState {
  articles: Article[];
  articleDetail: Article | null;
  paginate: any;
}

export const useArticleStore = defineStore('article', {
  state: (): ArticleState => ({
    articles: [],
    articleDetail: null,
    paginate: null
  }),

  actions: {
    async fetchArticles(params?: any) {
      const response = await ApiService.query('articles', params);
      console.log(response.data);
      this.articles = response.data.data.data || [];
      this.paginate = response.data.data.paginate || null;
    },

    async getArticleDetail(id: number) {
      const response = await ApiService.get(`articles`, id);
      this.articleDetail = response.data.data || null;
    },

    async saveArticle(article: Article) {
      console.log(article)
      if (article.id) {
        const response = await ApiService.update('articles', article.id, article);
        return response.data;
      } else {
        const response = await ApiService.post('articles', article);
        return response.data;
      }
    },

    async deleteArticle(id: number) {
      const response = await ApiService.delete('articles', id);
      return response.data.status === 1;
    },

    async uploadImage(formData: FormData) {
      const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
      };
      const response = await ApiService.post('articles/upload-image', formData, config);
      return response.data?.data;
    },
  },
})
