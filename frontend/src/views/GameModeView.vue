<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Backgrounds rotativos -->
    <div
      v-for="(bg, index) in backgrounds"
      :key="index"
      class="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms]"
      :style="{
        backgroundImage: `url(${bg})`,
        opacity: currentBgIndex === index ? 1 : 0,
        zIndex: 0
      }"
    ></div>

    <!-- Overlay oscuro -->
    <div class="absolute inset-0 bg-black/60 z-[0]"></div>

    <!-- Efecto de parpadeo -->
    <div class="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_2px)] pointer-events-none animate-[flicker_0.15s_infinite] z-[0]"></div>

    <NavBar />

    <div class="mx-auto px-5 py-[60px] relative z-[1]">
      <div class="text-center mb-[100px]">
        <h1 class="text-6xl md:text-7xl text-backrooms-yellow mb-4 font-['Courier_New',monospace] tracking-[8px]">
          Backrooms
        </h1>
      </div>

      <div class="max-w-md mx-auto space-y-5 mb-[60px]">
        <!-- Jugar Solo -->
        <div
          @click="handleSoloPlay"
          class="bg-backrooms-dark-light/80 rounded-lg p-6 cursor-pointer transition-all duration-300 ease-in-out hover:bg-backrooms-dark-light hover:border-backrooms-yellow/60 hover:shadow-[0_8px_30px_rgba(255,220,100,0.2)] hover:-translate-y-1"
        >
          <h2 class="text-backrooms-yellow text-3xl text-center font-['Courier_New',monospace] tracking-wide">
            Jugar Solo
          </h2>
        </div>

        <!-- Crear Sala -->
        <div
          @click="handleMultiplayerCreate"
          class="bg-backrooms-dark-light/80  rounded-lg p-6 cursor-pointer transition-all duration-300 ease-in-out hover:bg-backrooms-dark-light hover:border-backrooms-yellow/60 hover:shadow-[0_8px_30px_rgba(255,220,100,0.2)] hover:-translate-y-1"
        >
          <h2 class="text-backrooms-yellow text-3xl text-center font-['Courier_New',monospace] tracking-wide">
            Crear Sala
          </h2>
        </div>
      </div>

      <div class="text-center">
        <button
          @click="router.push('/lobby')"
          class="px-8 py-3 bg-backrooms-yellow/10 rounded-lg text-backrooms-yellow text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-backrooms-yellow/20 hover:border-backrooms-yellow/50 hover:-translate-y-0.5"
        >
          ← Volver al Lobby
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { roomAPI } from '@/services/api'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const authStore = useAuthStore()

// Backgrounds rotativos
const backgrounds = [
  '/images/background/background-1.jpg',
  '/images/background/background-2.jpg',
  '/images/background/background-3.jpg'
]
const currentBgIndex = ref(0)
let bgInterval = null

onMounted(() => {
  // Cambiar background cada 7 segundos
  bgInterval = setInterval(() => {
    currentBgIndex.value = (currentBgIndex.value + 1) % backgrounds.length
  }, 7000)
})

onUnmounted(() => {
  if (bgInterval) {
    clearInterval(bgInterval)
  }
})

async function handleSoloPlay() {
  try {
    // Crear una sala solo para el jugador
    const response = await roomAPI.createRoom(
      `${authStore.user?.username || 'Jugador'} - Solo`,
      1 // Máximo 1 jugador
    )

    if (response.success) {
      // Guardar en localStorage
      localStorage.setItem('currentRoomId', response.data.room.id)
      localStorage.setItem('isSoloGame', 'true')

      // Ir directamente al juego
      router.push('/game')
    }
  } catch (err) {
    alert(err.message || 'Error al crear partida individual')
  }
}

function handleMultiplayerCreate() {
  // Redirigir al lobby donde están las opciones de crear sala
  router.push('/lobby')
}
</script>
