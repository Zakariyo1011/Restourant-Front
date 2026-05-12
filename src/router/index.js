import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
    },
    {
        path: '/restaurant/:id',
        name: 'restaurant',
        component: () => import('../views/RestaurantView.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
    },
    {
        path: '/auth/callback',
        name: 'auth-callback',
        component: () => import('../views/AuthCallback.vue'),
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { requiresAuth: true, requiresOwner: true },
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/AdminView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Route guard
router.beforeEach(async (to) => {
    const auth = useAuthStore()

    if (auth.token && !auth.user) {
        await auth.fetchUser()
    }

    if (to.meta.requiresAuth && !auth.isLoggedIn) {
        return { name: 'login' }
    }

    if (to.meta.requiresAdmin && !auth.isAdmin) {
        return { name: 'home' }
    }

    if (to.meta.requiresOwner && !auth.isOwner) {
        return { name: 'home' }
    }
})

export default router