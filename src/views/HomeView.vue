<template>
    <div class="page">
        <!-- Navbar -->
        <nav class="navbar">
            <div class="nav-brand">
                <div class="brand-icon">
                    <i class="fas fa-utensils"></i>
                </div>
                <span class="brand-name">Restoran<span class="brand-accent">UZ</span></span>
            </div>
            <div class="nav-discovery">
                <div class="search-box nav-search-box">
                    <i class="fas fa-search search-icon"></i>
                    <input
                        v-model="search"
                        :placeholder="$t('home.searchPlaceholder')"
                        class="search-input"
                    />
                </div>
                <button class="address-trigger nav-address-trigger" @click="openAddressModal">
                    <i class="fas fa-location-arrow"></i>
                    <span>{{ selectedAddressLabel || $t('form.address') }}</span>
                </button>
            </div>
            <div class="nav-right">
                <LanguageSwitcher />
                <router-link v-if="!auth.isLoggedIn" to="/login" class="btn-login">
                    <i class="fas fa-sign-in-alt"></i>
                    <span>{{ $t('nav.login') }}</span>
                </router-link>
                <template v-else>
                    <router-link v-if="auth.isAdmin" to="/admin" class="btn-login">
                        <i class="fas fa-shield-alt"></i>
                        <span>{{ $t('nav.admin') }}</span>
                    </router-link>
                    <router-link v-else to="/dashboard" class="btn-login">
                        <i class="fas fa-th-large"></i>
                        <span>{{ $t('nav.dashboard') }}</span>
                    </router-link>
                </template>
            </div>
        </nav>

        <!-- Main content -->
<div class="main">
    <section class="promo-slider">
        <button class="slider-nav slider-prev" @click="prevPromoSlide" aria-label="Previous promo">
            <i class="fas fa-chevron-left"></i>
        </button>
        <div class="promo-slider-window">
            <div class="promo-slider-track" :style="promoTrackStyle">
                <article
                    v-for="slide in promoSlides"
                    :key="slide.id"
                    class="promo-slide"
                    :style="{ background: slide.bg }"
                >
                    <div class="promo-slide-content">
                        <span class="promo-chip">{{ slide.badge }}</span>
                        <h2>{{ slide.title }}</h2>
                        <p>{{ slide.subtitle }}</p>
                    </div>
                    <div class="promo-slide-icon">
                        <i :class="slide.icon"></i>
                    </div>
                </article>
            </div>
        </div>
        <button class="slider-nav slider-next" @click="nextPromoSlide" aria-label="Next promo">
            <i class="fas fa-chevron-right"></i>
        </button>
    </section>

    <div class="promo-dots">
        <button
            v-for="(slide, index) in promoSlides"
            :key="slide.id"
            type="button"
            class="promo-dot"
            :class="{ active: index === currentPromoIndex }"
            @click="goToPromoSlide(index)"
        ></button>
    </div>

    <section class="order-toolbar">
        <h2 class="toolbar-title">What to order</h2>
        <div class="toolbar-actions">
            <div class="toolbar-chips">
                <button
                    v-for="category in quickCategories"
                    :key="category.key"
                    class="toolbar-chip"
                    :class="{ active: selectedCuisineQuick === category.key }"
                    @click="selectQuickCategory(category.key)"
                >
                    {{ category.label }}
                </button>

                <div class="dropdown-wrap" ref="moreMenuRef">
                    <button class="toolbar-chip more-chip" :class="{ active: showMoreMenu }" @click="toggleMoreMenu">
                        More <i class="fas fa-chevron-down"></i>
                    </button>
                    <transition name="menu-fade">
                        <div v-if="showMoreMenu" class="dropdown-panel">
                            <button
                                v-for="category in moreCategories"
                                :key="category.key"
                                class="dropdown-option"
                                @click="selectQuickCategory(category.key, true)"
                            >
                                {{ category.label }}
                            </button>
                        </div>
                    </transition>
                </div>
            </div>

            <div class="dropdown-wrap" ref="sortingMenuRef">
                <button class="sorting-chip" @click="toggleSortingMenu">
                    <i class="fas fa-sliders-h"></i>
                    Sorting
                </button>
                <transition name="menu-fade">
                    <div v-if="showSortingMenu" class="sorting-panel">
                        <h3>What do you want to view first?</h3>
                        <button
                            v-for="option in sortingOptions"
                            :key="option.key"
                            class="sorting-option"
                            @click="selectedSortingQuick = option.key"
                        >
                            <span>{{ option.label }}</span>
                            <i
                                class="far"
                                :class="selectedSortingQuick === option.key ? 'fa-check-circle selected' : 'fa-circle'"
                            ></i>
                        </button>
                        <button class="sorting-apply-btn" @click="applySortingSelection">Show</button>
                    </div>
                </transition>
            </div>
        </div>
    </section>

    <div class="section-header">
        <div>
            <h2 class="section-title">
                <i class="fas fa-fire section-icon"></i>
                {{ locationActive ? $t('home.nearbyTitle') : $t('home.allTitle') }}
            </h2>
            <p class="section-sub">{{ $t('home.found', { count: filtered.length }) }}</p>
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
        <div
            v-for="r in filtered"
            :key="r.id"
            class="card"
            @click="$router.push(`/restaurant/${r.id}`)"
        >
            <div class="card-img-wrap">
                <img
                    v-if="resolveImageUrl(getRestaurantImageUrl(r))"
                    :src="resolveImageUrl(getRestaurantImageUrl(r))"
                    :alt="r.name"
                    class="card-img"
                />
                <div v-else class="card-no-img">
                    <i class="fas fa-utensils"></i>
                </div>
                <div class="card-badge">
                    <i class="fas fa-circle"></i> {{ $t('home.open') }}
                </div>
                <div class="distance-badge" v-if="r.distance">
                    <i class="fas fa-route"></i>
                    {{ r.distance }} km
                </div>
            </div>
            <div class="card-body">
                <h3 class="card-title">{{ r.name }}</h3>
                <div class="card-cuisine" v-if="r.cuisine_type">
                    🍽 {{ r.cuisine_type ? $t('cuisines.' + r.cuisine_type) : '' }}
                </div>
                <p class="card-desc">{{ r.description || $t('home.noDesc') }}</p>
                <div class="card-info">
                    <span class="info-item">
                        <i class="fas fa-phone-alt"></i>
                        {{ r.phone || $t('home.noPhone') }}
                    </span>
                    <span v-if="r.location" class="info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        {{ r.location.address || $t('home.hasAddress') }}
                    </span>
                    <span class="info-item" v-if="r.city || r.country">
                        <i class="fas fa-map-marker-alt"></i>
                        {{ r.city }}{{ r.city && r.country ? ', ' : '' }}{{ r.country }}
                    </span>
                    <span class="info-item" v-if="r.price_range">
                        <i class="fas fa-tag"></i>
                        {{ r.price_range }}
                    </span>
                </div>
                <div class="card-cta">
                    <span>{{ $t('home.viewDetails') }}</span>
                    <i class="fas fa-arrow-right"></i>
                </div>
            </div>
        </div>
    </div>
</div>

        <transition name="modal-fade">
            <div v-if="showAddressModal" class="address-modal-overlay" @click.self="closeAddressModal">
                <div class="address-modal">
                    <div class="address-modal-head">
                        <div>
                            <h3>{{ $t('form.address') }}</h3>
                            <p>{{ modalHelperText }}</p>
                        </div>
                        <button class="modal-close-btn" @click="closeAddressModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="address-modal-search-row">
                        <div class="address-modal-input-wrap">
                            <i class="fas fa-search"></i>
                            <input
                                v-model="addressQuery"
                                type="text"
                                class="address-modal-input"
                                :placeholder="$t('form.addressPlaceholder')"
                                @keyup.enter="applySelectedAddress"
                            />
                        </div>
                        <button
                            class="address-confirm-btn"
                            :disabled="locationLoading || (!addressDraft && !addressQuery.trim())"
                            @click="applySelectedAddress"
                        >
                            {{ $t('home.searchBtn') }}
                        </button>
                    </div>

                    <div v-if="addressSearchLoading" class="address-search-status">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Manzil qidirilmoqda...</span>
                    </div>

                    <div v-else-if="addressSuggestions.length" class="address-suggestions">
                        <button
                            v-for="option in addressSuggestions"
                            :key="option.id"
                            class="address-suggestion"
                            @click="selectAddressSuggestion(option)"
                        >
                            <strong>{{ option.name }}</strong>
                            <span>{{ option.label }}</span>
                        </button>
                    </div>

                    <div v-else-if="addressQuery.trim() && !addressDraft" class="address-search-status empty">
                        <i class="fas fa-map-signs"></i>
                        <span>Manzil topilmadi. Boshqa variantni kiriting.</span>
                    </div>

                    <div class="address-modal-toolbar">
                        <button class="toolbar-btn" @click="useCurrentLocationInModal" :disabled="locationLoading">
                            <i :class="locationLoading ? 'fas fa-spinner fa-spin' : 'fas fa-crosshairs'"></i>
                            <span>{{ $t('home.gpsBtn') }}</span>
                        </button>
                        <span class="toolbar-note">{{ selectedMapHint }}</span>
                    </div>

                    <div class="address-map-shell">
                        <div id="home-address-map" class="address-map"></div>
                    </div>

                    <div v-if="addressDraft" class="address-modal-footer">
                        <div class="address-preview">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <strong>{{ addressDraft.label }}</strong>
                                <span>{{ addressDraft.lat.toFixed(5) }}, {{ addressDraft.lng.toFixed(5) }}</span>
                            </div>
                        </div>
                        <button class="address-apply-btn" @click="applySelectedAddress">
                            {{ $t('form.save') }}
                        </button>
                    </div>
                </div>
            </div>
        </transition>

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
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
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
const search = ref('')
const sortBy = ref('default')
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

const filters = ref({
    cuisine_type: '',
    country: '',
    city: '',
    price_range: '',
})

const cuisineKeys = ['uzbek', 'tajik', 'kazakh', 'kyrgyz', 'turkish', 'arabic', 'persian', 'afghan', 'georgian', 'russian', 'european', 'asian', 'mixed']
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

const selectQuickCategory = (key, closeMenu = false) => {
    selectedCuisineQuick.value = key
    filters.value.cuisine_type = key
    if (closeMenu) {
        showMoreMenu.value = false
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

    if (filters.value.cuisine_type) {
        result = result.filter(r => r.cuisine_type === filters.value.cuisine_type)
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

    try {
        const res = await api.get('/restaurants')
        restaurants.value = res.data
    } finally {
        loading.value = false
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

/* NAVBAR */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    height: 64px;
    background: white;
    box-shadow: 0 1px 0 #e8e8e8;
    position: sticky;
    top: 0;
    z-index: 100;
}
.nav-brand { display: flex; align-items: center; gap: 10px; }
.nav-discovery {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 0 20px;
}
.brand-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #1D9E75, #0F6E56);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 16px;
}
.brand-name { font-size: 18px; font-weight: 700; color: #1a1a1a; }
.brand-accent { color: #1D9E75; }
.nav-right { display: flex; align-items: center; gap: 10px; }
.btn-login {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 18px;
    background: #1D9E75;
    color: white;
    border-radius: 10px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s;
}
.btn-login:hover { background: #0F6E56; }

/* HERO */
.hero {
    background: linear-gradient(135deg, #0F6E56 0%, #1D9E75 50%, #5DCAA5 100%);
    padding: 60px 32px 80px;
    position: relative;
    overflow: hidden;
}
.hero-content { max-width: 600px; margin: 0 auto; text-align: center; position: relative; z-index: 2; }
.hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.2);
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 13px;
    margin-bottom: 20px;
}
.hero-title {
    font-size: 42px;
    font-weight: 800;
    color: white;
    line-height: 1.15;
    margin-bottom: 14px;
}
.hero-highlight {
    background: rgba(255,255,255,0.25);
    padding: 0 8px;
    border-radius: 8px;
}
.hero-sub { font-size: 16px; color: rgba(255,255,255,0.85); margin-bottom: 28px; }

.search-wrap { margin-bottom: 22px; }
.search-box {
    display: flex; align-items: center;
    background: white;
    border-radius: 14px;
    padding: 6px 6px 6px 16px;
    gap: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}
.search-icon { font-size: 16px; color: #aaa; }
.nav-search-box {
    flex: 1;
    max-width: 420px;
    min-height: 46px;
    box-shadow: none;
    border-radius: 14px;
    background: #ffffff;
    border: 1px solid #d9ede6;
}
.search-input {
    flex: 1; border: none; outline: none;
    font-size: 15px; padding: 8px 0;
    color: #1a1a1a; background: transparent;
}
.address-search-status {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
    padding: 12px 14px;
    border-radius: 14px;
    background: #f5fbf8;
    color: #2b6b57;
    font-size: 14px;
}
.address-search-status.empty {
    background: #fff7eb;
    color: #9a6100;
}
.address-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-width: 220px;
    padding: 0 18px;
    border: 1px solid #168b67;
    border-radius: 16px;
    background: #1D9E75;
    color: white;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(15,110,86,0.22);
    transition: transform 0.2s, box-shadow 0.2s;
}
.nav-address-trigger {
    min-width: 190px;
    min-height: 46px;
    border-radius: 14px;
    box-shadow: none;
}
.address-trigger:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(15,110,86,0.28);
    background: #0F6E56;
}
.address-trigger span {
    max-width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.hero-stats {
    display: flex; align-items: center; justify-content: center; gap: 20px;
}
.stat { text-align: center; color: white; }
.stat strong { display: block; font-size: 20px; font-weight: 700; }
.stat span { font-size: 12px; opacity: 0.8; }
.stat-divider { width: 1px; height: 32px; background: rgba(255,255,255,0.3); }

/* Decorations */
.hero-decoration { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; }
.deco-circle {
    position: absolute; border-radius: 50%;
    background: rgba(255,255,255,0.07);
}
.deco-1 { width: 300px; height: 300px; top: -100px; right: -80px; }
.deco-2 { width: 200px; height: 200px; bottom: -60px; left: -40px; }
.deco-3 { width: 150px; height: 150px; top: 30px; left: 20%; }

/* MAIN */
.main { max-width: 1200px; margin: 18px auto 0; padding: 0 24px 40px; position: relative; z-index: 3; }

.promo-slider {
    position: relative;
    margin-bottom: 14px;
}
.promo-slider-window {
    overflow: hidden;
    border-radius: 20px;
}
.promo-slider-track {
    display: flex;
    transition: transform 0.4s ease;
}
.promo-slide {
    min-width: 100%;
    min-height: 190px;
    border-radius: 20px;
    padding: 26px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    box-shadow: 0 10px 28px rgba(11, 47, 39, 0.22);
}
.promo-slide-content {
    max-width: 70%;
}
.promo-chip {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.2);
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 10px;
}
.promo-slide h2 {
    font-size: 30px;
    line-height: 1.12;
    margin-bottom: 8px;
}
.promo-slide p {
    font-size: 14px;
    opacity: 0.92;
}
.promo-slide-icon {
    width: 94px;
    height: 94px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 38px;
}

.slider-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: rgba(13, 21, 19, 0.55);
    color: #fff;
    cursor: pointer;
    z-index: 2;
}
.slider-nav:hover {
    background: rgba(13, 21, 19, 0.75);
}
.slider-prev { left: -18px; }
.slider-next { right: -18px; }

.promo-dots {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 20px;
}
.promo-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    border: none;
    background: #c5d8d1;
    cursor: pointer;
    transition: all 0.2s;
}
.promo-dot.active {
    width: 20px;
    background: #1D9E75;
}

.order-toolbar {
    background: #ffffff;
    border-radius: 18px;
    padding: 16px;
    margin-bottom: 18px;
    box-shadow: 0 3px 12px rgba(12, 38, 32, 0.08);
}
.toolbar-title {
    font-size: 34px;
    line-height: 1.05;
    margin-bottom: 14px;
    color: #172b26;
    font-weight: 800;
}
.toolbar-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
}
.toolbar-chips {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}
.toolbar-chip {
    border: 1px solid #dce8e3;
    background: #f9fcfb;
    color: #35544c;
    border-radius: 999px;
    padding: 9px 14px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}
.toolbar-chip.active,
.toolbar-chip:hover {
    background: #e8f6f1;
    border-color: #83cdb6;
    color: #0f6e56;
}
.more-chip i {
    font-size: 11px;
    margin-left: 6px;
}

.dropdown-wrap {
    position: relative;
}
.dropdown-panel {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 220px;
    max-height: 320px;
    overflow: auto;
    padding: 8px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 20px 45px rgba(11, 41, 34, 0.18);
    border: 1px solid #e0ece7;
    z-index: 20;
}
.dropdown-option {
    width: 100%;
    border: none;
    border-radius: 10px;
    text-align: left;
    background: transparent;
    padding: 10px 12px;
    color: #305047;
    cursor: pointer;
}
.dropdown-option:hover {
    background: #eef8f4;
}

.sorting-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #dce8e3;
    background: #f9fcfb;
    color: #27473e;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 15px;
    cursor: pointer;
}
.sorting-chip:hover {
    border-color: #83cdb6;
}
.sorting-panel {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 300px;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 20px 45px rgba(11, 41, 34, 0.2);
    border: 1px solid #e0ece7;
    padding: 14px;
    z-index: 22;
}
.sorting-panel h3 {
    font-size: 29px;
    line-height: 1.1;
    margin-bottom: 12px;
    color: #203c35;
}
.sorting-option {
    width: 100%;
    border: none;
    background: transparent;
    border-radius: 10px;
    padding: 9px 6px;
    color: #3a564f;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.sorting-option:hover {
    background: #eef8f4;
}
.sorting-option .selected {
    color: #1D9E75;
}
.sorting-apply-btn {
    width: 100%;
    margin-top: 10px;
    min-height: 46px;
    border-radius: 12px;
    border: none;
    background: #1D9E75;
    color: white;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

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
.filter-tabs { display: flex; gap: 6px; }
.filter-tab {
    padding: 6px 14px; border-radius: 8px; font-size: 13px;
    border: 1px solid #e8e8e8; background: white; cursor: pointer;
    color: #666; transition: all 0.2s;
}
.filter-tab.active { background: #1D9E75; color: white; border-color: #1D9E75; }

/* SKELETON */
.loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.skeleton-card { background: white; border-radius: 16px; overflow: hidden; }
.skeleton-img { height: 180px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
.skeleton-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.skeleton-line { height: 12px; background: #f0f0f0; border-radius: 6px; }
.w70 { width: 70%; }
.w90 { width: 90%; }
.w50 { width: 50%; }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

/* EMPTY */
.empty-state { text-align: center; padding: 80px 0; }
.empty-icon { font-size: 56px; color: #ddd; margin-bottom: 16px; }
.empty-state h3 { font-size: 20px; color: #333; margin-bottom: 8px; }
.empty-state p { color: #999; }

/* GRID */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

/* CARD */
.card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.25s, box-shadow 0.25s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }

.card-img-wrap { position: relative; height: 190px; overflow: hidden; }
.card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.card:hover .card-img { transform: scale(1.05); }
.card-no-img {
    width: 100%; height: 100%;
    background: linear-gradient(135deg, #f0f0f0, #e8e8e8);
    display: flex; align-items: center; justify-content: center;
    font-size: 40px; color: #ccc;
}
.card-badge {
    position: absolute; top: 12px; left: 12px;
    background: #1D9E75; color: white;
    padding: 4px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 500;
    display: flex; align-items: center; gap: 4px;
}
.card-badge .fa-circle { font-size: 6px; }

.card-body { padding: 16px; }
.card-title { font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; }
.card-desc {
    font-size: 13px; color: #777; margin-bottom: 12px;
    display: -webkit-box; -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5;
}
.card-info { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.info-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #555; }
.info-item i { color: #1D9E75; font-size: 11px; width: 14px; }
.card-cta {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
    font-size: 13px; font-weight: 600; color: #1D9E75;
}

/* FOOTER */
.footer { background: #1a1a1a; padding: 24px; margin-top: 20px; }
.footer-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.footer-brand { display: flex; align-items: center; gap: 8px; color: white; font-size: 16px; font-weight: 600; }
.footer-brand i { color: #1D9E75; }
.footer-copy { font-size: 13px; color: #666; }

/* FILTERS */
.filters-card {
    background: white; border-radius: 16px;
    padding: 20px; margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.filters-header {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 16px;
}
.filters-header h3 {
    font-size: 15px; font-weight: 700; color: #1a1a1a;
    display: flex; align-items: center; gap: 8px;
}
.filters-header h3 i { color: #1D9E75; }
.clear-btn {
    display: flex; align-items: center; gap: 4px;
    padding: 6px 12px; background: #FCEBEB;
    color: #A32D2D; border: none; border-radius: 8px;
    font-size: 12px; cursor: pointer;
}
.filters-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 16px; margin-bottom: 12px;
}
.filter-item { display: flex; flex-direction: column; gap: 6px; }
.filter-label {
    font-size: 12px; font-weight: 600; color: #666;
    display: flex; align-items: center; gap: 5px;
}
.filter-label i { color: #1D9E75; font-size: 11px; }
.filter-select {
    padding: 9px 12px; border: 1.5px solid #e8e8e8;
    border-radius: 10px; font-size: 13px; outline: none;
    background: white; color: #1a1a1a; cursor: pointer;
    transition: border 0.2s;
}
.filter-select:focus { border-color: #1D9E75; }

/* PRICE FILTER */
.price-filter { display: flex; gap: 6px; }
.price-btn {
    flex: 1; padding: 8px 4px;
    border: 1.5px solid #e8e8e8;
    border-radius: 8px; background: white;
    font-size: 13px; font-weight: 600; color: #888;
    cursor: pointer; transition: all 0.2s;
}
.price-btn.active {
    border-color: #1D9E75; background: #E1F5EE; color: #0F6E56;
}
.price-btn:hover { border-color: #1D9E75; }

/* ACTIVE FILTERS */
.active-filters {
    display: flex; flex-wrap: wrap; gap: 8px;
    padding-top: 12px; border-top: 1px solid #f0f0f0;
}
.filter-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: #E1F5EE; color: #0F6E56;
    padding: 5px 12px; border-radius: 20px; font-size: 13px;
}
.filter-tag i { cursor: pointer; font-size: 10px; }
.filter-tag i:hover { color: #E24B4A; }

/* CARD - cuisine badge */
.card-cuisine {
    display: inline-flex; align-items: center; gap: 4px;
    background: #f0f0f0; color: #555;
    padding: 3px 8px; border-radius: 6px;
    font-size: 11px; margin-bottom: 6px;
}

/* SORT */
.sort-wrap { display: flex; align-items: center; }
.sort-select {
    padding: 8px 12px; border: 1.5px solid #e8e8e8;
    border-radius: 10px; font-size: 13px;
    outline: none; background: white; cursor: pointer;
}

/* DISTANCE BADGE */
.distance-badge {
    position: absolute; top: 12px; right: 12px;
    background: rgba(0,0,0,0.6); color: white;
    padding: 4px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 500;
    display: flex; align-items: center; gap: 4px;
}

/* ADDRESS MODAL */
.address-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(11, 37, 30, 0.36);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    z-index: 300;
}
.address-modal {
    width: min(980px, 100%);
    background: #ffffff;
    color: #18322b;
    border-radius: 28px;
    padding: 26px;
    box-shadow: 0 22px 70px rgba(8, 52, 41, 0.2);
}
.address-modal-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 18px;
}
.address-modal-head h3 {
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 6px;
}
.address-modal-head p {
    color: #6c7f79;
    font-size: 13px;
}
.modal-close-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #d8ebe4;
    background: #f7fcfa;
    color: #5d746d;
    cursor: pointer;
}
.address-modal-search-row {
    display: grid;
    grid-template-columns: 1fr 140px;
    gap: 10px;
    margin-bottom: 14px;
}
.address-modal-input-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f8fcfb;
    border: 1px solid #d4e8e2;
    border-radius: 16px;
    padding: 0 16px;
    min-height: 56px;
}
.address-modal-input-wrap i {
    color: #7da098;
}
.address-modal-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: #17322a;
    font-size: 14px;
}
.address-modal-input::placeholder {
    color: #8aa59e;
}
.address-confirm-btn,
.address-apply-btn {
    border: 1px solid #168b67;
    border-radius: 16px;
    background: #1D9E75;
    color: white;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
}
.address-confirm-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}
.address-suggestions {
    display: grid;
    gap: 8px;
    margin-bottom: 14px;
    max-height: 180px;
    overflow: auto;
}
.address-suggestion {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 12px 14px;
    border-radius: 14px;
    border: 1px solid #d6ebe4;
    background: #f9fdfb;
    color: #17332b;
    cursor: pointer;
    text-align: left;
}
.address-suggestion:hover {
    border-color: #1D9E75;
    background: #eef8f4;
}
.address-suggestion span {
    color: #68867d;
    font-size: 12px;
}
.address-modal-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 14px;
}
.toolbar-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 999px;
    border: 1px solid #cde5dd;
    background: #f7fcfa;
    color: #0f6e56;
    cursor: pointer;
}
.toolbar-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
.toolbar-note {
    color: #5c7a72;
    font-size: 13px;
}
.address-map-shell {
    overflow: hidden;
    border-radius: 22px;
    border: 1px solid #d7ebe4;
}
.address-map {
    width: 100%;
    height: 340px;
    background: #eef5f2;
}
.address-modal-footer {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}
.address-preview {
    display: flex;
    align-items: center;
    gap: 12px;
}
.address-preview i {
    color: #1D9E75;
    font-size: 18px;
}
.address-preview strong {
    display: block;
    font-size: 14px;
}
.address-preview span {
    color: #6f8a83;
    font-size: 12px;
}
.address-apply-btn {
    min-width: 150px;
    min-height: 48px;
    background: #0F6E56;
    color: white;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

/* Mobile */
@media (max-width: 768px) {
    .main { margin-top: 12px; }
    .promo-slide { min-height: 160px; padding: 20px; }
    .promo-slide h2 { font-size: 22px; }
    .promo-slide-icon { width: 72px; height: 72px; font-size: 28px; border-radius: 20px; }
    .slider-prev { left: 8px; }
    .slider-next { right: 8px; }
    .toolbar-title { font-size: 30px; }
    .toolbar-actions { flex-direction: column; align-items: stretch; }
    .sorting-panel { right: 0; left: 0; width: 100%; }
    .dropdown-panel { width: 100%; max-width: 280px; }
    .filters-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
    .promo-slide-content { max-width: 100%; }
    .promo-slide-icon { display: none; }
    .toolbar-title { font-size: 26px; }
    .filters-grid { grid-template-columns: 1fr; }
}

/* MOBILE */
@media (max-width: 768px) {
    .navbar { padding: 0 16px; }
    .nav-discovery {
        order: 3;
        width: 100%;
        margin: 12px 0 0;
        flex-direction: column;
    }
    .nav-search-box,
    .nav-address-trigger {
        width: 100%;
        max-width: none;
    }
    .navbar {
        height: auto;
        flex-wrap: wrap;
        padding-top: 12px;
        padding-bottom: 12px;
    }
    .hero { padding: 40px 16px 60px; }
    .hero-title { font-size: 28px; }
    .main { padding: 0 12px 32px; }
    .section-header { flex-direction: column; align-items: flex-start; gap: 12px; }
    .grid { grid-template-columns: 1fr; }
    .hero-stats { gap: 12px; }
    .footer-inner { flex-direction: column; gap: 12px; text-align: center; }
    .address-modal { padding: 18px; border-radius: 22px; }
    .address-modal-search-row { grid-template-columns: 1fr; }
    .address-modal-toolbar,
    .address-modal-footer { flex-direction: column; align-items: stretch; }
    .address-map { height: 300px; }
}
@media (max-width: 480px) {
    .hero-title { font-size: 24px; }
    .nav-right { width: 100%; justify-content: space-between; }
    .address-modal-overlay { padding: 12px; }
}
</style>