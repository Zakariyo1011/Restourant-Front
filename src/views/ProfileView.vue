<template>
    <div class="page">
        <div class="profile-card">
            <div class="avatar">{{ initial }}</div>
            <h2>{{ auth.user?.name || $t('profile.guest') }}</h2>
            <p class="email">{{ auth.user?.email }}</p>
        </div>

        <div class="menu-card">
            <router-link to="/favorites" class="menu-row">
                <i class="fas fa-heart"></i>
                <span>{{ $t('profile.menuFavorites') }}</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </router-link>
            <router-link to="/settings" class="menu-row">
                <i class="fas fa-gear"></i>
                <span>{{ $t('profile.menuSettings') }}</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </router-link>
            <router-link to="/help" class="menu-row">
                <i class="fas fa-circle-question"></i>
                <span>{{ $t('profile.menuHelp') }}</span>
                <i class="fas fa-chevron-right menu-arrow"></i>
            </router-link>
        </div>

        <button type="button" class="logout-btn" @click="logout">
            <i class="fas fa-right-from-bracket"></i>
            {{ $t('profile.logout') }}
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'
import api from '../axios'

const auth = useAuthStore()
const favorites = useFavoritesStore()
const router = useRouter()

const initial = computed(() => (auth.user?.name || '?').trim().charAt(0).toUpperCase())

async function logout() {
    try { await api.post('/logout') } catch { /* ignore */ }
    auth.logout()
    favorites.reset()
    router.push('/login')
}
</script>

<style scoped>
.page {
    max-width: 480px;
    margin: 0 auto;
    padding: var(--space-6) var(--space-5) var(--space-8);
}

.profile-card {
    text-align: center;
    padding: var(--space-6);
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    margin-bottom: var(--space-5);
}

.avatar {
    width: 76px; height: 76px;
    border-radius: 50%;
    background: var(--color-primary);
    color: #fff;
    font-size: 30px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto var(--space-4);
}

.profile-card h2 { font-size: 19px; font-weight: 700; color: var(--color-text); margin: 0 0 4px; }
.email { font-size: 13px; color: var(--color-text-muted); margin: 0; }

.menu-card {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    overflow: hidden;
    margin-bottom: var(--space-5);
}

.menu-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 15px var(--space-4);
    text-decoration: none;
    color: var(--color-text);
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid var(--color-border-light);
}
.menu-row:last-child { border-bottom: none; }
.menu-row i:first-child { color: var(--color-primary); width: 20px; text-align: center; }
.menu-arrow { margin-left: auto; color: var(--color-text-faint); font-size: 12px; }

.logout-btn {
    width: 100%;
    padding: 14px;
    border-radius: var(--radius-md);
    border: none;
    background: var(--color-danger-tint);
    color: var(--color-danger-dark);
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
}
.logout-btn:hover { background: var(--color-danger-tint-strong); }
</style>
