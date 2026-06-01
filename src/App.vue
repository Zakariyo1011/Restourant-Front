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
</style>