<template>
  <div class="min-h-screen bg-gradient-to-br from-backrooms-dark via-backrooms-dark-light to-backrooms-dark">
    <NavBar />

    <div class="max-w-7xl mx-auto px-5 py-10">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-8">
        <h1 class="text-4xl md:text-5xl text-backrooms-yellow font-mono" style="text-shadow: 0 0 20px rgba(255, 220, 100, 0.3);">
          Salas Disponibles
        </h1>
        <button
          @click="showCreateModal = true"
          class="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark border-none rounded-lg text-backrooms-dark text-base font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,220,100,0.4)]"
        >
          <span>➕</span> Crear Sala
        </button>
      </div>

      <div class="bg-backrooms-dark/60 border-2 border-backrooms-yellow/20 rounded-xl p-8">
        <div v-if="loading" class="text-center py-16 px-5 text-gray-400">
          <div class="w-12 h-12 mx-auto mb-5 border-4 border-backrooms-yellow/20 border-t-backrooms-yellow rounded-full animate-spin"></div>
          <p>Cargando salas...</p>
        </div>

        <div v-else-if="rooms.length === 0" class="text-center py-16 px-5">
          <p class="text-6xl mb-5">🚪</p>
          <p class="text-xl text-gray-300 mb-2">No hay salas disponibles</p>
          <p class="text-gray-400">Crea una nueva sala para empezar a jugar</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="room in rooms"
            :key="room.id"
            class="bg-black/40 border rounded-xl p-5 transition-all duration-300 hover:-translate-y-1"
            :class="isCurrentRoom(room.id)
              ? 'border-2 border-blue-400/50 shadow-[0_0_20px_rgba(100,150,255,0.2)] hover:border-blue-400/70 hover:shadow-[0_8px_24px_rgba(100,150,255,0.3)] bg-blue-500/10'
              : 'border-backrooms-yellow/20 hover:border-backrooms-yellow/50 hover:shadow-[0_8px_24px_rgba(255,220,100,0.1)]'"
          >
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-backrooms-yellow text-xl">{{ room.room_name }}</h3>
              <span class="bg-backrooms-yellow text-backrooms-dark px-2.5 py-1 rounded-md font-mono font-bold text-sm">
                {{ room.room_code }}
              </span>
            </div>

            <div class="mb-4">
              <div class="flex justify-between py-2 text-gray-300">
                <span class="text-gray-400">Host:</span>
                <span class="font-semibold">{{ room.host_username }}</span>
              </div>
              <div class="flex justify-between py-2 text-gray-300">
                <span class="text-gray-400">Jugadores:</span>
                <span class="font-semibold">{{ room.current_players }}/{{ room.max_players }}</span>
              </div>
            </div>

            <!-- Mostrar diferentes botones según si estás en la sala o no -->
            <div v-if="isCurrentRoom(room.id)" class="flex gap-2.5 mt-4">
              <button
                @click="router.push(`/room/${room.id}`)"
                class="flex-[2] px-3 py-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/60 rounded-lg text-blue-300 font-bold cursor-pointer transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-blue-600/30 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(100,150,255,0.3)]"
              >
                ✓ Entrar a la Sala
              </button>
              <button
                @click="handleLeaveRoom(room.id)"
                class="flex-1 px-3 py-3 bg-red-600/15 border border-red-500/50 rounded-lg text-red-300 font-bold cursor-pointer transition-all duration-300 hover:bg-red-600/25 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,70,70,0.3)]"
              >
                ✕ Salir
              </button>
            </div>
            <button
              v-else
              @click="handleJoinRoom(room.id)"
              class="w-full px-3 py-3 bg-gradient-to-br from-backrooms-yellow/20 to-backrooms-yellow-dark/20 border border-backrooms-yellow rounded-lg text-backrooms-yellow font-bold cursor-pointer transition-all duration-300 hover:bg-gradient-to-br hover:from-backrooms-yellow/30 hover:to-backrooms-yellow-dark/30 hover:-translate-y-0.5"
            >
              Unirse a la Sala
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Room Modal -->
    <div
      v-if="showCreateModal"
      @click.self="showCreateModal = false"
      class="fixed top-0 left-0 w-full h-full bg-black/85 flex items-center justify-center z-[2000]"
    >
      <div class="bg-backrooms-dark/[0.98] border-2 border-backrooms-yellow/30 rounded-xl p-8 w-[90%] max-w-lg">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-backrooms-yellow text-3xl">Crear Nueva Sala</h2>
          <button
            @click="showCreateModal = false"
            class="bg-transparent border-none text-gray-400 text-2xl cursor-pointer transition-colors duration-200 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleCreateRoom">
          <div v-if="error" class="bg-red-600/20 border border-red-500/50 text-red-300 px-3 py-3 rounded-md mb-5 text-sm">
            {{ error }}
          </div>

          <div class="mb-5">
            <label class="block text-gray-300 mb-2 text-sm font-medium">Nombre de la Sala</label>
            <input
              v-model="newRoom.name"
              type="text"
              placeholder="Mi sala de Backrooms"
              required
              class="w-full px-4 py-3 bg-black/40 border border-backrooms-yellow/20 rounded-md text-white text-base focus:outline-none focus:border-backrooms-yellow focus:shadow-[0_0_15px_rgba(255,220,100,0.2)]"
            />
          </div>

          <div class="mb-5">
            <label class="block text-gray-300 mb-2 text-sm font-medium">Máximo de Jugadores</label>
            <select
              v-model="newRoom.maxPlayers"
              required
              class="w-full px-4 py-3 bg-black/40 border border-backrooms-yellow/20 rounded-md text-white text-base focus:outline-none focus:border-backrooms-yellow focus:shadow-[0_0_15px_rgba(255,220,100,0.2)]"
            >
              <option value="2">2 jugadores</option>
              <option value="3">3 jugadores</option>
              <option value="4">4 jugadores</option>
            </select>
          </div>

          <button
            type="submit"
            :disabled="creating"
            class="w-full py-3.5 bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark border-none rounded-md text-backrooms-dark text-lg font-bold cursor-pointer transition-all duration-300 uppercase tracking-wider hover:not(:disabled):-translate-y-0.5 hover:not(:disabled):shadow-[0_6px_20px_rgba(255,220,100,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ creating ? 'Creando...' : 'Crear Sala' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { roomAPI } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const authStore = useAuthStore()

const rooms = ref([])
const loading = ref(false)
const error = ref(null)
const currentRoomId = ref(null) // Sala actual del usuario

const showCreateModal = ref(false)
const creating = ref(false)
const newRoom = ref({
  name: '',
  maxPlayers: '4'
})

async function loadRooms() {
  loading.value = true
  error.value = null

  try {
    const response = await roomAPI.getAvailableRooms()
    if (response.success) {
      rooms.value = response.data.rooms
    }
  } catch (err) {
    error.value = err.message || 'Error al cargar salas'
  } finally {
    loading.value = false
  }
}

async function handleCreateRoom() {
  creating.value = true
  error.value = null

  try {
    const response = await roomAPI.createRoom(newRoom.value.name, parseInt(newRoom.value.maxPlayers))

    if (response.success) {
      showCreateModal.value = false
      router.push(`/room/${response.data.room.id}`)
    }
  } catch (err) {
    error.value = err.message || 'Error al crear sala'
  } finally {
    creating.value = false
  }
}

async function handleJoinRoom(roomId) {
  try {
    const response = await roomAPI.joinRoom(roomId)
    if (response.success) {
      currentRoomId.value = roomId
      // TODO: Guardar en localStorage o store
      localStorage.setItem('currentRoomId', roomId)
      router.push(`/room/${roomId}`)
    }
  } catch (err) {
    alert(err.message || 'Error al unirse a la sala')
  }
}

async function handleLeaveRoom(roomId) {
  if (confirm('¿Estás seguro de que quieres salir de esta sala?')) {
    try {
      // TODO: Llamar API para salir de la sala
      // const response = await roomAPI.leaveRoom(roomId)

      currentRoomId.value = null
      localStorage.removeItem('currentRoomId')

      // Recargar salas
      await loadRooms()

      alert('Has salido de la sala exitosamente')
    } catch (err) {
      alert(err.message || 'Error al salir de la sala')
    }
  }
}

function isCurrentRoom(roomId) {
  return currentRoomId.value === roomId
}

onMounted(() => {
  // Recuperar sala actual del localStorage
  const savedRoomId = localStorage.getItem('currentRoomId')
  if (savedRoomId) {
    currentRoomId.value = parseInt(savedRoomId)
  }

  loadRooms()
  setInterval(loadRooms, 5000)
})
</script>

