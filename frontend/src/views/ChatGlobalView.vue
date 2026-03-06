<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2416] to-[#1a1a1a]">
    <NavBar />

    <div class="max-w-[1600px] mx-auto px-5 py-5">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 p-5 bg-backrooms-dark-light/60 border-2 border-backrooms-yellow/20 rounded-xl gap-2.5">
        <h1 class="text-3xl text-backrooms-yellow shadow-[0_0_20px_rgba(255,220,100,0.3)]">
          💬 Chat Global
        </h1>
        <div class="flex items-center gap-2 text-[#6f6] font-semibold text-base">
          <span class="w-2.5 h-2.5 bg-[#6f6] rounded-full animate-[pulse_2s_infinite]"></span>
          {{ onlineUsers }} usuarios en línea
        </div>
      </div>

      <!-- Chat Content -->
      <div class="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-5 h-[calc(100vh-180px)]">
        <!-- Sidebar -->
        <div class="bg-backrooms-dark-light/60 border-2 border-backrooms-yellow/20 rounded-xl overflow-hidden flex flex-col">
          <div class="flex flex-col bg-black/30 p-2.5 gap-2">
            <button
              @click="activeTab = 'online'"
              class="px-4 py-3 bg-black/30 border border-backrooms-yellow/20 rounded-md text-[#ccc] font-semibold cursor-pointer transition-all duration-300 flex items-center justify-between text-left hover:bg-backrooms-yellow/5 hover:border-backrooms-yellow/30"
              :class="{ 'bg-backrooms-yellow/10 border-backrooms-yellow/50 text-backrooms-yellow': activeTab === 'online' }"
            >
              🌐 En Línea ({{ onlineUsers }})
            </button>
            <button
              @click="activeTab = 'friends'"
              class="px-4 py-3 bg-black/30 border border-backrooms-yellow/20 rounded-md text-[#ccc] font-semibold cursor-pointer transition-all duration-300 flex items-center justify-between text-left hover:bg-backrooms-yellow/5 hover:border-backrooms-yellow/30"
              :class="{ 'bg-backrooms-yellow/10 border-backrooms-yellow/50 text-backrooms-yellow': activeTab === 'friends' }"
            >
              👥 Amigos ({{ friends.length }})
            </button>
            <button
              @click="activeTab = 'requests'"
              class="px-4 py-3 bg-black/30 border border-backrooms-yellow/20 rounded-md text-[#ccc] font-semibold cursor-pointer transition-all duration-300 flex items-center justify-between text-left hover:bg-backrooms-yellow/5 hover:border-backrooms-yellow/30"
              :class="{ 'bg-backrooms-yellow/10 border-backrooms-yellow/50 text-backrooms-yellow': activeTab === 'requests' }"
            >
              📬 Solicitudes
              <span v-if="friendRequests.length > 0" class="bg-[#ff4444] text-white px-2 py-0.5 rounded-[10px] text-xs font-bold">
                {{ friendRequests.length }}
              </span>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-2.5">
            <!-- Online Users -->
            <div v-if="activeTab === 'online'" class="flex flex-col gap-2">
              <div
                v-for="user in users"
                :key="user.id"
                @click="selectUser(user)"
                class="flex items-center gap-3 p-3 bg-black/30 border border-backrooms-yellow/20 rounded-lg cursor-pointer transition-all duration-300 hover:bg-backrooms-yellow/5 hover:border-backrooms-yellow/40 hover:translate-x-1"
                :class="{ 'bg-backrooms-yellow/10 border-backrooms-yellow/50': selectedUser?.id === user.id }"
              >
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark flex items-center justify-center font-bold text-backrooms-dark text-lg">
                  {{ user.username.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 flex flex-col gap-1">
                  <span class="text-white font-semibold text-[0.95rem]">{{ user.username }}</span>
                  <span class="text-[#999] text-xs">{{ user.status }}</span>
                </div>
                <button
                  v-if="!isFriend(user.id)"
                  @click.stop="sendFriendRequest(user.id)"
                  title="Enviar solicitud de amistad"
                  class="px-2.5 py-1.5 bg-backrooms-yellow/10 border border-backrooms-yellow/30 rounded text-backrooms-yellow text-sm cursor-pointer transition-all duration-200 hover:bg-backrooms-yellow/20 hover:scale-110"
                >
                  ➕
                </button>
              </div>
            </div>

            <!-- Friends List -->
            <div v-if="activeTab === 'friends'" class="flex flex-col gap-2">
              <div v-if="friends.length === 0" class="text-center py-10 px-5 text-[#666]">
                <p>No tienes amigos aún</p>
                <p class="text-[#555] text-[0.85rem] mt-2">Añade amigos desde la pestaña "En Línea"</p>
              </div>
              <div
                v-for="friend in friends"
                :key="friend.id"
                @click="openPrivateChat(friend)"
                class="flex items-center gap-3 p-3 bg-black/30 border border-backrooms-yellow/20 rounded-lg cursor-pointer transition-all duration-300 hover:bg-backrooms-yellow/5 hover:border-backrooms-yellow/40 hover:translate-x-1"
              >
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark flex items-center justify-center font-bold text-backrooms-dark text-lg">
                  {{ friend.username.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 flex flex-col gap-1">
                  <span class="text-white font-semibold text-[0.95rem]">{{ friend.username }}</span>
                  <span class="text-[#6f6] text-xs">● En línea</span>
                </div>
                <button
                  @click.stop="openPrivateChat(friend)"
                  title="Enviar mensaje privado"
                  class="px-2.5 py-1.5 bg-backrooms-yellow/10 border border-backrooms-yellow/30 rounded text-backrooms-yellow text-sm cursor-pointer transition-all duration-200 hover:bg-backrooms-yellow/20 hover:scale-110"
                >
                  💬
                </button>
              </div>
            </div>

            <!-- Friend Requests -->
            <div v-if="activeTab === 'requests'" class="flex flex-col gap-2">
              <div v-if="friendRequests.length === 0" class="text-center py-10 px-5 text-[#666]">
                <p>No tienes solicitudes pendientes</p>
              </div>
              <div
                v-for="request in friendRequests"
                :key="request.id"
                class="flex items-center gap-3 p-3 bg-black/30 border border-blue-400/30 rounded-lg"
              >
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark flex items-center justify-center font-bold text-backrooms-dark text-lg">
                  {{ request.username.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 flex flex-col gap-1">
                  <span class="text-white font-semibold text-[0.95rem]">{{ request.username }}</span>
                  <span class="text-[#999] text-xs">{{ formatTime(request.timestamp) }}</span>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="acceptFriendRequest(request.id)"
                    class="px-3 py-1.5 bg-green-500/20 text-[#6f6] border border-green-500/40 rounded font-bold cursor-pointer transition-all duration-200 hover:bg-green-500/30"
                  >
                    ✓
                  </button>
                  <button
                    @click="rejectFriendRequest(request.id)"
                    class="px-3 py-1.5 bg-red-500/20 text-[#ff9999] border border-red-500/40 rounded font-bold cursor-pointer transition-all duration-200 hover:bg-red-500/30"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Chat Area -->
        <div class="bg-backrooms-dark-light/60 border-2 border-backrooms-yellow/20 rounded-xl flex flex-col overflow-hidden">
          <!-- Chat Type Indicator -->
          <div class="p-5 bg-black/30 border-b border-backrooms-yellow/20">
            <div v-if="!privateChatUser">
              <h2 class="text-backrooms-yellow text-2xl mb-1">🌍 Chat Global</h2>
              <p class="text-[#999] text-sm">Conversa con todos los jugadores en línea</p>
            </div>
            <div v-else class="bg-blue-400/5">
              <div class="flex justify-between items-center">
                <h2 class="text-backrooms-yellow text-2xl">💬 Chat Privado con {{ privateChatUser.username }}</h2>
                <button
                  @click="closePrivateChat"
                  class="px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-md text-[#ff9999] cursor-pointer transition-all duration-200 hover:bg-red-500/30"
                >
                  ✕ Cerrar
                </button>
              </div>
            </div>
          </div>

          <!-- Messages Area -->
          <div ref="messagesContainer" class="flex-1 overflow-y-auto p-5 bg-black/20">
            <div
              v-for="message in currentMessages"
              :key="message.id"
              class="mb-4 p-3 border-l-[3px] rounded-md max-w-[70%] transition-colors"
              :class="{
                'bg-backrooms-yellow/5 border-l-backrooms-yellow/30': message.userId !== currentUserId && !message.isSystem,
                'ml-auto bg-blue-400/5 border-l-blue-400/50 border-r-[3px] border-r-blue-400/50 border-l-0': message.userId === currentUserId && !message.isSystem,
                'max-w-full bg-[#969696]/10 border-l-[#969696]/30 text-center italic text-[#999]': message.isSystem
              }"
            >
              <div v-if="!message.isSystem" class="flex justify-between mb-1.5">
                <span class="text-backrooms-yellow font-semibold text-sm">{{ message.username }}</span>
                <span class="text-[#666] text-xs">{{ formatTime(message.timestamp) }}</span>
              </div>
              <div class="text-[#ddd] text-base leading-relaxed break-words">
                {{ message.text }}
              </div>
            </div>

            <div v-if="currentMessages.length === 0" class="text-center py-[60px] px-5 text-[#666]">
              <p v-if="!privateChatUser">No hay mensajes en el chat global</p>
              <p v-else>No hay mensajes en este chat privado</p>
              <p class="text-[#555] text-[0.85rem] mt-2">¡Sé el primero en escribir!</p>
            </div>
          </div>

          <!-- Message Input -->
          <form @submit.prevent="sendMessage" class="flex gap-3 p-5 bg-black/30 border-t border-backrooms-yellow/20">
            <input
              v-model="messageInput"
              type="text"
              :placeholder="privateChatUser ? 'Mensaje privado...' : 'Mensaje global...'"
              class="flex-1 px-5 py-3.5 bg-black/40 border border-backrooms-yellow/20 rounded-lg text-white text-base focus:outline-none focus:border-backrooms-yellow focus:shadow-[0_0_12px_rgba(255,220,100,0.2)] transition-all"
              maxlength="300"
            />
            <button
              type="submit"
              :disabled="!messageInput.trim()"
              class="px-7 py-3.5 bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark border-none rounded-lg text-backrooms-dark font-bold text-base cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,220,100,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
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
import { useAuthStore } from '@/stores/auth'
import NavBar from '@/components/NavBar.vue'

const authStore = useAuthStore()

// State
const activeTab = ref('online')
const selectedUser = ref(null)
const privateChatUser = ref(null)
const messageInput = ref('')
const messagesContainer = ref(null)
const currentUserId = ref(authStore.user?.id || 1)

// Mock data (esto vendrá del backend con Socket.io)
const users = ref([
  { id: 2, username: 'Explorador23', status: 'En el lobby' },
  { id: 3, username: 'ShadowRunner', status: 'Buscando sala' },
  { id: 4, username: 'MazeWalker', status: 'En partida' },
  { id: 5, username: 'LostSoul99', status: 'Disponible' }
])

const friends = ref([
  { id: 6, username: 'BestFriend', status: 'online' },
  { id: 7, username: 'TeamMate', status: 'online' }
])

const friendRequests = ref([
  { id: 8, username: 'NewPlayer', timestamp: Date.now() - 300000 }
])

const globalMessages = ref([
  {
    id: 1,
    userId: 2,
    username: 'Explorador23',
    text: '¿Alguien quiere jugar?',
    timestamp: Date.now() - 600000,
    isSystem: false
  },
  {
    id: 2,
    userId: 3,
    username: 'ShadowRunner',
    text: 'Yo estoy listo!',
    timestamp: Date.now() - 300000,
    isSystem: false
  }
])

const privateChats = ref({
  // userId: [messages]
})

// Computed
const onlineUsers = computed(() => users.value.length + 1) // +1 for current user

const currentMessages = computed(() => {
  if (privateChatUser.value) {
    return privateChats.value[privateChatUser.value.id] || []
  }
  return globalMessages.value
})

// Methods
function selectUser(user) {
  selectedUser.value = user
}

function isFriend(userId) {
  return friends.value.some(f => f.id === userId)
}

function sendFriendRequest(userId) {
  // TODO: Enviar solicitud por Socket.io
  alert(`Solicitud enviada a usuario ${userId}`)
}

function acceptFriendRequest(requestId) {
  const request = friendRequests.value.find(r => r.id === requestId)
  if (request) {
    friends.value.push({ ...request, status: 'online' })
    friendRequests.value = friendRequests.value.filter(r => r.id !== requestId)
    // TODO: Enviar aceptación por Socket.io
  }
}

function rejectFriendRequest(requestId) {
  friendRequests.value = friendRequests.value.filter(r => r.id !== requestId)
  // TODO: Enviar rechazo por Socket.io
}

function openPrivateChat(friend) {
  privateChatUser.value = friend

  // Inicializar chat privado si no existe
  if (!privateChats.value[friend.id]) {
    privateChats.value[friend.id] = []
  }

  // Auto scroll
  nextTick(() => {
    scrollToBottom()
  })
}

function closePrivateChat() {
  privateChatUser.value = null
}

function sendMessage() {
  if (!messageInput.value.trim()) return

  const newMessage = {
    id: Date.now(),
    userId: currentUserId.value,
    username: authStore.user?.username || 'Usuario',
    text: messageInput.value.trim(),
    timestamp: Date.now(),
    isSystem: false
  }

  if (privateChatUser.value) {
    // Mensaje privado
    if (!privateChats.value[privateChatUser.value.id]) {
      privateChats.value[privateChatUser.value.id] = []
    }
    privateChats.value[privateChatUser.value.id].push(newMessage)
    // TODO: Enviar por Socket.io como mensaje privado
  } else {
    // Mensaje global
    globalMessages.value.push(newMessage)
    // TODO: Enviar por Socket.io como mensaje global
  }

  messageInput.value = ''
  nextTick(() => {
    scrollToBottom()
  })
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `Hace ${diffMins}m`
  if (diffMins < 1440) return `Hace ${Math.floor(diffMins / 60)}h`
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
}

onMounted(() => {
  // TODO: Conectar Socket.io
  // - Escuchar mensajes globales
  // - Escuchar mensajes privados
  // - Escuchar solicitudes de amistad
  // - Actualizar usuarios en línea
  scrollToBottom()
})

onUnmounted(() => {
  // TODO: Desconectar Socket.io
})
</script>
