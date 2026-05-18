import axios from 'axios'
import { API_BASE } from './utils/api'

const api = axios.create({
    baseURL: API_BASE,
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
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type']
    }
    return config
})

export default api