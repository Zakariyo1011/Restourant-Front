<template>
    <div class="page">
        <!-- Navbar -->
        <HomeNavbar
            :auth="auth"
            :search-query="search"
            :selected-address-label="selectedAddressLabel"
            @update:searchQuery="search = $event"
            @openAddressModal="openAddressModal"
        />

        <!-- Main content -->
<div class="main">
    <HomePromoSlider
        :promo-slides="promoSlides"
        :current-promo-index="currentPromoIndex"
        :promo-track-style="promoTrackStyle"
        @prev="prevPromoSlide"
        @next="nextPromoSlide"
        @go="goToPromoSlide"
    />

    <HomeOrderToolbar
        :quick-categories="quickCategories"
        :more-categories="moreCategories"
        :sorting-options="sortingOptions"
        :selected-cuisine="selectedCuisineQuick"
        :selected-sorting="selectedSortingQuick"
        :show-more-menu="showMoreMenu"
        :show-sorting-menu="showSortingMenu"
        @selectCategory="(key, close) => selectQuickCategory(key, close)"
        @toggleMoreMenu="toggleMoreMenu"
        @toggleSortingMenu="toggleSortingMenu"
        @selectSorting="selectedSortingQuick = $event"
        @applySorting="applySortingSelection"
    />

    <div class="section-header">
        <div>
            <h2 class="section-title">
                <i class="fas fa-fire section-icon"></i>
                {{ locationActive ? $t('home.nearbyTitle') : $t('home.allTitle') }}
            </h2>
            <p class="section-sub">{{ $t('home.found', { count: displayCount }) }}</p>
        </div>
        <div class="section-sort-pill">
            {{ activeSortingLabel }}
        </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
        <div class="loading-grid">
            <div v-for="i in 6" :key="i" class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-body">
                    <div class="skeleton-line w70"></div>
                    <div class="skeleton-line w90"></div>
                    <div class="skeleton-line w50"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0" class="empty-state">
        <div class="empty-icon">
            <i class="fas fa-store-slash"></i>
        </div>
        <h3>{{ $t('home.emptyTitle') }}</h3>
        <p>{{ $t('home.emptySub') }}</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid">
        <HomeRestaurantCard
            v-for="r in filtered"
            :key="r.id"
            :restaurant="r"
            :resolve-image-url="resolveImageUrl"
            :get-restaurant-image-url="getRestaurantImageUrl"
            :get-cuisine-label="getCuisineLabel"
            @select="$router.push(`/restaurant/${$event}`)"
        />
    </div>

    <div v-if="!locationActive && restaurants.length" ref="loadMoreTrigger" class="load-more-sentinel">
        <div v-if="paginationLoading" class="load-more-status">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Yana restoranlar yuklanmoqda...</span>
        </div>
        <div v-else-if="!hasMorePages" class="load-more-status done">
            <span>Barcha restoranlar yuklandi</span>
        </div>
    </div>
</div>

        <HomeAddressModal
            :show="showAddressModal"
            :address-query="addressQuery"
            :address-draft="addressDraft"
            :address-suggestions="addressSuggestions"
            :address-search-loading="addressSearchLoading"
            :location-loading="locationLoading"
            :modal-helper-text="modalHelperText"
            :selected-map-hint="selectedMapHint"
            @close="closeAddressModal"
            @update:addressQuery="addressQuery = $event"
            @applyAddress="applySelectedAddress"
            @selectSuggestion="selectAddressSuggestion"
            @useGps="useCurrentLocationInModal"
        />


        <!-- Footer -->
        <footer class="footer">
            <div class="footer-inner">
                <div class="footer-brand">
                    <i class="fas fa-utensils"></i>
                    <span>{{ $t('footer.brand') }}</span>
                </div>
                <p class="footer-copy">{{ $t('footer.copy') }}</p>
            </div>
        </footer>
    </div>
</template>

<script setup>

import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import api from '../axios'
import { resolveImageUrl } from '../utils/imageUrl'
import HomeNavbar from '../components/home/HomeNavbar.vue'
import HomePromoSlider from '../components/home/HomePromoSlider.vue'
import HomeOrderToolbar from '../components/home/HomeOrderToolbar.vue'
import HomeRestaurantCard from '../components/home/HomeRestaurantCard.vue'
import HomeAddressModal from '../components/home/HomeAddressModal.vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow })

const { t, locale } = useI18n()

const auth = useAuthStore()
const restaurants = ref([])
const loading = ref(true)
const paginationLoading = ref(false)
const search = ref('')
const sortBy = ref('default')
const currentPage = ref(1)
const lastPage = ref(1)
const perPage = ref(12)
const totalRestaurants = ref(0)
const userLocation = ref(null)
const locationActive = ref(false)
const locationLoading = ref(false)
const locationError = ref('')
const nearbyRestaurants = ref([])
const showAddressModal = ref(false)
const addressQuery = ref('')
const selectedAddressLabel = ref('')
const addressDraft = ref(null)
const addressSuggestions = ref([])
const addressSearchLoading = ref(false)
const modalMap = ref(null)
const modalMarker = ref(null)
const addressSearchDebounce = ref(null)
const addressSearchToken = ref(0)
const reverseLookupToken = ref(0)
const promoInterval = ref(null)
const currentPromoIndex = ref(0)
const showMoreMenu = ref(false)
const showSortingMenu = ref(false)
const selectedCuisineQuick = ref('')
const selectedSortingQuick = ref('trust')
const moreMenuRef = ref(null)
const sortingMenuRef = ref(null)
const loadMoreTrigger = ref(null)
const loadMoreObserver = ref(null)
const pendingCuisineHydration = ref(false)
const isHydratingAllPages = ref(false)

const filters = ref({
    cuisine_type: '',
    country: '',
    city: '',
    price_range: '',
})

const cuisineKeys = ['uzbek', 'tajik', 'kazakh', 'kyrgyz', 'turkish', 'arabic', 'persian', 'afghan', 'georgian', 'russian', 'european', 'asian', 'mixed']
const cuisineAliases = {
    ozbek: 'uzbek',
    ozbekcha: 'uzbek',
    uzbekistan: 'uzbek',
    turk: 'turkish',
    turkcha: 'turkish',
    turkiye: 'turkish',
    turkey: 'turkish',
    turki: 'turkish',
    kazak: 'kazakh',
    kazakhskaya: 'kazakh',
    qozoqcha: 'kazakh',
    qazaq: 'kazakh',
    qozoq: 'kazakh',
    kirgiz: 'kyrgyz',
    qirgizcha: 'kyrgyz',
    qirgiz: 'kyrgyz',
    qyrgyz: 'kyrgyz',
}

const normalizeCuisineValue = (value) => {
    if (!value) return ''

    const normalized = String(value)
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[_\s]+/g, '-')

    if (cuisineKeys.includes(normalized)) {
        return normalized
    }

    const compact = normalized.replace(/[-']/g, '')
    if (cuisineKeys.includes(compact)) {
        return compact
    }

    for (const key of cuisineKeys) {
        if (normalized.includes(key) || compact.includes(key)) {
            return key
        }
    }

    for (const [alias, canonical] of Object.entries(cuisineAliases)) {
        const compactAlias = alias.replace(/[-']/g, '')
        if (normalized.includes(alias) || compact.includes(compactAlias)) {
            return canonical
        }
    }

    return cuisineAliases[compact] || cuisineAliases[normalized] || ''
}

const normalizeSearchText = (value) => {
    if (!value) return ''

    return String(value)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
}

const cuisineKeywordMap = {
    uzbek: ['uzbek', 'ozbek', 'o‘zbek'],
    tajik: ['tajik', 'tojik'],
    kazakh: ['kazakh', 'qazaq', 'qozoq'],
    kyrgyz: ['kyrgyz', 'qirgiz', 'kirgiz'],
    turkish: ['turkish', 'turk', 'turkiye'],
    arabic: ['arabic', 'arab'],
    persian: ['persian', 'fors', 'iranian'],
    afghan: ['afghan', 'afgon'],
    georgian: ['georgian', 'gruzin'],
    russian: ['russian', 'rus'],
    european: ['european', 'evropa'],
    asian: ['asian', 'osiyo', 'asia'],
    mixed: ['mixed', 'aralash', 'mix'],
}

const matchesCuisineByText = (restaurant, cuisineKey) => {
    const text = normalizeSearchText([
        restaurant?.cuisine_type,
        restaurant?.name,
        restaurant?.description,
    ].filter(Boolean).join(' '))

    if (!text) return false

    const keywords = cuisineKeywordMap[cuisineKey] || [cuisineKey]
    return keywords.some(keyword => text.includes(normalizeSearchText(keyword)))
}

const getCuisineLabel = (value) => {
    const key = normalizeCuisineValue(value)
    if (key) {
        return t(`cuisines.${key}`)
    }

    return value || ''
}
const promoSlides = [
    {
        id: 1,
        badge: 'Yangi',
        title: 'Issiq chegirmalar',
        subtitle: 'Bugungi top restoranlardan maxsus takliflar',
        icon: 'fas fa-fire',
        bg: 'linear-gradient(120deg, #0f6e56 0%, #1d9e75 100%)',
    },
    {
        id: 2,
        badge: 'Top',
        title: 'Tez yetkazib berish',
        subtitle: 'Yaqin atrofdagi restoranlar 20-30 daqiqada',
        icon: 'fas fa-bolt',
        bg: 'linear-gradient(120deg, #155c9a 0%, #1d89e4 100%)',
    },
    {
        id: 3,
        badge: 'Tavsiya',
        title: 'Mashhur taomlar',
        subtitle: 'Eng ko‘p buyurtma qilingan taomlarni sinab ko‘ring',
        icon: 'fas fa-star',
        bg: 'linear-gradient(120deg, #7a2f8f 0%, #bc4de0 100%)',
    },
]

const quickCategories = [
    { key: '', label: 'All' },
    { key: 'uzbek', label: 'Uzbek' },
    { key: 'asian', label: 'Asian' },
    { key: 'turkish', label: 'Turkish' },
    { key: 'georgian', label: 'Georgian' },
    { key: 'russian', label: 'Russian' },
]

const moreCategories = [
    { key: 'tajik', label: 'Tajik' },
    { key: 'kazakh', label: 'Kazakh' },
    { key: 'kyrgyz', label: 'Kyrgyz' },
    { key: 'arabic', label: 'Arabic' },
    { key: 'persian', label: 'Persian' },
    { key: 'afghan', label: 'Afghan' },
    { key: 'european', label: 'European' },
    { key: 'mixed', label: 'Mixed' },
]

const sortingOptions = [
    { key: 'trust', label: 'I trust you' },
    { key: 'top_rating', label: 'Top rating' },
    { key: 'fastest_delivery', label: 'Fastest Delivery' },
]

const sortingLabelsMap = {
    trust: 'I trust you',
    top_rating: 'Top rating',
    fastest_delivery: 'Fastest Delivery',
}

const promoTrackStyle = computed(() => ({
    transform: `translateX(-${currentPromoIndex.value * 100}%)`,
}))

const activeSortingLabel = computed(() => sortingLabelsMap[selectedSortingQuick.value] || 'I trust you')

const hasActiveClientFilters = computed(() => {
    return Boolean(
        search.value.trim() ||
        filters.value.cuisine_type ||
        filters.value.country ||
        filters.value.city ||
        filters.value.price_range
    )
})

const displayCount = computed(() => {
    if (locationActive.value || hasActiveClientFilters.value) {
        return filtered.value.length
    }

    return totalRestaurants.value || filtered.value.length
})

const hasMorePages = computed(() => !locationActive.value && currentPage.value < lastPage.value)

const modalHelperText = computed(() => {
    if (addressSearchLoading.value) {
        return 'Manzil qidirilmoqda'
    }
    if (addressSuggestions.value.length && addressQuery.value.trim()) {
        return `${addressSuggestions.value.length} ta mos manzil topildi`
    }
    if (addressQuery.value.trim()) {
        return 'Adresni tanlang yoki Enter/Search ni bosing'
    }
    return 'Manzilni kiriting yoki xaritada nuqtani tanlang'
})

const selectedMapHint = computed(() => {
    if (locationError.value) return locationError.value
    if (addressDraft.value?.label) return addressDraft.value.label
    return 'Marker ni suring yoki xaritada nuqta bosing'
})

const nextPromoSlide = () => {
    currentPromoIndex.value = (currentPromoIndex.value + 1) % promoSlides.length
}

const prevPromoSlide = () => {
    currentPromoIndex.value = (currentPromoIndex.value - 1 + promoSlides.length) % promoSlides.length
}

const goToPromoSlide = (index) => {
    currentPromoIndex.value = index
}

const selectQuickCategory = async (key, closeMenu = false) => {
    const normalizedKey = normalizeCuisineValue(key)
    selectedCuisineQuick.value = normalizedKey
    filters.value.cuisine_type = normalizedKey
    pendingCuisineHydration.value = Boolean(normalizedKey)

    if (closeMenu) {
        showMoreMenu.value = false
    }

    if (normalizedKey && !locationActive.value && !loading.value && hasMorePages.value) {
        await ensureAllRestaurantsLoaded()
    }
}

const toggleMoreMenu = () => {
    showMoreMenu.value = !showMoreMenu.value
    if (showMoreMenu.value) {
        showSortingMenu.value = false
    }
}

const toggleSortingMenu = () => {
    showSortingMenu.value = !showSortingMenu.value
    if (showSortingMenu.value) {
        showMoreMenu.value = false
    }
}

const applySortingSelection = () => {
    if (selectedSortingQuick.value === 'fastest_delivery' && locationActive.value) {
        sortBy.value = 'distance'
    } else if (selectedSortingQuick.value === 'trust') {
        sortBy.value = 'default'
    } else {
        sortBy.value = 'default'
    }
    showSortingMenu.value = false
}

const getRestaurantRating = (restaurant) => {
    const rawRating = restaurant?.rating ?? restaurant?.google_rating ?? restaurant?.stars ?? 0
    const numericRating = Number(rawRating)
    return Number.isFinite(numericRating) ? numericRating : 0
}

const getRestaurantDeliveryTime = (restaurant) => {
    const rawValue = restaurant?.delivery_time ?? restaurant?.delivery_minutes ?? restaurant?.eta ?? 999
    const numericValue = Number(rawValue)
    return Number.isFinite(numericValue) ? numericValue : 999
}

const handleClickOutsideMenus = (event) => {
    const target = event.target

    if (showMoreMenu.value && moreMenuRef.value && !moreMenuRef.value.contains(target)) {
        showMoreMenu.value = false
    }

    if (showSortingMenu.value && sortingMenuRef.value && !sortingMenuRef.value.contains(target)) {
        showSortingMenu.value = false
    }
}

const isLocalhost = () => {
    const hostname = window.location.hostname
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

const requestCurrentPosition = (options) => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
}

const getLocationErrorMessage = (error) => {
    if (error?.message === 'SECURE_CONTEXT_REQUIRED') {
        return 'GPS faqat `https` yoki `localhost` da ishlaydi'
    }

    if (error?.message === 'PERMISSION_DENIED') {
        return 'Brauzerda location ruxsatini yoqing'
    }

    switch (error?.code) {
        case 1:
            return 'Joylashuv uchun ruxsat berilmadi'
        case 2:
            return 'Joylashuvni aniqlab bo\'lmadi'
        case 3:
            return 'GPS javobi kechikdi, qayta urinib ko\'ring'
        default:
            return 'Joylashuvni aniqlashda xatolik bo\'ldi'
    }
}

const resolveCurrentPosition = async () => {
    if (!window.isSecureContext && !isLocalhost()) {
        throw new Error('SECURE_CONTEXT_REQUIRED')
    }

    if (navigator.permissions?.query) {
        try {
            const permission = await navigator.permissions.query({ name: 'geolocation' })
            if (permission.state === 'denied') {
                throw new Error('PERMISSION_DENIED')
            }
        } catch (error) {
            if (error?.message === 'PERMISSION_DENIED') {
                throw error
            }
        }
    }

    try {
        return await requestCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
        })
    } catch (error) {
        if (error?.code !== 3) {
            throw error
        }

        return await requestCurrentPosition({
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 300000,
        })
    }
}

const filtered = computed(() => {
    let result = locationActive.value ? nearbyRestaurants.value : restaurants.value

    if (search.value) {
        const q = search.value.toLowerCase()
        result = result.filter(r =>
            r.name?.toLowerCase().includes(q) ||
            r.description?.toLowerCase().includes(q) ||
            r.city?.toLowerCase().includes(q) ||
            r.country?.toLowerCase().includes(q)
        )
    }

    const selectedCuisine = normalizeCuisineValue(filters.value.cuisine_type)
    if (selectedCuisine) {
        const strictMatched = result.filter(r => normalizeCuisineValue(r.cuisine_type) === selectedCuisine)
        result = strictMatched.length
            ? strictMatched
            : result.filter(r => matchesCuisineByText(r, selectedCuisine))
    }
    if (filters.value.country) {
        result = result.filter(r => r.country === filters.value.country)
    }
    if (filters.value.city) {
        result = result.filter(r => r.city === filters.value.city)
    }
    if (filters.value.price_range) {
        result = result.filter(r => r.price_range === filters.value.price_range)
    }

    if (selectedSortingQuick.value === 'top_rating') {
        result = [...result].sort((a, b) => getRestaurantRating(b) - getRestaurantRating(a))
    } else if (selectedSortingQuick.value === 'fastest_delivery') {
        if (locationActive.value) {
            result = [...result].sort((a, b) => (a.distance || 0) - (b.distance || 0))
        } else {
            result = [...result].sort((a, b) => getRestaurantDeliveryTime(a) - getRestaurantDeliveryTime(b))
        }
    } else if (sortBy.value === 'distance' && locationActive.value) {
        result = [...result].sort((a, b) => (a.distance || 0) - (b.distance || 0))
    } else if (sortBy.value === 'name') {
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
})

const normalizeRestaurantListResponse = (payload) => {
    const items = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
            ? payload.data
            : []

    return {
        items,
        currentPage: Number(payload?.current_page) || 1,
        lastPage: Number(payload?.last_page) || 1,
        perPage: Number(payload?.per_page) || items.length || perPage.value,
        total: Number(payload?.total) || items.length,
    }
}

const mergeRestaurants = (currentItems, nextItems) => {
    const seenIds = new Set(currentItems.map(item => item.id))
    const merged = [...currentItems]

    nextItems.forEach((item) => {
        if (seenIds.has(item.id)) return
        seenIds.add(item.id)
        merged.push(item)
    })

    return merged
}

const fetchRestaurants = async (page = 1) => {
    const targetPage = Number(page) || 1
    const isInitialLoad = targetPage === 1 && restaurants.value.length === 0

    if (isInitialLoad) {
        loading.value = true
    } else {
        paginationLoading.value = true
    }

    try {
        const res = await api.get('/restaurants', {
            params: {
                page: targetPage,
                per_page: perPage.value,
            },
        })

        const normalized = normalizeRestaurantListResponse(res?.data)

        restaurants.value = targetPage === 1
            ? normalized.items
            : mergeRestaurants(restaurants.value, normalized.items)
        currentPage.value = normalized.currentPage
        lastPage.value = normalized.lastPage
        perPage.value = normalized.perPage
        totalRestaurants.value = normalized.total
    } catch (error) {
        console.error(error)
        if (targetPage === 1) {
            restaurants.value = []
            totalRestaurants.value = 0
        }
    } finally {
        loading.value = false
        paginationLoading.value = false
    }
}

const loadNextRestaurants = async () => {
    if (!hasMorePages.value || paginationLoading.value || loading.value) {
        return
    }

    await fetchRestaurants(currentPage.value + 1)
}

const ensureAllRestaurantsLoaded = async () => {
    if (locationActive.value || isHydratingAllPages.value) {
        return
    }

    isHydratingAllPages.value = true

    let guard = 0
    try {
        while (currentPage.value < lastPage.value && guard < 100) {
            const nextPage = currentPage.value + 1
            await fetchRestaurants(nextPage)

            if (currentPage.value < nextPage) {
                break
            }

            guard += 1
        }
    } finally {
        isHydratingAllPages.value = false
    }
}

const disconnectLoadMoreObserver = () => {
    if (loadMoreObserver.value) {
        loadMoreObserver.value.disconnect()
        loadMoreObserver.value = null
    }
}

const setupLoadMoreObserver = () => {
    disconnectLoadMoreObserver()

    if (!loadMoreTrigger.value || !hasMorePages.value) {
        return
    }

    loadMoreObserver.value = new IntersectionObserver(
        (entries) => {
            const entry = entries[0]
            if (entry?.isIntersecting) {
                loadNextRestaurants()
            }
        },
        {
            root: null,
            rootMargin: '320px 0px',
            threshold: 0.1,
        }
    )

    loadMoreObserver.value.observe(loadMoreTrigger.value)
}

const setDraftLocation = ({ lat, lng, label }) => {
    addressDraft.value = {
        lat: Number(lat),
        lng: Number(lng),
        label: label || `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`,
    }
}

const buildAddressOption = (item) => ({
    id: item.place_id || `${item.lat}-${item.lon}-${item.osm_id || item.display_name}`,
    name: item.name || item.display_name?.split(',')[0] || 'Tanlangan manzil',
    label: item.display_name || item.name || 'Tanlangan manzil',
    lat: Number(item.lat),
    lng: Number(item.lon),
})

const searchAddresses = async (query) => {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('addressdetails', '1')
    url.searchParams.set('limit', '6')
    url.searchParams.set('accept-language', locale.value || 'uz')
    url.searchParams.set('q', query)

    const response = await fetch(url.toString(), {
        headers: {
            Accept: 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Address search failed')
    }

    const payload = await response.json()
    return Array.isArray(payload) ? payload.map(buildAddressOption).filter(item => Number.isFinite(item.lat) && Number.isFinite(item.lng)) : []
}

const reverseGeocode = async (lat, lng) => {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('accept-language', locale.value || 'uz')
    url.searchParams.set('lat', String(lat))
    url.searchParams.set('lon', String(lng))

    const response = await fetch(url.toString(), {
        headers: {
            Accept: 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Reverse geocode failed')
    }

    const payload = await response.json()
    return payload?.display_name || ''
}

const syncDraftLabel = async (lat, lng, fallbackLabel, shouldPan = false) => {
    const lookupId = ++reverseLookupToken.value

    setDraftLocation({ lat, lng, label: fallbackLabel })
    updateMapMarker({ lat, lng, label: fallbackLabel }, shouldPan)

    try {
        const resolvedLabel = await reverseGeocode(lat, lng)
        if (!resolvedLabel || lookupId !== reverseLookupToken.value) return

        setDraftLocation({ lat, lng, label: resolvedLabel })
        updateMapMarker({ lat, lng, label: resolvedLabel }, false)

        if (!addressQuery.value.trim()) {
            addressQuery.value = resolvedLabel
        }
    } catch (error) {
        console.error(error)
    }
}

const loadAddressSuggestions = async (query) => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
        addressSuggestions.value = []
        addressSearchLoading.value = false
        return
    }

    const lookupId = ++addressSearchToken.value
    addressSearchLoading.value = true

    try {
        const results = await searchAddresses(trimmedQuery)
        if (lookupId !== addressSearchToken.value) return
        addressSuggestions.value = results
    } catch (error) {
        if (lookupId === addressSearchToken.value) {
            addressSuggestions.value = []
        }
        console.error(error)
    } finally {
        if (lookupId === addressSearchToken.value) {
            addressSearchLoading.value = false
        }
    }
}

const updateMapMarker = ({ lat, lng, label }, shouldPan = true) => {
    if (!modalMap.value) return

    if (!modalMarker.value) {
        modalMarker.value = L.marker([lat, lng], { draggable: true }).addTo(modalMap.value)
        modalMarker.value.on('dragend', async (event) => {
            const { lat: nextLat, lng: nextLng } = event.target.getLatLng()
            await syncDraftLabel(nextLat, nextLng, `Tanlangan manzil (${nextLat.toFixed(5)}, ${nextLng.toFixed(5)})`)
        })
    } else {
        modalMarker.value.setLatLng([lat, lng])
    }

    if (shouldPan) {
        modalMap.value.setView([lat, lng], Math.max(modalMap.value.getZoom(), 14), { animate: true })
    }

    if (label) {
        modalMarker.value.bindPopup(`<strong>${label}</strong>`).openPopup()
    }
}

const fetchNearbyRestaurants = async (lat, lng, label = '') => {
    const safeLat = Number(lat)
    const safeLng = Number(lng)

    if (!Number.isFinite(safeLat) || !Number.isFinite(safeLng)) {
        throw new Error('Invalid coordinates for nearby request')
    }

    const res = await api.get('/restaurants/nearby', {
        params: { lat: safeLat, lng: safeLng, radius: 50 }
    })

    const payload = res?.data
    const nearbyList = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []

    nearbyRestaurants.value = nearbyList
    userLocation.value = { lat: safeLat, lng: safeLng }
    selectedAddressLabel.value = label || `${safeLat.toFixed(4)}, ${safeLng.toFixed(4)}`
    locationActive.value = true
    sortBy.value = 'distance'

    if (!nearbyList.length) {
        locationActive.value = false
        sortBy.value = 'default'
        alert('Yaqin atrofda restoran topilmadi. Barcha restoranlar ko\'rsatildi.')
    }
}

const getUserLocation = () => {
    if (locationActive.value && !showAddressModal.value) {
        locationActive.value = false
        userLocation.value = null
        nearbyRestaurants.value = []
        selectedAddressLabel.value = ''
        sortBy.value = 'default'
        return
    }

    if (!navigator.geolocation) {
        locationError.value = 'Brauzeringiz GPS ni qo\'llab-quvvatlamaydi'
        alert('Brauzeringiz GPS ni qo\'llab-quvvatlamaydi')
        return
    }

    locationLoading.value = true
    locationError.value = ''

    resolveCurrentPosition()
        .then(async (position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            const fallbackLabel = 'Mening joylashuvim'

            try {
                await syncDraftLabel(lat, lng, fallbackLabel, showAddressModal.value)
                const label = addressDraft.value?.label || fallbackLabel
                if (showAddressModal.value) {
                    updateMapMarker({ lat, lng, label })
                }
                await fetchNearbyRestaurants(lat, lng, label)
            } catch (e) {
                console.error(e)
                locationActive.value = false
                sortBy.value = 'default'
                locationError.value = 'GPS bo\'yicha restoranlarni olishda xatolik bo\'ldi'
                alert('GPS bo\'yicha restoranlarni olishda xatolik bo\'ldi. Qayta urinib ko\'ring.')
            } finally {
                locationLoading.value = false
            }
        })
        .catch((error) => {
            console.error(error)
            locationLoading.value = false
            locationError.value = getLocationErrorMessage(error)
            alert(locationError.value)
        })
}

const openAddressModal = async () => {
    showAddressModal.value = true
    locationError.value = ''
    document.body.style.overflow = 'hidden'
    await nextTick()
    initAddressMap()
}

const closeAddressModal = () => {
    showAddressModal.value = false
    addressQuery.value = ''
    addressSuggestions.value = []
    addressSearchLoading.value = false
    locationError.value = ''
    document.body.style.overflow = ''
}

const initAddressMap = () => {
    if (!modalMap.value) {
        const initialCenter = userLocation.value
            ? [userLocation.value.lat, userLocation.value.lng]
            : [41.3111, 69.2797]

        modalMap.value = L.map('home-address-map', { zoomControl: false }).setView(initialCenter, userLocation.value ? 14 : 11)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(modalMap.value)

        L.control.zoom({ position: 'topright' }).addTo(modalMap.value)

        modalMap.value.on('click', (event) => {
            const { lat, lng } = event.latlng
            syncDraftLabel(lat, lng, `Tanlangan manzil (${lat.toFixed(5)}, ${lng.toFixed(5)})`)
        })
    }

    const activeLat = addressDraft.value?.lat ?? userLocation.value?.lat ?? 41.3111
    const activeLng = addressDraft.value?.lng ?? userLocation.value?.lng ?? 69.2797
    const activeLabel = addressDraft.value?.label || selectedAddressLabel.value || 'Toshkent markazi'

    setDraftLocation({ lat: activeLat, lng: activeLng, label: activeLabel })
    updateMapMarker({ lat: activeLat, lng: activeLng, label: activeLabel })
    setTimeout(() => modalMap.value?.invalidateSize(), 50)
}

const selectAddressSuggestion = (option) => {
    setDraftLocation(option)
    updateMapMarker(option)
    addressQuery.value = option.label || option.name
    addressSuggestions.value = []
}

const useCurrentLocationInModal = async () => {
    if (!showAddressModal.value) {
        await openAddressModal()
    }
    getUserLocation()
}

const applySelectedAddress = async () => {
    const trimmedQuery = addressQuery.value.trim()

    if (trimmedQuery) {
        const normalizedDraft = addressDraft.value?.label?.trim().toLowerCase()
        const normalizedQuery = trimmedQuery.toLowerCase()

        if (!normalizedDraft || normalizedDraft !== normalizedQuery) {
            let option = addressSuggestions.value.find(item => item.label.trim().toLowerCase() === normalizedQuery)

            if (!option) {
                try {
                    addressSearchLoading.value = true
                    const results = await searchAddresses(trimmedQuery)
                    addressSuggestions.value = results
                    option = results[0]
                } catch (error) {
                    console.error(error)
                    alert('Manzil qidirishda xatolik bo\'ldi. Qayta urinib ko\'ring.')
                    return
                } finally {
                    addressSearchLoading.value = false
                }
            }

            if (!option) {
                alert('Bu manzil topilmadi. Iltimos, boshqa manzil kiriting.')
                return
            }

            setDraftLocation(option)
            updateMapMarker(option)
            addressQuery.value = option.label || option.name
        }
    }

    if (!addressDraft.value) return

    locationLoading.value = true

    try {
        await fetchNearbyRestaurants(addressDraft.value.lat, addressDraft.value.lng, addressDraft.value.label)
        closeAddressModal()
    } catch (e) {
        console.error(e)
        locationActive.value = false
        sortBy.value = 'default'
        alert('Manzil bo\'yicha restoranlarni olishda xatolik bo\'ldi.')
    } finally {
        locationLoading.value = false
    }
}

const getRestaurantImageUrl = (restaurant) => {
    if (restaurant?.images?.length > 0) {
        return restaurant.images[0].url
    }
    return restaurant.image_path || null
}

onMounted(async () => {
    document.addEventListener('click', handleClickOutsideMenus)

    promoInterval.value = setInterval(() => {
        nextPromoSlide()
    }, 5000)

    await fetchRestaurants(1)
    await nextTick()
    setupLoadMoreObserver()
})

watch([loadMoreTrigger, hasMorePages, locationActive], async () => {
    await nextTick()
    setupLoadMoreObserver()
})

watch([loading, paginationLoading, locationActive, () => filters.value.cuisine_type, hasMorePages], async () => {
    if (!pendingCuisineHydration.value) {
        return
    }

    if (locationActive.value || !filters.value.cuisine_type) {
        pendingCuisineHydration.value = false
        return
    }

    if (loading.value || paginationLoading.value) {
        return
    }

    pendingCuisineHydration.value = false
    if (hasMorePages.value) {
        await ensureAllRestaurantsLoaded()
    }
})

watch(showAddressModal, async (isOpen) => {
    if (!isOpen || !modalMap.value) return
    await nextTick()
    modalMap.value.invalidateSize()
})

watch(addressQuery, (value) => {
    clearTimeout(addressSearchDebounce.value)

    if (!value.trim()) {
        addressSuggestions.value = []
        addressSearchLoading.value = false
        return
    }

    addressSearchDebounce.value = setTimeout(() => {
        loadAddressSuggestions(value)
    }, 350)
})

onBeforeUnmount(() => {
    document.body.style.overflow = ''
    clearTimeout(addressSearchDebounce.value)
    document.removeEventListener('click', handleClickOutsideMenus)
    clearInterval(promoInterval.value)
    disconnectLoadMoreObserver()
    if (modalMap.value) {
        modalMap.value.remove()
        modalMap.value = null
    }
})

</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

* { box-sizing: border-box; margin: 0; padding: 0; }

.page { min-height: 100vh; background: #f4f5f7; font-family: 'Segoe UI', sans-serif; }

/* MAIN */
.main { max-width: 1200px; margin: 18px auto 0; padding: 0 24px 40px; position: relative; z-index: 3; }

/* SECTION HEADER */
.section-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 20px;
    background: white;
    border-radius: 16px;
    padding: 16px 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.section-title {
    font-size: 18px; font-weight: 700; color: #1a1a1a;
    display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
}
.section-icon { color: #FF6B35; font-size: 16px; }
.section-sub { font-size: 13px; color: #888; }
.section-sort-pill {
    background: #f2faf7;
    border: 1px solid #cae9de;
    border-radius: 999px;
    color: #125e49;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 600;
}

/* SKELETON */
.loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.skeleton-card { background: white; border-radius: 16px; overflow: hidden; }
.skeleton-img { height: 180px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
.skeleton-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.skeleton-line { height: 12px; background: #f0f0f0; border-radius: 6px; }
.w70 { width: 70%; } .w90 { width: 90%; } .w50 { width: 50%; }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

/* EMPTY */
.empty-state { text-align: center; padding: 80px 0; }
.empty-icon { font-size: 56px; color: #ddd; margin-bottom: 16px; }
.empty-state h3 { font-size: 20px; color: #333; margin-bottom: 8px; }
.empty-state p { color: #999; }

/* GRID */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

/* LOAD MORE */
.load-more-sentinel {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 72px;
    padding: 12px 0 6px;
}
.load-more-status {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(15, 110, 86, 0.12);
    color: #4b5563;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}
.load-more-status.done { color: #0f6e56; }

/* FOOTER */
.footer { background: #1a1a1a; padding: 24px; margin-top: 20px; }
.footer-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.footer-brand { display: flex; align-items: center; gap: 8px; color: white; font-size: 16px; font-weight: 600; }
.footer-brand i { color: #1D9E75; }
.footer-copy { font-size: 13px; color: #666; }

/* Mobile */
@media (max-width: 768px) {
    .main { padding: 0 12px 32px; margin-top: 10px; }
    .section-header { flex-direction: column; align-items: flex-start; gap: 10px; padding: 14px 16px; }
    .section-title { font-size: 16px; }
    .grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
    .footer-inner { flex-direction: column; gap: 12px; text-align: center; }
    .footer { padding: 20px 16px; }
}

@media (max-width: 480px) {
    .main { padding: 0 10px 24px; margin-top: 8px; }
    .grid { grid-template-columns: 1fr; gap: 12px; }
    .section-header { border-radius: 12px; }
    .section-sort-pill { align-self: flex-start; }
}
</style>
