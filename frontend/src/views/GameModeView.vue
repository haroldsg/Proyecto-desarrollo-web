<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2416] to-[#1a1a1a] relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_2px)] before:pointer-events-none before:animate-[flicker_0.15s_infinite]">
    <NavBar />

    <div class="max-w-[1200px] mx-auto px-5 py-[60px] relative z-[1]">
      <div class="text-center mb-[60px]">
        <h1 class="text-6xl md:text-7xl text-backrooms-yellow mb-4 shadow-[0_0_40px_rgba(255,220,100,0.5)] font-['Courier_New',monospace] tracking-[8px]">
          🎮 Backrooms
        </h1>
        <p class="text-xl md:text-2xl text-[#ccc] font-light">
          Elige cómo quieres jugar
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-[60px]">
        <!-- Jugar Solo -->
        <div
          @click="handleSoloPlay"
          class="bg-backrooms-dark-light/80 border-2 border-backrooms-yellow/30 rounded-2xl p-10 cursor-pointer transition-all duration-[400ms] ease-in-out relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-br before:from-backrooms-yellow/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-[400ms] hover:before:opacity-100 hover:-translate-y-2.5 hover:scale-[1.02] hover:border-blue-400/60 hover:shadow-[0_20px_60px_rgba(100,150,255,0.2)]"
        >
          <div class="text-[5rem] mb-5 text-center drop-shadow-[0_0_20px_rgba(255,220,100,0.4)]">
            🚶
          </div>
          <h2 class="text-backrooms-yellow text-3xl mb-4 text-center font-['Courier_New',monospace]">
            Jugar Solo
          </h2>
          <p class="text-[#ccc] text-base leading-relaxed mb-6 text-center">
            Explora los Backrooms por tu cuenta. Enfréntate a los desafíos en solitario.
          </p>
          <ul class="list-none p-0 m-0 mb-8">
            <li class="text-[#999] text-[0.95rem] py-2 border-b border-backrooms-yellow/10 last:border-b-0">
              ✓ Partida individual
            </li>
            <li class="text-[#999] text-[0.95rem] py-2 border-b border-backrooms-yellow/10 last:border-b-0">
              ✓ Progreso personal
            </li>
            <li class="text-[#999] text-[0.95rem] py-2 border-b border-backrooms-yellow/10 last:border-b-0">
              ✓ Dificultad ajustada
            </li>
            <li class="text-[#999] text-[0.95rem] py-2 border-b border-backrooms-yellow/10 last:border-b-0">
              ✓ Inicio inmediato
            </li>
          </ul>
          <button class="w-full py-4 bg-gradient-to-br from-[#6f9fff] to-[#4477dd] border-none rounded-lg text-white text-xl font-bold cursor-pointer transition-all duration-300 uppercase tracking-[2px] hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(100,150,255,0.5)]">
            Comenzar Solo
          </button>
        </div>

        <!-- Crear Partida Multijugador -->
        <div
          @click="handleMultiplayerCreate"
          class="bg-backrooms-dark-light/80 border-2 border-backrooms-yellow/30 rounded-2xl p-10 cursor-pointer transition-all duration-[400ms] ease-in-out relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-br before:from-backrooms-yellow/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-[400ms] hover:before:opacity-100 hover:-translate-y-2.5 hover:scale-[1.02] hover:border-[#ff6496]/60 hover:shadow-[0_20px_60px_rgba(255,100,150,0.2)]"
        >
          <div class="text-[5rem] mb-5 text-center drop-shadow-[0_0_20px_rgba(255,220,100,0.4)]">
            👥
          </div>
          <h2 class="text-backrooms-yellow text-3xl mb-4 text-center font-['Courier_New',monospace]">
            Crear Partida
          </h2>
          <p class="text-[#ccc] text-base leading-relaxed mb-6 text-center">
            Crea una sala y juega con amigos. Trabajen juntos para sobrevivir.
          </p>
          <ul class="list-none p-0 m-0 mb-8">
            <li class="text-[#999] text-[0.95rem] py-2 border-b border-backrooms-yellow/10 last:border-b-0">
              ✓ Multijugador cooperativo
            </li>
            <li class="text-[#999] text-[0.95rem] py-2 border-b border-backrooms-yellow/10 last:border-b-0">
              ✓ Hasta 4 jugadores
            </li>
            <li class="text-[#999] text-[0.95rem] py-2 border-b border-backrooms-yellow/10 last:border-b-0">
              ✓ Chat en tiempo real
            </li>
            <li class="text-[#999] text-[0.95rem] py-2 border-b border-backrooms-yellow/10 last:border-b-0">
              ✓ Eres el host
            </li>
          </ul>
          <button class="w-full py-4 bg-gradient-to-br from-[#ff6f9f] to-[#dd4477] border-none rounded-lg text-white text-xl font-bold cursor-pointer transition-all duration-300 uppercase tracking-[2px] hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(255,100,150,0.5)]">
            Crear Sala
          </button>
        </div>
      </div>

      <div class="text-center">
        <button
          @click="router.push('/lobby')"
          class="px-8 py-3 bg-backrooms-yellow/10 border border-backrooms-yellow/30 rounded-lg text-backrooms-yellow text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-backrooms-yellow/20 hover:border-backrooms-yellow/50 hover:-translate-y-0.5"
        >
          ← Volver al Lobby
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { roomAPI } from '@/services/api'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const authStore = useAuthStore()

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
