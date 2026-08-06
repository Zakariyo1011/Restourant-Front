<template>
    <transition name="sheet-fade">
        <div v-if="show" class="filters-overlay" @click.self="$emit('close')">
            <div class="filters-sheet">
                <div class="filters-head">
                    <h3>{{ $t('home.filters') }}</h3>
                    <button class="filters-close" @click="$emit('close')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="filters-body">
                    <div class="filters-group">
                        <h4>{{ $t('home.filterCuisine') }}</h4>
                        <div class="filters-chip-list">
                            <button
                                class="filters-chip"
                                :class="{ active: !selectedCuisine }"
                                @click="$emit('selectCuisine', '')"
                            >
                                {{ $t('home.all') }}
                            </button>
                            <button
                                v-for="option in cuisineOptions"
                                :key="option.key"
                                class="filters-chip"
                                :class="{ active: selectedCuisine === option.key }"
                                @click="$emit('selectCuisine', option.key)"
                            >
                                {{ option.label }}
                            </button>
                        </div>
                    </div>

                    <div class="filters-group" v-if="foodTypes.length">
                        <h4>{{ $t('home.filterFoodType') }}</h4>
                        <div class="filters-chip-list">
                            <button
                                class="filters-chip"
                                :class="{ active: !selectedFoodType }"
                                @click="$emit('selectFoodType', '')"
                            >
                                {{ $t('home.all') }}
                            </button>
                            <button
                                v-for="foodType in foodTypes"
                                :key="foodType.slug"
                                class="filters-chip"
                                :class="{ active: selectedFoodType === foodType.slug }"
                                @click="$emit('selectFoodType', foodType.slug)"
                            >
                                {{ foodType.label }}
                            </button>
                        </div>
                    </div>

                    <div class="filters-group">
                        <h4>{{ $t('home.filterPrice') }}</h4>
                        <div class="filters-chip-list">
                            <button
                                class="filters-chip"
                                :class="{ active: !selectedPriceRange }"
                                @click="$emit('selectPriceRange', '')"
                            >
                                {{ $t('home.all') }}
                            </button>
                            <button
                                v-for="price in priceRanges"
                                :key="price"
                                class="filters-chip"
                                :class="{ active: selectedPriceRange === price }"
                                @click="$emit('selectPriceRange', price)"
                            >
                                {{ price }}
                            </button>
                        </div>
                    </div>

                    <div class="filters-group">
                        <h4>{{ $t('home.filterRating') }}</h4>
                        <div class="filters-chip-list">
                            <button
                                class="filters-chip"
                                :class="{ active: !selectedRating }"
                                @click="$emit('selectRating', '')"
                            >
                                {{ $t('home.all') }}
                            </button>
                            <button
                                v-for="rating in ratingOptions"
                                :key="rating"
                                class="filters-chip"
                                :class="{ active: selectedRating === rating }"
                                @click="$emit('selectRating', rating)"
                            >
                                <i class="fas fa-star"></i> {{ rating }}+
                            </button>
                        </div>
                    </div>

                    <div class="filters-group" v-if="sortOptions.length">
                        <h4>{{ $t('home.sortBy') }}</h4>
                        <select
                            class="filters-sort-select"
                            :value="selectedSort"
                            @change="$emit('selectSort', $event.target.value)"
                        >
                            <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
                                {{ opt.label }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="filters-footer">
                    <button class="filters-show-btn" @click="$emit('apply')">
                        {{ $t('home.showResults', { count: resultCount }) }}
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
defineProps({
    show: { type: Boolean, default: false },
    cuisineOptions: { type: Array, default: () => [] },
    selectedCuisine: { type: String, default: '' },
    foodTypes: { type: Array, default: () => [] },
    selectedFoodType: { type: String, default: '' },
    priceRanges: { type: Array, default: () => [] },
    selectedPriceRange: { type: String, default: '' },
    ratingOptions: { type: Array, default: () => ['4.5', '4', '3.5'] },
    selectedRating: { type: String, default: '' },
    sortOptions: { type: Array, default: () => [] },
    selectedSort: { type: String, default: '' },
    resultCount: { type: Number, default: 0 },
})

defineEmits(['close', 'selectCuisine', 'selectFoodType', 'selectPriceRange', 'selectRating', 'selectSort', 'apply'])
</script>

<style scoped>
.filters-overlay {
    position: fixed;
    inset: 0;
    background: rgba(11, 37, 30, 0.4);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 500;
}
.filters-sheet {
    width: min(560px, 100%);
    max-height: 88vh;
    background: var(--color-surface);
    border-radius: 24px 24px 0 0;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-lg);
}
.filters-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px 8px;
}
.filters-head h3 { font-size: 18px; font-weight: 800; color: var(--color-text); }
.filters-close {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1px solid var(--color-primary-tint);
    background: var(--color-primary-tint);
    color: var(--color-text-muted);
    cursor: pointer;
}
.filters-body {
    overflow-y: auto;
    padding: 8px 20px 12px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.filters-group h4 { font-size: 14px; font-weight: 700; color: var(--color-text-muted); margin-bottom: 10px; }
.filters-chip-list { display: flex; flex-wrap: wrap; gap: 8px; }
.filters-chip {
    border: 1px solid var(--color-primary-tint);
    background: var(--color-primary-tint);
    color: var(--color-text-muted);
    border-radius: 999px;
    padding: 9px 14px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
}
.filters-chip.active,
.filters-chip:hover {
    background: var(--color-primary-tint);
    border-color: var(--color-primary-tint-strong);
    color: var(--color-primary-dark);
}
.filters-footer {
    padding: 12px 20px 20px;
    border-top: 1px solid var(--color-primary-tint);
}
.filters-show-btn {
    width: 100%;
    min-height: 52px;
    border: none;
    border-radius: 16px;
    background: var(--color-primary);
    color: white;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
}
.filters-show-btn:hover { background: var(--color-primary-dark); }

.filters-sort-select {
    width: 100%;
    padding: 12px 14px;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 14px;
    font-family: inherit;
    cursor: pointer;
}

.sheet-fade-enter-active,
.sheet-fade-leave-active { transition: opacity 0.2s ease; }
.sheet-fade-enter-active .filters-sheet,
.sheet-fade-leave-active .filters-sheet { transition: transform 0.25s ease; }
.sheet-fade-enter-from,
.sheet-fade-leave-to { opacity: 0; }
.sheet-fade-enter-from .filters-sheet,
.sheet-fade-leave-to .filters-sheet { transform: translateY(24px); }
</style>
