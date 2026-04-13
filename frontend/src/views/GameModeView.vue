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

        <!-- Continuar Partida (solo si status = 'playing') -->
        <div
          v-if="activeRoom && activeRoom.status === 'playing'"
          @click="handleContinue"
          class="bg-gradient-to-br from-backrooms-yellow/20 to-backrooms-yellow/10 border-2 border-backrooms-yellow rounded-lg p-6 cursor-pointer transition-all duration-300 ease-in-out hover:from-backrooms-yellow/30 hover:to-backrooms-yellow/20 hover:shadow-[0_8px_30px_rgba(255,220,100,0.3)] hover:-translate-y-1"
        >
          <h2 class="text-backrooms-yellow text-3xl text-center font-['Courier_New',monospace] tracking-wide">
            Continuar Partida
          </h2>
          <p class="text-backrooms-yellow/70 text-sm text-center mt-2">
            {{ activeRoom.room_name }}
          </p>
        </div>

        <!-- Volver a la Sala (solo si status = 'waiting') -->
        <div
          v-if="activeRoom && activeRoom.status === 'waiting'"
          @click="handleReturnToRoom"
          class="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-400/60 rounded-lg p-6 cursor-pointer transition-all duration-300 ease-in-out hover:from-blue-500/30 hover:to-blue-600/20 hover:shadow-[0_8px_30px_rgba(100,150,255,0.3)] hover:-translate-y-1"
        >
          <h2 class="text-blue-300 text-3xl text-center font-['Courier_New',monospace] tracking-wide">
            Volver a la Sala
          </h2>
          <p class="text-blue-300/60 text-sm text-center mt-2">
            {{ activeRoom.room_name }} · Esperando jugadores...
          </p>
        </div>

        <!-- Jugar Solo -->
        <div
          @click="handleSoloPlay"
          class="bg-backrooms-dark-light/80 rounded-lg p-6 cursor-pointer transition-all duration-300 ease-in-out hover:bg-backrooms-dark-light hover:border-backrooms-yellow/60 hover:shadow-[0_8px_30px_rgba(255,220,100,0.2)] hover:-translate-y-1"
        >
          <h2 class="text-backrooms-yellow text-3xl text-center font-['Courier_New',monospace] tracking-wide">
            {{ activeRoom ? 'Nueva Partida Solo' : 'Jugar Solo' }}
          </h2>
        </div>

        <!-- Crear Sala (solo si no hay sala en espera) -->
        <div
          v-if="!activeRoom || activeRoom.status === 'playing'"
          @click="handleMultiplayerCreate"
          class="bg-backrooms-dark-light/80 rounded-lg p-6 cursor-pointer transition-all duration-300 ease-in-out hover:bg-backrooms-dark-light hover:border-backrooms-yellow/60 hover:shadow-[0_8px_30px_rgba(255,220,100,0.2)] hover:-translate-y-1"
        >
          <h2 class="text-backrooms-yellow text-3xl text-center font-['Courier_New',monospace] tracking-wide">
            Crear Sala
          </h2>
        </div>

        <!-- Salir de la Sala/Partida (si hay sala o partida activa) -->
        <div
          v-if="activeRoom"
          @click="handleLeaveGame"
          class="bg-red-600/20 rounded-lg p-6 cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-600/30 hover:border-red-500/70 hover:shadow-[0_8px_30px_rgba(255,70,70,0.3)] hover:-translate-y-1"
        >
          <h2 class="text-red-400 text-3xl text-center font-['Courier_New',monospace] tracking-wide">
            {{ activeRoom.status === 'waiting' ? 'Salir de la Sala' : 'Salir de la Partida' }}
          </h2>
        </div>
      </div>

      <!-- Modal de Advertencia para Nueva Partida -->
      <div
        v-if="showWarning"
        class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5"
        @click.self="showWarning = false"
      >
        <div class="bg-backrooms-dark border-2 border-red-500/50 rounded-lg p-8 max-w-md w-full">
          <h3 class="text-red-400 text-2xl font-['Courier_New',monospace] mb-4 text-center">
            ⚠️ ADVERTENCIA
          </h3>
          <p class="text-white/90 text-center mb-6">
            <template v-if="activeRoom?.status === 'waiting'">
              Ya tienes una sala activa. Si continúas, <span class="text-red-400 font-bold">saldrás de esa sala</span> y los demás jugadores serán notificados.
            </template>
            <template v-else>
              Ya tienes una partida activa. Si continúas, <span class="text-red-400 font-bold">perderás todo el progreso</span> de tu partida anterior.
            </template>
          </p>
          <p class="text-backrooms-yellow/70 text-sm text-center mb-6">
            Partida actual: {{ activeRoom?.room_name }}
          </p>
          <div class="flex gap-4">
            <button
              @click="showWarning = false"
              class="flex-1 py-3 bg-backrooms-yellow/10 border border-backrooms-yellow/30 rounded-lg text-backrooms-yellow font-semibold transition-all duration-300 hover:bg-backrooms-yellow/20"
            >
              Cancelar
            </button>
            <button
              @click="confirmNewGame"
              class="flex-1 py-3 bg-gradient-to-br from-red-600 to-red-800 border-none rounded-lg text-white font-bold transition-all duration-300 hover:from-red-700 hover:to-red-900"
            >
              Abandonar y Continuar
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de Advertencia para Salir -->
      <div
        v-if="showLeaveWarning"
        class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5"
        @click.self="showLeaveWarning = false"
      >
        <div class="bg-backrooms-dark border-2 border-red-500/50 rounded-lg p-8 max-w-md w-full">
          <h3 class="text-red-400 text-2xl font-['Courier_New',monospace] mb-4 text-center">
            ⚠️ {{ activeRoom?.status === 'waiting' ? 'SALIR DE LA SALA' : 'SALIR DE LA PARTIDA' }}
          </h3>
          <p class="text-white/90 text-center mb-6">
            <template v-if="activeRoom?.status === 'waiting'">
              ¿Estás seguro de que quieres salir? Los demás jugadores serán notificados.
            </template>
            <template v-else>
              ¿Estás seguro de que quieres salir? <span class="text-red-400 font-bold">Perderás todo el progreso</span> de esta partida.
            </template>
          </p>
          <p class="text-backrooms-yellow/70 text-sm text-center mb-6">
            {{ activeRoom?.room_name }}
          </p>
          <div class="flex gap-4">
            <button
              @click="showLeaveWarning = false"
              class="flex-1 py-3 bg-backrooms-yellow/10 border border-backrooms-yellow/30 rounded-lg text-backrooms-yellow font-semibold transition-all duration-300 hover:bg-backrooms-yellow/20"
            >
              Cancelar
            </button>
            <button
              @click="confirmLeaveGame"
              class="flex-1 py-3 bg-gradient-to-br from-red-600 to-red-800 border-none rounded-lg text-white font-bold transition-all duration-300 hover:from-red-700 hover:to-red-900"
            >
              Salir de la Partida
            </button>
          </div>
        </div>
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

// Estado de partida activa
const activeRoom = ref(null)
const showWarning = ref(false)
const showLeaveWarning = ref(false)
const pendingAction = ref(null) // 'solo' o 'multiplayer'

onMounted(async () => {
  // Cambiar background cada 7 segundos
  bgInterval = setInterval(() => {
    currentBgIndex.value = (currentBgIndex.value + 1) % backgrounds.length
  }, 7000)

  // Verificar si hay partida activa
  await checkActiveRoom()
})

onUnmounted(() => {
  if (bgInterval) {
    clearInterval(bgInterval)
  }
})

// Verificar si el usuario tiene una partida activa
async function checkActiveRoom() {
  try {
    const response = await roomAPI.getCurrentRoom()
    if (response.success && response.data.room) {
      activeRoom.value = response.data.room
    }
  } catch (err) {
    // No hay partida activa o error
    activeRoom.value = null
  }
}

// Continuar partida existente (status = 'playing')
function handleContinue() {
  if (activeRoom.value) {
    localStorage.setItem('currentRoomId', activeRoom.value.id)
    router.push('/game')
  }
}

// Volver a la sala de espera (status = 'waiting')
function handleReturnToRoom() {
  if (activeRoom.value) {
    localStorage.setItem('currentRoomId', activeRoom.value.id)
    router.push(`/room/${activeRoom.value.id}`)
  }
}

// Manejar inicio de partida solo
async function handleSoloPlay() {
  // Si hay partida activa, mostrar advertencia
  if (activeRoom.value) {
    pendingAction.value = 'solo'
    showWarning.value = true
    return
  }

  // Si no hay partida activa, crear directamente
  await createSoloGame()
}

// Crear partida solo
async function createSoloGame() {
  try {
    const response = await roomAPI.createRoom(
      `${authStore.user?.username || 'Jugador'} - Solo`,
      1 // Máximo 1 jugador
    )

    if (response.success) {
      localStorage.setItem('currentRoomId', response.data.room.id)
      localStorage.setItem('isSoloGame', 'true')
      router.push('/game')
    }
  } catch (err) {
    alert(err.message || 'Error al crear partida individual')
  }
}

// Manejar creación de sala multijugador
function handleMultiplayerCreate() {
  // Ir directamente al lobby (sin warning)
  router.push('/lobby')
}

// Manejar salir de la partida
function handleLeaveGame() {
  showLeaveWarning.value = true
}

// Confirmar abandono de partida y crear nueva
async function confirmNewGame() {
  try {
    // Abandonar la partida actual
    if (activeRoom.value) {
      await roomAPI.leaveRoom(activeRoom.value.id)
      localStorage.removeItem('currentRoomId')
      localStorage.removeItem('isSoloGame')
    }

    // Cerrar modal
    showWarning.value = false

    // Ejecutar la acción pendiente
    if (pendingAction.value === 'solo') {
      await createSoloGame()
    } else if (pendingAction.value === 'multiplayer') {
      router.push('/lobby')
    }

    // Limpiar estado
    activeRoom.value = null
    pendingAction.value = null
  } catch (err) {
    alert(err.message || 'Error al abandonar la partida')
    showWarning.value = false
  }
}

// Confirmar salir de la partida
async function confirmLeaveGame() {
  try {
    if (activeRoom.value) {
      await roomAPI.leaveRoom(activeRoom.value.id)
      localStorage.removeItem('currentRoomId')
      localStorage.removeItem('isSoloGame')
    }

    // Cerrar modal
    showLeaveWarning.value = false

    // Limpiar estado
    activeRoom.value = null

    // Recargar para refrescar la vista
    await checkActiveRoom()
  } catch (err) {
    alert(err.message || 'Error al salir de la partida')
    showLeaveWarning.value = false
  }
}
</script>
