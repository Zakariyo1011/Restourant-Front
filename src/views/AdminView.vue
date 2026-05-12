<template>
    <div class="admin">
        <header class="header">
            <h1>Admin Panel</h1>
            <button @click="logout" class="logout-btn">Chiqish</button>
        </header>

        <h2>Barcha restoranlar</h2>
        <div v-if="loading">Yuklanmoqda...</div>
        <table v-else class="table">
            <thead>
                <tr>
                    <th>Nomi</th>
                    <th>Egasi</th>
                    <th>Telefon</th>
                    <th>Holat</th>
                    <th>Amal</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="r in restaurants" :key="r.id">
                    <td>{{ r.name }}</td>
                    <td>{{ r.owner?.name }}</td>
                    <td>{{ r.phone }}</td>
                    <td>{{ r.is_active ? '✅ Aktiv' : '❌ Inaktiv' }}</td>
                    <td>
                        <button @click="toggle(r)" class="toggle-btn">
                            {{ r.is_active ? 'Deaktiv' : 'Aktiv' }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../axios'

const auth = useAuthStore()
const router = useRouter()
const restaurants = ref([])
const loading = ref(true)

onMounted(async () => {
    try {
        const res = await api.get('/admin/restaurants')
        restaurants.value = res.data
    } finally {
        loading.value = false
    }
})

const toggle = async (r) => {
    await api.patch(`/admin/restaurants/${r.id}/toggle`)
    r.is_active = !r.is_active
}

const logout = async () => {
    await api.post('/logout')
    auth.logout()
    router.push('/')
}
</script>

<style scoped>
.admin { max-width: 1100px; margin: 0 auto; padding: 24px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.logout-btn { padding: 8px 16px; background: #ff4444; color: white; border: none; border-radius: 8px; cursor: pointer; }
.table { width: 100%; border-collapse: collapse; margin-top: 16px; }
.table th, .table td { padding: 12px; border: 1px solid #ddd; text-align: left; }
.table th { background: #f5f5f5; }
.toggle-btn { padding: 6px 12px; background: #42b883; color: white; border: none; border-radius: 6px; cursor: pointer; }
</style>