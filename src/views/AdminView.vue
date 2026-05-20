<template>
    <div class="page">
        <!-- Navbar -->
        <nav class="navbar">
            <div class="nav-brand">
                <div class="brand-icon"><i class="fas fa-utensils"></i></div>
                <span class="brand-name">Restoran<span class="brand-accent">UZ</span></span>
            </div>
            <div class="nav-right">
                <LanguageSwitcher />
                <router-link to="/" class="nav-link">
                    <i class="fas fa-home"></i>
                    <span>{{ $t('nav.home') }}</span>
                </router-link>
                <button @click="logout" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>{{ $t('admin.logout') }}</span>
                </button>
            </div>
        </nav>

        <div class="container">
            <!-- Welcome -->
            <div class="welcome-bar">
                <div class="welcome-left">
                    <div class="admin-avatar">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div>
                        <h2 class="welcome-title">{{ $t('admin.title') }}</h2>
                        <p class="welcome-sub">{{ $t('admin.subtitle') }}</p>
                    </div>
                </div>
                <div class="admin-badge">
                    <i class="fas fa-crown"></i>
                    {{ $t('admin.badge') }}
                </div>
            </div>

            <!-- Stats -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon-wrap gray">
                        <i class="fas fa-store"></i>
                    </div>
                    <div>
                        <p class="stat-label">{{ $t('admin.totalRestaurants') }}</p>
                        <p class="stat-num">{{ restaurants.length }}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-wrap green">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div>
                        <p class="stat-label">{{ $t('admin.activeLabel') }}</p>
                        <p class="stat-num green-text">{{ activeCount }}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-wrap red">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <div>
                        <p class="stat-label">{{ $t('admin.inactiveLabel') }}</p>
                        <p class="stat-num red-text">{{ inactiveCount }}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-wrap orange">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div>
                        <p class="stat-label">{{ $t('admin.pending') }}</p>
                        <p class="stat-num orange-text">{{ inactiveCount }}</p>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="table-card">
                <div class="table-header">
                    <div class="table-title">
                        <i class="fas fa-list"></i>
                        {{ $t('admin.allRestaurants') }}
                    </div>
                    <div class="table-search">
                        <i class="fas fa-search"></i>
                        <input v-model="search" :placeholder="$t('admin.search')" class="search-input" />
                    </div>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="loading-state">
                    <div class="spinner"></div>
                    <p>{{ $t('admin.loading') }}</p>
                </div>

                <!-- Empty -->
                <div v-else-if="filtered.length === 0" class="empty-state">
                    <i class="fas fa-store-slash"></i>
                    <p>{{ $t('admin.noRestaurants') }}</p>
                </div>

                <!-- Table content -->
                <div v-else class="table-wrap">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{ $t('admin.number') }}</th>
                                <th>{{ $t('admin.restaurant') }}</th>
                                <th>{{ $t('admin.owner') }}</th>
                                <th>{{ $t('admin.phone') }}</th>
                                <th>{{ $t('admin.address') }}</th>
                                <th>{{ $t('admin.status') }}</th>
                                <th>{{ $t('admin.action') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(r, i) in filtered" :key="r.id" class="table-row">
                                <td class="td-num">{{ i + 1 }}</td>
                                <td>
                                    <div class="restaurant-cell">
                                        <div class="restaurant-thumb">
                                            <img
                                                v-if="resolveImageUrl(r.image_path)"
                                                :src="resolveImageUrl(r.image_path)"
                                                alt=""
                                            />
                                            <i v-else class="fas fa-utensils"></i>
                                        </div>
                                        <div>
                                            <p class="restaurant-name">{{ r.name }}</p>
                                            <p class="restaurant-desc">{{ r.description?.slice(0, 30) || '—' }}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="owner-cell">
                                        <div class="owner-avatar">
                                            {{ r.owner?.name?.charAt(0) || '?' }}
                                        </div>
                                        <span>{{ r.owner?.name || '—' }}</span>
                                    </div>
                                </td>
                                <td>
                                    <a :href="`tel:${r.phone}`" class="phone-link">
                                        <i class="fas fa-phone-alt"></i>
                                        {{ r.phone || '—' }}
                                    </a>
                                </td>
                                <td class="td-address">
                                    <i class="fas fa-map-marker-alt address-icon"></i>
                                    {{ r.location?.address || '—' }}
                                </td>
                                <td>
                                    <span :class="r.is_active ? 'badge-active' : 'badge-inactive'">
                                        <i :class="r.is_active ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                                        {{ r.is_active ? $t('admin.activeLabel') : $t('admin.inactiveLabel') }}
                                    </span>
                                </td>
                                <td>
                                    <div class="td-actions">
                                        <button
                                            @click="toggle(r)"
                                            :class="r.is_active ? 'btn-deactivate' : 'btn-activate'"
                                        >
                                            <i :class="r.is_active ? 'fas fa-ban' : 'fas fa-check'"></i>
                                            {{ r.is_active ? $t('admin.deactivate') : $t('admin.activate') }}
                                        </button>
                                        <router-link :to="`/restaurant/${r.id}`" class="btn-view">
                                            <i class="fas fa-eye"></i>
                                        </router-link>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Footer -->
                <div class="table-footer" v-if="!loading && filtered.length > 0">
                    <p>{{ $t('admin.total') }} <strong>{{ filtered.length }}</strong> {{ $t('admin.allRestaurants').toLowerCase() }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../axios'
import { resolveImageUrl } from '../utils/imageUrl'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const auth = useAuthStore()
const router = useRouter()
const restaurants = ref([])
const loading = ref(true)
const search = ref('')

const filtered = computed(() => {
    if (!search.value) return restaurants.value
    const q = search.value.toLowerCase()
    return restaurants.value.filter(r =>
        r.name?.toLowerCase().includes(q) ||
        r.owner?.name?.toLowerCase().includes(q) ||
        r.phone?.includes(q)
    )
})

const activeCount = computed(() => restaurants.value.filter(r => r.is_active).length)
const inactiveCount = computed(() => restaurants.value.filter(r => !r.is_active).length)

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
    try { await api.post('/logout') } catch {}
    auth.logout()
    router.push('/')
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

* { box-sizing: border-box; margin: 0; padding: 0; }
.page { min-height: 100vh; background: #f4f5f7; font-family: 'Segoe UI', sans-serif; }

/* NAVBAR */
.navbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 32px; height: 64px;
    background: white; box-shadow: 0 1px 0 #e8e8e8;
    position: sticky; top: 0; z-index: 100;
}
.nav-brand { display: flex; align-items: center; gap: 10px; }
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
.nav-link {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 10px;
    background: #f4f5f7; color: #555;
    text-decoration: none; font-size: 14px; transition: all 0.2s;
}
.nav-link:hover { background: #E1F5EE; color: #1D9E75; }
.logout-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 10px;
    background: #FCEBEB; color: #A32D2D;
    border: none; cursor: pointer; font-size: 14px; transition: all 0.2s;
}
.logout-btn:hover { background: #F7C1C1; }

/* CONTAINER */
.container { max-width: 1200px; margin: 0 auto; padding: 28px 24px; display: flex; flex-direction: column; gap: 20px; }

/* WELCOME */
.welcome-bar {
    display: flex; justify-content: space-between; align-items: center;
    background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
    border-radius: 16px; padding: 20px 24px; color: white;
}
.welcome-left { display: flex; align-items: center; gap: 14px; }
.admin-avatar {
    width: 48px; height: 48px;
    background: rgba(255,255,255,0.15);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: #FFD700;
}
.welcome-title { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
.welcome-sub { font-size: 13px; opacity: 0.75; }
.admin-badge {
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,215,0,0.15);
    border: 1px solid rgba(255,215,0,0.3);
    color: #FFD700;
    padding: 8px 16px; border-radius: 20px;
    font-size: 13px; font-weight: 600;
}

/* STATS */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card {
    background: white; border-radius: 14px; padding: 18px 20px;
    display: flex; align-items: center; gap: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: transform 0.2s;
}
.stat-card:hover { transform: translateY(-2px); }
.stat-icon-wrap {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
}
.stat-icon-wrap.gray { background: #f0f0f0; color: #666; }
.stat-icon-wrap.green { background: #E1F5EE; color: #1D9E75; }
.stat-icon-wrap.red { background: #FCEBEB; color: #E24B4A; }
.stat-icon-wrap.orange { background: #FAEEDA; color: #EF9F27; }
.stat-label { font-size: 12px; color: #999; margin-bottom: 4px; }
.stat-num { font-size: 24px; font-weight: 800; color: #1a1a1a; }
.green-text { color: #1D9E75; }
.red-text { color: #E24B4A; }
.orange-text { color: #EF9F27; }

/* TABLE CARD */
.table-card {
    background: white; border-radius: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden;
}
.table-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 24px; border-bottom: 1px solid #f0f0f0;
}
.table-title {
    font-size: 16px; font-weight: 700; color: #1a1a1a;
    display: flex; align-items: center; gap: 8px;
}
.table-title i { color: #1D9E75; }
.table-search {
    display: flex; align-items: center; gap: 8px;
    background: #f4f5f7; border-radius: 10px;
    padding: 8px 14px;
}
.table-search i { color: #aaa; font-size: 14px; }
.search-input {
    border: none; background: transparent; outline: none;
    font-size: 14px; color: #1a1a1a; width: 200px;
}

/* LOADING / EMPTY */
.loading-state, .empty-state {
    padding: 60px; text-align: center; color: #aaa;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.empty-state i { font-size: 40px; }
.spinner {
    width: 36px; height: 36px;
    border: 3px solid #f0f0f0;
    border-top-color: #1D9E75;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* TABLE */
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; }
.table thead tr { background: #f9f9f9; }
.table th {
    padding: 12px 16px; text-align: left;
    font-size: 11px; font-weight: 600; color: #999;
    text-transform: uppercase; letter-spacing: 0.04em;
    border-bottom: 1px solid #f0f0f0;
}
.table-row { transition: background 0.15s; }
.table-row:hover { background: #f9fffe; }
.table td {
    padding: 14px 16px; border-bottom: 1px solid #f5f5f5;
    font-size: 14px; color: #333; vertical-align: middle;
}
.td-num { color: #bbb; font-size: 13px; font-weight: 500; }

/* RESTAURANT CELL */
.restaurant-cell { display: flex; align-items: center; gap: 10px; }
.restaurant-thumb {
    width: 40px; height: 40px; border-radius: 10px;
    overflow: hidden; background: #f0f0f0;
    display: flex; align-items: center; justify-content: center;
    color: #bbb; font-size: 16px; flex-shrink: 0;
}
.restaurant-thumb img { width: 100%; height: 100%; object-fit: cover; }
.restaurant-name { font-size: 14px; font-weight: 600; color: #1a1a1a; }
.restaurant-desc { font-size: 12px; color: #aaa; margin-top: 2px; }

/* OWNER CELL */
.owner-cell { display: flex; align-items: center; gap: 8px; }
.owner-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg, #1D9E75, #0F6E56);
    color: white; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}

/* PHONE */
.phone-link {
    display: flex; align-items: center; gap: 6px;
    color: #1D9E75; text-decoration: none; font-size: 13px;
    transition: color 0.2s;
}
.phone-link:hover { color: #0F6E56; }
.phone-link i { font-size: 11px; }

/* ADDRESS */
.td-address { font-size: 13px; color: #666; }
.address-icon { color: #E24B4A; margin-right: 4px; font-size: 11px; }

/* BADGES */
.badge-active, .badge-inactive {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 20px;
    font-size: 12px; font-weight: 500; white-space: nowrap;
}
.badge-active { background: #E1F5EE; color: #0F6E56; }
.badge-inactive { background: #FCEBEB; color: #A32D2D; }

/* ACTIONS */
.td-actions { display: flex; align-items: center; gap: 6px; }
.btn-activate, .btn-deactivate {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 12px; border-radius: 8px;
    border: none; cursor: pointer;
    font-size: 12px; font-weight: 500; transition: all 0.2s;
}
.btn-activate { background: #E1F5EE; color: #0F6E56; }
.btn-activate:hover { background: #9FE1CB; }
.btn-deactivate { background: #FCEBEB; color: #A32D2D; }
.btn-deactivate:hover { background: #F7C1C1; }
.btn-view {
    width: 32px; height: 32px; border-radius: 8px;
    background: #f0f0f0; color: #666;
    display: flex; align-items: center; justify-content: center;
    text-decoration: none; font-size: 14px; transition: all 0.2s;
}
.btn-view:hover { background: #E1F5EE; color: #1D9E75; }

/* TABLE FOOTER */
.table-footer {
    padding: 14px 24px; border-top: 1px solid #f0f0f0;
    background: #f9f9f9; font-size: 13px; color: #888;
}
.table-footer strong { color: #1a1a1a; }

/* MOBILE */
@media (max-width: 768px) {
    .navbar { padding: 0 16px; }
    .container { padding: 16px 12px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .welcome-bar { flex-direction: column; align-items: flex-start; gap: 12px; }
    .nav-link span, .logout-btn span { display: none; }
    .search-input { width: 120px; }
}
@media (max-width: 480px) {
    .stats-grid { grid-template-columns: 1fr; }
}
</style>