const API_ORIGIN = (
    import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') ||
    'https://restourant-production-6ae5.up.railway.app'
)

// VAQTINCHALIK: API rasmlari hozircha ishlamayapti, shuning uchun har doim placeholder qaytaramiz
const FORCE_PLACEHOLDER = true

export const IMAGE_PLACEHOLDER = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f0f0f0"/>
  <circle cx="200" cy="150" r="54" fill="#ffffff"/>
  <circle cx="200" cy="150" r="54" fill="none" stroke="#dcdcdc" stroke-width="2"/>
  <g stroke="#1D9E75" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.55">
    <line x1="176" y1="122" x2="176" y2="178"/>
    <line x1="168" y1="122" x2="168" y2="140"/>
    <line x1="184" y1="122" x2="184" y2="140"/>
    <path d="M168 140q0 10 8 10t8-10"/>
    <path d="M226 122c-10 0-16 8-16 20s6 16 12 18v18"/>
  </g>
</svg>
`)

/** ImageKit to'liq URL yoki storage relative path → brauzer uchun to'g'ri src */
export function resolveImageUrl(path) {
    if (FORCE_PLACEHOLDER) return IMAGE_PLACEHOLDER
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
