import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: () => import('../views/LobbyView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/game-mode',
      name: 'game-mode',
      component: () => import('../views/GameModeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/room/:id',
      name: 'room',
      component: () => import('../views/RoomView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../views/GameView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatGlobalView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation Guards (Protección de rutas)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Rutas que requieren autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  }
  // Rutas solo para invitados (login/register)
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/lobby')
  }
  else {
    next()
  }
})

export default router
