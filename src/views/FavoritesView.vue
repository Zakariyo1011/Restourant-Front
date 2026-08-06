<template>
    <div class="page">
        <header class="page-head">
            <h1>{{ $t('favorites.title') }}</h1>
            <p>{{ $t('favorites.subtitle') }}</p>
        </header>

        <div v-if="favorites.loading" class="grid">
            <div v-for="i in 4" :key="i" class="skeleton"></div>
        </div>

        <div v-else-if="!favorites.items.length" class="empty-state">
            <div class="empty-icon"><i class="far fa-heart"></i></div>
            <h3>{{ $t('favorites.emptyTitle') }}</h3>
            <p>{{ $t('favorites.emptySub') }}</p>
            <router-link to="/" class="empty-cta">{{ $t('favorites.emptyCta') }}</router-link>
        </div>

        <div v-else class="grid">
            <HomeRestaurantCard
                v-for="restaurant in favorites.items"
                :key="restaurant.id"
                :restaurant="restaurant"
                :resolve-image-url="resolveImageUrl"
                :get-restaurant-image-url="getRestaurantImageUrl"
                :get-cuisine-label="getCuisineLabel"
                @select="goToRestaurant"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFavoritesStore } from '../stores/favorites'
import HomeRestaurantCard from '../components/home/HomeRestaurantCard.vue'
import { resolveImageUrl } from '../utils/imageUrl'
import { getRestaurantImageUrl } from '../utils/restaurantImage'

const favorites = useFavoritesStore()
const router = useRouter()
const { t } = useI18n()

const cuisineKeys = ['uzbek', 'tajik', 'kazakh', 'kyrgyz', 'turkmen', 'turkish', 'arabic', 'persian', 'afghan', 'georgian', 'russian', 'european', 'asian', 'mixed']
const getCuisineLabel = (value) => {
    if (!value) return ''
    const normalized = String(value).trim().toLowerCase()
    return cuisineKeys.includes(normalized) ? t(`cuisines.${normalized}`) : value
}

function goToRestaurant(id) {
    router.push(`/restaurant/${id}`)
}

onMounted(() => {
    favorites.fetch()
})
</script>

<style scoped>
.page {
    max-width: 1100px;
    margin: 0 auto;
    padding: var(--space-6) var(--space-5) var(--space-8);
}

.page-head { margin-bottom: var(--space-6); }
.page-head h1 { font-size: 24px; font-weight: 800; color: var(--color-text); margin: 0 0 4px; }
.page-head p { font-size: 14px; color: var(--color-text-muted); margin: 0; }

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

.empty-state {
    text-align: center;
    padding: var(--space-8) var(--space-5);
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
}
.empty-icon {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: var(--color-primary-tint);
    color: var(--color-primary);
    display: flex; align-items: center; justify-content: center;
    font-size: 30px;
    margin: 0 auto var(--space-4);
}
.empty-state h3 { font-size: 18px; font-weight: 700; color: var(--color-text); margin: 0 0 6px; }
.empty-state p { font-size: 14px; color: var(--color-text-muted); margin: 0 0 var(--space-5); }
.empty-cta {
    display: inline-block;
    padding: 12px 24px;
    background: var(--color-primary);
    color: #fff;
    border-radius: var(--radius-md);
    text-decoration: none;
    font-weight: 700;
    font-size: 14px;
}
.empty-cta:hover { background: var(--color-primary-dark); }
</style>
