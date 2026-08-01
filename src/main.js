import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n, { setLocale } from './i18n'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import { IMAGE_PLACEHOLDER } from './utils/imageUrl'

const app = createApp(App)

setLocale(i18n.global.locale.value)

// VAQTINCHALIK: API rasmlari ochilmay qolganda o'rniga placeholder ko'rsatamiz

document.addEventListener('error', (event) => {
    const target = event.target
    if (target instanceof HTMLImageElement && !target.dataset.placeholderApplied) {
        target.dataset.placeholderApplied = 'true'
        target.src = IMAGE_PLACEHOLDER
    }
}, true)

app.use(createPinia())
app.use(i18n)
app.use(router)
app.use(VueGoogleMaps, {
    load: {
        key: 'YOUR_GOOGLE_MAPS_API_KEY', // keyinroq o'zgartiramiz
    }
})

app.mount('#app')