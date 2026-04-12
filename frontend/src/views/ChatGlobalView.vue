<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2416] to-[#1a1a1a]">
    <NavBar />

    <div class="max-w-[1600px] mx-auto px-5 py-5">
      <!-- Header -->
      <div class="mb-5 p-5 bg-backrooms-dark-light/60 border-2 border-backrooms-yellow/20 rounded-xl">
        <h1 class="text-3xl text-backrooms-yellow">Chat Global</h1>
      </div>

      <!-- Chat Content -->
      <div class="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 h-[calc(100vh-180px)]">

        <!-- Sidebar -->
        <div class="bg-backrooms-dark-light/60 border-2 border-backrooms-yellow/20 rounded-xl overflow-hidden flex flex-col">

          <!-- Tabs -->
          <div class="flex flex-col bg-black/30 p-2.5 gap-2">
            <button
              @click="activeTab = 'online'"
              class="px-4 py-3 bg-black/30 border border-backrooms-yellow/20 rounded-md text-[#ccc] font-semibold cursor-pointer transition-all duration-300 flex items-center justify-between text-left hover:bg-backrooms-yellow/5 hover:border-backrooms-yellow/30"
              :class="{ 'bg-backrooms-yellow/10 border-backrooms-yellow/50 text-backrooms-yellow': activeTab === 'online' }"
            >
              🌐 En Línea
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
              <span v-if="pendingRequests.length > 0" class="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {{ pendingRequests.length }}
              </span>
            </button>
          </div>

          <!-- Buscador de amigos (visible en tab online) -->
          <div v-if="activeTab === 'online'" class="px-3 pt-3 pb-1">
            <form @submit.prevent="handleSendFriendRequest" class="flex gap-2">
              <input
                v-model="searchUsername"
                type="text"
                placeholder="Buscar por nombre exacto..."
                class="flex-1 px-3 py-2 bg-black/40 border border-backrooms-yellow/20 rounded-md text-white text-sm focus:outline-none focus:border-backrooms-yellow"
              />
              <button
                type="submit"
                :disabled="!searchUsername.trim()"
                class="px-3 py-2 bg-backrooms-yellow/20 border border-backrooms-yellow/40 rounded-md text-backrooms-yellow text-sm font-bold transition-all hover:bg-backrooms-yellow/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ➕
              </button>
            </form>
            <p v-if="searchError" class="text-red-400 text-xs mt-1 px-1">{{ searchError }}</p>
            <p v-if="searchSuccess" class="text-green-400 text-xs mt-1 px-1">{{ searchSuccess }}</p>
          </div>

          <!-- Lista -->
          <div class="flex-1 overflow-y-auto p-2.5">

            <!-- Online Users -->
            <div v-if="activeTab === 'online'" class="flex flex-col gap-2">
              <p v-if="onlineUsers.length === 0" class="text-center py-10 text-[#666] text-sm">No hay más usuarios en línea</p>
              <div
                v-for="user in onlineUsers"
                :key="user.userId"
                class="flex items-center gap-3 p-3 bg-black/30 border border-backrooms-yellow/20 rounded-lg"
              >
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark flex items-center justify-center font-bold text-backrooms-dark">
                  {{ user.username.charAt(0).toUpperCase() }}
                </div>
                <span class="flex-1 text-white text-sm font-semibold truncate">{{ user.username }}</span>
                <template v-if="!isFriend(user.userId) && user.userId !== currentUser.id">
                  <button
                    v-if="!sentRequests.has(user.userId)"
                    @click="sendFriendRequestSocket(user.userId)"
                    title="Enviar solicitud de amistad"
                    class="px-2 py-1 bg-backrooms-yellow/10 border border-backrooms-yellow/30 rounded text-backrooms-yellow text-xs cursor-pointer transition-all hover:bg-backrooms-yellow/20"
                  >
                    ➕
                  </button>
                  <span v-else class="text-backrooms-yellow/60 text-xs">Enviada ✓</span>
                </template>
                <span v-else-if="isFriend(user.userId)" class="text-green-400 text-xs">Amigo</span>
              </div>
            </div>

            <!-- Friends List -->
            <div v-if="activeTab === 'friends'" class="flex flex-col gap-2">
              <p v-if="friends.length === 0" class="text-center py-10 px-5 text-[#666] text-sm">
                No tienes amigos aún.<br>
                <span class="text-[#555] text-xs">Busca por nombre exacto en "En Línea"</span>
              </p>
              <div
                v-for="friend in friends"
                :key="friend.id"
                class="flex items-center gap-3 p-3 bg-black/30 border rounded-lg cursor-pointer transition-all hover:bg-backrooms-yellow/5"
                :class="privateChatUser?.id === friend.id
                  ? 'border-backrooms-yellow/50 bg-backrooms-yellow/5'
                  : 'border-backrooms-yellow/20'"
                @click="openPrivateChat(friend)"
              >
                <div class="relative">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark flex items-center justify-center font-bold text-backrooms-dark">
                    {{ friend.username.charAt(0).toUpperCase() }}
                  </div>
                  <span
                    class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-backrooms-dark"
                    :class="isOnline(friend.id) ? 'bg-green-400' : 'bg-gray-500'"
                  ></span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-white text-sm font-semibold truncate">{{ friend.username }}</p>
                  <p class="text-xs" :class="isOnline(friend.id) ? 'text-green-400' : 'text-gray-500'">
                    {{ isOnline(friend.id) ? '● En línea' : '○ Desconectado' }}
                  </p>
                </div>
                <div class="flex gap-1">
                  <button
                    @click.stop="handleRemoveFriend(friend)"
                    class="px-2 py-1 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs transition-all hover:bg-red-500/20"
                    title="Eliminar amigo"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <!-- Pending Requests -->
            <div v-if="activeTab === 'requests'" class="flex flex-col gap-2">
              <p v-if="pendingRequests.length === 0" class="text-center py-10 text-[#666] text-sm">
                No tienes solicitudes pendientes
              </p>
              <div
                v-for="req in pendingRequests"
                :key="req.request_id"
                class="flex items-center gap-3 p-3 bg-black/30 border border-blue-400/30 rounded-lg"
              >
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-white">
                  {{ req.username.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-white text-sm font-semibold truncate">{{ req.username }}</p>
                  <p class="text-[#999] text-xs">{{ formatTime(req.created_at) }}</p>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="handleAcceptRequest(req)"
                    class="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/40 rounded font-bold cursor-pointer transition-all hover:bg-green-500/30"
                  >
                    ✓
                  </button>
                  <button
                    @click="handleRejectRequest(req)"
                    class="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/40 rounded font-bold cursor-pointer transition-all hover:bg-red-500/30"
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

          <!-- Chat Header -->
          <div class="p-4 bg-black/30 border-b border-backrooms-yellow/20 flex items-center justify-between">
            <div v-if="!privateChatUser">
              <h2 class="text-backrooms-yellow text-xl font-semibold">🌍 Chat Global</h2>
              <p class="text-[#999] text-xs mt-0.5">Conversa con todos los jugadores en línea</p>
            </div>
            <div v-else class="flex-1 flex items-center justify-between">
              <div>
                <h2 class="text-backrooms-yellow text-xl font-semibold">💬 {{ privateChatUser.username }}</h2>
                <p class="text-xs" :class="isOnline(privateChatUser.id) ? 'text-green-400' : 'text-gray-500'">
                  {{ isOnline(privateChatUser.id) ? '● En línea' : '○ Desconectado' }}
                </p>
              </div>
              <button
                @click="closePrivateChat"
                class="px-3 py-1.5 bg-black/40 border border-backrooms-yellow/20 rounded-md text-[#999] text-sm transition-all hover:border-backrooms-yellow/50 hover:text-white"
              >
                ← Volver al global
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div ref="messagesContainer" class="flex-1 overflow-y-auto p-5 space-y-3 bg-black/20">
            <div v-if="loading" class="text-center py-10 text-[#666] text-sm">Cargando mensajes...</div>

            <template v-else>
              <div
                v-for="msg in currentMessages"
                :key="msg.id"
                class="flex"
                :class="msg.userId === currentUser.id ? 'justify-end' : 'justify-start'"
              >
                <!-- Mensaje propio -->
                <div
                  v-if="msg.userId === currentUser.id"
                  class="max-w-[65%] bg-backrooms-yellow/10 border border-backrooms-yellow/30 rounded-xl rounded-tr-sm px-4 py-2.5"
                >
                  <p class="text-white text-sm leading-relaxed break-words">{{ msg.text }}</p>
                  <p class="text-backrooms-yellow/40 text-xs text-right mt-1">{{ formatTime(msg.timestamp) }}</p>
                </div>

                <!-- Mensaje ajeno -->
                <div v-else class="max-w-[65%] flex gap-2.5 items-end">
                  <div class="w-7 h-7 rounded-full bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark flex items-center justify-center font-bold text-backrooms-dark text-xs flex-shrink-0">
                    {{ msg.username.charAt(0).toUpperCase() }}
                  </div>
                  <div class="bg-black/40 border border-backrooms-yellow/20 rounded-xl rounded-tl-sm px-4 py-2.5">
                    <p class="text-backrooms-yellow text-xs font-semibold mb-1">{{ msg.username }}</p>
                    <p class="text-white text-sm leading-relaxed break-words">{{ msg.text }}</p>
                    <p class="text-[#666] text-xs text-right mt-1">{{ formatTime(msg.timestamp) }}</p>
                  </div>
                </div>
              </div>

              <div v-if="currentMessages.length === 0" class="text-center py-16 text-[#666] text-sm">
                <p>{{ privateChatUser ? 'No hay mensajes en este chat privado' : 'No hay mensajes en el chat global' }}</p>
                <p class="text-[#555] text-xs mt-1">¡Sé el primero en escribir!</p>
              </div>
            </template>
          </div>

          <!-- Input -->
          <form @submit.prevent="sendMessage" class="flex gap-3 p-4 bg-black/30 border-t border-backrooms-yellow/20">
            <input
              v-model="messageInput"
              type="text"
              :placeholder="privateChatUser ? `Mensaje privado a ${privateChatUser.username}...` : 'Mensaje global...'"
              class="flex-1 px-4 py-3 bg-black/40 border border-backrooms-yellow/20 rounded-lg text-white text-sm focus:outline-none focus:border-backrooms-yellow transition-all"
              maxlength="300"
            />
            <button
              type="submit"
              :disabled="!messageInput.trim()"
              class="px-6 py-3 bg-gradient-to-br from-backrooms-yellow to-backrooms-yellow-dark border-none rounded-lg text-backrooms-dark font-bold text-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(255,220,100,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
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
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import NavBar from '@/components/NavBar.vue'
import socketService from '@/services/socket'
import { socialAPI } from '@/services/api'

const authStore = useAuthStore()
const currentUser = computed(() => authStore.user)

// UI State
const activeTab = ref('online')
const privateChatUser = ref(null)
const messageInput = ref('')
const messagesContainer = ref(null)
const loading = ref(true)
const searchUsername = ref('')
const searchError = ref('')
const searchSuccess = ref('')

// Data
const onlineUsers = ref([])
const friends = ref([])
const pendingRequests = ref([])
const globalMessages = ref([])
const privateChats = ref({}) // { userId: [messages] }
const sentRequests = ref(new Set()) // userIds a los que ya envié solicitud

// ========================================
// COMPUTED
// ========================================
const currentMessages = computed(() => {
  if (privateChatUser.value) {
    return privateChats.value[privateChatUser.value.id] || []
  }
  return globalMessages.value
})

function isFriend(userId) {
  return friends.value.some(f => f.id === userId)
}

function isOnline(userId) {
  return onlineUsers.value.some(u => u.userId === userId)
}

// ========================================
// SOCKET LISTENERS
// ========================================
function setupSocketListeners() {
  const socket = socketService.socket
  if (!socket) return

  // Lista inicial de usuarios online
  socket.on('global:onlineList', (list) => {
    // Excluir al usuario actual de la lista
    onlineUsers.value = list.filter(u => u.userId !== currentUser.value?.id)
  })

  // Alguien se conectó — solo actualizar lista, sin mensaje en chat
  socket.on('global:userOnline', (data) => {
    if (data.userId === currentUser.value?.id) return
    if (!onlineUsers.value.some(u => u.userId === data.userId)) {
      onlineUsers.value.push(data)
    }
  })

  // Alguien se desconectó — solo actualizar lista, sin mensaje en chat
  socket.on('global:userOffline', (data) => {
    onlineUsers.value = onlineUsers.value.filter(u => u.userId !== data.userId)
  })

  // Mensaje global recibido
  socket.on('global:message', (data) => {
    globalMessages.value.push(data)
    if (!privateChatUser.value) scrollToBottom()
  })

  // Mensaje privado recibido
  socket.on('private:message', (data) => {
    // Si soy el remitente, la clave es el destinatario; si soy el receptor, la clave es el remitente
    const chatKey = data.fromUserId === currentUser.value?.id
      ? data.receiverId
      : data.fromUserId

    if (!privateChats.value[chatKey]) {
      privateChats.value[chatKey] = []
    }
    // Evitar duplicados
    if (!privateChats.value[chatKey].some(m => m.id === data.id)) {
      privateChats.value[chatKey].push(data)
    }

    if (privateChatUser.value?.id === chatKey) scrollToBottom()
  })

  // Solicitud de amistad recibida — las claves ya coinciden con el modelo
  socket.on('friend:request', (data) => {
    // Evitar duplicados si ya está en la lista
    if (!pendingRequests.value.some(r => r.request_id === data.request_id)) {
      pendingRequests.value.unshift(data)
    }
    if (activeTab.value !== 'requests') activeTab.value = 'requests'
  })

  // Solicitud de amistad aceptada
  socket.on('friend:requestAccepted', async (data) => {
    // Recargar lista de amigos
    await loadFriends()
  })

  // Error de amigos
  socket.on('friend:error', (data) => {
    searchError.value = data.message
  })
}

// ========================================
// ACCIONES
// ========================================
function sendMessage() {
  if (!messageInput.value.trim()) return
  const socket = socketService.socket
  if (!socket) return

  if (privateChatUser.value) {
    socket.emit('private:message', {
      receiverId: privateChatUser.value.id,
      message: messageInput.value.trim()
    })
  } else {
    socket.emit('global:message', {
      message: messageInput.value.trim()
    })
  }

  messageInput.value = ''
}

async function handleSendFriendRequest() {
  searchError.value = ''
  searchSuccess.value = ''
  if (!searchUsername.value.trim()) return

  try {
    await socialAPI.sendFriendRequest(searchUsername.value.trim())
    searchSuccess.value = `Solicitud enviada a "${searchUsername.value}"`
    searchUsername.value = ''
    setTimeout(() => { searchSuccess.value = '' }, 3000)
  } catch (err) {
    searchError.value = err.message || 'Usuario no encontrado'
  }
}

function sendFriendRequestSocket(targetUserId) {
  socketService.socket?.emit('friend:request', { targetUserId })
  sentRequests.value = new Set([...sentRequests.value, targetUserId])
}

async function handleAcceptRequest(req) {
  try {
    await socialAPI.acceptFriendRequest(req.request_id, req.id)
    pendingRequests.value = pendingRequests.value.filter(r => r.request_id !== req.request_id)
    await loadFriends()
  } catch (err) {
    console.error(err)
  }
}

async function handleRejectRequest(req) {
  try {
    await socialAPI.rejectFriendRequest(req.request_id)
    pendingRequests.value = pendingRequests.value.filter(r => r.request_id !== req.request_id)
  } catch (err) {
    console.error(err)
  }
}

async function handleRemoveFriend(friend) {
  if (!confirm(`¿Eliminar a ${friend.username} de tus amigos?`)) return
  try {
    await socialAPI.removeFriend(friend.id)
    friends.value = friends.value.filter(f => f.id !== friend.id)
    if (privateChatUser.value?.id === friend.id) closePrivateChat()
  } catch (err) {
    console.error(err)
  }
}

async function openPrivateChat(friend) {
  privateChatUser.value = friend
  activeTab.value = 'friends'

  if (!privateChats.value[friend.id]) {
    try {
      const res = await socialAPI.getPrivateHistory(friend.id)
      privateChats.value[friend.id] = (res.data || []).map(m => ({
        id: m.id,
        userId: m.user_id,
        username: m.username,
        text: m.message_text,
        timestamp: m.created_at,
        fromUserId: m.user_id
      }))
    } catch {
      privateChats.value[friend.id] = []
    }
  }

  await nextTick()
  scrollToBottom()
}

function closePrivateChat() {
  privateChatUser.value = null
  nextTick(() => scrollToBottom())
}

// ========================================
// CARGA INICIAL
// ========================================
async function loadGlobalMessages() {
  try {
    const res = await socialAPI.getGlobalMessages()
    globalMessages.value = (res.data || []).map(m => ({
      id: m.id,
      userId: m.user_id,
      username: m.username,
      text: m.message_text,
      timestamp: m.created_at
    }))
  } catch {
    globalMessages.value = []
  }
}

async function loadFriends() {
  try {
    const res = await socialAPI.getFriends()
    friends.value = (res.data || []).map(f => ({ id: f.id, username: f.username }))
  } catch {
    friends.value = []
  }
}

async function loadPendingRequests() {
  try {
    const res = await socialAPI.getPendingRequests()
    pendingRequests.value = res.data || []
  } catch {
    pendingRequests.value = []
  }
}

// ========================================
// HELPERS
// ========================================
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
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

// ========================================
// LIFECYCLE
// ========================================
onMounted(async () => {
  // Conectar socket si no está conectado
  const token = localStorage.getItem('backrooms_token')
  if (token && !socketService.connected) {
    socketService.connect(token)
    await new Promise(resolve => setTimeout(resolve, 400))
  }

  setupSocketListeners()

  // Pedir lista actualizada de online al abrir la vista
  socketService.socket?.emit('global:requestOnlineList')

  await Promise.all([loadGlobalMessages(), loadFriends(), loadPendingRequests()])
  loading.value = false
  scrollToBottom()
})

onUnmounted(() => {
  const socket = socketService.socket
  if (socket) {
    socket.off('global:onlineList')
    socket.off('global:userOnline')
    socket.off('global:userOffline')
    socket.off('global:requestOnlineList')
    socket.off('global:message')
    socket.off('private:message')
    socket.off('friend:request')
    socket.off('friend:requestAccepted')
    socket.off('friend:error')
  }
})
</script>
