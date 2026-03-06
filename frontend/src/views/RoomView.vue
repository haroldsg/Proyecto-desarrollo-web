<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2416] to-[#1a1a1a]">
    <NavBar />

    <div class="max-w-[1400px] mx-auto px-5 py-5">
      <!-- Room Header -->
      <div class="flex flex-col lg:flex-row justify-between items-center mb-8 p-5 bg-backrooms-dark-light/60 border-2 border-backrooms-yellow/20 rounded-xl gap-4">
        <div class="w-full lg:w-auto">
          <h1 class="text-3xl lg:text-4xl text-backrooms-yellow mb-2 shadow-[0_0_20px_rgba(255,220,100,0.3)]">
            🚪 {{ roomData.name }}
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
                'border-backrooms-yellow/50 bg-backrooms-yellow/5': player.isHost,
                'border-green-500/30': player.isReady && !player.isHost,
                'border-backrooms-yellow/20': !player.isHost && !player.isReady,
                'border-dashed opacity-40': false
              }"
            >
              <div class="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark flex items-center justify-center text-2xl font-bold text-backrooms-dark">
                {{ player.username.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 flex items-center gap-2 flex-wrap">
                <span class="text-white font-semibold text-lg">{{ player.username }}</span>
                <span
                  v-if="player.isHost"
                  class="bg-backrooms-yellow/20 text-backrooms-yellow px-2.5 py-1 rounded text-[0.85rem] font-semibold"
                >
                  👑 Host
                </span>
                <span
                  v-else-if="player.isReady"
                  class="bg-green-500/20 text-[#6f6] px-2.5 py-1 rounded text-[0.85rem] font-semibold"
                >
                  ✓ Listo
                </span>
                <span
                  v-else
                  class="bg-[#969696]/20 text-[#999] px-2.5 py-1 rounded text-[0.85rem]"
                >
                  ⏳ Esperando
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

          <!-- Ready Button (only for non-host players) -->
          <div v-if="!isHost" class="mt-5 pt-5 border-t border-backrooms-yellow/10">
            <button
              @click="toggleReady"
              class="w-full py-3.5 bg-green-500/10 border-2 rounded-lg text-[#6f6] text-lg font-bold cursor-pointer transition-all duration-300 hover:bg-green-500/20 hover:-translate-y-0.5"
              :class="{
                'bg-green-500/20 border-green-500/50': isReady,
                'border-green-500/30': !isReady
              }"
            >
              {{ isReady ? '✓ Listo' : 'Marcar como Listo' }}
            </button>
          </div>

          <!-- Start Game Button (only for host) -->
          <div v-if="isHost" class="mt-5 pt-5 border-t border-backrooms-yellow/10">
            <button
              @click="startGame"
              :disabled="!allPlayersReady"
              class="w-full py-3.5 border-none rounded-lg text-backrooms-dark text-lg font-bold cursor-pointer transition-all duration-300 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{
                'bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark hover:shadow-[0_6px_20px_rgba(255,220,100,0.4)] hover:-translate-y-0.5': allPlayersReady,
                'bg-[#646464]/30': !allPlayersReady
              }"
            >
              {{ allPlayersReady ? '🎮 Iniciar Juego' : '⏳ Esperando jugadores...' }}
            </button>
            <p v-if="!allPlayersReady" class="text-center text-[#999] text-sm mt-2.5">
              Todos los jugadores deben estar listos para comenzar
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
              <p class="text-sm mt-2">¡Sé el primero en escribir!</p>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Room data (esto vendrá del backend con Socket.io)
const roomData = ref({
  id: route.params.id,
  name: 'Sala de Ejemplo',
  code: 'ABC123',
  maxPlayers: 4
})

// Players data
const players = ref([
  { id: 1, username: authStore.user?.username || 'Usuario', isHost: true, isReady: false },
  { id: 2, username: 'Jugador2', isHost: false, isReady: true },
  { id: 3, username: 'Jugador3', isHost: false, isReady: false }
])

// Chat data
const messages = ref([
  { id: 1, userId: 1, username: authStore.user?.username || 'Usuario', text: '¡Hola a todos!', timestamp: Date.now() - 120000 },
  { id: 2, userId: 2, username: 'Jugador2', text: 'Hola! Listo para jugar', timestamp: Date.now() - 60000 }
])

const messageInput = ref('')
const chatContainer = ref(null)
const currentUserId = ref(authStore.user?.id || 1)
const isReady = ref(false)

// Computed
const isHost = computed(() => {
  const currentPlayer = players.value.find(p => p.id === currentUserId.value)
  return currentPlayer?.isHost || false
})

const allPlayersReady = computed(() => {
  const nonHostPlayers = players.value.filter(p => !p.isHost)
  return nonHostPlayers.length > 0 && nonHostPlayers.every(p => p.isReady)
})

// Methods
function toggleReady() {
  isReady.value = !isReady.value
  const currentPlayer = players.value.find(p => p.id === currentUserId.value)
  if (currentPlayer) {
    currentPlayer.isReady = isReady.value
  }
  // TODO: Enviar evento Socket.io al backend
}

function startGame() {
  if (allPlayersReady.value) {
    // TODO: Enviar evento Socket.io al backend para iniciar juego
    router.push('/game')
  }
}

function sendMessage() {
  if (!messageInput.value.trim()) return

  const newMessage = {
    id: Date.now(),
    userId: currentUserId.value,
    username: authStore.user?.username || 'Usuario',
    text: messageInput.value.trim(),
    timestamp: Date.now()
  }

  messages.value.push(newMessage)
  messageInput.value = ''

  // TODO: Enviar mensaje por Socket.io al backend

  // Auto-scroll to bottom
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }, 50)
}

function handleLeaveRoom() {
  const confirmMessage = isHost.value
    ? '¿Estás seguro de que quieres salir? Como host, la sala será eliminada y todos los jugadores serán expulsados.'
    : '¿Estás seguro de que quieres salir de la sala?'

  if (confirm(confirmMessage)) {
    // Si eres el host, eliminar la sala (cuando conectes el backend)
    if (isHost.value) {
      // TODO: Enviar evento Socket.io al backend para eliminar la sala
      console.log('Host saliendo - sala será eliminada')
    }

    // Limpiar el localStorage
    localStorage.removeItem('currentRoomId')

    // TODO: Enviar evento Socket.io al backend para salir de la sala
    router.push('/lobby')
  }
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  // TODO: Conectar Socket.io y escuchar eventos
  // - player-joined
  // - player-left
  // - player-ready
  // - chat-message
  // - game-started
})

onUnmounted(() => {
  // TODO: Desconectar Socket.io
})
</script>
