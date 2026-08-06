<template>
  <OnboardingGate v-if="showOnboarding" @done="showOnboarding = false" />
  <template v-else>
    <component :is="layoutComponent" v-if="layoutComponent"><router-view /></component>
    <router-view v-else />
  </template>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import { hasSeenOnboarding } from './utils/onboarding'
import OnboardingGate from './components/onboarding/OnboardingGate.vue'
import PublicShell from './layouts/PublicShell.vue'
import AdminShell from './layouts/AdminShell.vue'

const auth = useAuthStore()
const theme = useThemeStore()
const route = useRoute()
const showOnboarding = ref(!hasSeenOnboarding())

const layouts = {
  public: PublicShell,
  admin: AdminShell,
}

const layoutComponent = computed(() => layouts[route.meta.layout] ?? null)

onMounted(() => {
  auth.fetchUser()
  theme.watchSystem()
})
</script>

<style>
/* Restoran xarita pinlari (Leaflet divIcon orqali, scoped style ta'sir qilmaydi) */
.restaurant-map-pin-wrap { background: transparent !important; border: none !important; }
.map-pin { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; }
.map-pin-photo {
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #ffffff;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.28);
  background: #e8ece9;
}
.map-pin-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.map-pin-fallback {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  color: #9aa79f; font-size: 18px;
  background: linear-gradient(135deg, #eef2f0, #e2e8e4);
}
.map-pin-label {
  max-width: 110px;
  padding: 3px 9px;
  background: rgba(20, 32, 27, 0.86);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.map-pin--active .map-pin-photo { border-color: var(--color-primary); box-shadow: 0 8px 20px rgba(108,92,231,0.4); }
</style>