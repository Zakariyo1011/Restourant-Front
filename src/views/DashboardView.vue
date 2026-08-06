<template>
    <div class="page">
        <div class="container">
            <!-- Welcome bar -->
            <div class="welcome-bar">
                <div class="welcome-left">
                    <div class="avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                            <h2><i class="fas fa-store"></i> {{ $t('dashboard.myRestaurant') }}</h2>
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
                            <h3 class="alert-title">{{ $t('dashboard.inactiveTitle') }}</h3>
                            <p class="alert-sub">{{ $t('dashboard.inactiveSub') }}</p>
                    </div>
                </div>
                <button @click="showArijaForm = true" class="ariza-btn">
                    <i class="fas fa-paper-plane"></i>
                        {{ $t('dashboard.sendApp') }}
                </button>
            </div>

            <!-- Stats -->
            <div class="stats-grid" v-if="restaurant">
                <div class="stat-card green">
                    <div class="stat-icon-wrap">
                        <i class="fas fa-store"></i>
                    </div>
                    <div>
                        <p class="stat-label">{{ $t('dashboard.status') }}</p>
                        <p class="stat-value">{{ restaurant.is_active ? $t('dashboard.active') : $t('dashboard.inactive') }}</p>
                    </div>
                </div>
                <div class="stat-card blue">
                    <div class="stat-icon-wrap">
                        <i class="fas fa-phone-alt"></i>
                    </div>
                    <div>
                        <p class="stat-label">{{ $t('dashboard.phone') }}</p>
                        <p class="stat-value">{{ restaurant.phone || '—' }}</p>
                    </div>
                </div>
                <div class="stat-card orange">
                    <div class="stat-icon-wrap">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                        <p class="stat-label">{{ $t('dashboard.address') }}</p>
                        <p class="stat-value">{{ restaurant.location?.address || '—' }}</p>
                    </div>
                </div>
            </div>

            <!-- No restaurant -->
            <div v-if="!restaurant && !showAddForm" class="empty-card">
                <div class="empty-illustration">
                    <i class="fas fa-store-slash"></i>
                </div>
                    <h3>{{ $t('dashboard.noRestaurant') }}</h3>
                    <p>{{ $t('dashboard.noRestaurantSub') }}</p>
                <button @click="showAddForm = true" class="btn-primary">
                    <i class="fas fa-plus"></i>
                        {{ $t('dashboard.addRestaurant') }}
                </button>
            </div>

            <!-- Add form -->
            <div v-if="showAddForm" class="form-card">
                <div class="form-card-header">
                    <h2><i class="fas fa-plus-circle"></i> {{ $t('dashboard.addTitle') }}</h2>
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
                    <h2><i class="fas fa-store"></i> {{ $t('dashboard.myRestaurant') }}</h2>
                    <div class="action-btns">
                        <button @click="startEdit" class="btn-edit">
                            <i class="fas fa-edit"></i> {{ $t('dashboard.edit') }}
                        </button>
                        <button @click="showDeleteConfirm = true" class="btn-delete">
                            <i class="fas fa-trash-alt"></i> {{ $t('dashboard.delete') }}
                        </button>
                    </div>
                </div>

                <div class="restaurant-body">
                    <div class="restaurant-img-wrap">
                                                <img
                                                        v-if="firstImage && !imageLoadFailed"
                                                        :src="firstImage"
                                                        @error="imageLoadFailed = true"
    class="restaurant-img"
        :alt="$t('dashboard.imageAlt')"
                                                />
                                                <div v-if="galleryImages.length > 1" class="gallery-thumbs">
                                                    <div v-for="(img, idx) in galleryImages" :key="img.id || idx" class="thumb-wrap">
                                                        <img :src="resolveImageUrl(img.url || img)" class="thumb" />
                                                        <button
                                                            class="thumb-delete"
                                                            :disabled="deletingImageId === (img.id || idx)"
                                                            @click.prevent="deleteImage(img)"
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                </div>
                        <div v-else class="restaurant-no-img">
                            <i class="fas fa-camera"></i>
                            <span>{{ $t('dashboard.noImage') }}</span>
                        </div>
                        <div class="img-status" :class="restaurant.is_active ? 'active' : 'inactive'">
                            <i class="fas fa-circle"></i>
                            {{ restaurant.is_active ? $t('dashboard.active') : $t('dashboard.inactive') }}
                        </div>
                    </div>

                    <div class="restaurant-details">
                        <div class="detail-item">
                            <span class="detail-label">
                                <i class="fas fa-utensils"></i> {{ $t('dashboard.name') }}
                            </span>
                            <span class="detail-value">{{ restaurant.name }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">
                                <i class="fas fa-phone-alt"></i> {{ $t('dashboard.phone') }}
                            </span>
                            <span class="detail-value">{{ restaurant.phone || '—' }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">
                                    <i class="fas fa-align-left"></i> {{ $t('dashboard.description') }}
                            </span>
                                    <span class="detail-value desc">{{ restaurant.description || '—' }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">
                                <i class="fas fa-map-marker-alt"></i> {{ $t('dashboard.address') }}
                            </span>
                            <span class="detail-value">{{ restaurant.location?.address || '—' }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">
                                <i class="fas fa-globe"></i> {{ $t('dashboard.coordinates') }}
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
                        {{ $t('dashboard.viewOnSite') }}
                    </router-link>
                </div>
            </div>

            <!-- Edit form -->
            <div v-if="showEditForm" class="form-card">
                <div class="form-card-header">
                    <h2><i class="fas fa-edit"></i> {{ $t('dashboard.editTitle') }}</h2>
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
                <h3 class="modal-title">{{ $t('dashboard.appTitle') }}</h3>
                <p class="modal-sub">{{ $t('dashboard.appSub') }}</p>
                <div class="modal-input-wrap">
                    <i class="fas fa-phone-alt modal-input-icon"></i>
                    <input v-model="arijaPhone" :placeholder="$t('dashboard.phone')" class="modal-input" />
                </div>
                <div class="modal-btns">
                    <button @click="sendArija" class="btn-primary" :disabled="arijaLoading">
                        <i class="fas fa-paper-plane"></i>
                        {{ arijaLoading ? $t('dashboard.appSending') : $t('dashboard.appSend') }}
                    </button>
                    <button @click="showArijaForm = false" class="btn-ghost">{{ $t('dashboard.cancel') }}</button>
                </div>
                <div v-if="arijaSuccess" class="alert-success">
                    <i class="fas fa-check-circle"></i>
                    {{ $t('dashboard.appSuccess') }}
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
                <h3 class="modal-title">{{ $t('dashboard.deleteConfirm') }}</h3>
                <p class="modal-sub">{{ $t('dashboard.deleteWarn') }}</p>
                <div class="modal-btns">
                    <button @click="deleteRestaurant" class="btn-danger">
                        <i class="fas fa-trash-alt"></i>
                        {{ $t('dashboard.deleteYes') }}
                    </button>
                    <button @click="showDeleteConfirm = false" class="btn-ghost">{{ $t('dashboard.cancel') }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../axios'
import RestaurantForm from '../components/RestaurantForm.vue'
import { resolveImageUrl } from '../utils/imageUrl'

const auth = useAuthStore()
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

const galleryImages = computed(() => {
    if (!restaurant.value) return []
    // backend may provide `images` array or `image_paths` or single `image_path`
    if (Array.isArray(restaurant.value.images) && restaurant.value.images.length) {
        return restaurant.value.images.map(image => typeof image === 'string' ? { url: image, id: image } : image)
    }
    if (Array.isArray(restaurant.value.image_paths) && restaurant.value.image_paths.length) {
        return restaurant.value.image_paths.map(url => ({ url, id: url }))
    }
    if (restaurant.value.image_path) return [restaurant.value.image_path]
    return []
})

const firstImage = computed(() => galleryImages.value.length ? resolveImageUrl(galleryImages.value[0].url || galleryImages.value[0]) : null)

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
    } catch (e) {
        console.error('Failed to load restaurant:', e.response?.data || e.message || e)
        restaurant.value = null
    }
}

const deletingImageId = ref(null)

const deleteImage = async (image) => {
    if (!image?.id) return
    deletingImageId.value = image.id
    try {
        await api.delete(`/my-restaurant/images/${image.id}`)
        restaurant.value.images = (restaurant.value.images || []).filter(img => img.id !== image.id)
    } catch (e) {
        console.error('Image delete failed', e)
    } finally {
        deletingImageId.value = null
    }
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
        if (e.response?.status === 409) {
            await loadRestaurant()
        }
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
    // support multiple images from the form: `images` array or legacy single `image`
    if (form.images && Array.isArray(form.images) && form.images.length) {
        form.images.forEach((f) => data.append('images[]', f))
    } else if (form.image) {
        data.append('image', form.image)
    }
    return data
}

</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }
.page { min-height: 100vh; background: var(--color-bg); font-family: var(--font-sans); }

/* NAVBAR */
.navbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 32px; height: 64px;
    background: var(--color-surface); box-shadow: 0 1px 0 var(--color-border);
    position: sticky; top: 0; z-index: 100;
}
.nav-brand { display: flex; align-items: center; gap: 10px; }
.brand-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 16px;
}
.brand-name { font-size: 18px; font-weight: 700; color: var(--color-text); }
.brand-accent { color: var(--color-primary); }
.nav-right { display: flex; align-items: center; gap: 10px; }
.nav-link {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 10px;
    background: var(--color-bg); color: var(--color-text-muted);
    text-decoration: none; font-size: 14px;
    transition: all 0.2s;
}
.nav-link:hover { background: var(--color-primary-tint); color: var(--color-primary); }
.logout-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 10px;
    background: var(--color-danger-tint); color: var(--color-danger-dark);
    border: none; cursor: pointer; font-size: 14px;
    transition: all 0.2s;
}
.logout-btn:hover { background: var(--color-danger-tint); }

/* CONTAINER */
.container { max-width: 960px; margin: 0 auto; padding: 28px 24px; display: flex; flex-direction: column; gap: 20px; }

/* WELCOME */
.welcome-bar {
    display: flex; justify-content: space-between; align-items: center;
    background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
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
    background: var(--color-warning-tint); border: 1px solid var(--color-warning);
    border-radius: 14px; padding: 16px 20px; gap: 12px;
}
.alert-left { display: flex; align-items: center; gap: 14px; }
.alert-icon {
    width: 40px; height: 40px;
    background: var(--color-warning); color: white;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
}
.alert-title { font-size: 14px; font-weight: 600; color: var(--color-warning-dark); margin-bottom: 2px; }
.alert-sub { font-size: 12px; color: var(--color-warning-dark); }
.ariza-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 10px 18px; background: var(--color-warning);
    color: white; border: none; border-radius: 10px;
    cursor: pointer; font-size: 13px; font-weight: 500;
    white-space: nowrap; transition: background 0.2s;
}
.ariza-btn:hover { background: var(--color-warning); }

/* STATS */
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.stat-card {
    background: var(--color-surface); border-radius: 14px; padding: 16px 20px;
    display: flex; align-items: center; gap: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border-left: 4px solid;
}
.stat-card.green { border-color: var(--color-primary); }
.stat-card.blue { border-color: var(--color-info); }
.stat-card.orange { border-color: var(--color-warning); }
.stat-icon-wrap {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
}
.stat-card.green .stat-icon-wrap { background: var(--color-primary-tint); color: var(--color-primary); }
.stat-card.blue .stat-icon-wrap { background: var(--color-info-tint); color: var(--color-info); }
.stat-card.orange .stat-icon-wrap { background: var(--color-warning-tint); color: var(--color-warning); }
.stat-label { font-size: 11px; color: var(--color-text-faint); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; }
.stat-value { font-size: 14px; font-weight: 600; color: var(--color-text); }

/* EMPTY */
.empty-card {
    background: var(--color-surface); border-radius: 20px; padding: 60px 24px;
    text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.empty-illustration { font-size: 64px; color: var(--color-border); margin-bottom: 20px; }
.empty-card h3 { font-size: 20px; font-weight: 700; color: var(--color-text); margin-bottom: 8px; }
.empty-card p { font-size: 14px; color: var(--color-text-faint); margin-bottom: 24px; }

/* FORM CARD */
.form-card {
    background: var(--color-surface); border-radius: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden;
}
.form-card-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 24px; border-bottom: 1px solid var(--color-border-light);
}
.form-card-header h2 {
    font-size: 16px; font-weight: 700; color: var(--color-text);
    display: flex; align-items: center; gap: 8px;
}
.form-card-header h2 i { color: var(--color-primary); }
.close-btn {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--color-border-light); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--color-text-muted); transition: all 0.2s;
}
.close-btn:hover { background: var(--color-danger-tint); color: var(--color-danger-dark); }

/* RESTAURANT CARD */
.restaurant-card {
    background: var(--color-surface); border-radius: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden;
}
.restaurant-card-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 24px; border-bottom: 1px solid var(--color-border-light);
}
.restaurant-card-header h2 {
    font-size: 16px; font-weight: 700; color: var(--color-text);
    display: flex; align-items: center; gap: 8px;
}
.restaurant-card-header h2 i { color: var(--color-primary); }
.action-btns { display: flex; gap: 8px; }
.btn-edit {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; background: var(--color-info-tint);
    color: var(--color-info-dark); border: none; border-radius: 10px;
    cursor: pointer; font-size: 13px; font-weight: 500;
    transition: all 0.2s;
}
.btn-edit:hover { background: var(--color-info-tint); }
.btn-delete {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; background: var(--color-danger-tint);
    color: var(--color-danger-dark); border: none; border-radius: 10px;
    cursor: pointer; font-size: 13px; font-weight: 500;
    transition: all 0.2s;
}
.btn-delete:hover { background: var(--color-danger-tint); }

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
    background: linear-gradient(135deg, var(--color-border-light), var(--color-border));
    border-radius: 14px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 8px; color: var(--color-text-faint); font-size: 13px;
}
.restaurant-no-img i { font-size: 36px; }
.img-status {
    position: absolute; top: 10px; left: 10px;
    display: flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 20px;
    font-size: 12px; font-weight: 500;
}
.img-status.active { background: var(--color-primary); color: white; }
.img-status.inactive { background: var(--color-danger); color: white; }
.img-status .fa-circle { font-size: 7px; }

.gallery-thumbs { display: flex; gap: 8px; margin-top: 12px; }
.gallery-thumbs .thumb { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; }

.thumb-wrap { position: relative; }
.thumb-delete {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 26px;
    height: 26px;
    border: none;
    border-radius: 50%;
    background: rgba(0,0,0,0.55);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
}
.thumb-delete:hover { background: rgba(0,0,0,0.75); }
.thumb-delete:disabled { cursor: not-allowed; opacity: 0.6; }

.restaurant-details { display: flex; flex-direction: column; gap: 0; }
.detail-item {
    display: flex; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid var(--color-border-light);
}
.detail-item:last-child { border-bottom: none; }
.detail-label {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: var(--color-text-faint); min-width: 100px;
    text-transform: uppercase; letter-spacing: 0.04em;
}
.detail-label i { color: var(--color-primary); font-size: 11px; }
.detail-value { font-size: 14px; color: var(--color-text); font-weight: 500; }
.detail-value.desc { font-weight: 400; color: var(--color-text-muted); line-height: 1.5; }
.detail-value.coords { font-family: monospace; font-size: 12px; color: var(--color-text-faint); }

.restaurant-card-footer {
    padding: 14px 24px; border-top: 1px solid var(--color-border-light);
    background: var(--color-bg);
}
.view-link {
    display: inline-flex; align-items: center; gap: 6px;
    color: var(--color-primary); text-decoration: none; font-size: 13px; font-weight: 500;
    transition: gap 0.2s;
}
.view-link:hover { gap: 10px; }

/* BUTTONS */
.btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px; background: var(--color-primary);
    color: white; border: none; border-radius: 12px;
    cursor: pointer; font-size: 14px; font-weight: 600;
    transition: background 0.2s;
}
.btn-primary:hover { background: var(--color-primary-dark); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-danger {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px; background: var(--color-danger);
    color: white; border: none; border-radius: 12px;
    cursor: pointer; font-size: 14px; font-weight: 600;
    transition: background 0.2s;
}
.btn-danger:hover { background: var(--color-danger-dark); }
.btn-ghost {
    padding: 12px 24px; background: var(--color-bg);
    color: var(--color-text-muted); border: none; border-radius: 12px;
    cursor: pointer; font-size: 14px;
    transition: background 0.2s;
}
.btn-ghost:hover { background: var(--color-border); }

/* MODAL */
.modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 20px;
}
.modal {
    background: var(--color-surface); border-radius: 20px;
    padding: 28px; width: 100%; max-width: 400px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-header {
    display: flex; justify-content: space-between;
    align-items: flex-start; margin-bottom: 16px;
}
.modal-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: var(--color-primary-tint); color: var(--color-primary);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
}
.modal-icon.danger { background: var(--color-danger-tint); color: var(--color-danger); }
.modal-close {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--color-border-light); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);
}
.modal-title { font-size: 18px; font-weight: 700; color: var(--color-text); margin-bottom: 8px; }
.modal-sub { font-size: 13px; color: var(--color-text-faint); margin-bottom: 20px; line-height: 1.5; }
.modal-input-wrap {
    position: relative; margin-bottom: 16px;
}
.modal-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--color-text-faint); font-size: 14px;
}
.modal-input {
    width: 100%; padding: 12px 12px 12px 40px;
    border: 1.5px solid var(--color-border); border-radius: 10px;
    font-size: 15px; outline: none; transition: border 0.2s;
    box-sizing: border-box;
}
.modal-input:focus { border-color: var(--color-primary); }
.modal-btns { display: flex; gap: 10px; }
.modal-btns .btn-primary { flex: 1; justify-content: center; }

.alert-success {
    display: flex; align-items: center; gap: 8px;
    background: var(--color-primary-tint); color: var(--color-primary-dark);
    padding: 12px 14px; border-radius: 10px;
    font-size: 13px; margin-top: 14px;
}
.alert-error {
    display: flex; align-items: center; gap: 8px;
    background: var(--color-danger-tint); color: var(--color-danger-dark);
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