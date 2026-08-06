<template>
    <div class="admin-shell" :class="{ 'admin-shell--mobile': isMobile }">
        <aside v-if="!isMobile" class="admin-sidebar">
            <SidebarNav :role="role" />
            <UserFooter :user="auth.user" :badge="badge" @logout="logout" />
        </aside>

        <template v-else>
            <header class="admin-topbar">
                <button type="button" class="drawer-toggle" @click="drawerOpen = true" aria-label="menu">
                    <i class="fas fa-bars"></i>
                </button>
                <span class="admin-topbar-title">{{ badge }}</span>
                <button type="button" class="drawer-logout" @click="logout" :title="$t('nav.logout')">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </header>

            <Transition name="drawer-fade">
                <div v-if="drawerOpen" class="drawer-backdrop" @click="drawerOpen = false"></div>
            </Transition>
            <Transition name="drawer-slide">
                <aside v-if="drawerOpen" class="admin-sidebar admin-sidebar--drawer">
                    <SidebarNav :role="role" @click="drawerOpen = false" />
                    <UserFooter :user="auth.user" :badge="badge" @logout="logout" />
                </aside>
            </Transition>
        </template>

        <main class="admin-content">
            <slot />
        </main>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useIsMobile } from '../composables/useBreakpoint'
import SidebarNav from '../components/layout/SidebarNav.vue'
import UserFooter from '../components/layout/UserFooter.vue'
import api from '../axios'

const isMobile = useIsMobile()
const drawerOpen = ref(false)
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

const role = computed(() => (route.meta?.requiresAdmin ? 'admin' : 'owner'))
const badge = computed(() => (role.value === 'admin' ? t('admin.badge') : t('dashboard.ownerBadge')))

async function logout() {
    try { await api.post('/logout') } catch { /* ignore */ }
    auth.logout()
    router.push('/')
}
</script>

<style scoped>
.admin-shell {
    min-height: 100vh;
    display: flex;
    background: var(--color-bg);
}

.admin-sidebar {
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

.admin-content {
    flex: 1;
    min-width: 0;
}

.admin-shell--mobile {
    flex-direction: column;
}

.admin-shell--mobile .admin-content {
    padding-top: var(--topbar-height);
}

.admin-topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--topbar-height);
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-4);
    z-index: 40;
}

.admin-topbar-title {
    font-weight: 700;
    font-size: 15px;
    color: var(--color-text);
}

.drawer-toggle, .drawer-logout {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-sm);
    border: none;
    background: var(--color-primary-tint);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.drawer-logout {
    background: var(--color-danger-tint);
    color: var(--color-danger-dark);
}

.admin-sidebar--drawer {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 60;
    box-shadow: var(--shadow-lg);
}

.drawer-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(20, 15, 50, 0.4);
    z-index: 55;
}

.drawer-fade-enter-active, .drawer-fade-leave-active { transition: opacity 0.2s; }
.drawer-fade-enter-from, .drawer-fade-leave-to { opacity: 0; }

.drawer-slide-enter-active, .drawer-slide-leave-active { transition: transform 0.25s ease; }
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateX(-100%); }
</style>
