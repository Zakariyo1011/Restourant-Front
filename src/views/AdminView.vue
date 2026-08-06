<template>
    <div class="page">
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

            <!-- Promo Slides Card -->
            <div class="promo-card">
                <div class="promo-card-header">
                    <div class="promo-card-title">
                        <i class="fas fa-images" style="color:var(--color-primary)"></i>
                        Home Slider Boshqaruvi
                    </div>
                    <button class="promo-add-btn" @click="openPromoForm(null)">
                        <i class="fas fa-plus"></i> Yangi slide
                    </button>
                </div>

                <div class="promo-slides-list">
                    <div v-if="promoLoading" class="promo-loading">
                        <i class="fas fa-spinner fa-spin"></i> Yuklanmoqda...
                    </div>
                    <div v-else-if="!promoSlides.length" class="promo-empty">
                        Hali slide qo'shilmagan
                    </div>
                    <div v-else class="promo-items">
                        <div v-for="slide in promoSlides" :key="slide.id" class="promo-item">
                            <div class="promo-item-thumb" :style="{ background: slide.bg_color }">
                                <img v-if="slide.image_path" :src="resolvePromoImage(slide.image_path)" alt="" />
                                <i v-else class="fas fa-image"></i>
                            </div>
                            <div class="promo-item-info">
                                <span class="promo-item-badge" v-if="slide.badge">{{ slide.badge }}</span>
                                <strong>{{ slide.title }}</strong>
                                <p>{{ slide.subtitle }}</p>
                                <small :class="slide.is_active ? 'text-green' : 'text-gray'">
                                    {{ slide.is_active ? 'Faol' : 'Nofaol' }}
                                </small>
                            </div>
                            <div class="promo-item-actions">
                                <button class="btn-icon" @click="openPromoForm(slide)"><i class="fas fa-pen"></i></button>
                                <button class="btn-icon red" @click="deletePromoSlide(slide.id)"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Promo Form Modal -->
            <div v-if="promoFormOpen" class="modal-overlay" @click.self="promoFormOpen = false">
                <div class="modal-box">
                    <div class="modal-header">
                        <h3>{{ promoEditId ? 'Slideni tahrirlash' : 'Yangi slide' }}</h3>
                        <button class="modal-close" @click="promoFormOpen = false"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <label>Sarlavha *</label>
                            <input v-model="promoForm.title" class="form-input" placeholder="Masalan: Issiq chegirmalar" />
                        </div>
                        <div class="form-row">
                            <label>Badge (ixtiyoriy)</label>
                            <input v-model="promoForm.badge" class="form-input" placeholder="Yangi, Top, Tavsiya..." />
                        </div>
                        <div class="form-row">
                            <label>Tavsif (ixtiyoriy)</label>
                            <input v-model="promoForm.subtitle" class="form-input" placeholder="Qisqa tavsif..." />
                        </div>
                        <div class="form-row">
                            <label>Fon rangi (CSS gradient)</label>
                            <input v-model="promoForm.bg_color" class="form-input" placeholder="linear-gradient(...)" />
                        </div>
                        <div class="form-row">
                            <label>Tartib raqami</label>
                            <input v-model.number="promoForm.sort_order" type="number" class="form-input" />
                        </div>
                        <div class="form-row">
                            <label>Rasm (ixtiyoriy)</label>
                            <input type="file" accept="image/*" @change="promoImageFile = $event.target.files[0]" class="form-input" />
                            <img v-if="promoEditId && promoForm.current_image" :src="resolvePromoImage(promoForm.current_image)" class="promo-preview-img" />
                        </div>
                        <div class="form-row">
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="promoForm.is_active" />
                                Faol
                            </label>
                        </div>
                        <div v-if="promoSaveError" class="notice-error">{{ promoSaveError }}</div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel" @click="promoFormOpen = false">Bekor</button>
                        <button class="btn-save" :disabled="promoSaving" @click="savePromoSlide">
                            <i v-if="promoSaving" class="fas fa-spinner fa-spin"></i>
                            {{ promoSaving ? 'Saqlanmoqda...' : 'Saqlash' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Google Import Card -->
            <div class="import-card">
                <div class="import-header">
                    <div class="import-title">
                        <i class="fab fa-google" style="color:#4285F4"></i>
                        Google Places Import
                    </div>
                    <button class="import-toggle-btn" @click="importOpen = !importOpen">
                        <i :class="importOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                    </button>
                </div>

                <div v-if="importOpen" class="import-body">
                    <!-- Row 1: Davlat -->
                    <div class="import-row">
                        <label class="import-label">
                            <i class="fas fa-flag"></i> Davlat
                        </label>
                        <div class="searchable-select" v-click-outside="() => countryDropOpen = false">
                            <div class="ss-input-wrap" @click="countryDropOpen = !countryDropOpen">
                                <i class="fas fa-search ss-icon"></i>
                                <input
                                    v-model="countrySearch"
                                    class="ss-input"
                                    placeholder="Davlat qidiring yoki tanlang..."
                                    @input="countryDropOpen = true"
                                    @focus="countryDropOpen = true"
                                    @keydown.enter.prevent="applyTypedCountry"
                                />
                                <span v-if="importForm.country" class="ss-selected-badge">
                                    {{ importForm.country }}
                                    <i class="fas fa-times" @click.stop="importForm.country = ''; countrySearch = ''"></i>
                                </span>
                            </div>
                            <div v-if="countryDropOpen && filteredCountries.length" class="ss-dropdown">
                                <div
                                    v-for="c in filteredCountries"
                                    :key="c.code"
                                    class="ss-option"
                                    :class="{ active: importForm.country === c.name }"
                                    @click="selectCountry(c)"
                                >
                                    <span class="ss-flag">{{ c.flag }}</span>
                                    {{ c.name }}
                                </div>
                            </div>
                            <div
                                v-else-if="countryDropOpen && countrySearch.trim()"
                                class="ss-dropdown"
                            >
                                <div class="ss-option" @click="applyTypedCountry">
                                    <i class="fas fa-plus" style="color:var(--color-primary)"></i>
                                    "{{ countrySearch.trim() }}" dan foydalanish
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Row 2: Shaharlar (multi) -->
                    <div class="import-row">
                        <label class="import-label">
                            <i class="fas fa-city"></i> Shaharlar (bir nechta tanlash mumkin)
                        </label>
                        <div class="searchable-select" v-click-outside="() => cityDropOpen = false">
                            <div class="ss-input-wrap">
                                <i class="fas fa-search ss-icon"></i>
                                <div class="ss-tags">
                                    <span v-for="city in importForm.cities" :key="city" class="ss-tag">
                                        {{ city }}
                                        <i class="fas fa-times" @click="removeCity(city)"></i>
                                    </span>
                                </div>
                                <input
                                    v-model="citySearch"
                                    class="ss-input"
                                    :placeholder="importForm.country ? 'Shahar qidiring...' : 'Avval davlat tanlang'"
                                    :disabled="!importForm.country"
                                    @input="cityDropOpen = true"
                                    @focus="cityDropOpen = true"
                                    @keydown.enter.prevent="addTypedCity"
                                />
                                <button
                                    v-if="citySearch.trim()"
                                    class="ss-add-btn"
                                    type="button"
                                    @click="addTypedCity"
                                >
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div v-if="cityDropOpen && filteredCities.length" class="ss-dropdown">
                                <div
                                    v-for="city in filteredCities"
                                    :key="city"
                                    class="ss-option"
                                    :class="{ active: importForm.cities.includes(city) }"
                                    @click="toggleCity(city)"
                                >
                                    <i class="fas fa-check" v-if="importForm.cities.includes(city)" style="color:var(--color-primary);margin-right:6px"></i>
                                    {{ city }}
                                </div>
                            </div>
                            <div
                                v-else-if="cityDropOpen && citySearch.trim()"
                                class="ss-dropdown"
                            >
                                <div class="ss-option" @click="addTypedCity">
                                    <i class="fas fa-plus" style="color:var(--color-primary)"></i>
                                    "{{ citySearch.trim() }}" shahrini qo'shish
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Row 3: Ovqat yo'nalishi -->
                    <div class="import-row">
                        <label class="import-label">
                            <i class="fas fa-utensils"></i> Ovqat yo'nalishi (ixtiyoriy)
                        </label>
                        <div class="searchable-select" v-click-outside="() => cuisineDropOpen = false">
                            <div class="ss-input-wrap" @click="cuisineDropOpen = !cuisineDropOpen">
                                <i class="fas fa-search ss-icon"></i>
                                <input
                                    v-model="cuisineSearch"
                                    class="ss-input"
                                    placeholder="Masalan: sushi, pizza, osh..."
                                    @input="cuisineDropOpen = true"
                                    @focus="cuisineDropOpen = true"
                                />
                                <span v-if="importForm.cuisine" class="ss-selected-badge">
                                    {{ importForm.cuisine }}
                                    <i class="fas fa-times" @click.stop="importForm.cuisine = ''; cuisineSearch = ''"></i>
                                </span>
                            </div>
                            <div v-if="cuisineDropOpen && filteredCuisines.length" class="ss-dropdown">
                                <div
                                    v-for="cu in filteredCuisines"
                                    :key="cu"
                                    class="ss-option"
                                    :class="{ active: importForm.cuisine === cu }"
                                    @click="selectCuisine(cu)"
                                >
                                    {{ cu }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Row 4: Max soni -->
                    <div class="import-row">
                        <label class="import-label">
                            <i class="fas fa-hashtag"></i> Maksimal restoran soni
                        </label>
                        <input
                            v-model.number="importForm.max"
                            type="number" min="1" max="200"
                            class="import-number-input"
                            placeholder="50"
                        />
                    </div>

                    <div class="import-row">
                        <label class="import-label">
                            <i class="fas fa-layer-group"></i> Har davlatga maksimal
                        </label>
                        <input
                            v-model.number="importForm.max_per_country"
                            type="number" min="5" max="100"
                            class="import-number-input"
                            placeholder="30"
                        />
                    </div>

                    <div class="import-row">
                        <label class="import-label">
                            <i class="fas fa-layer-group"></i> Bulk rejim
                        </label>
                        <label class="checkbox-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                            <input type="checkbox" v-model="importAllTargetCountries" />
                            8 ta davlatni birdan import qilish
                        </label>
                    </div>

                    <div class="import-row">
                        <label class="import-label">
                            <i class="fas fa-plus-circle"></i> Qo'shish rejimi
                        </label>
                        <label class="checkbox-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                            <input type="checkbox" v-model="importForm.skip_updates" />
                            Faqat yangi restoranlarni qo'shish (mavjudini yangilamasin)
                        </label>
                    </div>

                    <div v-if="importAllTargetCountries" class="import-row" style="padding-top:0;">
                        <small style="color:var(--color-text-muted);line-height:1.4;">
                            Tanlangan preset: Amerika, Saudi Arabia, UAE, Malaysia, Thailand, Vietnam, Turkey, Russia
                        </small>
                    </div>

                    <!-- Natija xabar -->
                    <div v-if="importResult" class="import-result" :class="importResult.type">
                        <i :class="importResult.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
                        {{ importResult.message }}
                        <div v-if="importResult.errors?.length" class="import-errors">
                            <p v-for="e in importResult.errors" :key="e" class="import-error-item">⚠ {{ e }}</p>
                        </div>
                    </div>

                    <!-- Boshlash tugmasi -->
                    <button
                        class="import-run-btn"
                        :disabled="importing || (!importAllTargetCountries && (!importForm.country || !importForm.cities.length))"
                        @click="runImport"
                    >
                        <span v-if="importing">
                            <i class="fas fa-spinner fa-spin"></i> Import qilinmoqda...
                        </span>
                        <span v-else>
                            <i class="fas fa-cloud-download-alt"></i> Import boshlash
                        </span>
                    </button>
                </div>
            </div>

            <!-- Table -->
            <div class="table-card">
                <div class="table-header">
                    <div class="table-title">
                        <i class="fas fa-list"></i>
                        {{ $t('admin.allRestaurants') }}
                    </div>
                    <div class="table-controls">
                        <div class="bulk-actions" v-if="selectedIds.length">
                            <button class="bulk-btn bulk-activate" @click="bulkSetActive(true)">
                                <i class="fas fa-check-circle"></i>
                                Faollashtirish ({{ selectedIds.length }})
                            </button>
                            <button class="bulk-btn bulk-deactivate" @click="bulkSetActive(false)">
                                <i class="fas fa-ban"></i>
                                Nofaol qilish ({{ selectedIds.length }})
                            </button>
                        </div>
                        <div class="table-search">
                            <i class="fas fa-search"></i>
                            <input v-model="search" :placeholder="$t('admin.search')" class="search-input" />
                        </div>
                    </div>
                </div>
                <div class="status-filters">
                    <button class="status-chip" :class="{ active: statusFilter === 'all' }" @click="statusFilter = 'all'; resetPage()">
                        Barchasi ({{ restaurants.length }})
                    </button>
                    <button class="status-chip" :class="{ active: statusFilter === 'active' }" @click="statusFilter = 'active'; resetPage()">
                        Faol ({{ activeCount }})
                    </button>
                    <button class="status-chip" :class="{ active: statusFilter === 'inactive' }" @click="statusFilter = 'inactive'; resetPage()">
                        Nofaol ({{ inactiveCount }})
                    </button>
                    <button class="status-chip" :class="{ active: statusFilter === 'archived' }" @click="statusFilter = 'archived'; resetPage()">
                        Arxiv ({{ archivedCount }})
                    </button>
                </div>

                <div v-if="tableNotice" class="table-notice" :class="{ error: tableNoticeType === 'error' }">{{ tableNotice }}</div>

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
                                <th>
                                    <input
                                        type="checkbox"
                                        :checked="allVisibleSelected"
                                        :disabled="!selectableFiltered.length"
                                        @change="toggleSelectAll($event.target.checked)"
                                    />
                                </th>
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
                            <tr v-for="(r, i) in filtered" :key="r.id" class="table-row" :class="{ archived: !!r.deleted_at }">
                                <td>
                                    <input
                                        type="checkbox"
                                        :disabled="!!r.deleted_at"
                                        :checked="selectedIds.includes(r.id)"
                                        @change="toggleSelection(r.id, $event.target.checked)"
                                    />
                                </td>
                                <td class="td-num">{{ (serverPage - 1) * serverPerPage + i + 1 }}</td>
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
                                    <span v-if="r.deleted_at" class="badge-archived">
                                        <i class="fas fa-box-archive"></i>
                                        Arxiv
                                    </span>
                                    <span v-else :class="r.is_active ? 'badge-active' : 'badge-inactive'">
                                        <i :class="r.is_active ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                                        {{ r.is_active ? $t('admin.activeLabel') : $t('admin.inactiveLabel') }}
                                    </span>
                                </td>
                                <td>
                                    <div class="td-actions">
                                        <button
                                            v-if="!r.deleted_at"
                                            @click="toggle(r)"
                                            :class="r.is_active ? 'btn-deactivate' : 'btn-activate'"
                                        >
                                            <i :class="r.is_active ? 'fas fa-ban' : 'fas fa-check'"></i>
                                            {{ r.is_active ? $t('admin.deactivate') : $t('admin.activate') }}
                                        </button>
                                        <button v-if="!r.deleted_at" class="btn-archive" @click="archiveRestaurant(r)">
                                            <i class="fas fa-box-archive"></i>
                                            Arxivlash
                                        </button>
                                        <button v-else class="btn-restore" @click="restoreRestaurant(r)">
                                            <i class="fas fa-rotate-left"></i>
                                            Tiklash
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

                <!-- Server pagination -->
                <div class="table-pagination" v-if="!loading && serverLastPage > 1">
                    <button class="page-btn" :disabled="serverPage <= 1" @click="refreshRestaurants(serverPage - 1)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <template v-for="p in serverPageNumbers" :key="p">
                        <span v-if="p === '...'" class="page-ellipsis">…</span>
                        <button
                            v-else
                            class="page-btn"
                            :class="{ active: p === serverPage }"
                            @click="refreshRestaurants(p)"
                        >{{ p }}</button>
                    </template>
                    <button class="page-btn" :disabled="serverPage >= serverLastPage" @click="refreshRestaurants(serverPage + 1)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>

                <!-- Footer -->
                <div class="table-footer" v-if="!loading && (serverTotal > 0 || filtered.length > 0)">
                    <p>{{ $t('admin.total') }} <strong>{{ serverTotal || filtered.length }}</strong> {{ $t('admin.allRestaurants').toLowerCase() }}</p>
                    <p v-if="serverLastPage > 1" class="page-info">{{ serverPage }} / {{ serverLastPage }} sahifa</p>
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
import { resolveImageUrl, IMAGE_PLACEHOLDER } from '../utils/imageUrl'

const auth = useAuthStore()
const router = useRouter()
const restaurants = ref([])
const loading = ref(true)
const search = ref('')
const selectedIds = ref([])
const tableNotice = ref('')
const tableNoticeType = ref('success')
const statusFilter = ref('all')

const serverPage = ref(1)
const serverLastPage = ref(1)
const serverTotal = ref(0)
const serverPerPage = ref(50)

// ─── Google Import ma'lumotlari ───────────────────────────────────────────────

const COUNTRIES = [
    { code: 'UZ', name: 'Uzbekistan',    flag: '🇺🇿', cities: ['Tashkent','Samarkand','Bukhara','Namangan','Andijan','Fergana','Nukus','Qarshi','Termiz','Urgench'] },
    { code: 'KZ', name: 'Kazakhstan',    flag: '🇰🇿', cities: ['Almaty','Astana','Shymkent','Karaganda','Aktobe','Taraz','Pavlodar','Oskemen','Semey','Atyrau'] },
    { code: 'KG', name: 'Kyrgyzstan',    flag: '🇰🇬', cities: ['Bishkek','Osh','Jalal-Abad','Karakol','Tokmok','Naryn','Talas','Batken','Balykchy','Uzgen'] },
    { code: 'TJ', name: 'Tajikistan',    flag: '🇹🇯', cities: ['Dushanbe','Khujand','Kulob','Qurghonteppa','Istaravshan','Konibodom','Tursunzoda','Panjakent','Vahdat','Hisor'] },
    { code: 'TM', name: 'Turkmenistan',  flag: '🇹🇲', cities: ['Ashgabat','Turkmenbashi','Dashoguz','Mary','Turkmenabat','Balkanabat','Bayramaly','Tejen','Serdar','Yoloten'] },
    { code: 'RU', name: 'Russia',        flag: '🇷🇺', cities: ['Moscow','Saint Petersburg','Novosibirsk','Yekaterinburg','Kazan','Nizhny Novgorod','Chelyabinsk','Samara','Omsk','Ufa'] },
    { code: 'TR', name: 'Turkey',        flag: '🇹🇷', cities: ['Istanbul','Ankara','Izmir','Bursa','Antalya','Konya','Adana','Gaziantep','Mersin','Kayseri'] },
    { code: 'AE', name: 'UAE',           flag: '🇦🇪', cities: ['Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Al Ain','Umm Al Quwain'] },
    { code: 'US', name: 'USA',           flag: '🇺🇸', cities: ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','San Jose'] },
    { code: 'TH', name: 'Thailand',      flag: '🇹🇭', cities: ['Bangkok','Chiang Mai','Phuket','Pattaya','Hat Yai','Khon Kaen','Nakhon Ratchasima','Udon Thani'] },
    { code: 'VN', name: 'Vietnam',       flag: '🇻🇳', cities: ['Ho Chi Minh City','Hanoi','Da Nang','Hai Phong','Can Tho','Nha Trang','Hue','Vung Tau'] },
    { code: 'DE', name: 'Germany',       flag: '🇩🇪', cities: ['Berlin','Hamburg','Munich','Cologne','Frankfurt','Stuttgart','Düsseldorf','Leipzig','Dortmund','Essen'] },
    { code: 'FR', name: 'France',        flag: '🇫🇷', cities: ['Paris','Marseille','Lyon','Toulouse','Nice','Nantes','Strasbourg','Montpellier','Bordeaux','Lille'] },
    { code: 'GB', name: 'United Kingdom',flag: '🇬🇧', cities: ['London','Birmingham','Manchester','Glasgow','Leeds','Liverpool','Edinburgh','Bristol','Cardiff','Sheffield'] },
    { code: 'CN', name: 'China',         flag: '🇨🇳', cities: ['Beijing','Shanghai','Guangzhou','Shenzhen','Chengdu','Chongqing','Tianjin','Wuhan','Xian','Hangzhou'] },
    { code: 'JP', name: 'Japan',         flag: '🇯🇵', cities: ['Tokyo','Osaka','Yokohama','Nagoya','Sapporo','Fukuoka','Kobe','Kyoto','Kawasaki','Saitama'] },
    { code: 'KR', name: 'South Korea',   flag: '🇰🇷', cities: ['Seoul','Busan','Incheon','Daegu','Daejeon','Gwangju','Suwon','Ulsan','Changwon','Goyang'] },
    { code: 'IN', name: 'India',         flag: '🇮🇳', cities: ['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Surat'] },
    { code: 'IT', name: 'Italy',         flag: '🇮🇹', cities: ['Rome','Milan','Naples','Turin','Palermo','Genoa','Bologna','Florence','Bari','Catania'] },
    { code: 'ES', name: 'Spain',         flag: '🇪🇸', cities: ['Madrid','Barcelona','Valencia','Seville','Zaragoza','Málaga','Murcia','Palma','Las Palmas','Bilbao'] },
    { code: 'SA', name: 'Saudi Arabia',  flag: '🇸🇦', cities: ['Riyadh','Jeddah','Mecca','Medina','Dammam','Khobar','Tabuk','Buraidah','Hail','Najran'] },
    { code: 'MY', name: 'Malaysia',      flag: '🇲🇾', cities: ['Kuala Lumpur','George Town','Johor Bahru','Ipoh','Shah Alam','Malacca City','Kota Kinabalu','Kuching'] },
    { code: 'PK', name: 'Pakistan',      flag: '🇵🇰', cities: ['Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta','Sialkot','Gujranwala'] },
]

const COUNTRY_ALIASES = {
    'united kingdom': ['uk', 'england', 'britain', 'great britain'],
    'united states': ['usa', 'us', 'america'],
    'united arab emirates': ['uae'],
    'south korea': ['korea', 'republic of korea'],
}

const CUISINES = [
    "Osh (Plov)", "Lag'mon", 'Manti', 'Shashlik', "Sho'rva", 'Samsa', 'Dimlama',
    'Sushi', 'Pizza', 'Burger', 'Kebab', 'Shawarma', 'Ramen', 'Pasta', 'Steak',
    'Sushi & Rolls', 'BBQ', 'Seafood', 'Vegan', 'Halal', 'Indian', 'Chinese',
    'Korean', 'Thai', 'Mexican', 'American', 'Italian', 'French', 'Mediterranean',
    'Georgian', 'Azerbaijani', 'Armenian', 'Japanese', 'Vietnamese', 'Turkish',
]

const BULK_TARGET_COUNTRIES = [
    'USA',
    'Saudi Arabia',
    'UAE',
    'Malaysia',
    'Thailand',
    'Vietnam',
    'Turkey',
    'Russia',
]

// ─── Import state ─────────────────────────────────────────────────────────────

const importOpen      = ref(false)
const importing       = ref(false)
const importResult    = ref(null)
const importAllTargetCountries = ref(false)

const importForm = ref({
    country: '',
    cities:  [],
    cuisine: '',
    max:     50,
    max_per_country: 30,
    skip_updates: true,
    search_multiplier: 4,
})

const countryDropOpen = ref(false)
const cityDropOpen    = ref(false)
const cuisineDropOpen = ref(false)
const countrySearch   = ref('')
const citySearch      = ref('')
const cuisineSearch   = ref('')

const normalizeText = (value) =>
    String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()

const toTitleCase = (value) =>
    String(value || '')
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')

const getCountryAliases = (countryName) => {
    const normalizedName = normalizeText(countryName)
    return COUNTRY_ALIASES[normalizedName] || []
}

const findCountryByQuery = (rawQuery) => {
    const q = normalizeText(rawQuery)
    if (!q) return null

    const direct = COUNTRIES.find(c => {
        const name = normalizeText(c.name)
        const code = normalizeText(c.code)
        const aliases = getCountryAliases(c.name)
        return name === q || code === q || aliases.includes(q)
    })
    if (direct) return direct

    return COUNTRIES.find(c => {
        const name = normalizeText(c.name)
        const code = normalizeText(c.code)
        const aliases = getCountryAliases(c.name)
        return name.includes(q) || code.includes(q) || aliases.some(a => a.includes(q))
    }) || null
}

const filteredCountries = computed(() => {
    const q = normalizeText(countrySearch.value)
    if (!q) return COUNTRIES
    return COUNTRIES.filter(c => {
        const name = normalizeText(c.name)
        const code = normalizeText(c.code)
        const aliases = getCountryAliases(c.name)
        return name.includes(q) || code.includes(q) || aliases.some(a => a.includes(q))
    })
})

const selectedCountryObj = computed(() =>
    COUNTRIES.find(c => normalizeText(c.name) === normalizeText(importForm.value.country))
)

const filteredCities = computed(() => {
    const list = selectedCountryObj.value?.cities ?? []
    const q = citySearch.value.toLowerCase()
    return list.filter(c => c.toLowerCase().includes(q))
})

const filteredCuisines = computed(() => {
    const q = cuisineSearch.value.toLowerCase()
    return CUISINES.filter(c => c.toLowerCase().includes(q))
})

function selectCountry(c) {
    const prevCountry = importForm.value.country
    importForm.value.country = c.name
    if (normalizeText(prevCountry) !== normalizeText(c.name)) {
        importForm.value.cities = []
    }
    countrySearch.value      = ''
    countryDropOpen.value    = false
}

function applyTypedCountry() {
    const raw = countrySearch.value.trim()
    if (!raw) return

    const found = findCountryByQuery(raw)
    if (found) {
        selectCountry(found)
        return
    }

    const nextCountry = toTitleCase(raw)
    const prevCountry = importForm.value.country
    importForm.value.country = nextCountry
    if (normalizeText(prevCountry) !== normalizeText(nextCountry)) {
        importForm.value.cities = []
    }
    countryDropOpen.value = false
}

function toggleCity(city) {
    const idx = importForm.value.cities.indexOf(city)
    if (idx === -1) importForm.value.cities.push(city)
    else importForm.value.cities.splice(idx, 1)
    citySearch.value = ''
}

function removeCity(city) {
    importForm.value.cities = importForm.value.cities.filter(c => c !== city)
}

function addTypedCity() {
    const typedCity = citySearch.value.trim()
    if (!typedCity) return

    const normalizedTyped = normalizeText(typedCity)
    const exists = importForm.value.cities.some(c => normalizeText(c) === normalizedTyped)
    if (!exists) {
        importForm.value.cities.push(toTitleCase(typedCity))
    }

    citySearch.value = ''
    cityDropOpen.value = false
}

function selectCuisine(cu) {
    importForm.value.cuisine = cu
    cuisineSearch.value      = ''
    cuisineDropOpen.value    = false
}

const vClickOutside = {
    mounted(el, binding) {
        el._clickOutsideHandler = (e) => { if (!el.contains(e.target)) binding.value(e) }
        document.addEventListener('click', el._clickOutsideHandler)
    },
    unmounted(el) { document.removeEventListener('click', el._clickOutsideHandler) },
}

async function runImport() {
    if (importAllTargetCountries.value) {
        importResult.value = null
        importing.value = true
        try {
            const res = await api.post('/admin/import-google-places', {
                countries: BULK_TARGET_COUNTRIES,
                cuisine: importForm.value.cuisine || undefined,
                max: importForm.value.max * BULK_TARGET_COUNTRIES.length,
                max_per_country: importForm.value.max_per_country || 30,
                skip_updates: importForm.value.skip_updates !== false,
                search_multiplier: importForm.value.search_multiplier || 4,
                max_runtime_seconds: 120,
                auto_cities: true,
            })
            importResult.value = { type: 'success', message: res.data.message, errors: res.data.errors }
            await refreshRestaurants()
        } catch (e) {
            importResult.value = { type: 'error', message: e.response?.data?.message || 'Xatolik yuz berdi', errors: [] }
        } finally {
            importing.value = false
        }
        return
    }

    if (!importForm.value.country && countrySearch.value.trim()) {
        applyTypedCountry()
    }

    if (citySearch.value.trim()) {
        addTypedCity()
    }

    if (!importForm.value.country || !importForm.value.cities.length) {
        importResult.value = {
            type: 'error',
            message: 'Davlat va kamida bitta shahar kiriting',
            errors: [],
        }
        return
    }

    importResult.value = null
    importing.value    = true
    try {
        const res = await api.post('/admin/import-google-places', {
            country: importForm.value.country,
            cities:  importForm.value.cities,
            cuisine: importForm.value.cuisine || undefined,
            max:     importForm.value.max,
            max_per_country: importForm.value.max_per_country || 30,
            skip_updates: importForm.value.skip_updates !== false,
            search_multiplier: importForm.value.search_multiplier || 4,
            max_runtime_seconds: 90,
        })
        importResult.value = { type: 'success', message: res.data.message, errors: res.data.errors }
        await refreshRestaurants()
    } catch (e) {
        importResult.value = { type: 'error', message: e.response?.data?.message || 'Xatolik yuz berdi', errors: [] }
    } finally {
        importing.value = false
    }
}

// ─── Existing logic ─────────────────────────────────────────────────────────

const filtered = computed(() => {
    const byStatus = restaurants.value.filter(r => {
        if (statusFilter.value === 'active') return !r.deleted_at && r.is_active
        if (statusFilter.value === 'inactive') return !r.deleted_at && !r.is_active
        if (statusFilter.value === 'archived') return !!r.deleted_at
        return true
    })

    if (!search.value) return byStatus
    const q = search.value.toLowerCase()
    return byStatus.filter(r =>
        r.name?.toLowerCase().includes(q) ||
        r.owner?.name?.toLowerCase().includes(q) ||
        r.phone?.includes(q)
    )
})

const selectableFiltered = computed(() => filtered.value.filter(r => !r.deleted_at))

const allVisibleSelected = computed(() => {
    if (!selectableFiltered.value.length) return false
    return selectableFiltered.value.every(r => selectedIds.value.includes(r.id))
})

const activeCount   = computed(() => restaurants.value.filter(r => r.is_active && !r.deleted_at).length)
const inactiveCount = computed(() => restaurants.value.filter(r => !r.is_active && !r.deleted_at).length)
const archivedCount = computed(() => restaurants.value.filter(r => !!r.deleted_at).length)

const resetPage = () => {}

const serverPageNumbers = computed(() => {
    const total = serverLastPage.value
    const cur   = serverPage.value
    const delta = 2
    const range = []
    for (let i = Math.max(1, cur - delta); i <= Math.min(total, cur + delta); i++) range.push(i)
    if (range[0] > 1) { range.unshift('...'); range.unshift(1) }
    if (range[range.length - 1] < total) { range.push('...'); range.push(total) }
    return range
})

function setNotice(message, type = 'success') {
    tableNotice.value = message
    tableNoticeType.value = type
    setTimeout(() => {
        tableNotice.value = ''
        tableNoticeType.value = 'success'
    }, 3500)
}

async function refreshRestaurants(page = serverPage.value) {
    try {
        const res = await api.get('/admin/restaurants', {
            params: { page, per_page: serverPerPage.value }
        })
        const data = res.data
        if (data && Array.isArray(data.data)) {
            restaurants.value = data.data
            serverPage.value = data.current_page ?? page
            serverLastPage.value = data.last_page ?? 1
            serverTotal.value = data.total ?? data.data.length
        } else if (Array.isArray(data)) {
            restaurants.value = data
            serverPage.value = 1
            serverLastPage.value = 1
            serverTotal.value = data.length
        } else {
            restaurants.value = []
        }
    } catch (error) {
        if (error?.response?.status === 401) {
            auth.logout()
            router.push('/login')
            return
        }
        setNotice(error?.response?.data?.message || "Admin ro'yxatini yuklashda xatolik.", 'error')
        restaurants.value = []
    }
}

// ─── Promo slides state ───────────────────────────────────────────────────────
const promoSlides   = ref([])
const promoLoading  = ref(false)
const promoFormOpen = ref(false)
const promoEditId   = ref(null)
const promoSaving   = ref(false)
const promoSaveError = ref('')
const promoImageFile = ref(null)
const promoForm = ref({
    title: '', badge: '', subtitle: '', bg_color: '', sort_order: 0,
    is_active: true, current_image: null
})

function resolvePromoImage(path) {
    if (path) return IMAGE_PLACEHOLDER // VAQTINCHALIK: API rasmlari hozircha ishlamayapti
    if (!path) return ''
    if (path.startsWith('http')) return path
    const base = import.meta.env.VITE_API_URL?.replace('/api', '') ||
                 'http://localhost:8000'
    return `${base}/storage/${path}`
}

async function loadPromoSlides() {
    promoLoading.value = true
    try {
        const res = await api.get('/admin/promo-slides')
        promoSlides.value = Array.isArray(res.data) ? res.data : []
    } catch {
        promoSlides.value = []
    } finally {
        promoLoading.value = false
    }
}

function openPromoForm(slide) {
    promoEditId.value   = slide?.id ?? null
    promoImageFile.value = null
    promoSaveError.value = ''
    promoForm.value = {
        title:         slide?.title      ?? '',
        badge:         slide?.badge      ?? '',
        subtitle:      slide?.subtitle   ?? '',
        bg_color:      slide?.bg_color   ?? 'linear-gradient(120deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        sort_order:    slide?.sort_order ?? 0,
        is_active:     slide?.is_active  ?? true,
        current_image: slide?.image_path ?? null,
    }
    promoFormOpen.value = true
}

async function savePromoSlide() {
    if (!promoForm.value.title.trim()) {
        promoSaveError.value = 'Sarlavha kiritish shart'
        return
    }
    promoSaving.value = true
    promoSaveError.value = ''
    try {
        const fd = new FormData()
        fd.append('title',      promoForm.value.title)
        fd.append('badge',      promoForm.value.badge || '')
        fd.append('subtitle',   promoForm.value.subtitle || '')
        fd.append('bg_color',   promoForm.value.bg_color || '')
        fd.append('sort_order', String(promoForm.value.sort_order ?? 0))
        fd.append('is_active',  promoForm.value.is_active ? '1' : '0')
        if (promoImageFile.value) fd.append('image', promoImageFile.value)

        if (promoEditId.value) {
            await api.post(`/admin/promo-slides/${promoEditId.value}`, fd)
        } else {
            await api.post('/admin/promo-slides', fd)
        }
        promoFormOpen.value = false
        await loadPromoSlides()
    } catch (e) {
        promoSaveError.value = e?.response?.data?.message || 'Saqlashda xatolik'
    } finally {
        promoSaving.value = false
    }
}

async function deletePromoSlide(id) {
    if (!confirm('Slideni o\'chiramizmi?')) return
    try {
        await api.delete(`/admin/promo-slides/${id}`)
        await loadPromoSlides()
    } catch {
        setNotice('Slideni o\'chirishda xatolik', 'error')
    }
}
// ─────────────────────────────────────────────────────────────────────────────

onMounted(async () => {
    try {
        await Promise.all([refreshRestaurants(), loadPromoSlides()])
    } finally {
        loading.value = false
    }
})

const toggle = async (r) => {
    try {
        await api.patch(`/admin/restaurants/${r.id}/toggle`)
        r.is_active = !r.is_active
    } catch (error) {
        setNotice(error?.response?.data?.message || 'Statusni o‘zgartirib bo‘lmadi.', 'error')
    }
}

function toggleSelection(id, checked) {
    if (checked) {
        if (!selectedIds.value.includes(id)) selectedIds.value.push(id)
        return
    }
    selectedIds.value = selectedIds.value.filter(itemId => itemId !== id)
}

function toggleSelectAll(checked) {
    if (checked) {
        selectedIds.value = selectableFiltered.value.map(r => r.id)
        return
    }
    selectedIds.value = []
}

async function bulkSetActive(isActive) {
    if (!selectedIds.value.length) return

    const selectedCount = selectedIds.value.length

    try {
        await api.patch('/admin/restaurants/bulk-status', {
            ids: selectedIds.value,
            is_active: isActive,
        })

        await refreshRestaurants()
        setNotice(
            isActive
                ? `${selectedCount} ta restoran faollashtirildi.`
                : `${selectedCount} ta restoran nofaol qilindi.`
        )
        selectedIds.value = []
    } catch (error) {
        setNotice(error?.response?.data?.message || 'Bulk amal bajarilmadi.', 'error')
    }
}

async function archiveRestaurant(restaurant) {
    const ok = window.confirm(`"${restaurant.name}" restoranni arxivga o'tkazamizmi?`)
    if (!ok) return

    try {
        await api.delete(`/admin/restaurants/${restaurant.id}`)
        await refreshRestaurants()
        selectedIds.value = selectedIds.value.filter(id => id !== restaurant.id)
        setNotice('Restoran arxivga olindi.')
    } catch (error) {
        setNotice(error?.response?.data?.message || 'Arxivlash amalga oshmadi.', 'error')
    }
}

async function restoreRestaurant(restaurant) {
    try {
        await api.patch(`/admin/restaurants/${restaurant.id}/restore`)
        await refreshRestaurants()
        setNotice('Restoran tiklandi.')
    } catch (error) {
        setNotice(error?.response?.data?.message || 'Tiklash amalga oshmadi.', 'error')
    }
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
    text-decoration: none; font-size: 14px; transition: all 0.2s;
}
.nav-link:hover { background: var(--color-primary-tint); color: var(--color-primary); }
.logout-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 10px;
    background: var(--color-danger-tint); color: var(--color-danger-dark);
    border: none; cursor: pointer; font-size: 14px; transition: all 0.2s;
}
.logout-btn:hover { background: var(--color-danger-tint); }

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
    background: var(--color-surface); border-radius: 14px; padding: 18px 20px;
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
.stat-icon-wrap.gray { background: var(--color-border-light); color: var(--color-text-muted); }
.stat-icon-wrap.green { background: var(--color-primary-tint); color: var(--color-primary); }
.stat-icon-wrap.red { background: var(--color-danger-tint); color: var(--color-danger); }
.stat-icon-wrap.orange { background: var(--color-warning-tint); color: var(--color-warning); }
.stat-label { font-size: 12px; color: var(--color-text-faint); margin-bottom: 4px; }
.stat-num { font-size: 24px; font-weight: 800; color: var(--color-text); }
.green-text { color: var(--color-primary); }
.red-text { color: var(--color-danger); }
.orange-text { color: var(--color-warning); }

/* PROMO SLIDER CARD */
.promo-card {
    background: var(--color-surface);
    border-radius: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    overflow: hidden;
}
.promo-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 24px;
    border-bottom: 1px solid var(--color-border-light);
}
.promo-card-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text);
}
.promo-add-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    color: white;
    padding: 9px 13px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
}
.promo-add-btn:hover { filter: brightness(1.03); }

.promo-slides-list { padding: 16px 24px; }
.promo-loading,
.promo-empty {
    padding: 10px 2px;
    color: var(--color-text-faint);
    font-size: 14px;
}
.promo-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.promo-item {
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid var(--color-border-light);
    border-radius: 12px;
    padding: 10px;
    background: var(--color-surface);
}
.promo-item-thumb {
    width: 84px;
    height: 56px;
    border-radius: 10px;
    overflow: hidden;
    background: var(--color-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-faint);
    font-size: 18px;
    flex-shrink: 0;
}
.promo-item-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.promo-item-info {
    min-width: 0;
    flex: 1;
}
.promo-item-info strong {
    display: block;
    color: var(--color-text);
    font-size: 15px;
    line-height: 1.2;
}
.promo-item-info p {
    margin-top: 4px;
    font-size: 13px;
    color: var(--color-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.promo-item-badge {
    display: inline-flex;
    align-items: center;
    margin-bottom: 5px;
    padding: 3px 8px;
    border-radius: 999px;
    background: var(--color-primary-tint);
    color: var(--color-primary-dark);
    font-size: 11px;
    font-weight: 700;
}
.promo-item-actions {
    display: flex;
    align-items: center;
    gap: 7px;
}
.btn-icon {
    width: 33px;
    height: 33px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    color: var(--color-text-muted);
    cursor: pointer;
}
.btn-icon:hover { border-color: var(--color-primary-tint-strong); color: var(--color-primary); }
.btn-icon.red:hover { border-color: var(--color-danger-tint-strong); color: var(--color-danger-dark); }

.text-green { color: var(--color-primary-dark); }
.text-gray { color: var(--color-text-faint); }

/* PROMO MODAL */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.42);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 300;
}
.modal-box {
    width: min(560px, 100%);
    background: var(--color-surface);
    border-radius: 16px;
    box-shadow: 0 18px 52px rgba(2, 8, 23, 0.28);
    overflow: hidden;
}
.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px;
    border-bottom: 1px solid var(--color-border-light);
}
.modal-header h3 {
    font-size: 17px;
    font-weight: 700;
    color: var(--color-text);
}
.modal-close {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    background: var(--color-border-light);
    color: var(--color-text-muted);
    cursor: pointer;
}
.modal-body {
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.form-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.form-row label {
    font-size: 12px;
    font-weight: 700;
    color: var(--color-text-muted);
}
.form-input {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    background: var(--color-surface);
    color: var(--color-text);
    padding: 10px 12px;
    font-size: 14px;
}
.form-input:focus {
    outline: none;
    border-color: var(--color-primary-light);
    box-shadow: 0 0 0 3px rgba(108,92,231, 0.12);
}
.checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--color-text);
}
.promo-preview-img {
    width: 100%;
    max-height: 180px;
    border-radius: 10px;
    object-fit: cover;
    border: 1px solid var(--color-border-light);
}
.notice-error {
    margin-top: 4px;
    font-size: 13px;
    color: var(--color-danger-dark);
    background: var(--color-danger-tint);
    border: 1px solid var(--color-danger-tint-strong);
    border-radius: 8px;
    padding: 8px 10px;
}
.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 14px 18px 16px;
    border-top: 1px solid var(--color-border-light);
}
.btn-cancel,
.btn-save {
    border: none;
    border-radius: 10px;
    padding: 9px 14px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
}
.btn-cancel {
    background: var(--color-border-light);
    color: var(--color-text-muted);
}
.btn-save {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    color: #fff;
}
.btn-save:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

/* TABLE CARD */
.table-card {
    background: var(--color-surface); border-radius: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden;
}
.table-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 24px; border-bottom: 1px solid var(--color-border-light);
}
.table-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}
.bulk-actions { display: flex; align-items: center; gap: 8px; }
.bulk-btn {
    border: none;
    border-radius: 9px;
    padding: 8px 10px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}
.bulk-activate { background: var(--color-primary-tint); color: var(--color-primary-dark); }
.bulk-activate:hover { background: var(--color-primary-tint-strong); }
.bulk-deactivate { background: var(--color-danger-tint); color: var(--color-danger-dark); }
.bulk-deactivate:hover { background: var(--color-danger-tint-strong); }
.table-notice {
    margin: 12px 24px 0;
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--color-primary-tint);
    color: var(--color-primary-dark);
    font-size: 13px;
    font-weight: 600;
}
.table-notice.error {
    background: var(--color-danger-tint);
    color: var(--color-danger-dark);
}
.status-filters {
    display: flex;
    gap: 8px;
    padding: 14px 24px 0;
    flex-wrap: wrap;
}
.status-chip {
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-muted);
    border-radius: 999px;
    padding: 7px 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}
.status-chip:hover { border-color: var(--color-primary-tint-strong); color: var(--color-primary); }
.status-chip.active {
    background: var(--color-primary-tint);
    border-color: var(--color-primary-light);
    color: var(--color-primary-dark);
}
.table-title {
    font-size: 16px; font-weight: 700; color: var(--color-text);
    display: flex; align-items: center; gap: 8px;
}
.table-title i { color: var(--color-primary); }
.table-search {
    display: flex; align-items: center; gap: 8px;
    background: var(--color-bg); border-radius: 10px;
    padding: 8px 14px;
}
.table-search i { color: var(--color-text-faint); font-size: 14px; }
.search-input {
    border: none; background: transparent; outline: none;
    font-size: 14px; color: var(--color-text); width: 200px;
}

/* LOADING / EMPTY */
.loading-state, .empty-state {
    padding: 60px; text-align: center; color: var(--color-text-faint);
    display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.empty-state i { font-size: 40px; }
.spinner {
    width: 36px; height: 36px;
    border: 3px solid var(--color-border-light);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* TABLE */
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; }
.table thead tr { background: var(--color-bg); }
.table th {
    padding: 12px 16px; text-align: left;
    font-size: 11px; font-weight: 600; color: var(--color-text-faint);
    text-transform: uppercase; letter-spacing: 0.04em;
    border-bottom: 1px solid var(--color-border-light);
}
.table-row { transition: background 0.15s; }
.table-row:hover { background: var(--color-border-light); }
.table-row.archived { opacity: 0.8; background: var(--color-bg); }
.table td {
    padding: 14px 16px; border-bottom: 1px solid var(--color-border-light);
    font-size: 14px; color: var(--color-text); vertical-align: middle;
}
.td-num { color: var(--color-text-faint); font-size: 13px; font-weight: 500; }

/* RESTAURANT CELL */
.restaurant-cell { display: flex; align-items: center; gap: 10px; }
.restaurant-thumb {
    width: 40px; height: 40px; border-radius: 10px;
    overflow: hidden; background: var(--color-border-light);
    display: flex; align-items: center; justify-content: center;
    color: var(--color-text-faint); font-size: 16px; flex-shrink: 0;
}
.restaurant-thumb img { width: 100%; height: 100%; object-fit: cover; }
.restaurant-name { font-size: 14px; font-weight: 600; color: var(--color-text); }
.restaurant-desc { font-size: 12px; color: var(--color-text-faint); margin-top: 2px; }

/* OWNER CELL */
.owner-cell { display: flex; align-items: center; gap: 8px; }
.owner-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    color: white; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}

/* PHONE */
.phone-link {
    display: flex; align-items: center; gap: 6px;
    color: var(--color-primary); text-decoration: none; font-size: 13px;
    transition: color 0.2s;
}
.phone-link:hover { color: var(--color-primary-dark); }
.phone-link i { font-size: 11px; }

/* ADDRESS */
.td-address { font-size: 13px; color: var(--color-text-muted); }
.address-icon { color: var(--color-danger); margin-right: 4px; font-size: 11px; }

/* BADGES */
.badge-active, .badge-inactive, .badge-archived {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 20px;
    font-size: 12px; font-weight: 500; white-space: nowrap;
}
.badge-active { background: var(--color-primary-tint); color: var(--color-primary-dark); }
.badge-inactive { background: var(--color-danger-tint); color: var(--color-danger-dark); }
.badge-archived { background: var(--color-border-light); color: var(--color-text-muted); }

/* ACTIONS */
.td-actions { display: flex; align-items: center; gap: 6px; }
.btn-activate, .btn-deactivate {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 12px; border-radius: 8px;
    border: none; cursor: pointer;
    font-size: 12px; font-weight: 500; transition: all 0.2s;
}
.btn-activate { background: var(--color-primary-tint); color: var(--color-primary-dark); }
.btn-activate:hover { background: var(--color-primary-tint-strong); }
.btn-deactivate { background: var(--color-danger-tint); color: var(--color-danger-dark); }
.btn-deactivate:hover { background: var(--color-danger-tint); }
.btn-archive {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 12px; border-radius: 8px;
    border: none; cursor: pointer;
    font-size: 12px; font-weight: 500;
    background: var(--color-border-light); color: var(--color-text-muted);
}
.btn-archive:hover { background: var(--color-border); }
.btn-restore {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 12px; border-radius: 8px;
    border: none; cursor: pointer;
    font-size: 12px; font-weight: 500;
    background: var(--color-info-tint); color: var(--color-info-dark);
}
.btn-restore:hover { background: var(--color-info-tint); }
.btn-view {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--color-border-light); color: var(--color-text-muted);
    display: flex; align-items: center; justify-content: center;
    text-decoration: none; font-size: 14px; transition: all 0.2s;
}
.btn-view:hover { background: var(--color-primary-tint); color: var(--color-primary); }

/* TABLE FOOTER */
.table-footer {
    padding: 14px 24px; border-top: 1px solid var(--color-border-light);
    background: var(--color-bg); font-size: 13px; color: var(--color-text-faint);
    display: flex; justify-content: space-between; align-items: center;
}
.table-footer strong { color: var(--color-text); }
.page-info { font-size: 13px; color: var(--color-text-faint); }

/* PAGINATION */
.table-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 14px 24px;
    border-top: 1px solid var(--color-border-light);
    background: var(--color-bg);
}
.page-btn {
    min-width: 36px; height: 36px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    padding: 0 10px;
    transition: all 0.15s;
}
.page-btn:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary); }
.page-btn.active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-ellipsis { color: var(--color-text-faint); font-size: 14px; padding: 0 4px; }

/* ─── IMPORT CARD ─────────────────────────────────────────────────────────── */
.import-card {
    background: var(--color-surface); border-radius: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: visible;
}
.import-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 18px 24px; border-bottom: 1px solid var(--color-border-light);
    cursor: pointer;
}
.import-title {
    font-size: 16px; font-weight: 700; color: var(--color-text);
    display: flex; align-items: center; gap: 8px;
}
.import-toggle-btn {
    background: var(--color-bg); border: none; cursor: pointer;
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: var(--color-text-muted); transition: all 0.2s;
}
.import-toggle-btn:hover { background: var(--color-primary-tint); color: var(--color-primary); }
.import-body {
    padding: 20px 24px; display: flex; flex-direction: column; gap: 18px;
}
.import-row { display: flex; flex-direction: column; gap: 8px; }
.import-label {
    font-size: 13px; font-weight: 600; color: var(--color-text-muted);
    display: flex; align-items: center; gap: 6px;
}
.import-label i { color: var(--color-primary); }
.import-number-input {
    padding: 10px 14px; border: 1.5px solid var(--color-border); border-radius: 10px;
    font-size: 14px; outline: none; width: 200px; transition: border 0.2s;
}
.import-number-input:focus { border-color: var(--color-primary); }

/* Searchable Select */
.searchable-select { position: relative; }
.ss-input-wrap {
    display: flex; align-items: center; flex-wrap: wrap; gap: 6px;
    padding: 8px 12px; border: 1.5px solid var(--color-border); border-radius: 10px;
    cursor: text; background: var(--color-surface); transition: border 0.2s; min-height: 44px;
}
.ss-input-wrap:focus-within { border-color: var(--color-primary); }
.ss-icon { color: var(--color-text-faint); font-size: 13px; flex-shrink: 0; }
.ss-input {
    border: none; outline: none; font-size: 14px; color: var(--color-text);
    flex: 1; min-width: 120px; background: transparent;
}
.ss-add-btn {
    width: 24px; height: 24px;
    border: none; border-radius: 50%;
    background: var(--color-primary-tint); color: var(--color-primary-dark);
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0;
}
.ss-add-btn:hover { background: var(--color-primary-tint-strong); }
.ss-input:disabled { color: var(--color-text-faint); cursor: not-allowed; }
.ss-selected-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--color-primary-tint); color: var(--color-primary-dark);
    padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 500;
}
.ss-selected-badge i { cursor: pointer; font-size: 10px; }
.ss-selected-badge i:hover { color: var(--color-danger); }
.ss-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.ss-tag {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--color-primary-tint); color: var(--color-primary-dark);
    padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 500;
}
.ss-tag i { cursor: pointer; font-size: 10px; }
.ss-tag i:hover { color: var(--color-danger); }
.ss-dropdown {
    position: absolute; top: calc(100% + 4px); left: 0; right: 0;
    background: var(--color-surface); border: 1.5px solid var(--color-border); border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 200;
    max-height: 220px; overflow-y: auto;
}
.ss-option {
    padding: 10px 14px; font-size: 14px; cursor: pointer;
    display: flex; align-items: center; gap: 8px; transition: background 0.15s;
}
.ss-option:hover { background: var(--color-bg); }
.ss-option.active { background: var(--color-primary-tint); color: var(--color-primary-dark); font-weight: 600; }
.ss-flag { font-size: 18px; }

/* Import run button */
.import-run-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 28px; border-radius: 12px; border: none; cursor: pointer;
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    color: white; font-size: 15px; font-weight: 600;
    transition: all 0.2s; align-self: flex-start;
}
.import-run-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(108,92,231,0.35); }
.import-run-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Import result */
.import-result {
    padding: 14px 18px; border-radius: 12px; font-size: 14px; font-weight: 500;
    display: flex; flex-direction: column; gap: 6px;
}
.import-result.success { background: var(--color-primary-tint); color: var(--color-primary-dark); }
.import-result.error   { background: var(--color-danger-tint); color: var(--color-danger-dark); }
.import-errors { margin-top: 4px; display: flex; flex-direction: column; gap: 4px; }
.import-error-item { font-size: 12px; opacity: 0.85; }

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