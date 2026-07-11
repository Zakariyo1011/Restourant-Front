import { defineStore } from 'pinia'
import api from '../axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        isLoading: false,
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
        isOwner: (state) => state.user?.role === 'owner',
        isAdmin: (state) => state.user?.role === 'admin',
        isActive: (state) => state.user?.is_active === true,
    },

    actions: {
        async fetchUser() {
            if (!this.token) return
            try {
                const res = await api.get('/me')
                this.user = res.data.user
            } catch (error) {
                if (error?.response?.status === 401 || error?.response?.status === 419) {
                    this.logout()
                    return
                }
            }
        },

        setToken(token) {
            this.token = token
            localStorage.setItem('token', token)
        },

        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
        }
    }
})