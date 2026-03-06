<template>
  <div class="min-h-screen bg-backrooms-dark flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex justify-between items-center px-6 py-3 bg-backrooms-dark-light/95 border-b-2 border-backrooms-yellow/30">
      <div class="flex items-center gap-4">
        <h1 class="text-lg md:text-xl text-backrooms-yellow font-mono">
          🚪 {{ currentRoom.name }}
        </h1>
        <span class="text-sm text-gray-400">Nivel {{ currentRoom.level }}</span>
      </div>
      <button
        @click="showMenu = !showMenu"
        class="px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-md text-red-300 font-semibold text-sm transition-all duration-300 hover:bg-red-500/30"
      >
        {{ showMenu ? '✕ Cerrar Menú' : '☰ Menú' }}
      </button>
    </div>

    <!-- Main Game Area -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-0 h-[calc(100vh-60px)]">
      <!-- Left: Game Scene -->
      <div class="relative bg-gradient-to-br from-[#1a1510] via-[#0a0a0a] to-[#1a1a1a] flex flex-col">
        <!-- Scene Image/Visual -->
        <div class="flex-1 relative overflow-hidden flex items-center justify-center p-8">
          <div class="w-full h-full max-w-4xl max-h-[70vh] relative">
            <!-- Placeholder para imagen del escenario -->
            <div class="w-full h-full bg-black/40 border-2 border-backrooms-yellow/20 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm">
              <div class="text-8xl mb-4 animate-[flicker_3s_infinite]">{{ currentRoom.emoji }}</div>
              <h2 class="text-3xl md:text-4xl text-backrooms-yellow font-mono mb-4">{{ currentRoom.name }}</h2>
              <p class="text-gray-300 text-center max-w-lg px-4">{{ currentRoom.description }}</p>
            </div>
          </div>
        </div>

        <!-- Bottom: Movement/Action Buttons -->
        <div class="border-t-2 border-backrooms-yellow/20 bg-black/60 p-6">
          <div class="max-w-2xl mx-auto">
            <p class="text-backrooms-yellow text-sm mb-3 font-semibold">¿Qué quieres hacer?</p>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                v-for="action in availableActions"
                :key="action.id"
                @click="performAction(action)"
                class="px-4 py-3 bg-backrooms-yellow/10 border border-backrooms-yellow/40 rounded-lg text-backrooms-yellow font-semibold text-sm transition-all duration-300 hover:bg-backrooms-yellow/20 hover:border-backrooms-yellow hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(255,220,100,0.3)]"
              >
                {{ action.icon }} {{ action.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Stats & Inventory Panel -->
      <div class="bg-backrooms-dark-light border-l-2 border-backrooms-yellow/20 flex flex-col overflow-hidden">
        <!-- Player Stats -->
        <div class="p-5 border-b-2 border-backrooms-yellow/20 bg-black/30">
          <h3 class="text-backrooms-yellow text-lg font-semibold mb-4">📊 Estado</h3>

          <!-- Health -->
          <div class="mb-3">
            <div class="flex justify-between mb-1">
              <span class="text-sm text-gray-300 flex items-center gap-1">
                <span>❤️</span> Salud
              </span>
              <span class="text-sm text-white font-semibold">{{ playerStats.health }}/100</span>
            </div>
            <div class="h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
              <div
                class="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                :style="{ width: playerStats.health + '%' }"
              ></div>
            </div>
          </div>

          <!-- Stamina -->
          <div class="mb-3">
            <div class="flex justify-between mb-1">
              <span class="text-sm text-gray-300 flex items-center gap-1">
                <span>⚡</span> Energía
              </span>
              <span class="text-sm text-white font-semibold">{{ playerStats.stamina }}/100</span>
            </div>
            <div class="h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
              <div
                class="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                :style="{ width: playerStats.stamina + '%' }"
              ></div>
            </div>
          </div>

          <!-- Sanity -->
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-sm text-gray-300 flex items-center gap-1">
                <span>🧠</span> Cordura
              </span>
              <span class="text-sm text-white font-semibold">{{ playerStats.sanity }}/100</span>
            </div>
            <div class="h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
              <div
                class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                :style="{ width: playerStats.sanity + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Inventory -->
        <div class="flex-1 overflow-y-auto p-5">
          <h3 class="text-backrooms-yellow text-lg font-semibold mb-4">🎒 Inventario</h3>

          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="(item, index) in inventory"
              :key="index"
              @click="selectItem(index)"
              class="p-3 bg-black/40 border rounded-lg cursor-pointer transition-all duration-300"
              :class="selectedItem === index
                ? 'border-backrooms-yellow bg-backrooms-yellow/10'
                : 'border-backrooms-yellow/20 hover:border-backrooms-yellow/40 hover:bg-backrooms-yellow/5'"
            >
              <div class="text-3xl text-center mb-2">{{ item.icon }}</div>
              <p class="text-white text-xs font-semibold text-center">{{ item.name }}</p>
              <p v-if="item.quantity > 1" class="text-gray-400 text-xs text-center">x{{ item.quantity }}</p>
            </div>

            <!-- Empty slots -->
            <div
              v-for="n in (maxSlots - inventory.length)"
              :key="'empty-' + n"
              class="p-3 bg-black/20 border border-dashed border-backrooms-yellow/10 rounded-lg opacity-30"
            >
              <div class="text-3xl text-center mb-2 text-gray-600">-</div>
              <p class="text-gray-600 text-xs text-center">Vacío</p>
            </div>
          </div>

          <!-- Item Actions -->
          <div v-if="selectedItem !== null" class="mt-4 p-4 bg-black/50 border border-backrooms-yellow/30 rounded-lg">
            <h4 class="text-backrooms-yellow font-semibold mb-2">{{ inventory[selectedItem].name }}</h4>
            <p class="text-gray-300 text-sm mb-3">{{ inventory[selectedItem].description }}</p>
            <div class="flex gap-2">
              <button
                @click="useItem(selectedItem)"
                class="flex-1 py-2 bg-backrooms-yellow/20 border border-backrooms-yellow rounded text-backrooms-yellow text-sm font-semibold transition-all duration-300 hover:bg-backrooms-yellow/30"
              >
                Usar
              </button>
              <button
                @click="dropItem(selectedItem)"
                class="px-3 py-2 bg-red-500/20 border border-red-500/40 rounded text-red-300 text-sm font-semibold transition-all duration-300 hover:bg-red-500/30"
              >
                Tirar
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Items -->
        <div class="p-4 border-t-2 border-backrooms-yellow/20 bg-black/30">
          <p class="text-backrooms-yellow text-xs font-semibold mb-2">Items Rápidos</p>
          <div class="flex gap-2">
            <button
              v-for="(slot, index) in quickSlots"
              :key="index"
              @click="useQuickSlot(index)"
              class="flex-1 p-2 bg-backrooms-yellow/10 border rounded-lg transition-all duration-300"
              :class="slot
                ? 'border-backrooms-yellow/40 hover:bg-backrooms-yellow/20'
                : 'border-backrooms-yellow/10 opacity-40 cursor-not-allowed'"
            >
              <div class="text-2xl text-center">{{ slot?.icon || '-' }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu Overlay -->
    <div
      v-if="showMenu"
      @click.self="showMenu = false"
      class="fixed inset-0 bg-black/85 flex items-center justify-center z-50"
    >
      <div class="bg-backrooms-dark/98 border-2 border-backrooms-yellow/30 rounded-xl p-8 w-[90%] max-w-md">
        <h2 class="text-backrooms-yellow text-2xl mb-6">⚙️ Menú</h2>

        <div class="flex flex-col gap-3">
          <button
            @click="continueGame"
            class="w-full py-3 bg-backrooms-yellow/10 border border-backrooms-yellow/40 rounded-lg text-backrooms-yellow font-semibold transition-all duration-300 hover:bg-backrooms-yellow/20"
          >
            ▶️ Continuar
          </button>

          <button
            @click="saveGame"
            class="w-full py-3 bg-backrooms-yellow/10 border border-backrooms-yellow/40 rounded-lg text-backrooms-yellow font-semibold transition-all duration-300 hover:bg-backrooms-yellow/20"
          >
            💾 Guardar Progreso
          </button>

          <button
            @click="leaveGame"
            class="w-full py-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 font-semibold transition-all duration-300 hover:bg-red-500/30"
          >
            🚪 Salir al Lobby
          </button>
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

// UI State
const showMenu = ref(false)
const selectedItem = ref(null)

// Room/Scene State
const currentRoom = ref({
  name: 'El Pasillo Amarillo',
  level: 0,
  emoji: '🚪',
  description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.'
})

// Available Actions
const availableActions = ref([
  { id: 1, icon: '➡️', label: 'Ir a la derecha', direction: 'right' },
  { id: 2, icon: '⬅️', label: 'Ir a la izquierda', direction: 'left' },
  { id: 3, icon: '⬆️', label: 'Avanzar', direction: 'forward' },
  { id: 4, icon: '🔍', label: 'Examinar', action: 'examine' },
  { id: 5, icon: '🔦', label: 'Usar linterna', action: 'flashlight' },
  { id: 6, icon: '👂', label: 'Escuchar', action: 'listen' }
])

// Player Stats
const playerStats = ref({
  health: 85,
  stamina: 70,
  sanity: 65
})

// Inventory
const maxSlots = 8
const inventory = ref([
  { id: 1, icon: '🔦', name: 'Linterna', description: 'Ilumina la oscuridad. Batería: 75%', quantity: 1 },
  { id: 2, icon: '🍫', name: 'Barra Energética', description: 'Restaura 20 de energía', quantity: 3 },
  { id: 3, icon: '💊', name: 'Botiquín', description: 'Restaura 50 de salud', quantity: 2 },
  { id: 4, icon: '🗝️', name: 'Llave Oxidada', description: 'Parece antigua y misteriosa', quantity: 1 }
])

const quickSlots = ref([
  { icon: '🔦', name: 'Linterna' },
  { icon: '🍫', name: 'Comida' },
  { icon: '💊', name: 'Botiquín' },
  null
])

// Methods
function performAction(action) {
  console.log('Acción:', action)

  // Simular transición de escena
  if (action.direction) {
    transitionToNewRoom(action.direction)
  } else {
    executeAction(action.action)
  }
}

function transitionToNewRoom(direction) {
  // TODO: Implementar lógica de transición entre habitaciones
  console.log('Moviéndose hacia:', direction)

  // Ejemplo de cambio de escenario
  const scenarios = [
    { name: 'Pasillo Infinito', emoji: '🚪', description: 'Paredes amarillas sin fin...' },
    { name: 'Sala Abandonada', emoji: '🏢', description: 'Una oficina vacía con computadoras antiguas.' },
    { name: 'Escaleras Oscuras', emoji: '🪜', description: 'Escaleras que bajan a la oscuridad total.' }
  ]

  const random = Math.floor(Math.random() * scenarios.length)
  currentRoom.value = { ...scenarios[random], level: currentRoom.value.level }
}

function executeAction(action) {
  console.log('Ejecutando acción:', action)
  // TODO: Implementar acciones específicas
}

function selectItem(index) {
  selectedItem.value = selectedItem.value === index ? null : index
}

function useItem(index) {
  const item = inventory.value[index]
  console.log('Usando:', item.name)

  // TODO: Implementar efectos de items
  if (item.quantity > 1) {
    item.quantity--
  } else {
    inventory.value.splice(index, 1)
  }
  selectedItem.value = null
}

function dropItem(index) {
  if (confirm('¿Descartar este objeto?')) {
    inventory.value.splice(index, 1)
    selectedItem.value = null
  }
}

function useQuickSlot(index) {
  if (quickSlots.value[index]) {
    console.log('Usando slot rápido:', quickSlots.value[index].name)
    // TODO: Usar item del slot rápido
  }
}

function continueGame() {
  showMenu.value = false
}

function saveGame() {
  console.log('Guardando progreso...')
  // TODO: Guardar en backend
  alert('Progreso guardado')
  showMenu.value = false
}

function leaveGame() {
  if (confirm('¿Salir al lobby? El progreso se guardará.')) {
    router.push('/lobby')
  }
}
</script>
