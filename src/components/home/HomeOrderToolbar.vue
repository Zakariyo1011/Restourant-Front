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
                        More <i class="fas fa-chevron-down"></i>
                    </button>
                    <transition name="menu-fade">
                        <div v-if="showMoreMenu" class="dropdown-panel">
                            <button
                                v-for="category in moreCategories"
                                :key="category.key"
                                class="dropdown-option"
                                @click="$emit('selectCategory', category.key, true)"
                            >
                                {{ category.label }}
                            </button>
                        </div>
                    </transition>
                </div>
            </div>

            <div class="dropdown-wrap" ref="sortingMenuRef">
                <button class="sorting-chip" @click="$emit('toggleSortingMenu')">
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
                            @click="$emit('selectSorting', option.key)"
                        >
                            <span>{{ option.label }}</span>
                            <i
                                class="far"
                                :class="selectedSorting === option.key ? 'fa-check-circle selected' : 'fa-circle'"
                            ></i>
                        </button>
                        <button class="sorting-apply-btn" @click="$emit('applySorting')">Show</button>
                    </div>
                </transition>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    quickCategories: { type: Array, default: () => [] },
    moreCategories:  { type: Array, default: () => [] },
    sortingOptions:  { type: Array, default: () => [] },
    selectedCuisine: { type: String, default: '' },
    selectedSorting: { type: String, default: 'trust' },
    showMoreMenu:    { type: Boolean, default: false },
    showSortingMenu: { type: Boolean, default: false },
})

defineEmits(['selectCategory', 'toggleMoreMenu', 'toggleSortingMenu', 'selectSorting', 'applySorting'])
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

.dropdown-wrap { position: relative; }
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
.dropdown-option:hover { background: #eef8f4; }

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
.sorting-chip:hover { border-color: #83cdb6; }

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
.sorting-option:hover { background: #eef8f4; }
.sorting-option .selected { color: #1D9E75; }
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
.menu-fade-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.menu-fade-enter-from,
.menu-fade-leave-to { opacity: 0; transform: translateY(-4px); }

@media (max-width: 768px) {
    .order-toolbar { padding: 14px; border-radius: 14px; }
    .toolbar-title { font-size: 26px; margin-bottom: 12px; }
    .toolbar-actions { flex-direction: column; align-items: stretch; gap: 10px; }
    .toolbar-chips { flex-wrap: wrap; }
    .sorting-chip { width: 100%; justify-content: center; }
    .sorting-panel { right: 0; left: 0; width: 100%; }
    .dropdown-panel { width: 100%; max-width: 280px; }
}

@media (max-width: 480px) {
    .toolbar-title { font-size: 22px; }
    .toolbar-chip { padding: 8px 12px; font-size: 13px; }
}
</style>
