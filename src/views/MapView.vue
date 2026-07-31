<template>
    <div class="map-page">
        <div :id="mapId" class="map-canvas"></div>

        <button class="map-back-btn" @click="$router.back()">
            <i class="fas fa-arrow-left"></i>
        </button>

        <div v-if="showSearch" class="map-search-bar">
            <i class="fas fa-search"></i>
            <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('home.searchPlaceholder')"
                autofocus
            />
            <button class="map-search-close" @click="showSearch = false; searchQuery = ''">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <div class="map-bottom-controls">
            <button class="map-control-btn" @click="showSearch = !showSearch">
                <i class="fas fa-search"></i>
                <span>{{ $t('home.searchBtn') }}</span>
            </button>
            <button class="map-control-btn" @click="showFilters = true">
                <i class="fas fa-sliders-h"></i>
                <span>{{ $t('home.quickFilters') }}</span>
            </button>
        </div>

        <div class="map-sheet" :class="{ 'map-sheet--expanded': expanded }">
            <button class="map-sheet-handle" @click="expanded = !expanded">
                <span class="handle-bar"></span>
            </button>

            <p class="map-sheet-count">{{ $t('home.found', { count: displayedRestaurants.length }) }}</p>

            <div v-if="loading" class="map-sheet-status">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div v-else-if="!displayedRestaurants.length" class="map-sheet-status">
                {{ $t('home.emptyTitle') }}
            </div>
            <template v-else>
                <div class="map-sheet-scroll">
                    <HomeRestaurantCard
                        v-for="r in displayedRestaurants"
                        :key="r.id"
                        :restaurant="r"
                        variant="compact"
                        :resolve-image-url="resolveImageUrl"
                        :get-restaurant-image-url="getRestaurantImageUrl"
                        :get-cuisine-label="getCuisineLabel"
                        @select="goToRestaurant"
                    />
                </div>

                <div v-if="expanded" class="map-sheet-list">
                    <HomeRestaurantCard
                        v-for="r in displayedRestaurants"
                        :key="`list-${r.id}`"
                        :restaurant="r"
                        :resolve-image-url="resolveImageUrl"
                        :get-restaurant-image-url="getRestaurantImageUrl"
                        :get-cuisine-label="getCuisineLabel"
                        @select="goToRestaurant"
                    />
                </div>
            </template>
        </div>

        <FiltersSheet
            :show="showFilters"
            :cuisine-options="cuisineOptions"
            :selected-cuisine="selectedCuisine"
            :food-types="[]"
            :selected-food-type="''"
            :price-ranges="priceRanges"
            :selected-price-range="selectedPriceRange"
            :result-count="displayedRestaurants.length"
            @close="showFilters = false"
            @selectCuisine="selectedCuisine = $event"
            @selectPriceRange="selectedPriceRange = $event"
            @apply="showFilters = false"
        />
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../axios'
import { resolveImageUrl } from '../utils/imageUrl'
import { getRestaurantImageUrl } from '../utils/restaurantImage'
import { buildRestaurantPinIcon } from '../utils/restaurantMapPin'
import HomeRestaurantCard from '../components/home/HomeRestaurantCard.vue'
import FiltersSheet from '../components/home/FiltersSheet.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const mapId = 'restaurant-full-map'
const DEFAULT_CENTER = { lat: 41.3111, lng: 69.2797 }

const restaurants = ref([])
const loading = ref(false)
const expanded = ref(false)
const showSearch = ref(false)
const showFilters = ref(false)
const searchQuery = ref('')
const selectedCuisine = ref('')
const selectedPriceRange = ref('')

const priceRanges = ['$', '$$', '$$$']
const cuisineKeys = ['uzbek', 'tajik', 'kazakh', 'kyrgyz', 'turkish', 'arabic', 'persian', 'afghan', 'georgian', 'russian', 'european', 'asian', 'mixed']
const cuisineOptions = cuisineKeys.map(key => ({ key, label: t(`cuisines.${key}`) }))

const getCuisineLabel = (value) => {
    if (!value) return ''
    const normalized = String(value).trim().toLowerCase()
    return cuisineKeys.includes(normalized) ? t(`cuisines.${normalized}`) : value
}

const displayedRestaurants = computed(() => {
    let result = restaurants.value

    if (searchQuery.value.trim()) {
        const q = searchQuery.value.trim().toLowerCase()
        result = result.filter(r => r.name?.toLowerCase().includes(q))
    }
    if (selectedCuisine.value) {
        result = result.filter(r => String(r.cuisine_type || '').toLowerCase().includes(selectedCuisine.value))
    }
    if (selectedPriceRange.value) {
        result = result.filter(r => r.price_range === selectedPriceRange.value)
    }

    return result
})

let map = null
let markersLayer = null
let moveTimer = null

const renderPins = () => {
    if (!map) return
    markersLayer.clearLayers()

    displayedRestaurants.value.forEach((restaurant) => {
        const lat = Number(restaurant?.location?.latitude)
        const lng = Number(restaurant?.location?.longitude)
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

        const imageUrl = resolveImageUrl(getRestaurantImageUrl(restaurant))
        const icon = buildRestaurantPinIcon(restaurant, imageUrl, { size: 46 })
        const marker = L.marker([lat, lng], { icon }).addTo(markersLayer)
        marker.on('click', () => goToRestaurant(restaurant.id))
    })
}

const fetchNearby = async (lat, lng) => {
    loading.value = true
    try {
        const res = await api.get('/restaurants/nearby', {
            params: { lat, lng, radius: 100, limit: 100 },
        })
        const payload = res?.data
        restaurants.value = Array.isArray(payload?.data) ? payload.data : []
    } catch (error) {
        console.error(error)
        restaurants.value = []
    } finally {
        loading.value = false
        renderPins()
    }
}

const goToRestaurant = (id) => {
    router.push(`/restaurant/${id}`)
}

onMounted(() => {
    const queryLat = Number(route.query.lat)
    const queryLng = Number(route.query.lng)
    const center = Number.isFinite(queryLat) && Number.isFinite(queryLng)
        ? { lat: queryLat, lng: queryLng }
        : DEFAULT_CENTER

    map = L.map(mapId, { zoomControl: false }).setView([center.lat, center.lng], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
    }).addTo(map)

    L.control.zoom({ position: 'topright' }).addTo(map)

    markersLayer = L.layerGroup().addTo(map)

    map.on('moveend', () => {
        clearTimeout(moveTimer)
        moveTimer = setTimeout(() => {
            const c = map.getCenter()
            fetchNearby(c.lat, c.lng)
        }, 500)
    })

    fetchNearby(center.lat, center.lng)
    setTimeout(() => map?.invalidateSize(), 50)
})

onBeforeUnmount(() => {
    clearTimeout(moveTimer)
    map?.remove()
    map = null
})
</script>

<style scoped>
.map-page { position: fixed; inset: 0; background: #eef2f0; }
.map-canvas { width: 100%; height: 100%; }

.map-back-btn {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 420;
    width: 44px; height: 44px;
    border: none;
    border-radius: 50%;
    background: white;
    color: #172b26;
    box-shadow: 0 6px 18px rgba(12, 38, 32, 0.18);
    cursor: pointer;
}

.map-search-bar {
    position: absolute;
    top: 16px;
    left: 70px;
    right: 16px;
    z-index: 420;
    display: flex;
    align-items: center;
    gap: 10px;
    background: white;
    border-radius: 16px;
    padding: 0 14px;
    min-height: 44px;
    box-shadow: 0 6px 18px rgba(12, 38, 32, 0.18);
}
.map-search-bar i { color: #9aa79f; }
.map-search-bar input { flex: 1; border: none; outline: none; font-size: 14px; }
.map-search-close { border: none; background: none; color: #9aa79f; cursor: pointer; }

.map-bottom-controls {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 190px;
    z-index: 420;
    display: flex;
    gap: 10px;
}
.map-control-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 50px;
    border: none;
    border-radius: 16px;
    background: white;
    color: #172b26;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 6px 18px rgba(12, 38, 32, 0.18);
    cursor: pointer;
}

.map-sheet {
    position: absolute;
    left: 0; right: 0; bottom: 0;
    z-index: 410;
    background: white;
    border-radius: 22px 22px 0 0;
    box-shadow: 0 -8px 30px rgba(12, 38, 32, 0.16);
    height: 172px;
    transition: height 0.28s ease;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.map-sheet--expanded { height: 72vh; }

.map-sheet-handle {
    align-self: center;
    border: none;
    background: none;
    padding: 10px 40px 4px;
    cursor: pointer;
}
.handle-bar { display: block; width: 40px; height: 4px; border-radius: 4px; background: #d7ddd9; }

.map-sheet-count { text-align: center; font-size: 13px; color: #666; margin-bottom: 8px; }
.map-sheet-status { text-align: center; color: #9aa79f; padding: 20px 0; }

.map-sheet-scroll {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding: 0 16px 12px;
    scrollbar-width: none;
}
.map-sheet-scroll::-webkit-scrollbar { display: none; }

.map-sheet-list {
    flex: 1;
    overflow-y: auto;
    padding: 4px 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

@media (max-width: 480px) {
    .map-bottom-controls { bottom: 178px; }
}
</style>
