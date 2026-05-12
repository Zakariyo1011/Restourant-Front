<template>
    <div class="form">
        <div class="form-group">
            <label>Restoran nomi *</label>
            <input v-model="form.name" placeholder="Masalan: Milliy taomlar" class="input" />
        </div>

        <div class="form-group">
            <label>Telefon raqami *</label>
            <input v-model="form.phone" placeholder="+998901234567" class="input" />
        </div>

        <div class="form-group">
            <label>Tavsif</label>
            <textarea v-model="form.description" placeholder="Restoran haqida qisqacha..." class="input textarea"></textarea>
        </div>

        <div class="form-group">
            <label>Manzil</label>
            <input v-model="form.address" placeholder="Toshkent, Chilonzor tumani..." class="input" />
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Latitude *</label>
                <input v-model="form.latitude" placeholder="41.2995" class="input" />
            </div>
            <div class="form-group">
                <label>Longitude *</label>
                <input v-model="form.longitude" placeholder="69.2401" class="input" />
            </div>
        </div>

        <div class="form-group">
            <label>Rasm</label>
            <div class="image-upload" @click="$refs.fileInput.click()">
                <img v-if="previewUrl" :src="previewUrl" class="preview-img" />
                <div v-else class="upload-placeholder">
                    <span>📷</span>
                    <p>Rasm yuklash uchun bosing</p>
                </div>
                <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" style="display:none" />
            </div>
        </div>

        <p v-if="error" class="error-msg">❌ {{ error }}</p>

        <div class="form-buttons">
            <button @click="submit" :disabled="loading" class="btn-green">
                {{ loading ? 'Saqlanmoqda...' : '💾 Saqlash' }}
            </button>
            <button @click="$emit('cancel')" class="btn-gray">Bekor qilish</button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    initial: { type: Object, default: () => ({}) },
    loading: Boolean,
    error: String,
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
    name: '',
    phone: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    image: null,
})

const previewUrl = ref(null)

watch(() => props.initial, (val) => {
    if (val) {
        form.value = { ...form.value, ...val }
    }
}, { immediate: true })

const onFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        form.value.image = file
        previewUrl.value = URL.createObjectURL(file)
    }
}

const submit = () => {
    emit('submit', form.value)
}
</script>

<style scoped>
.form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 13px; font-weight: 500; color: #555; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.input { padding: 10px 14px; border: 1px solid #ddd; border-radius: 8px; font-size: 15px; outline: none; transition: border 0.2s; }
.input:focus { border-color: #42b883; }
.textarea { min-height: 100px; resize: vertical; }
.image-upload { border: 2px dashed #ddd; border-radius: 12px; overflow: hidden; cursor: pointer; min-height: 160px; display: flex; align-items: center; justify-content: center; transition: border 0.2s; }
.image-upload:hover { border-color: #42b883; }
.preview-img { width: 100%; height: 200px; object-fit: cover; }
.upload-placeholder { text-align: center; color: #aaa; }
.upload-placeholder span { font-size: 40px; }
.upload-placeholder p { margin-top: 8px; }
.form-buttons { display: flex; gap: 12px; margin-top: 8px; }
.btn-green { padding: 12px 24px; background: #42b883; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; }
.btn-green:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-gray { padding: 12px 24px; background: #9e9e9e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; }
.error-msg { color: #e53935; }
</style>