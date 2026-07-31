<template>
    <div class="card" :class="{ 'card-compact': variant === 'compact' }" @click="$emit('select', restaurant.id)">
        <div class="card-img-wrap">
            <img
                v-if="imageSrc"
                :src="imageSrc"
                :alt="restaurant.name"
                class="card-img"
                loading="lazy"
            />
            <div v-else class="card-no-img">
                <i class="fas fa-utensils"></i>
            </div>
            <div class="distance-badge" v-if="restaurant.distance">
                <i class="fas fa-route"></i>
                {{ restaurant.distance }} km
            </div>
            <div class="rating-badge" v-if="restaurant.rating">
                <i class="fas fa-star"></i>
                {{ Number(restaurant.rating).toFixed(1) }}
            </div>
        </div>
        <div class="card-body">
            <h3 class="card-title">{{ restaurant.name }}</h3>
            <div class="card-cuisine" v-if="restaurant.cuisine_type">
                🍽 {{ getCuisineLabel(restaurant.cuisine_type) }}
            </div>
            <p class="card-desc">{{ restaurant.description || $t('home.noDesc') }}</p>
            <div class="card-info">
                <span class="info-item">
                    <i class="fas fa-phone-alt"></i>
                    {{ restaurant.phone || $t('home.noPhone') }}
                </span>
                <span v-if="restaurant.location" class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ restaurant.location.address || $t('home.hasAddress') }}
                </span>
                <span class="info-item" v-if="restaurant.city || restaurant.country">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ restaurant.city }}{{ restaurant.city && restaurant.country ? ', ' : '' }}{{ restaurant.country }}
                </span>
                <span class="info-item" v-if="restaurant.price_range">
                    <i class="fas fa-tag"></i>
                    {{ restaurant.price_range }}
                </span>
            </div>
            <div class="card-cta">
                <span>{{ $t('home.viewDetails') }}</span>
                <i class="fas fa-arrow-right"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    restaurant: {
        type: Object,
        required: true,
    },
    variant: {
        type: String,
        default: 'default',
    },
    resolveImageUrl: {
        type: Function,
        required: true,
    },
    getRestaurantImageUrl: {
        type: Function,
        required: true,
    },
    getCuisineLabel: {
        type: Function,
        required: true,
    },
})

defineEmits(['select'])

const imageSrc = computed(() => props.resolveImageUrl(props.getRestaurantImageUrl(props.restaurant)))
</script>

<style scoped>
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
.card-cuisine {
    display: inline-flex; align-items: center; gap: 4px;
    background: #f0f0f0; color: #555;
    padding: 3px 8px; border-radius: 6px;
    font-size: 11px; margin-bottom: 6px;
}
.distance-badge {
    position: absolute; top: 12px; right: 12px;
    background: rgba(0,0,0,0.6); color: white;
    padding: 4px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 500;
    display: flex; align-items: center; gap: 4px;
}
.rating-badge {
    position: absolute; top: 12px; left: 12px;
    background: rgba(255,255,255,0.92); color: #1a1a1a;
    padding: 4px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 700;
    display: flex; align-items: center; gap: 4px;
}
.rating-badge i { color: #f5a623; font-size: 10px; }

/* COMPACT (gorizontal scroll qatorlari uchun) */
.card-compact {
    flex: none;
    width: 220px;
    scroll-snap-align: start;
}
.card-compact .card-img-wrap { height: 130px; }
.card-compact .card-body { padding: 12px; }
.card-compact .card-title { font-size: 14px; margin-bottom: 4px; }
.card-compact .card-desc { display: none; }
.card-compact .card-info { margin-bottom: 8px; gap: 4px; }
.card-compact .card-cta { padding-top: 8px; font-size: 12px; }

@media (max-width: 480px) {
    .card-compact { width: 168px; }
    .card-compact .card-img-wrap { height: 110px; }
}
</style>
