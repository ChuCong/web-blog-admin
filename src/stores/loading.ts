import { defineStore } from 'pinia';

interface LoadingState {
  isLoading: boolean;
}

export const useLoadingStore = defineStore('loading', {
  state: (): LoadingState => ({
    isLoading: false
  }),

  actions: {
    async setLoading(loading) {
      this.isLoading = loading;
    }
  },
});