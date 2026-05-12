<template>
    <div class="restaurant-page" v-if="restaurant">
        <button @click="$router.back()" class="back-btn">← Orqaga</button>

        <img
            :src="restaurant.image_path ? `http://localhost:8000/storage/${restaurant.image_path}` : 'https://via.placeholder.com/800x350?text=Rasm+yo\'q'"
            :alt="restaurant.name"
            class="hero-img"
        />

        <div class="info">
            <h1>{{ restaurant.name }}</h1>
            <p>{{ restaurant.description }}</p>
            <p class="phone">📞 {{ restaurant.phone }}</p>
        </div>

        <!-- Leaflet Map -->
        <div class="map-section" v-if="restaurant.location">
            <h2>Joylashuv</h2>
            <div id="map" style="width: 100%; height: 400px; border-radius: 12px;"></div>
            <p class="address">📍 {{ restaurant.location.address }}</p>
        </div>
    </div>
    <div v-else class="loading">Yuklanmoqda...</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import api from '../axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Leaflet marker ikonkasini tuzatish
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
})

const route = useRoute()
const restaurant = ref(null)

onMounted(async () => {
    const res = await api.get(`/restaurants/${route.params.id}`)
    restaurant.value = res.data

    if (restaurant.value?.location) {
        await nextTick()
        const lat = parseFloat(restaurant.value.location.latitude)
        const lng = parseFloat(restaurant.value.location.longitude)

        const map = L.map('map').setView([lat, lng], 15)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map)

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(restaurant.value.name)
            .openPopup()
    }
})
</script>

<style scoped>
.restaurant-page { max-width: 800px; margin: 0 auto; padding: 24px; }
.back-btn {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    margin-bottom: 16px;
    color: #42b883;
}
.hero-img { width: 100%; height: 350px; object-fit: cover; border-radius: 12px; }
.info { padding: 24px 0; }
.info h1 { font-size: 28px; margin-bottom: 8px; }
.info p { color: #555; }
.phone { margin-top: 8px; font-size: 16px; }
.map-section { margin-top: 24px; }
.map-section h2 { margin-bottom: 16px; }
.address { margin-top: 12px; color: #555; }
.loading { text-align: center; padding: 60px; font-size: 18px; }
</style>