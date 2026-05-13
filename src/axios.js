import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://restourant-production-6ae5.up.railway.app/api',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api