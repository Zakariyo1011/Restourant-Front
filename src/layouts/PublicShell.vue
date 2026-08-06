<template>
    <div class="public-shell" :class="{ 'public-shell--mobile': isMobile }">
        <aside v-if="!isMobile" class="public-sidebar">
            <SidebarNav :links="navLinks" :show-home-link="false">
                <template #extra>
                    <a class="telegram-card" :href="TELEGRAM_BOT_URL" target="_blank" rel="noopener">
                        <span class="telegram-icon"><i class="fab fa-telegram-plane"></i></span>
                        <span class="telegram-text">
                            <strong>{{ $t('onboarding.telegramTitle') }}</strong>
                            <span>{{ $t('onboarding.telegramSub') }}</span>
                        </span>
                    </a>
                </template>
            </SidebarNav>
            <UserFooter :user="auth.user" :badge="$t('publicNav.diner')" @logout="logout" />
        </aside>

        <main class="public-content">
            <slot />
        </main>

        <nav v-if="isMobile" class="bottom-tabbar">
            <router-link to="/" class="tab" exact-active-class="tab--active">
                <span class="tab-icon"><i class="fas fa-compass"></i></span>
                <span>{{ $t('publicNav.discover') }}</span>
            </router-link>
            <router-link to="/search" class="tab" active-class="tab--active">
                <span class="tab-icon"><i class="fas fa-magnifying-glass"></i></span>
                <span>{{ $t('publicNav.search') }}</span>
            </router-link>
            <router-link to="/favorites" class="tab" active-class="tab--active">
                <span class="tab-icon"><i class="fas fa-heart"></i></span>
                <span>{{ $t('publicNav.favorites') }}</span>
            </router-link>
            <router-link to="/profile" class="tab" active-class="tab--active">
                <span class="tab-icon"><i class="fas fa-user"></i></span>
                <span>{{ $t('publicNav.profile') }}</span>
            </router-link>
        </nav>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useIsMobile } from '../composables/useBreakpoint'
import { useAuthStore } from '../stores/auth'
import SidebarNav from '../components/layout/SidebarNav.vue'
import UserFooter from '../components/layout/UserFooter.vue'
import api from '../axios'

const TELEGRAM_BOT_URL = 'https://t.me/Restau4ant_bot'

const isMobile = useIsMobile()
const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

const navLinks = computed(() => [
    { to: '/', icon: 'fa-compass', label: t('publicNav.discover') },
    { to: '/search', icon: 'fa-magnifying-glass', label: t('publicNav.search') },
    { to: '/map', icon: 'fa-map-location-dot', label: t('publicNav.map') },
    { to: '/favorites', icon: 'fa-heart', label: t('publicNav.favorites') },
    { to: '/profile', icon: 'fa-user', label: t('publicNav.profile') },
    { to: '/settings', icon: 'fa-gear', label: t('publicNav.settings') },
    { to: '/help', icon: 'fa-circle-question', label: t('publicNav.help') },
])

async function logout() {
    try { await api.post('/logout') } catch { /* ignore */ }
    auth.logout()
    router.push('/login')
}
</script>

<style scoped>
.public-shell {
    min-height: 100vh;
    display: flex;
    background: var(--color-bg);
}

.public-sidebar {
    width: var(--sidebar-width);
    flex-shrink: 0;
    background: var(--color-surface);
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
}

.public-content {
    flex: 1;
    min-width: 0;
}

.telegram-card {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin: 0 var(--space-2) var(--space-3);
    padding: var(--space-3);
    background: var(--color-primary-tint);
    border-radius: var(--radius-md);
    text-decoration: none;
}

.telegram-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #2AABEE;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
}

.telegram-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.telegram-text strong {
    font-size: 12px;
    color: var(--color-text);
}

.telegram-text span:last-child {
    font-size: 10.5px;
    color: var(--color-text-muted);
}

.public-shell--mobile .public-content {
    padding-bottom: var(--bottomnav-height);
}

.bottom-tabbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: var(--bottomnav-height);
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    display: flex;
    z-index: 50;
    box-shadow: 0 -2px 12px rgba(20, 15, 50, 0.06);
}

.tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    text-decoration: none;
    color: var(--color-text-faint);
    font-size: 10.5px;
    font-weight: 600;
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    padding: var(--space-2) 0;
}

.tab-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 22px;
    border-radius: var(--radius-pill);
    font-size: 16px;
    transition: background 0.15s, color 0.15s;
}

.tab--active {
    color: var(--color-primary);
}

.tab--active .tab-icon {
    background: var(--color-primary-tint);
    color: var(--color-primary);
}
</style>
