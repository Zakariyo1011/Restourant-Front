<template>
    <div class="dashboard">
        <header class="header">
            <div class="header-left">
                <h1>🍽 Dashboard</h1>
                <span class="role-badge">Restoran egasi</span>
            </div>
            <div class="header-right">
                <router-link to="/" class="home-btn">🏠 Bosh sahifa</router-link>
                <button @click="logout" class="logout-btn">Chiqish</button>
            </div>
        </header>

        <!-- Inactive ogohlantirish -->
        <div v-if="!auth.isActive" class="inactive-warning">
            ⚠️ Restorningiz hali aktiv emas. Admin tasdiqlashini kuting yoki ariza yuboring.
            <button @click="showArijaForm = true" class="ariza-btn">📨 Ariza yuborish</button>
        </div>

        <!-- Ariza yuborish formasi -->
        <div v-if="showArijaForm" class="modal-overlay" @click.self="showArijaForm = false">
            <div class="modal">
                <h2>Aktivlashtirish uchun ariza</h2>
                <p>Telefon raqamingizni kiriting, admin siz bilan bog'lanadi.</p>
                <input v-model="arijaPhone" placeholder="+998901234567" class="input" />
                <div class="modal-buttons">
                    <button @click="sendArija" class="btn-green">📨 Yuborish</button>
                    <button @click="showArijaForm = false" class="btn-gray">Bekor</button>
                </div>
                <p v-if="arijaSuccess" class="success-msg">✅ Ariza yuborildi! Admin tez orada bog'lanadi.</p>
                <p v-if="arijaError" class="error-msg">❌ {{ arijaError }}</p>
            </div>
        </div>

        <div class="content">
            <!-- Restoran yo'q -->
            <div v-if="!restaurant && !showAddForm" class="empty-state">
                <div class="empty-icon">🏪</div>
                <h2>Hali restoran qo'shilmagan</h2>
                <p>Restoran qo'shib, mijozlaringizga o'zingizni tanituring!</p>
                <button @click="showAddForm = true" class="btn-green">+ Restoran qo'shish</button>
            </div>

            <!-- Restoran qo'shish formasi -->
            <div v-if="showAddForm" class="form-card">
                <h2>Yangi restoran qo'shish</h2>
                <RestaurantForm
                    :loading="formLoading"
                    :error="formError"
                    @submit="createRestaurant"
                    @cancel="showAddForm = false"
                />
            </div>

            <!-- Restoran ma'lumotlari -->
            <div v-if="restaurant && !showEditForm" class="restaurant-card">
                <div class="restaurant-header">
                    <h2>Mening restoranim</h2>
                    <div class="action-buttons">
                        <button @click="startEdit" class="btn-blue">✏️ Tahrirlash</button>
                        <button @click="confirmDelete" class="btn-red">🗑 O'chirish</button>
                    </div>
                </div>

                <div class="restaurant-info">
                    <img
                        v-if="restaurant.image_path"
                        :src="`http://localhost:8000/storage/${restaurant.image_path}`"
                        class="restaurant-img"
                        alt="Restoran rasmi"
                    />
                    <div class="no-image" v-else>📷 Rasm yo'q</div>

                    <div class="info-grid">
                        <div class="info-item">
                            <span class="label">Nomi</span>
                            <span class="value">{{ restaurant.name }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Telefon</span>
                            <span class="value">{{ restaurant.phone }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Tavsif</span>
                            <span class="value">{{ restaurant.description }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Manzil</span>
                            <span class="value">{{ restaurant.location?.address }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Holat</span>
                            <span :class="restaurant.is_active ? 'badge-active' : 'badge-inactive'">
                                {{ restaurant.is_active ? '✅ Aktiv' : '❌ Inaktiv' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tahrirlash formasi -->
            <div v-if="showEditForm" class="form-card">
                <h2>Restoran tahrirlash</h2>
                <RestaurantForm
                    :initial="editData"
                    :loading="formLoading"
                    :error="formError"
                    @submit="updateRestaurant"
                    @cancel="showEditForm = false"
                />
            </div>
        </div>

        <!-- O'chirish tasdiqlash -->
        <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
            <div class="modal">
                <h2>⚠️ O'chirishni tasdiqlang</h2>
                <p>Restoran ma'lumotlari butunlay o'chib ketadi!</p>
                <div class="modal-buttons">
                    <button @click="deleteRestaurant" class="btn-red">Ha, o'chirish</button>
                    <button @click="showDeleteConfirm = false" class="btn-gray">Bekor</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../axios'
import axios from 'axios'
import RestaurantForm from '../components/RestaurantForm.vue'

const auth = useAuthStore()
const router = useRouter()
const restaurant = ref(null)
const showAddForm = ref(false)
const showEditForm = ref(false)
const showDeleteConfirm = ref(false)
const showArijaForm = ref(false)
const formLoading = ref(false)
const formError = ref('')
const arijaPhone = ref('')
const arijaSuccess = ref(false)
const arijaError = ref('')
const editData = ref({})

onMounted(async () => {
    await loadRestaurant()
})

const loadRestaurant = async () => {
    try {
        const res = await api.get('/my-restaurant')
        restaurant.value = res.data
    } catch {}
}

const createRestaurant = async (form) => {
    formLoading.value = true
    formError.value = ''
    try {
        const data = buildFormData(form)
        const token = localStorage.getItem('token')
        const res = await axios.post('http://localhost:8000/api/my-restaurant', data, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        })
        restaurant.value = res.data
        showAddForm.value = false
    } catch (e) {
        formError.value = e.response?.data?.message || 'Xato yuz berdi.'
    } finally {
        formLoading.value = false
    }
}

const startEdit = () => {
    editData.value = {
        name: restaurant.value.name,
        phone: restaurant.value.phone,
        description: restaurant.value.description,
        address: restaurant.value.location?.address,
        latitude: restaurant.value.location?.latitude,
        longitude: restaurant.value.location?.longitude,
    }
    showEditForm.value = true
}

const updateRestaurant = async (form) => {
    formLoading.value = true
    formError.value = ''
    try {
        const data = buildFormData(form)
        const token = localStorage.getItem('token')
        const res = await axios.post('http://localhost:8000/api/my-restaurant/update', data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'X-HTTP-Method-Override': 'POST'
            }
        })
        restaurant.value = res.data
        showEditForm.value = false
    } catch (e) {
        formError.value = e.response?.data?.message || e.message || 'Xato yuz berdi.'
    } finally {
        formLoading.value = false
    }
}

const confirmDelete = () => {
    showDeleteConfirm.value = true
}

const deleteRestaurant = async () => {
    try {
        await api.delete('/my-restaurant')
        restaurant.value = null
        showDeleteConfirm.value = false
    } catch (e) {
        showDeleteConfirm.value = false
    }
}

const sendArija = async () => {
    arijaSuccess.value = false
    arijaError.value = ''
    try {
        await api.post('/send-arija', { phone: arijaPhone.value })
        arijaSuccess.value = true
        arijaPhone.value = ''
    } catch (e) {
        arijaError.value = 'Xato yuz berdi. Qayta urinib ko\'ring.'
    }
}

const buildFormData = (form) => {
    const data = new FormData()
    data.append('name', form.name || '')
    data.append('phone', form.phone || '')
    data.append('description', form.description || '')
    data.append('address', form.address || '')
    data.append('latitude', form.latitude || '')
    data.append('longitude', form.longitude || '')
    if (form.image) data.append('image', form.image)
    return data
}

const logout = async () => {
    try { await api.post('/logout') } catch {}
    auth.logout()
    router.push('/')
}
</script>

<style scoped>
.dashboard { max-width: 960px; margin: 0 auto; padding: 24px; }

.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 2px solid #f0f0f0; }
.header-left { display: flex; align-items: center; gap: 12px; }
.header-left h1 { font-size: 24px; margin: 0; }
.role-badge { background: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 20px; font-size: 13px; }
.header-right { display: flex; gap: 10px; }
.home-btn { padding: 8px 16px; background: #f5f5f5; color: #333; border-radius: 8px; text-decoration: none; font-size: 14px; }
.logout-btn { padding: 8px 16px; background: #ff4444; color: white; border: none; border-radius: 8px; cursor: pointer; }

.inactive-warning { background: #fff8e1; border: 1px solid #ffca28; padding: 16px 20px; border-radius: 10px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
.ariza-btn { padding: 8px 16px; background: #ff9800; color: white; border: none; border-radius: 8px; cursor: pointer; white-space: nowrap; }

.empty-state { text-align: center; padding: 60px 20px; background: #f9f9f9; border-radius: 16px; }
.empty-icon { font-size: 60px; margin-bottom: 16px; }
.empty-state h2 { margin-bottom: 8px; }
.empty-state p { color: #666; margin-bottom: 24px; }

.restaurant-card { background: white; border: 1px solid #eee; border-radius: 16px; padding: 24px; }
.restaurant-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.restaurant-header h2 { margin: 0; }
.action-buttons { display: flex; gap: 10px; }

.restaurant-img { width: 100%; height: 250px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; }
.no-image { width: 100%; height: 200px; background: #f5f5f5; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 20px; }

.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.info-item { display: flex; flex-direction: column; gap: 4px; }
.label { font-size: 12px; color: #999; text-transform: uppercase; }
.value { font-size: 15px; color: #333; }

.badge-active { color: #2e7d32; font-weight: 500; }
.badge-inactive { color: #c62828; font-weight: 500; }

.form-card { background: white; border: 1px solid #eee; border-radius: 16px; padding: 24px; }
.form-card h2 { margin-bottom: 20px; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: white; padding: 32px; border-radius: 16px; width: 400px; max-width: 90%; }
.modal h2 { margin-bottom: 12px; }
.modal p { color: #666; margin-bottom: 20px; }
.modal-buttons { display: flex; gap: 12px; margin-top: 20px; }

.input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 15px; box-sizing: border-box; margin-bottom: 8px; }
.btn-green { padding: 10px 20px; background: #42b883; color: white; border: none; border-radius: 8px; cursor: pointer; }
.btn-blue { padding: 8px 16px; background: #1976d2; color: white; border: none; border-radius: 8px; cursor: pointer; }
.btn-red { padding: 8px 16px; background: #e53935; color: white; border: none; border-radius: 8px; cursor: pointer; }
.btn-gray { padding: 8px 16px; background: #9e9e9e; color: white; border: none; border-radius: 8px; cursor: pointer; }

.success-msg { color: #2e7d32; margin-top: 12px; }
.error-msg { color: #c62828; margin-top: 12px; }
</style>