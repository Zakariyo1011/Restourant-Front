<template>
    <div class="dashboard">
        <header class="header">
            <h1>Dashboard</h1>
            <button @click="logout" class="logout-btn">Chiqish</button>
        </header>

        <div v-if="!auth.isActive" class="inactive-warning">
            ⚠️ Restorningiz hali aktiv emas. Admin tasdiqlashini kuting.
        </div>

        <div class="content">
            <h2>Mening restoranim</h2>
            <div v-if="restaurant">
                <p><strong>Nomi:</strong> {{ restaurant.name }}</p>
                <p><strong>Telefon:</strong> {{ restaurant.phone }}</p>
                <p><strong>Holat:</strong> {{ restaurant.is_active ? '✅ Aktiv' : '❌ Inaktiv' }}</p>
            </div>
            <div v-else>
                <p>Hali restoran qo'shilmagan</p>
                <button @click="showForm = !showForm" class="btn">+ Restoran qo'shish</button>
            </div>

            <!-- Restoran qo'shish formasi -->
            <div v-if="showForm" class="form-box">
                <h3>Yangi restoran</h3>
                <input v-model="form.name" placeholder="Restoran nomi" class="input" />
                <input v-model="form.phone" placeholder="Telefon raqam" class="input" />
                <textarea v-model="form.description" placeholder="Tavsif" class="input"></textarea>
                <input v-model="form.address" placeholder="Manzil" class="input" />
                <input v-model="form.latitude" placeholder="Latitude (masalan: 41.2995)" class="input" />
                <input v-model="form.longitude" placeholder="Longitude (masalan: 69.2401)" class="input" />
                <input type="file" @change="onFileChange" class="input" />
                <button @click="submitForm" class="btn">Saqlash</button>
                <p v-if="formError" class="error">{{ formError }}</p>
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

const auth = useAuthStore()
const router = useRouter()
const restaurant = ref(null)
const showForm = ref(false)
const formError = ref('')

const form = ref({
    name: '',
    phone: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    image: null,
})

onMounted(async () => {
    try {
        const res = await api.get('/my-restaurant')
        restaurant.value = res.data
    } catch {}
})

const onFileChange = (e) => {
    form.value.image = e.target.files[0]
}

const submitForm = async () => {
    formError.value = ''
    try {
        const data = new FormData()
        data.append('name', form.value.name)
        data.append('phone', form.value.phone)
        data.append('description', form.value.description)
        data.append('address', form.value.address)
        data.append('latitude', form.value.latitude)
        data.append('longitude', form.value.longitude)
        if (form.value.image) {
            data.append('image', form.value.image)
        }

        const token = localStorage.getItem('token')
        const res = await axios.post('http://localhost:8000/api/my-restaurant', data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        })
        restaurant.value = res.data
        showForm.value = false
    } catch (e) {
        console.error(e.response?.data)
        formError.value = JSON.stringify(e.response?.data?.message || 'Xato yuz berdi.')
    }
}

const logout = async () => {
    try {
        await api.post('/logout')
    } catch {}
    auth.logout()
    router.push('/')
}
</script>

<style scoped>
.dashboard { max-width: 900px; margin: 0 auto; padding: 24px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.logout-btn { padding: 8px 16px; background: #ff4444; color: white; border: none; border-radius: 8px; cursor: pointer; }
.inactive-warning { background: #fff3cd; border: 1px solid #ffc107; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
.btn { padding: 10px 20px; background: #42b883; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 12px; }
.form-box { margin-top: 24px; padding: 24px; border: 1px solid #ddd; border-radius: 12px; }
.form-box h3 { margin-bottom: 16px; }
.input { display: block; width: 100%; padding: 10px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 15px; box-sizing: border-box; }
.error { color: red; margin-top: 8px; }
</style>