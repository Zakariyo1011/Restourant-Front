<template>
    <section class="cuisine-row">
        <div class="cuisine-row-head">
            <div>
                <h2 class="cuisine-row-title">{{ title }}</h2>
                <p class="cuisine-row-sub">{{ $t('home.found', { count: restaurants.length }) }}</p>
            </div>
            <button class="cuisine-row-seeall" @click="$emit('seeAll')">
                {{ $t('home.seeAll') }}
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>

        <div class="cuisine-row-scroll">
            <HomeRestaurantCard
                v-for="r in restaurants"
                :key="r.id"
                :restaurant="r"
                variant="compact"
                :resolve-image-url="resolveImageUrl"
                :get-restaurant-image-url="getRestaurantImageUrl"
                :get-cuisine-label="getCuisineLabel"
                @select="$emit('select', $event)"
            />
        </div>
    </section>
</template>

<script setup>
import HomeRestaurantCard from './HomeRestaurantCard.vue'

defineProps({
    title: { type: String, required: true },
    restaurants: { type: Array, default: () => [] },
    resolveImageUrl: { type: Function, required: true },
    getRestaurantImageUrl: { type: Function, required: true },
    getCuisineLabel: { type: Function, required: true },
})

defineEmits(['seeAll', 'select'])
</script>

<style scoped>
.cuisine-row { margin-bottom: 22px; }
.cuisine-row-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 12px;
}
.cuisine-row-title { font-size: 17px; font-weight: 700; color: var(--color-text); margin-bottom: 2px; }
.cuisine-row-sub { font-size: 12px; color: var(--color-text-faint); }
.cuisine-row-seeall {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    background: none;
    color: var(--color-primary-dark);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
}
.cuisine-row-seeall i { font-size: 11px; }

.cuisine-row-scroll {
    display: flex;
    gap: 14px;
    overflow-x: auto;
    padding: 2px 2px 6px;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
}
.cuisine-row-scroll::-webkit-scrollbar { display: none; }

@media (max-width: 480px) {
    .cuisine-row-scroll { gap: 10px; }
}
</style>
