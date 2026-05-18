import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n, { setLocale } from './i18n'
import VueGoogleMaps from '@fawmi/vue-google-maps'

const app = createApp(App)

setLocale(i18n.global.locale.value)

app.use(createPinia())
app.use(i18n)
app.use(router)
app.use(VueGoogleMaps, {
    load: {
        key: 'YOUR_GOOGLE_MAPS_API_KEY', // keyinroq o'zgartiramiz
    }
})

app.mount('#app')