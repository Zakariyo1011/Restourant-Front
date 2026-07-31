import L from 'leaflet'

const escapeHtml = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * Yandex Eats uslubidagi doira-rasm + nom pin.
 * @param {{name?: string}} restaurant
 * @param {string|null} imageUrl - resolveImageUrl orqali tayyorlangan to'liq URL
 * @param {{ size?: number, highlighted?: boolean }} [options]
 */
export function buildRestaurantPinIcon(restaurant, imageUrl, options = {}) {
    const size = options.size || 52
    const label = escapeHtml(restaurant?.name || '')
    const safeImage = imageUrl ? escapeHtml(imageUrl) : ''

    const media = safeImage
        ? `<img src="${safeImage}" alt="" />`
        : `<div class="map-pin-fallback"><i class="fas fa-utensils"></i></div>`

    const html = `
        <div class="map-pin ${options.highlighted ? 'map-pin--active' : ''}">
            <div class="map-pin-photo" style="width:${size}px;height:${size}px;">${media}</div>
            ${label ? `<div class="map-pin-label">${label}</div>` : ''}
        </div>
    `

    return L.divIcon({
        html,
        className: 'restaurant-map-pin-wrap',
        iconSize: [size + 16, size + 30],
        iconAnchor: [(size + 16) / 2, size + 14],
        popupAnchor: [0, -(size + 10)],
    })
}
