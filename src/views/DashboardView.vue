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
                    <span>{{ $t('nav.logout') }}</span>
                </button>
            </div>
        </nav>

        <div class="container">
            <!-- Welcome bar -->
            <div class="welcome-bar">
                <div class="welcome-left">
                    <div class="avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <h2 class="welcome-title">{{ $t('dashboard.welcome', { name: auth.user?.name?.split(' ')[0] }) }}</h2>
                        <p class="welcome-sub">{{ $t('dashboard.welcomeSub') }}</p>
                    </div>
                </div>
                <div class="role-badge">
                    <i class="fas fa-store"></i>
                    {{ $t('dashboard.ownerBadge') }}
                </div>
            </div>

            <!-- Inactive warning -->
            <div v-if="!auth.isActive" class="alert-card">
                <div class="alert-left">
                    <div class="alert-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div>
                        <h3 class="alert-title">Restorningiz hali aktiv emas</h3>
                        <p class="alert-sub">Admin tasdiqlashini kuting yoki ariza yuboring</p>
                    </div>
                </div>
                <button @click="showArijaForm = true" class="ariza-btn">
                    <i class="fas fa-paper-plane"></i>
                    Ariza yuborish
                </button>
            </div>

            <!-- Stats -->
            <div class="stats-grid" v-if="restaurant">
                <div class="stat-card green">
                    <div class="stat-icon-wrap">
                        <i class="fas fa-store"></i>
                    </div>
                    <div>
                        <p class="stat-label">Restoran holati</p>
                        <p class="stat-value">{{ restaurant.is_active ? 'Aktiv' : 'Inaktiv' }}</p>
                    </div>
                </div>
                <div class="stat-card blue">
                    <div class="stat-icon-wrap">
                        <i class="fas fa-phone-alt"></i>
                    </div>
                    <div>
                        <p class="stat-label">Telefon</p>
                        <p class="stat-value">{{ restaurant.phone || '—' }}</p>
                    </div>
                </div>
                <div class="stat-card orange">
                    <div class="stat-icon-wrap">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                        <p class="stat-label">Manzil</p>
                        <p class="stat-value">{{ restaurant.location?.address || '—' }}</p>
                    </div>
                </div>
            </div>

            <!-- No restaurant -->
            <div v-if="!restaurant && !showAddForm" class="empty-card">
                <div class="empty-illustration">
                    <i class="fas fa-store-slash"></i>
                </div>
                <h3>Hali restoran qo'shilmagan</h3>
                <p>Restoran qo'shib, minglab mijozlarga o'zingizni tanituring!</p>
                <button @click="showAddForm = true" class="btn-primary">
                    <i class="fas fa-plus"></i>
                    Restoran qo'shish
                </button>
            </div>

            <!-- Add form -->
            <div v-if="showAddForm" class="form-card">
                <div class="form-card-header">
                    <h2><i class="fas fa-plus-circle"></i> Yangi restoran qo'shish</h2>
                    <button @click="showAddForm = false" class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <RestaurantForm
                    :loading="formLoading"
                    :error="formError"
                    @submit="createRestaurant"
                    @cancel="showAddForm = false"
                />
            </div>

            <!-- Restaurant card -->
            <div v-if="restaurant && !showEditForm" class="restaurant-card">
                <div class="restaurant-card-header">
                    <h2><i class="fas fa-store"></i> Mening restoranim</h2>
                    <div class="action-btns">
                        <button @click="startEdit" class="btn-edit">
                            <i class="fas fa-edit"></i> Tahrirlash
                        </button>
                        <button @click="showDeleteConfirm = true" class="btn-delete">
                            <i class="fas fa-trash-alt"></i> O'chirish
                        </button>
                    </div>
                </div>

                <div class="restaurant-body">
                    <div class="restaurant-img-wrap">
                        <img
                            v-if="displayImageUrl && !imageLoadFailed"
                            :src="displayImageUrl"
                            @error="imageLoadFailed = true"
  class="restaurant-img"
  alt="Restoran rasmi"
                        />
                        <div v-else class="restaurant-no-img">
                            <i class="fas fa-camera"></i>
                            <span>Rasm yo'q</span>
                        </div>
                        <div class="img-status" :class="restaurant.is_active ? 'active' : 'inactive'">
                            <i class="fas fa-circle"></i>
                            {{ restaurant.is_active ? 'Aktiv' : 'Inaktiv' }}
                        </div>
                    </div>

                    <div class="restaurant-details">
                        <div class="detail-item">
                            <span class="detail-label">
                                <i class="fas fa-utensils"></i> Nomi
                            </span>
                            <span class="detail-value">{{ restaurant.name }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">
                                <i class="fas fa-phone-alt"></i> Telefon
                            </span>
                            <span class="detail-value">{{ restaurant.phone || '—' }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">
                                <i class="fas fa-align-left"></i> Tavsif
                            </span>
                            <span class="detail-value desc">{{ restaurant.description || '—' }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">
                                <i class="fas fa-map-marker-alt"></i> Manzil
                            </span>
                            <span class="detail-value">{{ restaurant.location?.address || '—' }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">
                                <i class="fas fa-globe"></i> Koordinatalar
                            </span>
                            <span class="detail-value coords" v-if="restaurant.location">
                                {{ restaurant.location.latitude }}, {{ restaurant.location.longitude }}
                            </span>
                            <span class="detail-value" v-else>—</span>
                        </div>
                    </div>
                </div>

                <div class="restaurant-card-footer">
                    <router-link :to="`/restaurant/${restaurant.id}`" class="view-link">
                        <i class="fas fa-eye"></i>
                        Saytda qanday ko'rinishini ko'rish
                    </router-link>
                </div>
            </div>

            <!-- Edit form -->
            <div v-if="showEditForm" class="form-card">
                <div class="form-card-header">
                    <h2><i class="fas fa-edit"></i> Restoran tahrirlash</h2>
                    <button @click="showEditForm = false" class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <RestaurantForm
                    :initial="editData"
                    :loading="formLoading"
                    :error="formError"
                    @submit="updateRestaurant"
                    @cancel="showEditForm = false"
                />
            </div>
        </div>

        <!-- Arija Modal -->
        <div v-if="showArijaForm" class="modal-overlay" @click.self="showArijaForm = false">
            <div class="modal">
                <div class="modal-header">
                    <div class="modal-icon">
                        <i class="fas fa-paper-plane"></i>
                    </div>
                    <button @click="showArijaForm = false" class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <h3 class="modal-title">Aktivlashtirish uchun ariza</h3>
                <p class="modal-sub">Telefon raqamingizni kiriting, admin siz bilan bog'lanadi</p>
                <div class="modal-input-wrap">
                    <i class="fas fa-phone-alt modal-input-icon"></i>
                    <input v-model="arijaPhone" placeholder="+998 90 123 45 67" class="modal-input" />
                </div>
                <div class="modal-btns">
                    <button @click="sendArija" class="btn-primary" :disabled="arijaLoading">
                        <i class="fas fa-paper-plane"></i>
                        {{ arijaLoading ? 'Yuborilmoqda...' : 'Yuborish' }}
                    </button>
                    <button @click="showArijaForm = false" class="btn-ghost">Bekor</button>
                </div>
                <div v-if="arijaSuccess" class="alert-success">
                    <i class="fas fa-check-circle"></i>
                    Ariza muvaffaqiyatli yuborildi! Admin tez orada bog'lanadi.
                </div>
                <div v-if="arijaError" class="alert-error">
                    <i class="fas fa-times-circle"></i>
                    {{ arijaError }}
                </div>
            </div>
        </div>

        <!-- Delete confirm modal -->
        <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
            <div class="modal">
                <div class="modal-header">
                    <div class="modal-icon danger">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <button @click="showDeleteConfirm = false" class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <h3 class="modal-title">O'chirishni tasdiqlang</h3>
                <p class="modal-sub">Restoran ma'lumotlari butunlay o'chib ketadi. Bu amalni qaytarib bo'lmaydi!</p>
                <div class="modal-btns">
                    <button @click="deleteRestaurant" class="btn-danger">
                        <i class="fas fa-trash-alt"></i>
                        Ha, o'chirish
                    </button>
                    <button @click="showDeleteConfirm = false" class="btn-ghost">Bekor</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../axios'
import RestaurantForm from '../components/RestaurantForm.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import { resolveImageUrl } from '../utils/imageUrl'

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
const arijaLoading = ref(false)
const editData = ref({})
const imageLoadFailed = ref(false)

const displayImageUrl = computed(() => resolveImageUrl(restaurant.value?.image_path))

watch(() => restaurant.value?.image_path, () => {
    imageLoadFailed.value = false
})

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
        const res = await api.post('/my-restaurant', buildFormData(form))
        restaurant.value = res.data
        showAddForm.value = false
        imageLoadFailed.value = false
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
        cuisine_type: restaurant.value.cuisine_type,
        country: restaurant.value.country,
        city: restaurant.value.city,
        price_range: restaurant.value.price_range,
        website: restaurant.value.website,
        instagram: restaurant.value.instagram,
        image_path: restaurant.value.image_path,
    }
    showEditForm.value = true
}

const updateRestaurant = async (form) => {
    formLoading.value = true
    formError.value = ''
    try {
        const res = await api.post('/my-restaurant/update', buildFormData(form))
        restaurant.value = res.data
        showEditForm.value = false
        imageLoadFailed.value = false
    } catch (e) {
        const errors = e.response?.data?.errors
        formError.value = e.response?.data?.message
            || (errors ? Object.values(errors).flat().join(' ') : 'Xato yuz berdi.')
    } finally {
        formLoading.value = false
    }
}

const deleteRestaurant = async () => {
    try {
        await api.delete('/my-restaurant')
        restaurant.value = null
        showDeleteConfirm.value = false
    } catch {}
}

const sendArija = async () => {
    arijaLoading.value = true
    arijaSuccess.value = false
    arijaError.value = ''
    try {
        await api.post('/send-arija', { phone: arijaPhone.value })
        arijaSuccess.value = true
        arijaPhone.value = ''
    } catch {
        arijaError.value = 'Xato yuz berdi. Qayta urinib ko\'ring.'
    } finally {
        arijaLoading.value = false
    }
}

const buildFormData = (form) => {
    const data = new FormData()
    data.append('name', form.name || '')
    data.append('phone', form.phone || '')
    data.append('description', form.description || '')
    data.append('address', form.address || '')
    data.append('latitude', form.latitude ?? '')
    data.append('longitude', form.longitude ?? '')
    if (form.cuisine_type) data.append('cuisine_type', form.cuisine_type)
    if (form.country) data.append('country', form.country)
    if (form.city) data.append('city', form.city)
    if (form.price_range) data.append('price_range', form.price_range)
    if (form.website) data.append('website', form.website)
    if (form.instagram) data.append('instagram', form.instagram)
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
    text-decoration: none; font-size: 14px;
    transition: all 0.2s;
}
.nav-link:hover { background: #E1F5EE; color: #1D9E75; }
.logout-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 10px;
    background: #FCEBEB; color: #A32D2D;
    border: none; cursor: pointer; font-size: 14px;
    transition: all 0.2s;
}
.logout-btn:hover { background: #F7C1C1; }

/* CONTAINER */
.container { max-width: 960px; margin: 0 auto; padding: 28px 24px; display: flex; flex-direction: column; gap: 20px; }

/* WELCOME */
.welcome-bar {
    display: flex; justify-content: space-between; align-items: center;
    background: linear-gradient(135deg, #0F6E56, #1D9E75);
    border-radius: 16px; padding: 20px 24px;
    color: white;
}
.welcome-left { display: flex; align-items: center; gap: 14px; }
.avatar {
    width: 48px; height: 48px;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
}
.welcome-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
.welcome-sub { font-size: 13px; opacity: 0.8; }
.role-badge {
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.2);
    padding: 8px 16px; border-radius: 20px;
    font-size: 13px; font-weight: 500;
}

/* ALERT */
.alert-card {
    display: flex; justify-content: space-between; align-items: center;
    background: #FAEEDA; border: 1px solid #FAC775;
    border-radius: 14px; padding: 16px 20px; gap: 12px;
}
.alert-left { display: flex; align-items: center; gap: 14px; }
.alert-icon {
    width: 40px; height: 40px;
    background: #EF9F27; color: white;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
}
.alert-title { font-size: 14px; font-weight: 600; color: #633806; margin-bottom: 2px; }
.alert-sub { font-size: 12px; color: #854F0B; }
.ariza-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 10px 18px; background: #EF9F27;
    color: white; border: none; border-radius: 10px;
    cursor: pointer; font-size: 13px; font-weight: 500;
    white-space: nowrap; transition: background 0.2s;
}
.ariza-btn:hover { background: #D4891A; }

/* STATS */
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.stat-card {
    background: white; border-radius: 14px; padding: 16px 20px;
    display: flex; align-items: center; gap: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border-left: 4px solid;
}
.stat-card.green { border-color: #1D9E75; }
.stat-card.blue { border-color: #378ADD; }
.stat-card.orange { border-color: #EF9F27; }
.stat-icon-wrap {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
}
.stat-card.green .stat-icon-wrap { background: #E1F5EE; color: #1D9E75; }
.stat-card.blue .stat-icon-wrap { background: #E6F1FB; color: #378ADD; }
.stat-card.orange .stat-icon-wrap { background: #FAEEDA; color: #EF9F27; }
.stat-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; }
.stat-value { font-size: 14px; font-weight: 600; color: #1a1a1a; }

/* EMPTY */
.empty-card {
    background: white; border-radius: 20px; padding: 60px 24px;
    text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.empty-illustration { font-size: 64px; color: #ddd; margin-bottom: 20px; }
.empty-card h3 { font-size: 20px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
.empty-card p { font-size: 14px; color: #888; margin-bottom: 24px; }

/* FORM CARD */
.form-card {
    background: white; border-radius: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden;
}
.form-card-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 24px; border-bottom: 1px solid #f0f0f0;
}
.form-card-header h2 {
    font-size: 16px; font-weight: 700; color: #1a1a1a;
    display: flex; align-items: center; gap: 8px;
}
.form-card-header h2 i { color: #1D9E75; }
.close-btn {
    width: 32px; height: 32px; border-radius: 8px;
    background: #f0f0f0; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #666; transition: all 0.2s;
}
.close-btn:hover { background: #FCEBEB; color: #A32D2D; }

/* RESTAURANT CARD */
.restaurant-card {
    background: white; border-radius: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden;
}
.restaurant-card-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 24px; border-bottom: 1px solid #f0f0f0;
}
.restaurant-card-header h2 {
    font-size: 16px; font-weight: 700; color: #1a1a1a;
    display: flex; align-items: center; gap: 8px;
}
.restaurant-card-header h2 i { color: #1D9E75; }
.action-btns { display: flex; gap: 8px; }
.btn-edit {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; background: #E6F1FB;
    color: #185FA5; border: none; border-radius: 10px;
    cursor: pointer; font-size: 13px; font-weight: 500;
    transition: all 0.2s;
}
.btn-edit:hover { background: #B5D4F4; }
.btn-delete {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; background: #FCEBEB;
    color: #A32D2D; border: none; border-radius: 10px;
    cursor: pointer; font-size: 13px; font-weight: 500;
    transition: all 0.2s;
}
.btn-delete:hover { background: #F7C1C1; }

.restaurant-body {
    display: grid; grid-template-columns: 260px 1fr;
    gap: 24px; padding: 24px;
}
.restaurant-img-wrap { position: relative; }
.restaurant-img {
    width: 100%; height: 200px; object-fit: cover;
    border-radius: 14px;
}
.restaurant-no-img {
    width: 100%; height: 200px;
    background: linear-gradient(135deg, #f0f0f0, #e8e8e8);
    border-radius: 14px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 8px; color: #bbb; font-size: 13px;
}
.restaurant-no-img i { font-size: 36px; }
.img-status {
    position: absolute; top: 10px; left: 10px;
    display: flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 20px;
    font-size: 12px; font-weight: 500;
}
.img-status.active { background: #1D9E75; color: white; }
.img-status.inactive { background: #E24B4A; color: white; }
.img-status .fa-circle { font-size: 7px; }

.restaurant-details { display: flex; flex-direction: column; gap: 0; }
.detail-item {
    display: flex; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid #f5f5f5;
}
.detail-item:last-child { border-bottom: none; }
.detail-label {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: #999; min-width: 100px;
    text-transform: uppercase; letter-spacing: 0.04em;
}
.detail-label i { color: #1D9E75; font-size: 11px; }
.detail-value { font-size: 14px; color: #1a1a1a; font-weight: 500; }
.detail-value.desc { font-weight: 400; color: #555; line-height: 1.5; }
.detail-value.coords { font-family: monospace; font-size: 12px; color: #777; }

.restaurant-card-footer {
    padding: 14px 24px; border-top: 1px solid #f0f0f0;
    background: #f9f9f9;
}
.view-link {
    display: inline-flex; align-items: center; gap: 6px;
    color: #1D9E75; text-decoration: none; font-size: 13px; font-weight: 500;
    transition: gap 0.2s;
}
.view-link:hover { gap: 10px; }

/* BUTTONS */
.btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px; background: #1D9E75;
    color: white; border: none; border-radius: 12px;
    cursor: pointer; font-size: 14px; font-weight: 600;
    transition: background 0.2s;
}
.btn-primary:hover { background: #0F6E56; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-danger {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px; background: #E24B4A;
    color: white; border: none; border-radius: 12px;
    cursor: pointer; font-size: 14px; font-weight: 600;
    transition: background 0.2s;
}
.btn-danger:hover { background: #C23B3A; }
.btn-ghost {
    padding: 12px 24px; background: #f4f5f7;
    color: #555; border: none; border-radius: 12px;
    cursor: pointer; font-size: 14px;
    transition: background 0.2s;
}
.btn-ghost:hover { background: #e8e8e8; }

/* MODAL */
.modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 20px;
}
.modal {
    background: white; border-radius: 20px;
    padding: 28px; width: 100%; max-width: 400px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-header {
    display: flex; justify-content: space-between;
    align-items: flex-start; margin-bottom: 16px;
}
.modal-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: #E1F5EE; color: #1D9E75;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
}
.modal-icon.danger { background: #FCEBEB; color: #E24B4A; }
.modal-close {
    width: 32px; height: 32px; border-radius: 8px;
    background: #f0f0f0; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; color: #666;
}
.modal-title { font-size: 18px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
.modal-sub { font-size: 13px; color: #888; margin-bottom: 20px; line-height: 1.5; }
.modal-input-wrap {
    position: relative; margin-bottom: 16px;
}
.modal-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: #aaa; font-size: 14px;
}
.modal-input {
    width: 100%; padding: 12px 12px 12px 40px;
    border: 1.5px solid #e8e8e8; border-radius: 10px;
    font-size: 15px; outline: none; transition: border 0.2s;
    box-sizing: border-box;
}
.modal-input:focus { border-color: #1D9E75; }
.modal-btns { display: flex; gap: 10px; }
.modal-btns .btn-primary { flex: 1; justify-content: center; }

.alert-success {
    display: flex; align-items: center; gap: 8px;
    background: #E1F5EE; color: #0F6E56;
    padding: 12px 14px; border-radius: 10px;
    font-size: 13px; margin-top: 14px;
}
.alert-error {
    display: flex; align-items: center; gap: 8px;
    background: #FCEBEB; color: #A32D2D;
    padding: 12px 14px; border-radius: 10px;
    font-size: 13px; margin-top: 14px;
}

/* MOBILE */
@media (max-width: 768px) {
    .navbar { padding: 0 16px; }
    .container { padding: 16px 12px; }
    .welcome-bar { flex-direction: column; align-items: flex-start; gap: 12px; }
    .stats-grid { grid-template-columns: 1fr; }
    .restaurant-body { grid-template-columns: 1fr; }
    .alert-card { flex-direction: column; align-items: flex-start; }
    .nav-link span, .logout-btn span { display: none; }
}
</style>