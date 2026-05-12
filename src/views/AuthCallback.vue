<template>
    <div class="callback">
        <p>Yuklanmoqda...</p>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

onMounted(async () => {
    const token = route.query.token

    if (token) {
        auth.setToken(token)
        await auth.fetchUser()

        console.log('User role:', auth.user?.role)
        console.log('isAdmin:', auth.isAdmin)

        if (auth.user?.role === 'admin') {
            router.push('/admin')
        } else {
            router.push('/dashboard')
        }
    } else {
        router.push('/login')
    }
})
</script>

<style scoped>
.callback {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}
</style>