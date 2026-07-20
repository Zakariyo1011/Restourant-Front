<template>
    <section class="order-toolbar">
        <h2 class="toolbar-title">What to order</h2>
        <div class="toolbar-actions">
            <div class="toolbar-chips">
                <button
                    v-for="category in quickCategories"
                    :key="category.key"
                    class="toolbar-chip"
                    :class="{ active: selectedCuisine === category.key }"
                    @click="$emit('selectCategory', category.key)"
                >
                    {{ category.label }}
                </button>

                <div class="dropdown-wrap" ref="moreMenuRef">
                    <button class="toolbar-chip more-chip" :class="{ active: showMoreMenu }" @click="$emit('toggleMoreMenu')">
                        {{ selectedFoodTypeLabel ? `More · ${selectedFoodTypeLabel}` : 'More' }} <i class="fas fa-chevron-down"></i>
                    </button>
                    <transition name="menu-fade">
                        <div v-if="showMoreMenu" class="dropdown-panel">
                            <div class="food-search-block" @click.stop>
                                <div class="food-search-input-wrap">
                                    <i class="fas fa-search"></i>
                                    <input
                                        v-model="foodTypeQuery"
                                        type="text"
                                        class="food-search-input"
                                        placeholder="Ovqat turini qidiring"
                                    />
                                </div>

                                <div class="food-type-list">
                                    <button
                                        class="food-type-option"
                                        :class="{ active: !selectedFoodType }"
                                        @click="selectFoodTypeOption('', true)"
                                    >
                                        Barchasi
                                    </button>
                                    <button
                                        v-for="foodType in filteredFoodTypes"
                                        :key="foodType.slug"
                                        class="food-type-option"
                                        :class="{ active: selectedFoodType === foodType.slug }"
                                        @click="selectFoodTypeOption(foodType.slug, true)"
                                    >
                                        {{ foodType.label }}
                                    </button>
                                    <div v-if="foodTypeQuery && !filteredFoodTypes.length" class="food-type-empty">
                                        Mos ovqat turi topilmadi
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>

        </div>
    </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const foodTypeQuery = ref('')

const props = defineProps({
    quickCategories: { type: Array, default: () => [] },
    foodTypes:       { type: Array, default: () => [] },
    selectedCuisine: { type: String, default: '' },
    selectedFoodType: { type: String, default: '' },
    selectedFoodTypeLabel: { type: String, default: '' },
    showMoreMenu:    { type: Boolean, default: false },
})

const emit = defineEmits(['selectCategory', 'selectFoodType', 'toggleMoreMenu'])

const filteredFoodTypes = computed(() => {
    const query = foodTypeQuery.value.trim().toLowerCase()
    if (!query) return props.foodTypes

    return props.foodTypes.filter((foodType) => {
        const haystacks = [foodType.label, foodType.slug, ...(foodType.keywords || [])]
        return haystacks.some(value => String(value || '').toLowerCase().includes(query))
    })
})

const selectFoodTypeOption = (slug, closeMenu = false) => {
    emit('selectFoodType', slug, closeMenu)
    foodTypeQuery.value = ''
}
</script>

<style scoped>
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
.more-chip i { font-size: 11px; margin-left: 6px; }
.more-chip {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
}

.dropdown-wrap { position: relative; }
.dropdown-panel {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 280px;
    max-height: 320px;
    overflow: auto;
    padding: 8px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 20px 45px rgba(11, 41, 34, 0.18);
    border: 1px solid #e0ece7;
    z-index: 20;
}
.food-search-block {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 8px;
}
.food-search-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #dce8e3;
    border-radius: 12px;
    background: #f9fcfb;
    padding: 0 12px;
}
.food-search-input-wrap i {
    color: #7a928b;
    font-size: 13px;
}
.food-search-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: #27473e;
    min-height: 40px;
    font-size: 14px;
}
.food-type-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.food-type-option {
    border: 1px solid #dce8e3;
    background: #f9fcfb;
    color: #35544c;
    border-radius: 999px;
    padding: 8px 12px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
}
.food-type-option.active,
.food-type-option:hover {
    background: #e8f6f1;
    border-color: #83cdb6;
    color: #0f6e56;
}
.food-type-empty {
    width: 100%;
    color: #6f847d;
    font-size: 13px;
    padding: 4px 2px;
}

.menu-fade-enter-active,
.menu-fade-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.menu-fade-enter-from,
.menu-fade-leave-to { opacity: 0; transform: translateY(-4px); }

@media (max-width: 768px) {
    .order-toolbar { padding: 14px; border-radius: 14px; }
    .toolbar-title { font-size: 26px; margin-bottom: 12px; }
    .toolbar-actions { flex-direction: column; align-items: stretch; gap: 10px; }
    .toolbar-chips { flex-wrap: wrap; width: 100%; }
    .toolbar-chips .more-chip { width: 100%; }
    .dropdown-panel {
        left: 0;
        right: 0;
        width: 100%;
        max-width: none;
        max-height: 280px;
    }
}

@media (max-width: 480px) {
    .toolbar-title { font-size: 22px; }
    .toolbar-chip { padding: 8px 12px; font-size: 13px; }
}
</style>
