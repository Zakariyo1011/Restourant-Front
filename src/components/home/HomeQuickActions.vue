<template>
    <section class="quick-actions">
        <div class="quick-actions-scroll">
            <button class="quick-chip quick-chip-icon" @click="$emit('openFilters')">
                <i class="fas fa-sliders-h"></i>
                <span>{{ $t('home.quickFilters') }}</span>
            </button>

            <button
                class="quick-chip"
                :class="{ active: locationActive }"
                @click="$emit('toggleNearby')"
            >
                <i :class="locationLoading ? 'fas fa-spinner fa-spin' : 'fas fa-location-arrow'"></i>
                <span>{{ $t('home.quickNearby') }}</span>
            </button>

            <button
                class="quick-chip"
                :class="{ active: topRatedActive }"
                @click="$emit('toggleTopRated')"
            >
                <i class="fas fa-star"></i>
                <span>{{ $t('home.quickTopRated') }}</span>
            </button>

            <span class="quick-divider"></span>

            <button
                v-for="category in cuisineOptions"
                :key="category.key"
                class="quick-chip"
                :class="{ active: selectedCuisine === category.key }"
                @click="$emit('selectCuisine', category.key)"
            >
                {{ category.label }}
            </button>
        </div>
    </section>
</template>

<script setup>
defineProps({
    cuisineOptions: { type: Array, default: () => [] },
    selectedCuisine: { type: String, default: '' },
    locationActive: { type: Boolean, default: false },
    locationLoading: { type: Boolean, default: false },
    topRatedActive: { type: Boolean, default: false },
})

defineEmits(['openFilters', 'toggleNearby', 'toggleTopRated', 'selectCuisine'])
</script>

<style scoped>
.quick-actions { margin-bottom: 18px; }
.quick-actions-scroll {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    padding: 2px 2px 8px;
    scrollbar-width: none;
}
.quick-actions-scroll::-webkit-scrollbar { display: none; }

.quick-chip {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
    border: 1px solid var(--color-primary-tint);
    background: var(--color-surface);
    color: var(--color-text-muted);
    border-radius: 999px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: var(--shadow-sm);
}
.quick-chip i { font-size: 13px; color: var(--color-text-muted); }
.quick-chip.active,
.quick-chip:hover {
    background: var(--color-primary-tint);
    border-color: var(--color-primary-tint-strong);
    color: var(--color-primary-dark);
}
.quick-chip.active i,
.quick-chip:hover i { color: var(--color-primary-dark); }

.quick-chip-icon { background: var(--color-text); color: white; border-color: var(--color-text); }
.quick-chip-icon i { color: white; }
.quick-chip-icon:hover { background: var(--color-text); color: white; }
.quick-chip-icon:hover i { color: white; }

.quick-divider {
    flex: none;
    width: 1px;
    align-self: stretch;
    background: var(--color-primary-tint);
    margin: 4px 2px;
}

@media (max-width: 480px) {
    .quick-chip { padding: 9px 13px; font-size: 13px; }
}
</style>
