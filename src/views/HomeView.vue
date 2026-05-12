<template>
    <div class="home">
        <header class="header">
            <h1>🍽 Restoranlar</h1>
            <router-link v-if="!auth.isLoggedIn" to="/login" class="btn">
                Kirish
            </router-link>
            <router-link v-else-if="auth.isAdmin" to="/admin" class="btn">
                Admin panel
            </router-link>
            <router-link v-else to="/dashboard" class="btn">
                Dashboard
            </router-link>
        </header>

        <div class="restaurants">
            <div v-if="loading">Yuklanmoqda...</div>
            <div v-else-if="restaurants.length === 0">Restoranlar topilmadi</div>
            <div
                v-for="r in restaurants"
                :key="r.id"
                class="card"
                @click="$router.push(`/restaurant/${r.id}`)"
            >
                <img
                    :src="r.image_path ? `http://localhost:8000/storage/${r.image_path}` : '/no-image.png'"
                    :alt="r.name"
                    class="card-img"
                />
                <div class="card-body">
                    <h3>{{ r.name }}</h3>
                    <p>{{ r.description }}</p>
                    <p class="phone">📞 {{ r.phone }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const restaurants = ref([])
const loading = ref(true)

onMounted(async () => {
    try {
        const res = await api.get('/restaurants')
        restaurants.value = res.data
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.home { max-width: 1100px; margin: 0 auto; padding: 24px; }
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}
.btn {
    padding: 10px 20px;
    background: #42b883;
    color: white;
    border-radius: 8px;
    text-decoration: none;
}
.restaurants {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
}
.card {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.2s;
}
.card:hover { transform: translateY(-4px); }
.card-img { width: 100%; height: 200px; object-fit: cover; }
.card-body { padding: 16px; }
.card-body h3 { margin-bottom: 8px; }
.card-body p { color: #666; font-size: 14px; }
.phone { margin-top: 8px; }
</style>