const STORAGE_KEY = 'theme'

export function getStoredMode() {
    try {
        const value = localStorage.getItem(STORAGE_KEY)
        if (value === 'light' || value === 'dark' || value === 'system') return value
    } catch { /* ignore */ }
    return 'system'
}

export function setStoredMode(mode) {
    try { localStorage.setItem(STORAGE_KEY, mode) } catch { /* ignore */ }
}

export function systemPrefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function resolveTheme(mode) {
    return mode === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : mode
}

export function applyTheme(mode) {
    document.documentElement.setAttribute('data-theme', resolveTheme(mode))
}
