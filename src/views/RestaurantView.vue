<template>
    <div class="page" v-if="restaurant">
        <!-- Navbar -->
        <nav class="navbar">
            <div class="nav-left">
                <button @click="$router.back()" class="back-btn">
                    <i class="fas fa-arrow-left"></i>
                    <span>{{ t('nav.back') }}</span>
                </button>
            </div>
            <div class="nav-brand">
                <div class="brand-icon"><i class="fas fa-utensils"></i></div>
                <span class="brand-name">Restoran<span class="brand-accent">UZ</span></span>
            </div>
            <div class="nav-right">
                <LanguageSwitcher />
                <router-link to="/" class="home-link">
                    <i class="fas fa-home"></i>
                </router-link>
            </div>
        </nav>

        <!-- Hero Image -->
        <div class="hero">
            <img
                v-if="heroImageUrl && !heroImageFailed"
                :src="heroImageUrl"
                :alt="restaurant.name"
                class="hero-img"
                @error="heroImageFailed = true"
            />
            <div v-else class="hero-placeholder">
                <i class="fas fa-utensils"></i>
            </div>
            <div class="hero-overlay">
                <div class="hero-badge">
                    <i class="fas fa-circle"></i> {{ t('restaurant.open') }}
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="content-wrap">
            <!-- Main info card -->
            <div class="main-card">
                <div class="main-card-header">
                    <div>
                        <h1 class="restaurant-name">{{ restaurant.name }}</h1>
                        <div class="restaurant-meta">
                            <span class="meta-item" v-if="restaurant.location?.address">
                                <i class="fas fa-map-marker-alt"></i>
                                {{ restaurant.location.address }}
                            </span>
                        </div>
                    </div>
                    <a :href="`tel:${restaurant.phone}`" class="call-btn">
                        <i class="fas fa-phone-alt"></i>
                        <span>{{ t('restaurant.call') }}</span>
                    </a>
                </div>

                <div class="divider"></div>

                <!-- Stats row -->
                <div class="stats-row">
                    <div class="stat-box">
                        <i class="fas fa-phone-alt stat-icon green"></i>
                        <div>
                                <p class="stat-label">{{ t('restaurant.phone') }}</p>
                            <p class="stat-value">{{ restaurant.phone || '—' }}</p>
                        </div>
                    </div>
                    <div class="stat-box">
                        <i class="fas fa-map-marker-alt stat-icon blue"></i>
                        <div>
                                <p class="stat-label">{{ t('restaurant.address') }}</p>
                            <p class="stat-value">{{ restaurant.location?.address || '—' }}</p>
                        </div>
                    </div>
                    <div class="stat-box">
                        <i class="fas fa-check-circle stat-icon orange"></i>
                        <div>
                            <p class="stat-label">{{ t('restaurant.status') }}</p>
                            <p class="stat-value">{{ t('restaurant.verified') }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Description -->
            <div class="section-card" v-if="restaurant.description">
                <h2 class="section-title">
                    <i class="fas fa-info-circle"></i>
                    {{ t('restaurant.about') }}
                </h2>
                <p class="description">{{ restaurant.description }}</p>
            </div>

            <!-- Map -->
            <div class="section-card" v-if="restaurant.location">
                <h2 class="section-title">
                    <i class="fas fa-map-marked-alt"></i>
                    {{ t('restaurant.location') }}
                </h2>
                <div class="map-wrap">
                    <div id="map"></div>
                </div>
                <div class="map-footer">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>{{ restaurant.location.address || t('restaurant.noAddress') }}</span>
                    
                     <a :href="`https://www.google.com/maps?q=${restaurant.location.latitude},${restaurant.location.longitude}`"
   target="_blank"
   class="maps-link"
>
                        {{ t('restaurant.mapLink') }} <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>

            <!-- Contact -->
            <div class="section-card contact-card">
                <h2 class="section-title">
                    <i class="fas fa-headset"></i>
                    {{ t('restaurant.contact') }}
                </h2>
                <div class="contact-grid">
                    <a :href="`tel:${restaurant.phone}`" class="contact-item phone">
                        <div class="contact-icon">
                            <i class="fas fa-phone-alt"></i>
                        </div>
                        <div>
                            <p class="contact-label">{{ t('restaurant.phone') }}</p>
                            <p class="contact-value">{{ restaurant.phone }}</p>
                        </div>
                        <i class="fas fa-chevron-right contact-arrow"></i>
                    </a>
                    
                       <a v-if="restaurant.location"
   :href="`https://www.google.com/maps?q=${restaurant.location.latitude},${restaurant.location.longitude}`"
   target="_blank"
   class="contact-item map"
>
                        <div class="contact-icon">
                            <i class="fas fa-directions"></i>
                        </div>
                        <div>
                            <p class="contact-label">{{ t('restaurant.directions') }}</p>
                            <p class="contact-value">{{ t('restaurant.viewOnMap') }}</p>
                        </div>
                        <i class="fas fa-chevron-right contact-arrow"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Loading -->
    <div v-else class="loading-page">
        <div class="spinner"></div>
        <p>{{ t('restaurant.loading') }}</p>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import api from '../axios'
import { resolveImageUrl } from '../utils/imageUrl'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow })

const route = useRoute()
const restaurant = ref(null)
const heroImageFailed = ref(false)
const { t } = useI18n()

const heroImageUrl = computed(() => resolveImageUrl(restaurant.value?.image_path))

watch(() => restaurant.value?.image_path, () => {
    heroImageFailed.value = false
})

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
            .bindPopup(`<strong>${restaurant.value.name}</strong>`)
            .openPopup()
    }
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

* { box-sizing: border-box; margin: 0; padding: 0; }
.page { min-height: 100vh; background: #f4f5f7; font-family: 'Segoe UI', sans-serif; }

/* NAVBAR */
.navbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 24px; height: 60px;
    background: white;
    box-shadow: 0 1px 0 #e8e8e8;
    position: sticky; top: 0; z-index: 100;
}
.back-btn {
    display: flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    font-size: 14px; color: #555;
    padding: 8px 12px; border-radius: 8px;
    transition: all 0.2s;
}
.back-btn:hover { background: #f0f0f0; color: #1D9E75; }
.nav-brand { display: flex; align-items: center; gap: 8px; }
.brand-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #1D9E75, #0F6E56);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 14px;
}
.brand-name { font-size: 16px; font-weight: 700; color: #1a1a1a; }
.brand-accent { color: #1D9E75; }
.home-link {
    width: 36px; height: 36px;
    background: #f0f0f0; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: #555; text-decoration: none; font-size: 16px;
    transition: all 0.2s;
}
.home-link:hover { background: #E1F5EE; color: #1D9E75; }

/* HERO */
.hero { position: relative; height: 320px; overflow: hidden; }
.hero-img { width: 100%; height: 100%; object-fit: cover; }
.hero-placeholder {
    width: 100%; height: 100%;
    background: linear-gradient(135deg, #1D9E75, #0F6E56);
    display: flex; align-items: center; justify-content: center;
    font-size: 64px; color: rgba(255,255,255,0.4);
}
.hero-overlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
    display: flex; align-items: flex-end; padding: 20px 24px;
}
.hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #1D9E75; color: white;
    padding: 6px 14px; border-radius: 20px;
    font-size: 13px; font-weight: 500;
}
.hero-badge .fa-circle { font-size: 7px; }

/* CONTENT */
.content-wrap {
    max-width: 800px; margin: -24px auto 0;
    padding: 0 20px 40px;
    position: relative; z-index: 2;
    display: flex; flex-direction: column; gap: 16px;
}

/* MAIN CARD */
.main-card {
    background: white; border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}
.main-card-header {
    display: flex; justify-content: space-between;
    align-items: flex-start; gap: 12px; margin-bottom: 20px;
}
.restaurant-name { font-size: 24px; font-weight: 800; color: #1a1a1a; margin-bottom: 6px; }
.restaurant-meta { display: flex; flex-direction: column; gap: 4px; }
.meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #666; }
.meta-item i { color: #E24B4A; font-size: 12px; }
.call-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 20px;
    background: #1D9E75; color: white;
    border-radius: 12px; text-decoration: none;
    font-size: 14px; font-weight: 600;
    white-space: nowrap;
    transition: background 0.2s;
    flex-shrink: 0;
}
.call-btn:hover { background: #0F6E56; }
.divider { height: 1px; background: #f0f0f0; margin-bottom: 20px; }

/* STATS */
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.stat-box {
    display: flex; align-items: center; gap: 10px;
    background: #f7f8fa; border-radius: 12px; padding: 12px;
}
.stat-icon { font-size: 18px; flex-shrink: 0; }
.stat-icon.green { color: #1D9E75; }
.stat-icon.blue { color: #378ADD; }
.stat-icon.orange { color: #EF9F27; }
.stat-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 2px; }
.stat-value { font-size: 13px; font-weight: 500; color: #1a1a1a; }

/* SECTION CARD */
.section-card {
    background: white; border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.section-title {
    font-size: 16px; font-weight: 700; color: #1a1a1a;
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 16px;
}
.section-title i { color: #1D9E75; }
.description { font-size: 15px; color: #555; line-height: 1.7; }

/* MAP */
.map-wrap { border-radius: 14px; overflow: hidden; margin-bottom: 12px; }
#map { width: 100%; height: 300px; }
.map-footer {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: #666; flex-wrap: wrap;
}
.map-footer i { color: #E24B4A; }
.maps-link {
    margin-left: auto; color: #1D9E75; text-decoration: none;
    font-weight: 500; font-size: 13px;
    display: flex; align-items: center; gap: 4px;
}
.maps-link:hover { text-decoration: underline; }

/* CONTACT */
.contact-grid { display: flex; flex-direction: column; gap: 10px; }
.contact-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px; border-radius: 12px;
    text-decoration: none; transition: all 0.2s;
    border: 1px solid #f0f0f0;
}
.contact-item.phone { background: #E1F5EE; border-color: #9FE1CB; }
.contact-item.map { background: #E6F1FB; border-color: #B5D4F4; }
.contact-item:hover { transform: translateX(4px); }
.contact-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
    flex-shrink: 0;
}
.contact-item.phone .contact-icon { background: #1D9E75; color: white; }
.contact-item.map .contact-icon { background: #378ADD; color: white; }
.contact-label { font-size: 11px; color: #888; margin-bottom: 2px; }
.contact-item.phone .contact-label { color: #0F6E56; }
.contact-item.map .contact-label { color: #185FA5; }
.contact-value { font-size: 14px; font-weight: 600; }
.contact-item.phone .contact-value { color: #0F6E56; }
.contact-item.map .contact-value { color: #185FA5; }
.contact-arrow { margin-left: auto; color: #aaa; font-size: 14px; }

/* LOADING */
.loading-page {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
    font-size: 16px; color: #666;
}
.spinner {
    width: 40px; height: 40px;
    border: 3px solid #e8e8e8;
    border-top-color: #1D9E75;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* MOBILE */
@media (max-width: 600px) {
    .hero { height: 240px; }
    .stats-row { grid-template-columns: 1fr; }
    .main-card-header { flex-direction: column; }
    .call-btn { width: 100%; justify-content: center; }
    .content-wrap { padding: 0 12px 32px; }
}
</style>