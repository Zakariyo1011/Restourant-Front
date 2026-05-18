<template>
    <div class="lang-switcher" ref="root">
        <button
            type="button"
            class="lang-trigger"
            :aria-expanded="open"
            @click="open = !open"
        >
            <span class="lang-flag">{{ current.flag }}</span>
            <span class="lang-code">{{ current.code.toUpperCase() }}</span>
            <i class="fas fa-chevron-down" :class="{ rotated: open }"></i>
        </button>

        <Transition name="lang-drop">
            <div v-if="open" class="lang-menu">
                <button
                    v-for="loc in LOCALE_OPTIONS"
                    :key="loc.code"
                    type="button"
                    class="lang-option"
                    :class="{ active: locale === loc.code }"
                    @click="pick(loc.code)"
                >
                    <span class="lang-flag">{{ loc.flag }}</span>
                    <span class="lang-name">{{ loc.name }}</span>
                    <i v-if="locale === loc.code" class="fas fa-check lang-check"></i>
                </button>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCALE_OPTIONS, setLocale } from '../i18n'

const { locale } = useI18n()
const open = ref(false)
const root = ref(null)

const current = computed(() =>
    LOCALE_OPTIONS.find((l) => l.code === locale.value) || LOCALE_OPTIONS[2]
)

function pick(code) {
    setLocale(code)
    open.value = false
    window.location.reload()
}

function onClickOutside(e) {
    if (root.value && !root.value.contains(e.target)) open.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.lang-switcher {
    position: relative;
    z-index: 50;
}

.lang-trigger {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: white;
    border: 1.5px solid #e8e8e8;
    border-radius: 10px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: #333;
    transition: all 0.2s;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.lang-trigger:hover {
    border-color: #1d9e75;
    color: #0f6e56;
}

.lang-flag {
    font-size: 16px;
    line-height: 1;
}

.lang-code {
    letter-spacing: 0.04em;
}

.lang-trigger .fa-chevron-down {
    font-size: 10px;
    color: #999;
    transition: transform 0.2s;
}

.lang-trigger .fa-chevron-down.rotated {
    transform: rotate(180deg);
}

.lang-menu {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    min-width: 180px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border: 1px solid #eee;
    padding: 6px;
    overflow: hidden;
}

.lang-option {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    text-align: left;
    transition: background 0.15s;
}

.lang-option:hover {
    background: #f4f5f7;
}

.lang-option.active {
    background: #e1f5ee;
    color: #0f6e56;
    font-weight: 600;
}

.lang-name {
    flex: 1;
}

.lang-check {
    color: #1d9e75;
    font-size: 12px;
}

.lang-drop-enter-active,
.lang-drop-leave-active {
    transition: opacity 0.15s, transform 0.15s;
}

.lang-drop-enter-from,
.lang-drop-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

@media (max-width: 768px) {
    .lang-code {
        display: none;
    }
    .lang-trigger {
        padding: 8px 10px;
    }
}
</style>
