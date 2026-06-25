import { defineStore } from 'pinia'

export const useTypeStore = defineStore('type', {
  state: () => ({
    types: [],
  }),

  getters: {
    typeMap: (state) => Object.fromEntries(state.types.map((t) => [t.name, t.sprite])),
    isLoaded: (state) => state.types.length > 0,
  },

  actions: {
    async fetch() {
      if (this.isLoaded) return
      const { getTypeList } = usePokeApi()
      this.types = await getTypeList()
    },
  },
})
