const API_ORIGIN = (
    import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') ||
    'https://restourant-production-6ae5.up.railway.app'
)

/** ImageKit to'liq URL yoki storage relative path → brauzer uchun to'g'ri src */
export function resolveImageUrl(path) {
    if (!path || typeof path !== 'string') return null

    const trimmed = path.trim()
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed
    }

    const clean = trimmed.replace(/^\/+/, '')
    return `${API_ORIGIN}/storage/${clean}`
}

export { API_ORIGIN }
