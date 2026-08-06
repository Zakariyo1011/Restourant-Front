import { defineStore } from 'pinia'
import { applyTheme, getStoredMode, resolveTheme, setStoredMode } from '../utils/theme'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        mode: getStoredMode(),
    }),

    getters: {
        effective: (state) => resolveTheme(state.mode),
    },

    actions: {
        setMode(mode) {
            this.mode = mode
            setStoredMode(mode)
            applyTheme(mode)
        },

        watchSystem() {
            const mq = window.matchMedia('(prefers-color-scheme: dark)')
            mq.addEventListener('change', () => {
                if (this.mode === 'system') applyTheme(this.mode)
            })
        },
    },
})
