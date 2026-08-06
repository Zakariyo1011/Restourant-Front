<template>
    <nav class="navbar">
        <div class="nav-brand">
            <div class="brand-icon">
                <i class="fas fa-utensils"></i>
            </div>
            <span class="brand-name">Restoran<span class="brand-accent">UZ</span></span>
        </div>
        <div class="nav-discovery">
            <div class="search-box nav-search-box">
                <i class="fas fa-search search-icon"></i>
                <input
                    :value="searchQuery"
                    :placeholder="$t('home.searchPlaceholder')"
                    class="search-input"
                    type="text"
                    autocomplete="off"
                    autocorrect="off"
                    spellcheck="false"
                    name="restaurant-search"
                    @input="$emit('update:searchQuery', $event.target.value)"
                />
            </div>
            <button class="address-trigger nav-address-trigger" @click="$emit('openAddressModal')">
                <i class="fas fa-location-arrow"></i>
                <span>{{ selectedAddressLabel || $t('form.address') }}</span>
            </button>
        </div>
        <div class="nav-right">
            <LanguageSwitcher class="nav-lang" />
            <router-link v-if="auth?.isAdmin" to="/admin" class="btn-login">
                <i class="fas fa-shield-alt"></i>
                <span>{{ $t('nav.admin') }}</span>
            </router-link>
            <router-link v-else-if="auth?.isOwner" to="/dashboard" class="btn-login">
                <i class="fas fa-th-large"></i>
                <span>{{ $t('nav.dashboard') }}</span>
            </router-link>
        </div>
    </nav>
</template>

<script setup>
import LanguageSwitcher from '../LanguageSwitcher.vue'

defineProps({
    auth: {
        type: Object,
        required: true,
    },
    searchQuery: {
        type: String,
        default: '',
    },
    selectedAddressLabel: {
        type: String,
        default: '',
    },
})

defineEmits(['update:searchQuery', 'openAddressModal'])
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    min-height: 72px;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border-light);
    position: sticky;
    top: 0;
    z-index: 100;
}
.nav-brand { display: flex; align-items: center; gap: 10px; }
.nav-discovery {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    margin: 0 28px;
    max-width: 920px;
}
.brand-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 16px;
}
.brand-name { font-size: 18px; font-weight: 700; color: var(--color-text); }
.brand-accent { color: var(--color-primary); }
.nav-right { display: flex; align-items: center; gap: 10px; }
.btn-login {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 18px;
    background: var(--color-primary);
    color: white;
    border-radius: 10px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s;
}
.btn-login:hover { background: var(--color-primary-dark); }
.search-box {
    display: flex; align-items: center;
    background: var(--color-border-light);
    border-radius: 16px;
    padding: 0 14px;
    gap: 8px;
}
.search-icon { font-size: 16px; color: var(--color-text-faint); }
.nav-search-box {
    flex: 1;
    max-width: 620px;
    min-height: 48px;
    box-shadow: none;
    border-radius: 16px;
    background: var(--color-border-light);
    border: 1px solid transparent;
    transition: border-color 0.2s ease, background 0.2s ease;
}
.nav-search-box:focus-within {
    background: var(--color-surface);
    border-color: var(--color-primary-tint-strong);
}
.search-input {
    flex: 1; border: none; outline: none;
    font-size: 15px; padding: 12px 0;
    color: var(--color-text); background: transparent;
}
.search-input::placeholder { color: var(--color-text-faint); }
.address-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 190px;
    padding: 0 18px;
    border: 1px solid var(--color-primary-dark);
    border-radius: 16px;
    background: var(--color-primary);
    color: white;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 18px rgba(78,63,203,0.2);
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}
.nav-address-trigger {
    min-height: 48px;
    border-radius: 16px;
}
.address-trigger:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(78,63,203,0.26);
    background: var(--color-primary-dark);
}
.address-trigger span {
    max-width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

@media (min-width: 769px) {
    .nav-brand,
    .nav-lang { display: none; }
}

@media (max-width: 768px) {
    .navbar {
        height: auto;
        padding: 10px 14px 12px;
        flex-wrap: wrap;
        gap: 8px;
    }
    .nav-brand { order: 1; }
    .nav-right  { order: 2; margin-left: auto; }
    .nav-discovery {
        order: 3;
        width: 100%;
        margin: 4px 0 0;
        flex-direction: column;
        gap: 8px;
    }
    .nav-discovery { align-items: center; }
    .nav-search-box {
        box-sizing: border-box;
        flex: none;
        width: calc(100% - 24px);
        max-width: none;
        margin: 0 auto;
        min-height: 48px;
        padding: 0 18px;
        border-radius: 24px;
        background: var(--color-border-light);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    .nav-search-box .search-icon { font-size: 16px; color: var(--color-text); }
    .nav-search-box .search-input {
        text-align: center;
        font-size: 15px;
        font-weight: 600;
        padding: 11px 0;
        color: var(--color-text);
    }
    .nav-search-box .search-input::placeholder { color: var(--color-text); font-weight: 600; }

    /* Yandex uslubidagi qidiruv: manzil tugmasi mobil kirish qismida ko'rinmaydi */
    .nav-address-trigger { display: none; }
}

@media (max-width: 480px) {
    .brand-name { font-size: 16px; }
    .btn-login span { display: none; }
    .btn-login { padding: 8px 12px; }
}
</style>
