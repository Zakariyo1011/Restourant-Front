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

        <!-- Hero -->
        <div class="hero">
            <div class="hero-content">
                <div class="hero-badge">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ $t('home.badge') }}
                </div>
                <h1 class="hero-title">
                    {{ $t('home.title1') }}<br/>
                    <span class="hero-highlight">{{ $t('home.title2') }}</span><br/>
                    {{ $t('home.title3') }}
                </h1>
                <p class="hero-sub">{{ $t('home.subtitle') }}</p>
                <div class="search-wrap">
                
                <!-- GPS tugmasi -->
                    <div class="gps-wrap">
                        <button @click="getUserLocation" :class="['gps-btn', { active: locationActive, loading: locationLoading }]">
                         <i :class="locationLoading ? 'fas fa-spinner fa-spin' : 'fas fa-location-arrow'"></i>
                         <span>{{ locationLoading ? $t('home.gpsLoading') : locationActive ? $t('home.gpsActive') : $t('home.gpsBtn') }}</span>
                     </button>
                     <span v-if="userLocation" class="gps-info">
                          <i class="fas fa-check-circle"></i>
                         {{ $t('home.gpsFound', { count: nearbyCount }) }}
                     </span>
                    </div>
                    <div class="search-box">
                        <i class="fas fa-search search-icon"></i>
                        <input
                            v-model="search"
                            :placeholder="$t('home.searchPlaceholder')"
                            class="search-input"
                        />
                        <button class="search-btn">{{ $t('home.searchBtn') }}</button>
                    </div>
                </div>
                <div class="hero-stats">
                    <div class="stat">
                        <strong>{{ restaurants.length }}+</strong>
                        <span>{{ $t('home.statRestaurants') }}</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat">
                        <strong>100%</strong>
                        <span>{{ $t('home.statVerified') }}</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat">
                        <strong>{{ $t('home.statFree') }}</strong>
                        <span>{{ $t('home.statService') }}</span>
                    </div>
                </div>
            </div>
            <div class="hero-decoration">
                <div class="deco-circle deco-1"></div>
                <div class="deco-circle deco-2"></div>
                <div class="deco-circle deco-3"></div>
            </div>
        </div>

        <!-- Main content -->
<div class="main">
    <!-- Filters -->
    <div class="filters-card">
        <div class="filters-header">
            <h3><i class="fas fa-sliders-h"></i> {{ $t('home.filters') }}</h3>
            <button v-if="hasActiveFilters" @click="clearFilters" class="clear-btn">
                <i class="fas fa-times"></i> {{ $t('home.clearFilters') }}
            </button>
        </div>
        <div class="filters-grid">
            <div class="filter-item">
                <label class="filter-label">
                    <i class="fas fa-utensils"></i> {{ $t('home.cuisine') }}
                </label>
                <select v-model="filters.cuisine_type" class="filter-select">
                    <option value="">{{ $t('home.all') }}</option>
                    <option v-for="key in cuisineKeys" :key="key" :value="key">{{ $t('cuisines.' + key) }}</option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label">
                    <i class="fas fa-globe"></i> {{ $t('home.country') }}
                </label>
                <select v-model="filters.country" class="filter-select">
                    <option value="">{{ $t('home.all') }}</option>
                    <option v-for="country in uniqueCountries" :key="country" :value="country">
                        {{ country }}
                    </option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label">
                    <i class="fas fa-city"></i> {{ $t('home.city') }}
                </label>
                <select v-model="filters.city" class="filter-select">
                    <option value="">{{ $t('home.all') }}</option>
                    <option v-for="city in uniqueCities" :key="city" :value="city">
                        {{ city }}
                    </option>
                </select>
            </div>
            <div class="filter-item">
                <label class="filter-label">
                    <i class="fas fa-tag"></i> {{ $t('home.price') }}
                </label>
                <div class="price-filter">
                    <button
                        v-for="price in ['$', '$$', '$$$']"
                        :key="price"
                        :class="['price-btn', { active: filters.price_range === price }]"
                        @click="togglePrice(price)"
                    >
                        {{ price }}
                    </button>
                </div>
            </div>
        </div>
        <div v-if="hasActiveFilters" class="active-filters">
            <span v-if="filters.cuisine_type" class="filter-tag">
                🍽 {{ $t('cuisines.' + filters.cuisine_type) }}
                <i class="fas fa-times" @click="filters.cuisine_type = ''"></i>
            </span>
            <span v-if="filters.country" class="filter-tag">
                🌍 {{ filters.country }}
                <i class="fas fa-times" @click="filters.country = ''"></i>
            </span>
            <span v-if="filters.city" class="filter-tag">
                🏙 {{ filters.city }}
                <i class="fas fa-times" @click="filters.city = ''"></i>
            </span>
            <span v-if="filters.price_range" class="filter-tag">
                💰 {{ filters.price_range }}
                <i class="fas fa-times" @click="filters.price_range = ''"></i>
            </span>
        </div>
    </div>

    <!-- Section header -->
    <div class="section-header">
        <div>
            <h2 class="section-title">
                <i class="fas fa-fire section-icon"></i>
                {{ locationActive ? $t('home.nearbyTitle') : $t('home.allTitle') }}
            </h2>
            <p class="section-sub">{{ $t('home.found', { count: filtered.length }) }}</p>
        </div>
        <div class="sort-wrap">
            <select v-model="sortBy" class="sort-select">
                <option value="default">{{ $t('home.sortDefault') }}</option>
                <option value="distance" v-if="locationActive">{{ $t('home.sortDistance') }}</option>
                <option value="name">{{ $t('home.sortName') }}</option>
            </select>
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
                    v-if="resolveImageUrl(r.image_path)"
                    :src="resolveImageUrl(r.image_path)"
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

import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import api from '../axios'
import { resolveImageUrl } from '../utils/imageUrl'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const { t } = useI18n()

const auth = useAuthStore()
const restaurants = ref([])
const loading = ref(true)
const search = ref('')
const sortBy = ref('default')
const userLocation = ref(null)
const locationActive = ref(false)
const locationLoading = ref(false)
const nearbyRestaurants = ref([])

const filters = ref({
    cuisine_type: '',
    country: '',
    city: '',
    price_range: '',
})

const cuisineKeys = ['uzbek', 'tajik', 'kazakh', 'kyrgyz', 'turkish', 'arabic', 'persian', 'afghan', 'georgian', 'russian', 'european', 'asian', 'mixed']

const uniqueCountries = computed(() => {
    const countries = restaurants.value.map(r => r.country).filter(Boolean)
    return [...new Set(countries)].sort()
})

const uniqueCities = computed(() => {
    const cities = restaurants.value
        .filter(r => !filters.value.country || r.country === filters.value.country)
        .map(r => r.city).filter(Boolean)
    return [...new Set(cities)].sort()
})

const hasActiveFilters = computed(() => {
    return Object.values(filters.value).some(v => v !== '')
})

const nearbyCount = computed(() => nearbyRestaurants.value.length)

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

    if (sortBy.value === 'distance' && locationActive.value) {
        result = [...result].sort((a, b) => (a.distance || 0) - (b.distance || 0))
    } else if (sortBy.value === 'name') {
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
})

const getUserLocation = () => {
    if (!navigator.geolocation) {
        alert('Brauzeringiz GPS ni qo\'llab-quvvatlamaydi')
        return
    }

    if (locationActive.value) {
        locationActive.value = false
        userLocation.value = null
        nearbyRestaurants.value = []
        sortBy.value = 'default'
        return
    }

    locationLoading.value = true

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            userLocation.value = { lat, lng }

            try {
                const res = await api.get('/restaurants/nearby', {
                    params: { lat, lng, radius: 50 }
                })
                nearbyRestaurants.value = res.data
                locationActive.value = true
                sortBy.value = 'distance'
            } catch (e) {
                console.error(e)
            } finally {
                locationLoading.value = false
            }
        },
        (error) => {
            locationLoading.value = false
            alert('Joylashuvni aniqlab bo\'lmadi. Ruxsat bering.')
        },
        { enableHighAccuracy: true, timeout: 10000 }
    )
}

const togglePrice = (price) => {
    filters.value.price_range = filters.value.price_range === price ? '' : price
}

const clearFilters = () => {
    filters.value = { cuisine_type: '', country: '', city: '', price_range: '' }
}

onMounted(async () => {
    try {
        const res = await api.get('/restaurants')
        restaurants.value = res.data
    } finally {
        loading.value = false
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

.search-wrap { margin-bottom: 32px; }
.search-box {
    display: flex; align-items: center;
    background: white;
    border-radius: 14px;
    padding: 6px 6px 6px 16px;
    gap: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}
.search-icon { font-size: 16px; color: #aaa; }
.search-input {
    flex: 1; border: none; outline: none;
    font-size: 15px; padding: 8px 0;
    color: #1a1a1a; background: transparent;
}
.search-btn {
    padding: 10px 20px;
    background: #1D9E75;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}
.search-btn:hover { background: #0F6E56; }

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
.main { max-width: 1200px; margin: -28px auto 0; padding: 0 24px 40px; position: relative; z-index: 3; }

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

/* GPS */
.gps-wrap {
    display: flex; align-items: center;
    justify-content: center; gap: 12px;
    flex-wrap: wrap;
}
.gps-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px;
    background: rgba(255,255,255,0.15);
    color: white; border: 1.5px solid rgba(255,255,255,0.4);
    border-radius: 25px; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
    backdrop-filter: blur(4px);
}
.gps-btn:hover { background: rgba(255,255,255,0.25); }
.gps-btn.active {
    background: white; color: #1D9E75;
    border-color: white;
}
.gps-btn.loading { opacity: 0.8; cursor: not-allowed; }
.gps-info {
    display: flex; align-items: center; gap: 6px;
    color: white; font-size: 13px;
    background: rgba(255,255,255,0.15);
    padding: 6px 14px; border-radius: 20px;
}
.gps-info i { color: #9FE1CB; }

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

/* Mobile */
@media (max-width: 768px) {
    .filters-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
    .filters-grid { grid-template-columns: 1fr; }
}

/* MOBILE */
@media (max-width: 768px) {
    .navbar { padding: 0 16px; }
    .hero { padding: 40px 16px 60px; }
    .hero-title { font-size: 28px; }
    .main { padding: 0 12px 32px; }
    .section-header { flex-direction: column; align-items: flex-start; gap: 12px; }
    .grid { grid-template-columns: 1fr; }
    .hero-stats { gap: 12px; }
    .footer-inner { flex-direction: column; gap: 12px; text-align: center; }
}
@media (max-width: 480px) {
    .hero-title { font-size: 24px; }
    .search-btn span { display: none; }
}
</style>