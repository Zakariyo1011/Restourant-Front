<template>
    <div class="page">
        <h1 class="page-title">{{ $t('settings.title') }}</h1>

        <div class="section">
            <h4 class="section-title">{{ $t('settings.appearance') }}</h4>
            <div class="lang-list">
                <button
                    v-for="opt in THEME_OPTIONS"
                    :key="opt.code"
                    type="button"
                    class="lang-row"
                    :class="{ 'lang-row--active': theme.mode === opt.code }"
                    @click="theme.setMode(opt.code)"
                >
                    <span class="theme-icon"><i :class="['fas', opt.icon]"></i></span>
                    <span>{{ $t(opt.labelKey) }}</span>
                    <i v-if="theme.mode === opt.code" class="fas fa-check lang-check"></i>
                </button>
            </div>
        </div>

        <div class="section">
            <h4 class="section-title">{{ $t('settings.language') }}</h4>
            <div class="lang-list">
                <button
                    v-for="loc in LOCALE_OPTIONS"
                    :key="loc.code"
                    type="button"
                    class="lang-row"
                    :class="{ 'lang-row--active': locale === loc.code }"
                    @click="pick(loc.code)"
                >
                    <span class="lang-flag">{{ loc.flag }}</span>
                    <span>{{ loc.name }}</span>
                    <i v-if="locale === loc.code" class="fas fa-check lang-check"></i>
                </button>
            </div>
        </div>

        <div class="section">
            <h4 class="section-title">{{ $t('settings.account') }}</h4>
            <div class="account-row">
                <span>{{ auth.user?.email }}</span>
            </div>
            <button type="button" class="logout-btn" @click="logout">
                <i class="fas fa-right-from-bracket"></i>
                {{ $t('settings.logout') }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { LOCALE_OPTIONS, setLocale } from '../i18n'
import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'
import { useThemeStore } from '../stores/theme'
import api from '../axios'

const THEME_OPTIONS = [
    { code: 'light', icon: 'fa-sun', labelKey: 'settings.themeLight' },
    { code: 'dark', icon: 'fa-moon', labelKey: 'settings.themeDark' },
    { code: 'system', icon: 'fa-circle-half-stroke', labelKey: 'settings.themeSystem' },
]

const { locale } = useI18n()
const auth = useAuthStore()
const favorites = useFavoritesStore()
const theme = useThemeStore()
const router = useRouter()

function pick(code) {
    setLocale(code)
    api.post('/me/locale', { locale: code }).catch(() => {})
    window.location.reload()
}

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

.page-title { font-size: 22px; font-weight: 800; color: var(--color-text); margin: 0 0 var(--space-5); }

.section { margin-bottom: var(--space-6); }
.section-title { font-size: 13px; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 var(--space-3); }

.lang-list {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    overflow: hidden;
}

.lang-row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 13px var(--space-4);
    border: none;
    border-bottom: 1px solid var(--color-border-light);
    background: transparent;
    font-family: inherit;
    font-size: 14px;
    color: var(--color-text);
    cursor: pointer;
    text-align: left;
}
.lang-row:last-child { border-bottom: none; }
.lang-row--active { background: var(--color-primary-tint); color: var(--color-primary-dark); font-weight: 700; }
.lang-flag { font-size: 17px; }
.lang-check { margin-left: auto; color: var(--color-primary); }
.theme-icon {
    width: 20px;
    font-size: 15px;
    color: var(--color-text-muted);
    text-align: center;
}
.lang-row--active .theme-icon { color: var(--color-primary); }

.account-row {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    padding: 14px var(--space-4);
    font-size: 14px;
    color: var(--color-text-muted);
    margin-bottom: var(--space-3);
}

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
