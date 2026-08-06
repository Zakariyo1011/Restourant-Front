<template>
    <div class="directions-page">
        <div class="directions-topbar">
            <button class="icon-btn" @click="$router.back()">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h1>{{ t('directions.title') }}</h1>
            <span class="icon-btn-spacer"></span>
        </div>

        <div class="route-rows">
            <div class="route-row">
                <span class="route-dot route-dot--origin"><i class="fas fa-location-arrow"></i></span>
                <span class="route-text">{{ t('directions.myLocation') }}</span>
            </div>
            <div class="route-row">
                <span class="route-dot route-dot--dest"><i class="fas fa-map-marker-alt"></i></span>
                <span class="route-text">{{ restaurant?.name || '…' }}</span>
            </div>
        </div>

        <div v-if="restaurant" class="mode-tabs">
            <button
                v-for="mode in MODES"
                :key="mode.key"
                type="button"
                class="mode-tab"
                :class="{ 'mode-tab--active': selectedMode === mode.key }"
                :disabled="!origin || (!routesLoading && !results[mode.key])"
                @click="selectedMode = mode.key"
            >
                <i :class="['fas', mode.icon]"></i>
                <span class="mode-time" v-if="results[mode.key]">{{ formatDuration(results[mode.key].duration) }}</span>
                <span class="mode-time mode-time--pending" v-else-if="origin && routesLoading">
                    <i class="fas fa-spinner fa-spin"></i>
                </span>
                <span class="mode-time mode-time--pending" v-else>—</span>
            </button>
        </div>

        <div class="map-wrap">
            <div :id="mapId" class="map-canvas"></div>

            <div v-if="!origin && !locationError" class="map-status">
                <i class="fas fa-spinner fa-spin"></i>
                <span>{{ t('directions.locating') }}</span>
            </div>
            <div v-else-if="locationError" class="map-status map-status--error">
                <i class="fas fa-triangle-exclamation"></i>
                <span>{{ locationError }}</span>
                <button type="button" class="retry-btn" @click="locate">{{ t('directions.retry') }}</button>
            </div>
        </div>

        <div class="bottom-card" v-if="restaurant">
            <template v-if="activeResult">
                <div class="bottom-main">
                    <span class="bottom-duration">{{ formatDuration(activeResult.duration) }}</span>
                    <span class="bottom-distance">({{ formatDistance(activeResult.distance) }})</span>
                </div>
                <p class="bottom-sub">
                    {{ selectedMode === 'transit' ? t('directions.estimated') : t('directions.fastestRoute') }}
                </p>
                <button type="button" class="start-btn" @click="startNavigation">
                    <i class="fas fa-location-arrow"></i>
                    {{ t('directions.start') }}
                </button>
            </template>
            <p v-else-if="!origin" class="bottom-empty">{{ t('directions.enableLocation') }}</p>
            <p v-else class="bottom-empty">{{ t('directions.routeUnavailable') }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import api from '../axios'
import { resolveCurrentPosition, getLocationErrorMessage } from '../composables/useGeolocation'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow })

const OSRM_BASE = 'https://router.project-osrm.org/route/v1'
const MODES = [
    { key: 'car', icon: 'fa-car', profile: 'driving', travelmode: 'driving' },
    { key: 'transit', icon: 'fa-bus', profile: null, travelmode: 'transit' },
    { key: 'walk', icon: 'fa-person-walking', profile: 'foot', travelmode: 'walking' },
    { key: 'bike', icon: 'fa-bicycle', profile: 'bike', travelmode: 'bicycling' },
]

const route = useRoute()
const { t } = useI18n()

const restaurant = ref(null)
const origin = ref(null)
const locationError = ref('')
const selectedMode = ref('car')
const results = ref({})
const routesLoading = ref(false)
const mapId = `directions-map-${Math.random().toString(36).slice(2)}`

let map = null
let routeLine = null
let originMarker = null
let destMarker = null

const destination = computed(() => {
    if (!restaurant.value?.location) return null
    return {
        lat: parseFloat(restaurant.value.location.latitude),
        lng: parseFloat(restaurant.value.location.longitude),
    }
})

const activeResult = computed(() => results.value[selectedMode.value] || null)

function formatDuration(seconds) {
    const min = Math.max(1, Math.round(seconds / 60))
    return `${min} ${t('directions.min')}`
}

function formatDistance(meters) {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
    return `${Math.round(meters)} m`
}

async function fetchRoute(profile, from, to) {
    const url = `${OSRM_BASE}/${profile}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
    const res = await fetch(url)
    if (!res.ok) throw new Error('OSRM request failed')
    const data = await res.json()
    if (data.code !== 'Ok' || !data.routes?.length) throw new Error('No route found')
    const best = data.routes[0]
    return {
        distance: best.distance,
        duration: best.duration,
        coords: best.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    }
}

// Ommaviy transport uchun bepul marshrut API mavjud emas — piyoda tezligiga
// asoslangan taxminiy vaqt (o'rtacha shahar transporti tezligi + kutish vaqti).
function estimateTransit(distanceMeters) {
    const AVG_SPEED_MPS = 5 // ~18 km/h
    const WAIT_SECONDS = 240
    return {
        distance: distanceMeters,
        duration: distanceMeters / AVG_SPEED_MPS + WAIT_SECONDS,
        coords: null,
    }
}

async function loadRoutes() {
    if (!origin.value || !destination.value) return

    results.value = {}
    routesLoading.value = true
    for (const mode of MODES) {
        if (!mode.profile) continue
        try {
            const result = await fetchRoute(mode.profile, origin.value, destination.value)
            results.value = { ...results.value, [mode.key]: result }

            if (mode.key === 'walk') {
                results.value = { ...results.value, transit: estimateTransit(result.distance) }
            }
        } catch {
            // shu rejimni o'tkazib yuboramiz, foydalanuvchi boshqasini tanlashi mumkin
        }
    }
    routesLoading.value = false
}

function drawRoute() {
    if (!map) return

    if (routeLine) { map.removeLayer(routeLine); routeLine = null }

    const result = activeResult.value
    if (result?.coords) {
        routeLine = L.polyline(result.coords, { color: '#6C5CE7', weight: 5, opacity: 0.85 }).addTo(map)
        map.fitBounds(routeLine.getBounds(), { padding: [40, 40] })
    } else if (origin.value && destination.value) {
        const bounds = L.latLngBounds([origin.value.lat, origin.value.lng], [destination.value.lat, destination.value.lng])
        map.fitBounds(bounds, { padding: [40, 40] })
    }
}

function startNavigation() {
    if (!origin.value || !destination.value) return
    const mode = MODES.find(m => m.key === selectedMode.value)
    const params = new URLSearchParams({
        api: '1',
        origin: `${origin.value.lat},${origin.value.lng}`,
        destination: restaurant.value?.name || `${destination.value.lat},${destination.value.lng}`,
        travelmode: mode.travelmode,
    })
    // place_id bo'lmasa, Google Maps koordinatalarga eng yaqin biznesni taxmin qilib,
    // butunlay boshqa joyni ko'rsatib qo'yishi mumkin — shu sabab mavjud bo'lsa aniq joyni beramiz.
    if (restaurant.value?.google_place_id) {
        params.set('destination_place_id', restaurant.value.google_place_id)
    }
    window.open(`https://www.google.com/maps/dir/?${params.toString()}`, '_blank', 'noopener')
}

async function locate() {
    locationError.value = ''
    origin.value = null
    try {
        const position = await resolveCurrentPosition()
        origin.value = { lat: position.coords.latitude, lng: position.coords.longitude }
    } catch (error) {
        locationError.value = getLocationErrorMessage(error)
    }
}

watch(origin, async (value) => {
    if (!value || !destination.value) return

    await nextTick()
    if (!map) initMap()

    if (originMarker) map.removeLayer(originMarker)
    originMarker = L.circleMarker([value.lat, value.lng], {
        radius: 8, color: '#fff', weight: 3, fillColor: '#378ADD', fillOpacity: 1,
    }).addTo(map)

    await loadRoutes()

    if (!results.value[selectedMode.value]) {
        const firstAvailable = MODES.find(m => results.value[m.key])
        if (firstAvailable) selectedMode.value = firstAvailable.key
    }
})

watch(selectedMode, drawRoute)
watch(results, drawRoute, { deep: true })

function initMap() {
    map = L.map(mapId, { attributionControl: false }).setView([destination.value.lat, destination.value.lng], 14)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map)
    destMarker = L.marker([destination.value.lat, destination.value.lng]).addTo(map).bindPopup(restaurant.value.name)

    // Flex-layout hisoblanishi map konteyneri yaratilgan paytda hali tugamagan bo'lishi mumkin,
    // shu sabab Leaflet noto'g'ri o'lchamni keshlab qo'yadi — o'lchamni qayta hisoblatamiz.
    requestAnimationFrame(() => map?.invalidateSize())
    window.addEventListener('resize', handleResize)
}

function handleResize() {
    map?.invalidateSize()
}

onMounted(async () => {
    const res = await api.get(`/restaurants/${route.params.id}`)
    restaurant.value = res.data

    if (destination.value) {
        await nextTick()
        if (!map) initMap()
    }

    locate()
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    map?.remove()
    map = null
})
</script>

<style scoped>
.directions-page {
    position: fixed;
    inset: 0;
    z-index: 400;
    background: var(--color-bg);
    display: flex;
    flex-direction: column;
}

.directions-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
}
.directions-topbar h1 { font-size: 16px; font-weight: 700; color: var(--color-text); margin: 0; }
.icon-btn {
    width: 36px; height: 36px;
    border: none; border-radius: 50%;
    background: var(--color-border-light);
    color: var(--color-text);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
}
.icon-btn-spacer { width: 36px; flex-shrink: 0; }

.route-rows {
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
}
.route-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: var(--color-bg);
    border-radius: 12px;
}
.route-dot {
    width: 22px; height: 22px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
}
.route-dot--origin { background: var(--color-info-tint); color: var(--color-info); }
.route-dot--dest { background: var(--color-danger-tint); color: var(--color-danger); }
.route-text {
    font-size: 14px; font-weight: 600; color: var(--color-text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.mode-tabs {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
}
.mode-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 6px;
    border: 1px solid var(--color-border);
    border-radius: 14px;
    background: var(--color-bg);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.15s;
}
.mode-tab:disabled { opacity: 0.5; cursor: not-allowed; }
.mode-tab--active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: #fff;
}
.mode-tab i { font-size: 16px; }
.mode-time { font-size: 12px; font-weight: 700; }
.mode-time--pending { opacity: 0.7; font-weight: 400; }

.map-wrap {
    position: relative;
    flex: 1;
    min-height: 0;
}
.map-canvas { width: 100%; height: 100%; }

.map-status {
    position: absolute;
    top: 16px; left: 50%;
    transform: translateX(-50%);
    display: flex; align-items: center; gap: 8px;
    background: var(--color-surface);
    color: var(--color-text);
    padding: 10px 16px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    box-shadow: var(--shadow-md);
    z-index: 420;
}
.map-status--error { color: var(--color-danger-dark); }
.retry-btn {
    border: none;
    background: var(--color-primary-tint);
    color: var(--color-primary-dark);
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
}

.bottom-card {
    flex-shrink: 0;
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    padding: 16px;
    box-shadow: 0 -8px 24px rgba(12, 38, 32, 0.1);
}
.bottom-main { display: flex; align-items: baseline; gap: 8px; }
.bottom-duration { font-size: 24px; font-weight: 800; color: var(--color-text); }
.bottom-distance { font-size: 15px; color: var(--color-text-muted); }
.bottom-sub { font-size: 13px; color: var(--color-text-faint); margin: 2px 0 12px; }
.bottom-empty { font-size: 13px; color: var(--color-text-faint); text-align: center; padding: 8px 0; }

.start-btn {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px;
    border: none;
    border-radius: 14px;
    background: var(--color-primary);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
}
.start-btn:hover { background: var(--color-primary-dark); }
</style>
