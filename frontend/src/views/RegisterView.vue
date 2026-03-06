<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-backrooms-dark-light via-[#2d2416] to-backrooms-dark-light">
    <!-- Backrooms Flicker Effect -->
    <div class="absolute inset-0 pointer-events-none opacity-95 animate-flicker bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_2px)]"></div>

    <!-- Auth Card -->
    <div class="relative z-10 w-full max-w-md mx-4 sm:mx-0">
      <div class="bg-backrooms-dark/95 border-2 border-backrooms-yellow/30 rounded-xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_60px_rgba(255,220,100,0.1)]">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-backrooms-yellow mb-2.5 font-mono tracking-[4px] drop-shadow-[0_0_20px_rgba(255,220,100,0.5)]">
            🚪 BACKROOMS
          </h1>
          <p class="text-gray-400 text-sm">Crea tu cuenta para explorar</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleRegister" class="mb-6">
          <!-- Error Message -->
          <div
            v-if="error"
            class="bg-red-500/20 border border-red-500/50 text-red-300 px-3 py-3 rounded-md mb-5 text-sm"
          >
            {{ error }}
          </div>

          <!-- Username Input -->
          <div class="mb-5">
            <label for="username" class="block text-gray-300 mb-2 text-sm font-medium">
              Usuario
            </label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              placeholder="Tu nombre de usuario"
              required
              minlength="3"
              autocomplete="username"
              class="w-full px-4 py-3 bg-black/40 border border-backrooms-yellow/20 rounded-md text-white text-base transition-all duration-300 focus:outline-none focus:border-backrooms-yellow focus:shadow-[0_0_15px_rgba(255,220,100,0.2)]"
            />
          </div>

          <!-- Email Input -->
          <div class="mb-5">
            <label for="email" class="block text-gray-300 mb-2 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="tu@email.com"
              required
              autocomplete="email"
              class="w-full px-4 py-3 bg-black/40 border border-backrooms-yellow/20 rounded-md text-white text-base transition-all duration-300 focus:outline-none focus:border-backrooms-yellow focus:shadow-[0_0_15px_rgba(255,220,100,0.2)]"
            />
          </div>

          <!-- Password Input -->
          <div class="mb-5">
            <label for="password" class="block text-gray-300 mb-2 text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="••••••••"
              required
              minlength="6"
              autocomplete="new-password"
              class="w-full px-4 py-3 bg-black/40 border border-backrooms-yellow/20 rounded-md text-white text-base transition-all duration-300 focus:outline-none focus:border-backrooms-yellow focus:shadow-[0_0_15px_rgba(255,220,100,0.2)]"
            />
          </div>

          <!-- Confirm Password Input -->
          <div class="mb-5">
            <label for="confirmPassword" class="block text-gray-300 mb-2 text-sm font-medium">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              minlength="6"
              autocomplete="new-password"
              class="w-full px-4 py-3 bg-black/40 border border-backrooms-yellow/20 rounded-md text-white text-base transition-all duration-300 focus:outline-none focus:border-backrooms-yellow focus:shadow-[0_0_15px_rgba(255,220,100,0.2)]"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark border-none rounded-md text-backrooms-dark text-lg font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(255,220,100,0.4)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {{ loading ? 'Creando cuenta...' : 'Registrarse' }}
          </button>
        </form>

        <!-- Footer -->
        <div class="text-center pt-5 border-t border-backrooms-yellow/10">
          <p class="text-gray-400 mb-2.5 text-sm">¿Ya tienes cuenta?</p>
          <router-link
            to="/login"
            class="text-backrooms-yellow no-underline font-semibold transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,220,100,0.5)]"
          >
            Inicia sesión aquí
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref(null)

async function handleRegister() {
  error.value = null

  // Validar contraseñas
  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (formData.value.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  loading.value = true

  const result = await authStore.register(
    formData.value.username,
    formData.value.email,
    formData.value.password
  )

  if (result.success) {
    router.push('/lobby')
  } else {
    error.value = result.error || 'Error al registrarse'
  }

  loading.value = false
}
</script>
