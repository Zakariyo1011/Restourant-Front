<template>
    <div class="page">
        <div class="search-bar">
            <i class="fas fa-magnifying-glass search-icon"></i>
            <input
                v-model="query"
                type="text"
                class="search-input"
                :placeholder="$t('home.searchPlaceholder')"
                autofocus
            />
            <button type="button" class="filter-btn" @click="showFiltersSheet = true">
                <i class="fas fa-sliders"></i>
            </button>
        </div>

        <div v-if="loading" class="grid">
            <div v-for="i in 6" :key="i" class="skeleton"></div>
        </div>

        <div v-else-if="!query.trim() && !hasActiveFilters" class="hint-state">
            <i class="fas fa-magnifying-glass hint-icon"></i>
            <p>{{ $t('search.hint') }}</p>
        </div>

        <div v-else-if="!results.length" class="empty-state">
            <h3>{{ $t('home.emptyTitle') }}</h3>
            <p>{{ $t('home.emptySub') }}</p>
        </div>

        <div v-else class="grid">
            <HomeRestaurantCard
                v-for="restaurant in results"
                :key="restaurant.id"
                :restaurant="restaurant"
                :resolve-image-url="resolveImageUrl"
                :get-restaurant-image-url="getRestaurantImageUrl"
                :get-cuisine-label="getCuisineLabel"
                @select="goToRestaurant"
            />
        </div>

        <FiltersSheet
            :show="showFiltersSheet"
            :cuisine-options="cuisineOptions"
            :selected-cuisine="selectedCuisine"
            :price-ranges="priceRanges"
            :selected-price-range="selectedPriceRange"
            :selected-rating="selectedRating"
            :result-count="results.length"
            @close="showFiltersSheet = false"
            @selectCuisine="selectedCuisine = $event"
            @selectPriceRange="selectedPriceRange = $event"
            @selectRating="selectedRating = $event"
            @apply="showFiltersSheet = false"
        />
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api from '../axios'
import HomeRestaurantCard from '../components/home/HomeRestaurantCard.vue'
import FiltersSheet from '../components/home/FiltersSheet.vue'
import { resolveImageUrl } from '../utils/imageUrl'
import { getRestaurantImageUrl } from '../utils/restaurantImage'

const router = useRouter()
const { t } = useI18n()

const query = ref('')
const restaurants = ref([])
const loading = ref(true)
const showFiltersSheet = ref(false)
const selectedCuisine = ref('')
const selectedPriceRange = ref('')
const selectedRating = ref('')
const priceRanges = ['$', '$$', '$$$']

const cuisineKeys = ['uzbek', 'tajik', 'kazakh', 'kyrgyz', 'turkmen', 'turkish', 'arabic', 'persian', 'afghan', 'georgian', 'russian', 'european', 'asian', 'mixed']
const cuisineOptions = cuisineKeys.map((key) => ({ key, label: t(`cuisines.${key}`) }))
const getCuisineLabel = (value) => {
    if (!value) return ''
    const normalized = String(value).trim().toLowerCase()
    return cuisineKeys.includes(normalized) ? t(`cuisines.${normalized}`) : value
}

const hasActiveFilters = computed(() => !!(selectedCuisine.value || selectedPriceRange.value || selectedRating.value))

const results = computed(() => {
    let result = restaurants.value

    const q = query.value.trim().toLowerCase()
    if (q) {
        result = result.filter((r) =>
            r.name?.toLowerCase().includes(q) ||
            r.cuisine_type?.toLowerCase().includes(q) ||
            r.city?.toLowerCase().includes(q) ||
            r.description?.toLowerCase().includes(q)
        )
    }
    if (selectedCuisine.value) {
        result = result.filter((r) => String(r.cuisine_type || '').toLowerCase().includes(selectedCuisine.value))
    }
    if (selectedPriceRange.value) {
        result = result.filter((r) => r.price_range === selectedPriceRange.value)
    }
    if (selectedRating.value) {
        result = result.filter((r) => (Number(r.rating) || 0) >= Number(selectedRating.value))
    }

    return result
})

function goToRestaurant(id) {
    router.push(`/restaurant/${id}`)
}

onMounted(async () => {
    try {
        const res = await api.get('/restaurants', { params: { per_page: 100 } })
        restaurants.value = Array.isArray(res.data?.data) ? res.data.data : []
    } catch {
        restaurants.value = []
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.page {
    max-width: 1100px;
    margin: 0 auto;
    padding: var(--space-6) var(--space-5) var(--space-8);
}

.search-bar {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: var(--color-surface);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-pill);
    padding: 10px var(--space-4);
    margin-bottom: var(--space-6);
    box-shadow: var(--shadow-sm);
}

.search-icon { color: var(--color-text-faint); }

.search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 15px;
    font-family: inherit;
    color: var(--color-text);
    background: transparent;
}

.filter-btn {
    width: 34px; height: 34px;
    border-radius: 50%;
    border: none;
    background: var(--color-primary-tint);
    color: var(--color-primary);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: var(--space-5);
}

.skeleton {
    height: 280px;
    border-radius: var(--radius-lg);
    background: linear-gradient(90deg, var(--color-border-light) 25%, var(--color-border) 37%, var(--color-border-light) 63%);
    background-size: 400% 100%;
    animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }

.hint-state, .empty-state {
    text-align: center;
    padding: var(--space-8) var(--space-5);
    color: var(--color-text-muted);
}
.hint-icon { font-size: 32px; color: var(--color-border); margin-bottom: var(--space-3); display: block; }
.empty-state h3 { font-size: 17px; color: var(--color-text); margin: 0 0 6px; }
</style>
