<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()

onMounted(() => {
  auth.fetchUser()
})
</script>

<style>
body {
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0 !important;
}

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
.map-pin--active .map-pin-photo { border-color: #1D9E75; box-shadow: 0 8px 20px rgba(15,110,86,0.4); }
</style>