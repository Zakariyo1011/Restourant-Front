import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: { layout: 'public', requiresAuth: true },
    },
    {
        path: '/restaurant/:id',
        name: 'restaurant',
        component: () => import('../views/RestaurantView.vue'),
        meta: { layout: 'public', requiresAuth: true },
    },
    {
        path: '/restaurant/:id/directions',
        name: 'restaurant-directions',
        component: () => import('../views/DirectionsView.vue'),
        meta: { layout: 'public', requiresAuth: true },
    },
    {
        path: '/map',
        name: 'map',
        component: () => import('../views/MapView.vue'),
        meta: { layout: 'public', requiresAuth: true },
    },
    {
        path: '/search',
        name: 'search',
        component: () => import('../views/SearchView.vue'),
        meta: { layout: 'public', requiresAuth: true },
    },
    {
        path: '/favorites',
        name: 'favorites',
        component: () => import('../views/FavoritesView.vue'),
        meta: { layout: 'public', requiresAuth: true },
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('../views/ProfileView.vue'),
        meta: { layout: 'public', requiresAuth: true },
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/SettingsView.vue'),
        meta: { layout: 'public', requiresAuth: true },
    },
    {
        path: '/help',
        name: 'help',
        component: () => import('../views/HelpView.vue'),
        meta: { layout: 'public', requiresAuth: true },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
        meta: { layout: 'bare' },
    },
    {
        path: '/auth/callback',
        name: 'auth-callback',
        component: () => import('../views/AuthCallback.vue'),
        meta: { layout: 'bare' },
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { requiresAuth: true, requiresOwner: true, layout: 'admin' },
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/AdminView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' },
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