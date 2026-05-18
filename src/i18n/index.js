import { createI18n } from 'vue-i18n'
import en from './locales/en'
import ru from './locales/ru'
import uz from './locales/uz'
import kk from './locales/kk'
import ky from './locales/ky'
import tg from './locales/tg'

const STORAGE_KEY = 'locale'
const SUPPORTED = ['en', 'ru', 'uz', 'kk', 'ky', 'tg']

function detectLocale() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && SUPPORTED.includes(saved)) return saved

    const browser = (navigator.language || 'uz').slice(0, 2).toLowerCase()
    if (SUPPORTED.includes(browser)) return browser

    return 'uz'
}

const i18n = createI18n({
    legacy: false,
    locale: detectLocale(),
    fallbackLocale: 'uz',
    messages: { en, ru, uz, kk, ky, tg },
})

export function setLocale(code) {
    if (!SUPPORTED.includes(code)) return
    i18n.global.locale.value = code
    localStorage.setItem(STORAGE_KEY, code)
    document.documentElement.lang = code
}

export const LOCALE_OPTIONS = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
    { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
    { code: 'ky', name: 'Кыргызча', flag: '🇰🇬' },
    { code: 'tg', name: 'Тоҷикӣ', flag: '🇹🇯' },
]

export { SUPPORTED }
export default i18n
