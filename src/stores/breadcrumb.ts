import { defineStore } from 'pinia';

interface BreadcrumbState {
  breadcrumbs: { title?: string; titledad?: string }[] ;
}

export const useBreadcrumbStore = defineStore('breadcrumb', {
  state: (): BreadcrumbState => ({
    breadcrumbs: [] as { title?: string; titledad?: string }[]
  }),

  getters: {
    breadcrumbs(state) {
      return state.breadcrumbs
    },

    pageTitle(state) {
      const last = state.breadcrumbs[state.breadcrumbs.length - 1]
      if (last && last.titledad && last.title) {
        return `${last.titledad} - ${last.title}`
      }
      return last?.title || ''
    }
  },

  actions: {
    setBreadcrumb(payload: { title?: string; titledad?: string }[] | any[]) {
      this.breadcrumbs = payload
    },

    addBreadcrumb(payload: { title?: string; titledad?: string }[] | any) {
      if (Array.isArray(payload)) {
        payload.forEach(item => {
          this.breadcrumbs.push(item)
        })
      } else {
        this.breadcrumbs.push(payload)
      }
    }
  }
})
