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
                    @input="$emit('update:searchQuery', $event.target.value)"
                />
            </div>
            <button class="address-trigger nav-address-trigger" @click="$emit('openAddressModal')">
                <i class="fas fa-location-arrow"></i>
                <span>{{ selectedAddressLabel || $t('form.address') }}</span>
            </button>
        </div>
        <div class="nav-right">
            <LanguageSwitcher />
            <router-link v-if="!auth?.isLoggedIn" to="/login" class="btn-login">
                <i class="fas fa-sign-in-alt"></i>
                <span>{{ $t('nav.login') }}</span>
            </router-link>
            <template v-else>
                <router-link v-if="auth?.isAdmin" to="/admin" class="btn-login">
                    <i class="fas fa-shield-alt"></i>
                    <span>{{ $t('nav.admin') }}</span>
                </router-link>
                <router-link v-else to="/dashboard" class="btn-login">
                    <i class="fas fa-th-large"></i>
                    <span>{{ $t('nav.dashboard') }}</span>
                </router-link>
            </template>
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
    background: white;
    border-bottom: 1px solid #e8edf1;
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
    background: linear-gradient(135deg, #1D9E75, #0F6E56);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 16px;
}
.brand-name { font-size: 18px; font-weight: 700; color: #1a1a1a; }
.brand-accent { color: #1D9E75; }
.nav-right { display: flex; align-items: center; gap: 10px; }
.btn-login {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 18px;
    background: #1D9E75;
    color: white;
    border-radius: 10px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s;
}
.btn-login:hover { background: #0F6E56; }
.search-box {
    display: flex; align-items: center;
    background: #f1f3f4;
    border-radius: 16px;
    padding: 0 14px;
    gap: 8px;
}
.search-icon { font-size: 16px; color: #aaa; }
.nav-search-box {
    flex: 1;
    max-width: 620px;
    min-height: 48px;
    box-shadow: none;
    border-radius: 16px;
    background: #f1f3f4;
    border: 1px solid transparent;
    transition: border-color 0.2s ease, background 0.2s ease;
}
.nav-search-box:focus-within {
    background: #ffffff;
    border-color: #c8d6df;
}
.search-input {
    flex: 1; border: none; outline: none;
    font-size: 15px; padding: 12px 0;
    color: #1a1a1a; background: transparent;
}
.search-input::placeholder { color: #88949c; }
.address-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 190px;
    padding: 0 18px;
    border: 1px solid #148665;
    border-radius: 16px;
    background: #1D9E75;
    color: white;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 18px rgba(15,110,86,0.2);
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}
.nav-address-trigger {
    min-height: 48px;
    border-radius: 16px;
}
.address-trigger:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(15,110,86,0.26);
    background: #0F6E56;
}
.address-trigger span {
    max-width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    .nav-search-box,
    .nav-address-trigger {
        width: 100%;
        max-width: none;
    }
}

@media (max-width: 480px) {
    .brand-name { font-size: 16px; }
    .btn-login span { display: none; }
    .btn-login { padding: 8px 12px; }
}
</style>
