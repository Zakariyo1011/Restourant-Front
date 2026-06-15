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

    // Agar rasm yo'li allaqachon 'storage/' bilan boshlansa, qaytadan qo'shmaymiz
    if (clean.startsWith('storage/')) {
        return `${API_ORIGIN}/${clean}`
    }

    // Aks holda (masalan, shunchaki 'restaurants/abc.jpg' bo'lsa) qo'shib beramiz
    return `${API_ORIGIN}/storage/${clean}`
}

export { API_ORIGIN }
