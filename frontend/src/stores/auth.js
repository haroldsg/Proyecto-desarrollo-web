import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/services/api'
import socketService from '@/services/socket'

export const useAuthStore = defineStore('auth', () => {
  // State (variables reactivas)
  const user = ref(null)
  const token = ref(localStorage.getItem('backrooms_token') || null)
  const loading = ref(false)
  const error = ref(null)

  // Getters (valores computados)
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const username = computed(() => user.value?.username || '')
  const userId = computed(() => user.value?.id || null)

  // Actions (funciones)
  async function register(username, email, password) {
    loading.value = true
    error.value = null

    try {
      const response = await authAPI.register(username, email, password)

      if (response.success) {
        token.value = response.data.token
        user.value = response.data.user
        localStorage.setItem('backrooms_token', token.value)
        localStorage.setItem('backrooms_user', JSON.stringify(user.value))

        // Conectar Socket.io
        socketService.connect(token.value)
        return { success: true }
      }
    } catch (err) {
      error.value = err.message || 'Error al registrarse'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function login(email, password) {
    loading.value = true
    error.value = null

    try {
      const response = await authAPI.login(email, password)

      if (response.success) {
        token.value = response.data.token
        user.value = response.data.user
        localStorage.setItem('backrooms_token', token.value)
        localStorage.setItem('backrooms_user', JSON.stringify(user.value))

        // Conectar Socket.io
        socketService.connect(token.value)
        return { success: true }
      }
    } catch (err) {
      error.value = err.message || 'Error al iniciar sesión'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function getMe() {
    if (!token.value) return

    try {
      const response = await authAPI.getMe()
      if (response.success) {
        user.value = response.data.user
        localStorage.setItem('backrooms_user', JSON.stringify(user.value))

        // Conectar Socket.io si no está conectado
        if (!socketService.connected) {
          socketService.connect(token.value)
        }
      }
    } catch (err) {
      console.error('Error al obtener usuario:', err)
      logout()
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('backrooms_token')
    localStorage.removeItem('backrooms_user')
    socketService.disconnect()
  }

  // Inicializar desde localStorage
  function init() {
    const savedUser = localStorage.getItem('backrooms_user')
    if (savedUser && token.value) {
      user.value = JSON.parse(savedUser)
      socketService.connect(token.value)
      // Verificar token
      getMe()
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    username,
    userId,
    // Actions
    register,
    login,
    logout,
    getMe,
    init
  }
})
