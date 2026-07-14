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
    padding: 0 32px;
    height: 64px;
    background: white;
    box-shadow: 0 1px 0 #e8e8e8;
    position: sticky;
    top: 0;
    z-index: 100;
}
.nav-brand { display: flex; align-items: center; gap: 10px; }
.nav-discovery {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 0 24px;
    max-width: 780px;
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
    background: white;
    border-radius: 14px;
    padding: 6px 6px 6px 16px;
    gap: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}
.search-icon { font-size: 16px; color: #aaa; }
.nav-search-box {
    flex: 1;
    max-width: 540px;
    min-height: 46px;
    box-shadow: none;
    border-radius: 14px;
    background: #ffffff;
    border: 1px solid #d9ede6;
}
.search-input {
    flex: 1; border: none; outline: none;
    font-size: 15px; padding: 10px 0;
    color: #1a1a1a; background: transparent;
}
.address-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-width: 220px;
    padding: 0 18px;
    border: 1px solid #168b67;
    border-radius: 16px;
    background: #1D9E75;
    color: white;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(15,110,86,0.22);
    transition: transform 0.2s, box-shadow 0.2s;
}
.nav-address-trigger {
    min-width: 190px;
    min-height: 46px;
    border-radius: 14px;
    box-shadow: none;
}
.address-trigger:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(15,110,86,0.28);
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
        padding: 10px 16px 12px;
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
