<template>
    <nav class="sidebar-nav">
        <router-link to="/" class="sidebar-brand">
            <span class="brand-icon"><i class="fas fa-utensils"></i></span>
            <span class="brand-name">Food<span class="brand-accent">Finder</span></span>
        </router-link>

        <ul class="sidebar-links">
            <li v-for="item in items" :key="item.to">
                <router-link :to="item.to" class="sidebar-link" active-class="sidebar-link--active">
                    <i :class="['fas', item.icon]"></i>
                    <span>{{ item.label }}</span>
                </router-link>
            </li>
        </ul>

        <div class="sidebar-spacer"></div>

        <slot name="extra" />

        <router-link v-if="showHomeLink" to="/" class="sidebar-link sidebar-link--home">
            <i class="fas fa-arrow-left"></i>
            <span>{{ $t('nav.home') }}</span>
        </router-link>
    </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    role: { type: String, default: null }, // 'owner' | 'admin' — used when `links` isn't passed
    links: { type: Array, default: null },
    showHomeLink: { type: Boolean, default: true },
})

const { t } = useI18n()

const items = computed(() => {
    if (props.links) return props.links
    if (props.role === 'admin') {
        return [{ to: '/admin', icon: 'fa-shield-halved', label: t('nav.admin') }]
    }
    return [{ to: '/dashboard', icon: 'fa-store', label: t('nav.dashboard') }]
})
</script>

<style scoped>
.sidebar-nav {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: var(--space-5) var(--space-4);
    gap: var(--space-6);
}

.sidebar-brand {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    text-decoration: none;
    padding: 0 var(--space-2);
}

.brand-icon {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    background: var(--color-primary);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
}

.brand-name {
    font-weight: 700;
    font-size: 17px;
    color: var(--color-text);
}

.brand-accent {
    color: var(--color-primary);
}

.sidebar-links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
}

.sidebar-link {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 11px var(--space-3);
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    transition: background 0.15s, color 0.15s;
}

.sidebar-link i {
    width: 18px;
    text-align: center;
    font-size: 15px;
}

.sidebar-link:hover {
    background: var(--color-primary-tint);
    color: var(--color-primary-dark);
}

.sidebar-link--active {
    background: var(--color-primary-tint);
    color: var(--color-primary);
}

.sidebar-spacer {
    flex: 1;
}

.sidebar-link--home {
    border-top: 1px solid var(--color-border);
    padding-top: var(--space-4);
}
</style>
