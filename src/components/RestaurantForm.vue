<template>
    <div class="form-wrap">
        <!-- Rasm yuklash -->
        <div class="image-section">
                <div class="image-upload" @click="$refs.fileInput.click()">
                <div v-if="previews && previews.length" class="previews">
                    <img v-for="(p, i) in previews" :key="i" :src="p" class="preview-thumb" />
                </div>
                <img v-else-if="previewUrl" :src="previewUrl" class="preview-img" />
                <div v-else class="upload-placeholder">
                    <div class="upload-icon">
                        <i class="fas fa-camera"></i>
                    </div>
                    <p class="upload-title">{{ $t('form.uploadTitle') }}</p>
                    <p class="upload-sub">{{ $t('form.uploadSub') }}</p>
                </div>
                <div class="upload-overlay" v-if="previewUrl">
                    <i class="fas fa-camera"></i>
                    <span>{{ $t('form.changeImage') }}</span>
                </div>
                <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    multiple
                    @change="onFileChange"
                    style="display:none"
                />
            </div>
        </div>

        <!-- Form fields -->
        <div class="fields">
            <!-- Nomi -->
            <div class="field-group">
                <label class="field-label">
                    <i class="fas fa-utensils"></i>
                    {{ $t('form.name') }}
                    <span class="required">*</span>
                </label>
                <input
                    v-model="form.name"
                    :placeholder="$t('form.namePlaceholder')"
                    class="field-input"
                    :class="{ error: errors.name }"
                />
                <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
            </div>

            <!-- Telefon -->
            <div class="field-group">
                <label class="field-label">
                    <i class="fas fa-phone-alt"></i>
                    {{ $t('form.phone') }}
                    <span class="required">*</span>
                </label>
                <div class="input-with-prefix">
                    <span class="prefix">+998</span>
                    <input
                        v-model="form.phone"
                    :placeholder="$t('form.phonePlaceholder')"
                        class="field-input prefix-input"
                        :class="{ error: errors.phone }"
                    />
                </div>
                <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>
            </div>

            <!-- Tavsif -->
            <div class="field-group">
                <label class="field-label">
                    <i class="fas fa-align-left"></i>
                    {{ $t('form.description') }}
                </label>
                <textarea
                    v-model="form.description"
                    :placeholder="$t('form.descriptionPlaceholder')"
                    class="field-textarea"
                    rows="3"
                ></textarea>
                <p class="field-hint">{{ form.description?.length || 0 }} / {{ $t('form.descriptionHint', { count: 500 }) }}</p>
            </div>

            <!-- Manzil -->
            <div class="field-group">
                <label class="field-label">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ $t('form.address') }}
                </label>
                <input
                    v-model="form.address"
                    :placeholder="$t('form.addressPlaceholder')"
                    class="field-input"
                />
            </div>

            <!-- Taom yo'nalishi -->
<div class="field-group">
    <label class="field-label">
        <i class="fas fa-utensils"></i>
        {{ $t('form.cuisine') }}
    </label>
    <select v-model="form.cuisine_type" class="field-input">
        <option value="">{{ $t('form.cuisineSelect') }}</option>
        <option value="uzbek">{{ $t('cuisines.uzbek') }}</option>
        <option value="tajik">{{ $t('cuisines.tajik') }}</option>
        <option value="kazakh">{{ $t('cuisines.kazakh') }}</option>
        <option value="kyrgyz">{{ $t('cuisines.kyrgyz') }}</option>
        <option value="turkish">{{ $t('cuisines.turkish') }}</option>
        <option value="arabic">{{ $t('cuisines.arabic') }}</option>
        <option value="persian">{{ $t('cuisines.persian') }}</option>
        <option value="afghan">{{ $t('cuisines.afghan') }}</option>
        <option value="georgian">{{ $t('cuisines.georgian') }}</option>
        <option value="russian">{{ $t('cuisines.russian') }}</option>
        <option value="european">{{ $t('cuisines.european') }}</option>
        <option value="asian">{{ $t('cuisines.asian') }}</option>
        <option value="mixed">{{ $t('cuisines.mixed') }}</option>
    </select>
</div>

<!-- Mamlakat va Shahar -->
<div class="form-row">
    <div class="field-group">
        <label class="field-label">
            <i class="fas fa-globe"></i>
            {{ $t('form.country') }}
        </label>
        <input
            v-model="form.country"
            :placeholder="$t('form.countryPlaceholder')"
            class="field-input"
        />
    </div>
    <div class="field-group">
        <label class="field-label">
            <i class="fas fa-city"></i>
            {{ $t('form.city') }}
        </label>
        <input
            v-model="form.city"
            :placeholder="$t('form.cityPlaceholder')"
            class="field-input"
        />
    </div>
</div>

<!-- Narx darajasi -->
<div class="field-group">
    <label class="field-label">
        <i class="fas fa-tag"></i>
        {{ $t('form.price') }}
    </label>
    <div class="price-options">
        <label
            v-for="price in ['$', '$$', '$$$']"
            :key="price"
            :class="['price-option', { active: form.price_range === price }]"
            @click="form.price_range = price"
        >
            {{ price }}
        </label>
    </div>
</div>

<!-- Veb-sayt va Instagram -->
<div class="form-row">
    <div class="field-group">
        <label class="field-label">
            <i class="fas fa-globe"></i>
            {{ $t('form.website') }}
        </label>
        <input
            v-model="form.website"
            :placeholder="$t('form.websitePlaceholder')"
            class="field-input"
        />
    </div>
    <div class="field-group">
        <label class="field-label">
            <i class="fab fa-instagram"></i>
            {{ $t('form.instagram') }}
        </label>
        <div class="input-with-prefix">
            <span class="prefix">@</span>
            <input
                v-model="form.instagram"
                :placeholder="$t('form.instagramPlaceholder')"
                class="field-input prefix-input"
            />
        </div>
    </div>
</div>

            <!-- Koordinatalar -->
            <div class="field-group">
                <label class="field-label">
                    <i class="fas fa-globe"></i>
                    Xarita koordinatalari
                    <span class="required">*</span>
                </label>
                <div class="coords-grid">
                    <div class="coord-field">
                        <span class="coord-label">Latitude</span>
                        <input
                            v-model="form.latitude"
                            placeholder="41.2995"
                            class="field-input"
                            :class="{ error: errors.latitude }"
                        />
                    </div>
                    <div class="coord-field">
                        <span class="coord-label">Longitude</span>
                        <input
                            v-model="form.longitude"
                            placeholder="69.2401"
                            class="field-input"
                            :class="{ error: errors.longitude }"
                        />
                    </div>
                </div>
                <div class="coord-hint">
                    <i class="fas fa-info-circle"></i>
                    <span>{{ $t('form.mapHint') }}</span>
                    <a href="https://maps.google.com" target="_blank" class="coord-link">
                        maps.google.com <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
                <p v-if="errors.latitude || errors.longitude" class="field-error">
                    {{ $t('form.mapValidation') }}
                </p>
            </div>

            <!-- Error -->
            <div v-if="error" class="form-error">
                <i class="fas fa-exclamation-circle"></i>
                {{ error }}
            </div>

            <!-- Buttons -->
            <div class="form-btns">
                <button
                    @click="submit"
                    :disabled="loading"
                    class="btn-save"
                >
                    <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                    <i v-else class="fas fa-save"></i>
                    {{ loading ? $t('form.saving') : $t('form.save') }}
                </button>
                <button @click="$emit('cancel')" class="btn-cancel">
                    <i class="fas fa-times"></i>
                    {{ $t('form.cancel') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { resolveImageUrl } from '../utils/imageUrl'

const props = defineProps({
    initial: { type: Object, default: () => ({}) },
    loading: Boolean,
    error: String,
})

const emit = defineEmits(['submit', 'cancel'])

const { t } = useI18n()

const form = ref({
    name: '',
    phone: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    images: [],
    cuisine_type: '',
    country: '',
    city: '',
    price_range: '',
    website: '',
    instagram: '',
})

const previewUrl = ref(null)
const previews = ref([])
const errors = ref({})

watch(() => props.initial, (val) => {
    if (val && Object.keys(val).length) {
        form.value = { ...form.value, ...val }
        if (val.image_path) {
            previewUrl.value = resolveImageUrl(val.image_path)
        }
        // support array of images from backend: `images` or `image_paths`
        if (val.images && Array.isArray(val.images) && val.images.length) {
            previews.value = val.images.map(p => resolveImageUrl(p))
        } else if (val.image_paths && Array.isArray(val.image_paths) && val.image_paths.length) {
            previews.value = val.image_paths.map(p => resolveImageUrl(p))
        }
    }
}, { immediate: true })

const onFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length) {
        form.value.images = files
        previews.value = files.map(f => URL.createObjectURL(f))
        // keep previewUrl for single-file compatibility
        previewUrl.value = previews.value[0] || null
    }
}

const validate = () => {
    errors.value = {}
    if (!form.value.name?.trim()) errors.value.name = t('form.validation.name')
    if (!form.value.phone?.trim()) errors.value.phone = t('form.validation.phone')
    if (!form.value.latitude) errors.value.latitude = true
    if (!form.value.longitude) errors.value.longitude = true
    return Object.keys(errors.value).length === 0
}

const submit = () => {
    if (!validate()) return
    emit('submit', form.value)
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

* { box-sizing: border-box; margin: 0; padding: 0; }

.form-wrap { padding: 24px; display: flex; flex-direction: column; gap: 24px; }

/* IMAGE UPLOAD */
.image-section { width: 100%; }
.image-upload {
    position: relative;
    width: 100%; height: 200px;
    border: 2px dashed #e0e0e0;
    border-radius: 16px; overflow: hidden;
    cursor: pointer; transition: border-color 0.2s;
    background: #f9f9f9;
}
.image-upload:hover { border-color: #1D9E75; }
.preview-img { width: 100%; height: 100%; object-fit: cover; }
.upload-placeholder {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 8px;
}
.upload-icon {
    width: 56px; height: 56px;
    background: #E1F5EE; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; color: #1D9E75;
    margin-bottom: 4px;
}
.upload-title { font-size: 15px; font-weight: 600; color: #333; }
.upload-sub { font-size: 12px; color: #aaa; }
.upload-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 6px; color: white; font-size: 14px;
    opacity: 0; transition: opacity 0.2s;
}
.image-upload:hover .upload-overlay { opacity: 1; }
.upload-overlay i { font-size: 24px; }

.previews { display: flex; gap: 8px; align-items: center; padding: 8px; }
.preview-thumb { width: 100px; height: 100px; object-fit: cover; border-radius: 8px; }

/* FIELDS */
.fields { display: flex; flex-direction: column; gap: 18px; }

.field-group { display: flex; flex-direction: column; gap: 6px; }

.field-label {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 600; color: #444;
}
.field-label i { color: #1D9E75; font-size: 12px; }
.required { color: #E24B4A; }

.field-input {
    padding: 11px 14px;
    border: 1.5px solid #e8e8e8;
    border-radius: 10px; font-size: 14px;
    outline: none; transition: border 0.2s;
    color: #1a1a1a; background: white;
}
.field-input:focus { border-color: #1D9E75; box-shadow: 0 0 0 3px rgba(29,158,117,0.1); }
.field-input.error { border-color: #E24B4A; }

.field-textarea {
    padding: 11px 14px;
    border: 1.5px solid #e8e8e8;
    border-radius: 10px; font-size: 14px;
    outline: none; transition: border 0.2s;
    color: #1a1a1a; resize: vertical;
    font-family: inherit; line-height: 1.5;
}
.field-textarea:focus { border-color: #1D9E75; box-shadow: 0 0 0 3px rgba(29,158,117,0.1); }

.field-hint { font-size: 11px; color: #bbb; text-align: right; }
.field-error { font-size: 12px; color: #E24B4A; display: flex; align-items: center; gap: 4px; }

/* PHONE PREFIX */
.input-with-prefix { display: flex; align-items: stretch; }
.prefix {
    padding: 11px 12px;
    background: #f4f5f7; border: 1.5px solid #e8e8e8;
    border-right: none; border-radius: 10px 0 0 10px;
    font-size: 14px; color: #555; font-weight: 500;
}
.prefix-input { border-radius: 0 10px 10px 0 !important; flex: 1; }

/* COORDS */
.coords-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.coord-field { display: flex; flex-direction: column; gap: 4px; }
.coord-label { font-size: 11px; color: #999; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; }
.coord-hint {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: #888;
    background: #f4f5f7; border-radius: 8px; padding: 8px 12px;
}
.coord-hint i { color: #1D9E75; flex-shrink: 0; }
.coord-link {
    color: #1D9E75; text-decoration: none; font-weight: 500;
    display: inline-flex; align-items: center; gap: 3px;
}
.coord-link i { font-size: 10px; }

/* ERROR */
.form-error {
    display: flex; align-items: center; gap: 8px;
    background: #FCEBEB; color: #A32D2D;
    padding: 12px 14px; border-radius: 10px; font-size: 13px;
}

/* BUTTONS */
.form-btns { display: flex; gap: 10px; padding-top: 4px; }
.btn-save {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px; background: #1D9E75; color: white;
    border: none; border-radius: 12px; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: background 0.2s;
}
.btn-save:hover { background: #0F6E56; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-cancel {
    display: flex; align-items: center; gap: 6px;
    padding: 13px 20px; background: #f4f5f7; color: #555;
    border: none; border-radius: 12px; font-size: 14px;
    cursor: pointer; transition: background 0.2s;
}
.btn-cancel:hover { background: #e8e8e8; }

/* PRICE OPTIONS */
.price-options {
    display: flex; gap: 10px;
}
.price-option {
    flex: 1; padding: 10px;
    border: 1.5px solid #e8e8e8;
    border-radius: 10px; text-align: center;
    cursor: pointer; font-size: 15px; font-weight: 600;
    color: #888; transition: all 0.2s;
}
.price-option.active {
    border-color: #1D9E75;
    background: #E1F5EE;
    color: #0F6E56;
}
.price-option:hover { border-color: #1D9E75; }

/* MOBILE */
@media (max-width: 480px) {
    .form-wrap { padding: 16px; }
    .coords-grid { grid-template-columns: 1fr; }
}
</style>