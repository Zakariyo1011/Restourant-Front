import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

// Har bir so'rovga token qo'shish
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api