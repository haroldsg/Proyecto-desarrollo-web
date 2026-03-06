<template>
  <nav class="sticky top-0 z-50 bg-backrooms-dark/95 backdrop-blur-md border-b-2 border-backrooms-yellow/30 px-5 h-[70px] flex items-center justify-between">
    <!-- Left Side -->
    <div class="flex items-center gap-8">
      <!-- Logo -->
      <div class="flex items-center gap-2.5 font-mono">
        <span class="text-3xl">🚪</span>
        <span class="text-xl font-bold text-backrooms-yellow tracking-[3px] drop-shadow-[0_0_10px_rgba(255,220,100,0.3)] md:inline hidden">
          BACKROOMS
        </span>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex gap-1.5">
        <router-link
          to="/lobby"
          class="nav-tab group"
          active-class="nav-tab-active"
        >
          <span class="text-xl">🏠</span>
          <span class="hidden sm:inline font-semibold">Lobby</span>
        </router-link>

        <router-link
          to="/game-mode"
          class="nav-tab group"
          active-class="nav-tab-active"
        >
          <span class="text-xl">🎮</span>
          <span class="hidden sm:inline font-semibold">Jugar</span>
        </router-link>

        <router-link
          to="/chat"
          class="nav-tab group"
          active-class="nav-tab-active"
        >
          <span class="text-xl">💬</span>
          <span class="hidden sm:inline font-semibold">Chat Global</span>
        </router-link>

        <router-link
          v-if="currentRoom"
          :to="`/room/${currentRoom.id}`"
          class="nav-tab group"
          active-class="nav-tab-active"
        >
          <span class="text-xl">🚪</span>
          <span class="hidden sm:inline font-semibold">Sala</span>
        </router-link>

        <router-link
          v-if="inGame"
          to="/game"
          class="nav-tab group"
          active-class="nav-tab-active"
        >
          <span class="text-xl">🎮</span>
          <span class="hidden sm:inline font-semibold">Juego</span>
        </router-link>
      </div>
    </div>

    <!-- Right Side - User Profile -->
    <div class="relative" ref="userMenuRef">
      <div
        @click="toggleDropdown"
        class="flex items-center gap-3 px-4 py-2 bg-black/30 border border-backrooms-yellow/20 rounded-lg cursor-pointer transition-all duration-300 hover:bg-backrooms-yellow/10 hover:border-backrooms-yellow/40"
      >
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark flex items-center justify-center text-backrooms-dark font-bold text-lg">
          {{ userInitial }}
        </div>
        <span class="hidden sm:inline text-white font-semibold text-sm">{{ username }}</span>
        <span class="text-xs text-gray-400 transition-transform duration-300" :class="{ 'rotate-180': showDropdown }">▼</span>
      </div>

      <!-- Dropdown Menu -->
      <transition name="dropdown">
        <div
          v-if="showDropdown"
          class="absolute top-[calc(100%+10px)] right-0 min-w-[220px] bg-backrooms-dark/98 border-2 border-backrooms-yellow/30 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.6)] overflow-hidden z-[100]"
        >
          <div class="px-5 py-3 flex flex-col gap-1">
            <div class="text-xs text-gray-400 uppercase">Usuario</div>
            <div class="text-sm text-backrooms-yellow font-semibold">{{ username }}</div>
          </div>

          <div class="h-px bg-backrooms-yellow/20 my-1"></div>

          <button
            @click="handleLogout"
            class="w-full px-5 py-3 text-left flex items-center gap-2.5 text-red-400 font-semibold text-sm transition-colors hover:bg-red-400/10 hover:text-red-300"
          >
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showDropdown = ref(false)
const currentRoom = ref(null)
const inGame = ref(false)
const userMenuRef = ref(null)

const username = computed(() => authStore.username)
const userInitial = computed(() => username.value.charAt(0).toUpperCase())

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function handleLogout() {
  showDropdown.value = false
  authStore.logout()
  router.push('/login')
}

// Cerrar dropdown al hacer click fuera
function handleClickOutside(event) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Custom styles for nav tabs */
.nav-tab {
  @apply flex items-center gap-2 px-5 py-2.5 bg-black/30 border border-backrooms-yellow/20 rounded-lg text-gray-300 no-underline transition-all duration-300 text-sm;
}

.nav-tab:hover {
  @apply bg-backrooms-yellow/10 border-backrooms-yellow/40 text-backrooms-yellow;
}

.nav-tab-active {
  @apply bg-gradient-to-br from-backrooms-yellow/20 to-backrooms-yellow-dark/20 border-backrooms-yellow text-backrooms-yellow shadow-[0_0_15px_rgba(255,220,100,0.2)];
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease-out;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Mobile responsive adjustments */
@media (max-width: 640px) {
  nav {
    @apply px-2.5 h-[60px];
  }

  .nav-tab {
    @apply px-3 py-2;
  }
}
</style>
