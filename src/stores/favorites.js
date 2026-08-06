import { defineStore } from 'pinia'
import api from '../axios'

export const useFavoritesStore = defineStore('favorites', {
    state: () => ({
        ids: new Set(),
        items: [],
        loaded: false,
        loading: false,
    }),

    getters: {
        isFavorited: (state) => (restaurantId) => state.ids.has(Number(restaurantId)),
        count: (state) => state.ids.size,
    },

    actions: {
        async fetch() {
            if (this.loading) return
            this.loading = true
            try {
                const res = await api.get('/favorites')
                this.items = res.data.data || []
                this.ids = new Set(this.items.map((r) => Number(r.id)))
                this.loaded = true
            } catch {
                // keep whatever we had; guest/unauthenticated users just see empty state
            } finally {
                this.loading = false
            }
        },

        async toggle(restaurant) {
            const id = Number(restaurant.id)
            const wasFavorited = this.ids.has(id)

            if (wasFavorited) {
                this.ids.delete(id)
                this.items = this.items.filter((r) => Number(r.id) !== id)
            } else {
                this.ids.add(id)
                this.items = [...this.items, restaurant]
            }

            try {
                if (wasFavorited) {
                    await api.delete(`/favorites/${id}`)
                } else {
                    await api.post(`/favorites/${id}`)
                }
            } catch {
                // revert optimistic update on failure
                if (wasFavorited) {
                    this.ids.add(id)
                    this.items = [...this.items, restaurant]
                } else {
                    this.ids.delete(id)
                    this.items = this.items.filter((r) => Number(r.id) !== id)
                }
            }
        },

        reset() {
            this.ids = new Set()
            this.items = []
            this.loaded = false
        },
    },
})
