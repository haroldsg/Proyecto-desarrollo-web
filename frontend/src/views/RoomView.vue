<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2416] to-[#1a1a1a]">
    <NavBar />

    <!-- Loading State -->
    <div v-if="loading" class="max-w-[1400px] mx-auto px-5 py-20">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-5 border-4 border-backrooms-yellow/20 border-t-backrooms-yellow rounded-full animate-spin"></div>
        <p class="text-backrooms-yellow text-xl">Cargando sala...</p>
      </div>
    </div>

    <div v-else class="max-w-[1400px] mx-auto px-5 py-5">
      <!-- Room Header -->
      <div class="flex flex-col lg:flex-row justify-between items-center mb-8 p-5 bg-backrooms-dark-light/60 border-2 border-backrooms-yellow/20 rounded-xl gap-4">
        <div class="w-full lg:w-auto">
          <h1 class="text-3xl lg:text-4xl text-backrooms-yellow mb-2">
            {{ roomData.name }}
          </h1>
          <div class="flex items-center gap-2 text-[#999] text-sm">
            <span>Código:</span>
            <span class="bg-backrooms-yellow text-backrooms-dark px-3 py-1 rounded-md font-mono font-bold text-base">
              {{ roomData.code }}
            </span>
          </div>
        </div>
        <button
          @click="handleLeaveRoom"
          class="w-full lg:w-auto px-5 py-2.5 bg-red-500/20 border border-red-500/50 rounded-md text-[#ff9999] font-semibold cursor-pointer transition-all duration-300 hover:bg-red-500/30 hover:-translate-y-0.5"
        >
          Salir de la Sala
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Players Section -->
        <div class="bg-backrooms-dark-light/60 border-2 border-backrooms-yellow/20 rounded-xl p-6">
          <div class="mb-5">
            <h2 class="text-backrooms-yellow text-2xl">
              👥 Jugadores ({{ players.length }}/{{ roomData.maxPlayers }})
            </h2>
          </div>

          <div class="flex flex-col gap-3 mb-5">
            <div
              v-for="player in players"
              :key="player.id"
              class="flex items-center gap-4 p-4 bg-black/40 border rounded-lg transition-all duration-300"
              :class="{
                'border-backrooms-yellow/50 bg-backrooms-yellow/5': player.is_host,
                'border-backrooms-yellow/20': !player.is_host
              }"
            >
              <div class="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark flex items-center justify-center text-2xl font-bold text-backrooms-dark">
                {{ player.username.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 flex items-center gap-2 flex-wrap">
                <span class="text-white font-semibold text-lg">{{ player.username }}</span>
                <span
                  v-if="player.is_host"
                  class="bg-backrooms-yellow/20 text-backrooms-yellow px-2.5 py-1 rounded text-[0.85rem] font-semibold"
                >
                  👑 Host
                </span>
              </div>
            </div>

            <!-- Empty slots -->
            <div
              v-for="n in (roomData.maxPlayers - players.length)"
              :key="'empty-' + n"
              class="flex items-center gap-4 p-4 bg-black/40 border border-dashed border-backrooms-yellow/20 rounded-lg opacity-40"
            >
              <div class="w-[50px] h-[50px] rounded-full bg-[#646464]/30 flex items-center justify-center text-2xl font-bold text-[#666]">
                ?
              </div>
              <div class="flex-1">
                <span class="text-[#666] font-semibold text-lg italic">Esperando jugador...</span>
              </div>
            </div>
          </div>

          <!-- Start Game Button (only for host) -->
          <div v-if="isHost" class="mt-5 pt-5 border-t border-backrooms-yellow/10">
            <button
              @click="startGame"
              :disabled="!canStartGame"
              class="w-full py-3.5 border-none rounded-lg text-backrooms-dark text-lg font-bold cursor-pointer transition-all duration-300 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{
                'bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark hover:shadow-[0_6px_20px_rgba(255,220,100,0.4)] hover:-translate-y-0.5': canStartGame,
                'bg-[#646464]/30': !canStartGame
              }"
            >
              {{ canStartGame ? 'Iniciar Juego' : 'Esperando jugadores...' }}
            </button>
            <p v-if="!canStartGame" class="text-center text-[#999] text-sm mt-2.5">
              Se necesitan al menos 2 jugadores para iniciar
            </p>
          </div>
        </div>

        <!-- Chat Section -->
        <div class="bg-backrooms-dark-light/60 border-2 border-backrooms-yellow/20 rounded-xl p-6 flex flex-col h-[600px]">
          <div class="mb-5">
            <h2 class="text-backrooms-yellow text-2xl">💬 Chat de la Sala</h2>
          </div>

          <div
            ref="chatContainer"
            class="flex-1 overflow-y-auto mb-4 p-2.5 bg-black/30 rounded-lg"
          >
            <div
              v-for="message in messages"
              :key="message.id"
              class="flex flex-col gap-1 p-2.5 mb-2 rounded border-l-[3px] transition-colors"
              :class="{
                'bg-backrooms-yellow/5 border-l-backrooms-yellow/30': message.userId !== currentUserId,
                'bg-blue-500/5 border-l-blue-400/50 border-r-[3px] border-r-blue-400/50 border-l-0': message.userId === currentUserId
              }"
            >
              <span class="text-backrooms-yellow font-semibold text-sm">{{ message.username }}:</span>
              <span class="text-[#ddd] text-base">{{ message.text }}</span>
              <span class="text-[#666] text-xs self-end">{{ formatTime(message.timestamp) }}</span>
            </div>

            <div v-if="messages.length === 0" class="text-center py-10 px-5 text-[#666]">
              <p>No hay mensajes aún</p>
            </div>
          </div>

          <form @submit.prevent="sendMessage" class="flex gap-2.5">
            <input
              v-model="messageInput"
              type="text"
              placeholder="Escribe un mensaje..."
              class="flex-1 px-4 py-3 bg-black/40 border border-backrooms-yellow/20 rounded-md text-white text-base focus:outline-none focus:border-backrooms-yellow focus:shadow-[0_0_10px_rgba(255,220,100,0.2)] transition-all"
              maxlength="200"
            />
            <button
              type="submit"
              :disabled="!messageInput.trim()"
              class="px-6 py-3 bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark border-none rounded-md text-backrooms-dark font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,220,100,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { roomAPI } from '@/services/api'
import socketService from '@/services/socket'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const roomId = route.params.id

// Room data
const roomData = ref({
  id: roomId,
  name: '',
  code: '',
  maxPlayers: 4
})

// Players data
const players = ref([])

// Chat data
const messages = ref([])
const messageInput = ref('')
const chatContainer = ref(null)
const currentUserId = computed(() => authStore.user?.id)
const loading = ref(true)

// Computed
const isHost = computed(() => {
  const currentPlayer = players.value.find(p => p.user_id === currentUserId.value)
  return currentPlayer?.is_host || false
})

const canStartGame = computed(() => {
  return players.value.length >= 2
})

// Methods
async function loadRoomData() {
  try {
    console.log('🔍 Cargando datos de la sala:', roomId)
    const response = await roomAPI.getRoomDetails(roomId)
    console.log('📦 Respuesta del servidor:', response)

    if (response.success) {
      roomData.value = {
        id: response.data.room.id,
        name: response.data.room.room_name,
        code: response.data.room.room_code,
        maxPlayers: response.data.room.max_players
      }
      players.value = response.data.room.players || []

      console.log('👥 Jugadores cargados:', players.value)
      console.log('🆔 ID del usuario actual:', currentUserId.value)
    }
  } catch (error) {
    console.error('❌ Error al cargar sala:', error)
    alert('Error al cargar la sala: ' + (error.message || 'Error desconocido'))
    router.push('/lobby')
  } finally {
    loading.value = false
  }
}

async function startGame() {
  if (!canStartGame.value) return

  try {
    const response = await roomAPI.startGame(roomId)
    if (response.success) {
      // Guardar en localStorage para el juego
      localStorage.setItem('currentRoomId', roomId)
      // Socket.io emitirá el evento a todos los jugadores
    }
  } catch (error) {
    console.error('Error al iniciar juego:', error)
    alert('Error al iniciar el juego')
  }
}

function sendMessage() {
  if (!messageInput.value.trim()) return

  // Emitir mensaje por Socket.io
  socketService.socket?.emit('chat:message', {
    roomId,
    message: messageInput.value.trim()
  })

  messageInput.value = ''
}

async function handleLeaveRoom() {
  const confirmMessage = isHost.value
    ? '¿Estás seguro de que quieres salir? La sala será transferida a otro jugador o eliminada.'
    : '¿Estás seguro de que quieres salir de la sala?'

  if (confirm(confirmMessage)) {
    try {
      await roomAPI.leaveRoom(roomId)
      localStorage.removeItem('currentRoomId')
      router.push('/lobby')
    } catch (error) {
      console.error('Error al salir de sala:', error)
      alert('Error al salir de la sala')
    }
  }
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function scrollChatToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

onMounted(async () => {
  console.log('🚀 RoomView montado - ID de sala:', roomId)
  console.log('👤 Usuario actual:', authStore.user)

  // Conectar socket si no está conectado
  const token = localStorage.getItem('backrooms_token')
  if (token && !socketService.connected) {
    socketService.connect(token)
  }

  await loadRoomData()

  // Unirse al room de Socket.io
  console.log('🔌 Uniéndose al socket room:', roomId)
  socketService.socket?.emit('room:join', { roomId })

  // Escuchar eventos de Socket.io
  socketService.socket?.on('room:playerJoined', (data) => {
    console.log('Jugador se unió:', data)
    loadRoomData() // Recargar datos
  })

  socketService.socket?.on('room:playerLeft', (data) => {
    console.log('Jugador salió:', data)
    loadRoomData() // Recargar datos
  })

  socketService.socket?.on('room:gameStarted', (data) => {
    console.log('Juego iniciado:', data)
    // Redirigir a todos a /game
    localStorage.setItem('currentRoomId', roomId)
    router.push('/game')
  })

  socketService.socket?.on('chat:message', (data) => {
    messages.value.push({
      id: Date.now(),
      userId: data.userId,
      username: data.username,
      text: data.message,
      timestamp: Date.now()
    })
    scrollChatToBottom()
  })
})

onUnmounted(() => {
  // Salir del room de Socket.io
  socketService.socket?.emit('room:leave', { roomId })

  // Limpiar listeners
  socketService.socket?.off('room:playerJoined')
  socketService.socket?.off('room:playerLeft')
  socketService.socket?.off('room:gameStarted')
  socketService.socket?.off('chat:message')
})
</script>
