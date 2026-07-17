<template>
    <transition name="modal-fade">
        <div v-if="show" class="address-modal-overlay" @click.self="$emit('close')">
            <div class="address-modal">
                <div class="address-modal-head">
                    <div>
                        <h3>{{ $t('form.address') }}</h3>
                        <p>{{ modalHelperText }}</p>
                    </div>
                    <button class="modal-close-btn" @click="$emit('close')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="address-modal-search-row">
                    <div class="address-modal-input-wrap">
                        <i class="fas fa-search"></i>
                        <input
                            :value="addressQuery"
                            type="text"
                            class="address-modal-input"
                            :placeholder="$t('form.addressPlaceholder')"
                            @input="$emit('update:addressQuery', $event.target.value)"
                            @keyup.enter="$emit('applyAddress')"
                        />
                    </div>
                    <button
                        class="address-confirm-btn"
                        :disabled="locationLoading || (!addressDraft && !addressQuery.trim())"
                        @click="$emit('applyAddress')"
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
                        @click="$emit('selectSuggestion', option)"
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
                    <span class="toolbar-note">{{ selectedMapHint }}</span>
                </div>

                <div class="address-map-shell">
                    <div id="home-address-map" class="address-map"></div>
                    <button class="map-gps-btn" @click="$emit('useGps')" :disabled="locationLoading">
                        <i :class="locationLoading ? 'fas fa-spinner fa-spin' : 'fas fa-crosshairs'"></i>
                        <span>{{ $t('home.gpsBtn') }}</span>
                    </button>
                </div>

                <div v-if="addressDraft" class="address-modal-footer">
                    <div class="address-preview">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>{{ addressDraft.label }}</strong>
                            <span>{{ addressDraft.lat.toFixed(5) }}, {{ addressDraft.lng.toFixed(5) }}</span>
                        </div>
                    </div>
                    <button class="address-apply-btn" @click="$emit('applyAddress')">
                        {{ $t('form.save') }}
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
defineProps({
    show:                 { type: Boolean, default: false },
    addressQuery:         { type: String,  default: '' },
    addressDraft:         { type: Object,  default: null },
    addressSuggestions:   { type: Array,   default: () => [] },
    addressSearchLoading: { type: Boolean, default: false },
    locationLoading:      { type: Boolean, default: false },
    modalHelperText:      { type: String,  default: '' },
    selectedMapHint:      { type: String,  default: '' },
})

defineEmits(['close', 'update:addressQuery', 'applyAddress', 'selectSuggestion', 'useGps'])
</script>

<style scoped>
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
.address-modal-head h3 { font-size: 20px; font-weight: 800; margin-bottom: 6px; }
.address-modal-head p  { color: #6c7f79; font-size: 13px; }
.modal-close-btn {
    width: 40px; height: 40px;
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
.address-modal-input-wrap i { color: #7da098; }
.address-modal-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: #17322a;
    font-size: 14px;
}
.address-modal-input::placeholder { color: #8aa59e; }
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
.address-confirm-btn:disabled { opacity: 0.55; cursor: not-allowed; }

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
.address-search-status.empty { background: #fff7eb; color: #9a6100; }

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
.address-suggestion:hover { border-color: #1D9E75; background: #eef8f4; }
.address-suggestion span { color: #68867d; font-size: 12px; }

.address-map-shell {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    border: 1px solid #d7ebe4;
}
.address-map { width: 100%; height: 340px; background: #eef5f2; }
.map-gps-btn {
    position: absolute;
    left: 12px;
    top: 12px;
    z-index: 450;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(18, 94, 73, 0.2);
    border-radius: 999px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.95);
    color: #0f6e56;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(15, 110, 86, 0.18);
}
.map-gps-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.address-modal-toolbar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    margin-bottom: 14px;
}
.toolbar-note { color: #5c7a72; font-size: 13px; }

.address-modal-footer {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}
.address-preview { display: flex; align-items: center; gap: 12px; }
.address-preview i   { color: #1D9E75; font-size: 18px; }
.address-preview strong { display: block; font-size: 14px; }
.address-preview span   { color: #6f8a83; font-size: 12px; }
.address-apply-btn {
    min-width: 150px;
    min-height: 48px;
    background: #0F6E56;
    color: white;
}

.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }

@media (max-width: 768px) {
    .address-modal {
        padding: 18px 16px;
        border-radius: 22px;
        max-height: 90vh;
        overflow-y: auto;
    }
    .address-modal-search-row { grid-template-columns: 1fr; gap: 8px; }
    .address-confirm-btn { min-height: 50px; border-radius: 14px; font-size: 15px; }
    .address-modal-toolbar { justify-content: flex-start; }
    .address-modal-footer { flex-direction: column; align-items: stretch; gap: 10px; }
    .address-apply-btn { min-height: 50px; width: 100%; }
    .address-map { height: 260px; }
    .address-modal-head h3 { font-size: 18px; }
}

@media (max-width: 480px) {
    .address-modal-overlay { padding: 8px; align-items: flex-end; }
    .address-modal { border-radius: 22px 22px 0 0; width: 100%; max-height: 95vh; }
    .address-map { height: 220px; }
    .map-gps-btn {
        left: 10px;
        top: 10px;
        padding: 7px 10px;
        font-size: 12px;
    }
}
</style>
