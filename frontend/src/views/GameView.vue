<template>
  <div class="min-h-screen bg-backrooms-dark flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex justify-between items-center px-6 py-3 bg-backrooms-dark-light/95 border-b-2 border-backrooms-yellow/30">
      <div class="flex items-center gap-4">
        <h1 class="text-lg md:text-xl text-backrooms-yellow font-mono">
          {{ currentRoom.name }}
        </h1>
      </div>
      <button
        @click="showMenu = !showMenu"
        class="px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-md text-red-300 font-semibold text-sm transition-all duration-300 hover:bg-red-500/30"
      >
        {{ showMenu ?  '☰ Menú' : '☰ Menú' }}
      </button>
    </div>

    <!-- Main Game Area -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-0 h-[calc(100vh-60px)]">
      <!-- Left: Game Scene -->
      <div class="relative bg-gradient-to-br from-[#1a1510] via-[#0a0a0a] to-[#1a1a1a] flex flex-col">
        <!-- Scene Image/Visual -->
        <div class="flex-1 relative overflow-hidden flex items-center justify-center p-4">
          <div class="w-full h-full max-h-[70vh] relative">
            <!-- Imagen del escenario -->
            <div
              class="w-full h-full bg-black/40 border-2 border-backrooms-yellow/20 rounded-xl overflow-hidden relative transition-opacity duration-300"
              :class="isTransitioning ? 'opacity-0' : 'opacity-100'"
            >
              <!-- Imagen de fondo -->
              <img
                v-if="currentRoom.image"
                :src="currentRoom.image"
                :alt="currentRoom.name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <!-- Fallback si no hay imagen -->
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a2510] to-[#0a0a0a]"
              >
                <span class="text-8xl animate-[flicker_3s_infinite]">🚪</span>
              </div>

              <!-- Overlay con nombre -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h2 class="text-xl md:text-2xl text-backrooms-yellow font-mono">{{ currentRoom.name }}</h2>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom: Movement/Action Buttons -->
        <div class="border-t-2 border-backrooms-yellow/20 bg-black/60 p-6">
          <div class="max-w-2xl mx-auto">

            <!-- Controles en forma de flechas de teclado -->
            <div class="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <!-- Fila 1: Avanzar (centro) + Examinar (derecha) -->
              <div></div>
              <button
                v-if="getActionByDirection('forward')"
                @click="performAction(getActionByDirection('forward'))"
                class="px-4 py-3 bg-backrooms-yellow/10 border border-backrooms-yellow/40 rounded-lg text-backrooms-yellow font-semibold text-sm transition-all duration-300 hover:bg-backrooms-yellow/20 hover:border-backrooms-yellow hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(255,220,100,0.3)]"
              >
                ⬆️ Avanzar
              </button>
              <div v-else></div>
              <button
                v-if="getExamineAction()"
                @click="performAction(getExamineAction())"
                class="px-4 py-3 bg-blue-500/20 border border-blue-400/40 rounded-lg text-blue-300 font-semibold text-sm transition-all duration-300 hover:bg-blue-500/30 hover:border-blue-400"
              >
                🔍 Examinar
              </button>

              <!-- Fila 2: Izquierda + Retroceder + Derecha -->
              <button
                v-if="getActionByDirection('left')"
                @click="performAction(getActionByDirection('left'))"
                class="px-4 py-3 bg-backrooms-yellow/10 border border-backrooms-yellow/40 rounded-lg text-backrooms-yellow font-semibold text-sm transition-all duration-300 hover:bg-backrooms-yellow/20 hover:border-backrooms-yellow hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(255,220,100,0.3)]"
              >
                ⬅️ Izquierda
              </button>
              <div v-else></div>
              <button
                v-if="getActionByDirection('backward')"
                @click="performAction(getActionByDirection('backward'))"
                class="px-4 py-3 bg-backrooms-yellow/10 border border-backrooms-yellow/40 rounded-lg text-backrooms-yellow font-semibold text-sm transition-all duration-300 hover:bg-backrooms-yellow/20 hover:border-backrooms-yellow hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(255,220,100,0.3)]"
              >
                ⬇️ Retroceder
              </button>
              <div v-else></div>
              <button
                v-if="getActionByDirection('right')"
                @click="performAction(getActionByDirection('right'))"
                class="px-4 py-3 bg-backrooms-yellow/10 border border-backrooms-yellow/40 rounded-lg text-backrooms-yellow font-semibold text-sm transition-all duration-300 hover:bg-backrooms-yellow/20 hover:border-backrooms-yellow hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(255,220,100,0.3)]"
              >
                ➡️ Derecha
              </button>
              <div v-else></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Stats & Inventory Panel -->
      <div class="bg-backrooms-dark-light border-l-2 border-backrooms-yellow/20 flex flex-col overflow-hidden">
        <!-- Inventory -->
        <div class="flex-1 overflow-y-auto p-5">
          <h3 class="text-backrooms-yellow text-lg font-semibold mb-4">Inventario</h3>

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

          <!-- Item Details -->
          <div v-if="selectedItem !== null" class="mt-4 p-4 bg-black/50 border border-backrooms-yellow/30 rounded-lg">
            <h4 class="text-backrooms-yellow font-semibold mb-2">{{ inventory[selectedItem].name }}</h4>
            <p class="text-gray-300 text-sm mb-3">{{ inventory[selectedItem].description }}</p>
            <button
              @click="selectedItem = null"
              class="w-full py-2 bg-backrooms-yellow/10 border border-backrooms-yellow/40 rounded text-backrooms-yellow text-sm font-semibold transition-all duration-300 hover:bg-backrooms-yellow/20"
            >
              Cerrar
            </button>
          </div>
        </div>

        <!-- Items Clave -->
        <div class="p-4 border-t-2 border-backrooms-yellow/20 bg-black/30">
          <p class="text-backrooms-yellow text-xs font-semibold mb-2">Items Clave</p>
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

    <!-- Modal Examinar -->
    <Transition name="modal-fade">
      <div
        v-if="showExamineModal"
        @click.self="showExamineModal = false"
        class="fixed inset-0 bg-black/85 flex items-center justify-center z-50"
      >
        <Transition name="modal-scale" appear>
          <div class="bg-backrooms-dark/98 border-2 border-backrooms-yellow/30 rounded-xl p-6 w-[90%] max-w-lg">
            <h2 class="text-backrooms-yellow text-xl font-mono mb-4">{{ currentRoom.name }}</h2>

            <!-- Descripción solo si no hay keypad -->
            <p v-if="!currentRoom.keypad || isKeypadUnlocked" class="text-gray-300 mb-4 leading-relaxed whitespace-pre-line">{{ currentRoom.description }}</p>

            <!-- Panel numérico si existe -->
            <div v-if="currentRoom.keypad && !isKeypadUnlocked" class="pt-2">
              <p class="text-backrooms-yellow text-sm mb-3">🔢 {{ currentRoom.keypad.hint }}</p>

              <div class="flex gap-2">
                <input
                  v-model="keypadInput"
                  type="text"
                  maxlength="4"
                  placeholder="****"
                  class="flex-1 px-4 py-3 bg-black/60 border-2 border-backrooms-yellow/40 rounded-lg text-backrooms-yellow text-center text-xl font-mono tracking-widest focus:outline-none focus:border-backrooms-yellow"
                  @keyup.enter="submitKeypadCode"
                  @input="filterKeypadInput"
                />
                <button
                  @click="submitKeypadCode"
                  class="px-6 py-3 bg-backrooms-yellow/20 border border-backrooms-yellow rounded-lg text-backrooms-yellow font-semibold transition-all duration-300 hover:bg-backrooms-yellow/30"
                >
                  Enviar
                </button>
              </div>

              <p v-if="keypadMessage" class="mt-3 text-sm" :class="keypadSuccess ? 'text-green-400' : 'text-red-400'">
                {{ keypadMessage }}
              </p>
            </div>

            <!-- Mensaje de examen normal -->
            <div v-else class="border-t border-backrooms-yellow/20 pt-4 mt-4">
              <p class="text-gray-400 italic text-sm">{{ examineMessage }}</p>
            </div>

            <button
              @click="closeExamineModal"
              class="w-full mt-6 py-3 bg-backrooms-yellow/10 border border-backrooms-yellow/40 rounded-lg text-backrooms-yellow font-semibold transition-all duration-300 hover:bg-backrooms-yellow/20"
            >
              Cerrar
            </button>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- NPC Dialogue Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showDialogue"
        class="fixed inset-0 bg-black/85 flex items-end justify-center z-50 pb-8"
      >
        <Transition name="dialogue-slide" appear>
          <div
            class="bg-backrooms-dark/98 border-2 rounded-xl p-6 w-[95%] max-w-2xl"
            :style="{
              borderColor: currentRoom.npc?.colors?.primary + '80' || '#06b6d480',
              background: `linear-gradient(135deg, ${currentRoom.npc?.colors?.primary}10 0%, ${currentRoom.npc?.colors?.secondary}10 100%)`
            }"
          >
            <!-- Nombre del NPC -->
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :style="{
                  backgroundColor: (currentRoom.npc?.colors?.primary || '#06b6d4') + '30',
                  borderColor: (currentRoom.npc?.colors?.primary || '#06b6d4') + '80',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }"
              >
                <span class="text-lg">{{ currentRoom.npc?.icon || '🎤' }}</span>
              </div>
              <h3
                class="text-lg font-semibold"
                :style="{ color: currentRoom.npc?.colors?.primary || '#06b6d4' }"
              >
                {{ currentRoom.npc?.name }}
              </h3>
            </div>

            <!-- Texto del diálogo -->
            <p class="text-gray-200 text-base leading-relaxed mb-6 min-h-[60px]">
              {{ currentDialogue[dialogueIndex] }}
            </p>

            <!-- Indicador de progreso y botón continuar -->
            <div class="flex items-center justify-between">
              <span class="text-gray-500 text-sm">{{ dialogueIndex + 1 }} / {{ currentDialogue.length }}</span>
              <button
                @click="nextDialogue"
                class="px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                :style="{
                  backgroundColor: (currentRoom.npc?.colors?.secondary || '#06b6d4') + '30',
                  borderColor: (currentRoom.npc?.colors?.secondary || '#06b6d4') + '80',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: currentRoom.npc?.colors?.secondary || '#06b6d4'
                }"
              >
                {{ dialogueIndex < currentDialogue.length - 1 ? 'Continuar ▶' : 'Cerrar' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Key Item Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showKeyItemModal"
        @click.self="showKeyItemModal = false"
        class="fixed inset-0 bg-black/85 flex items-center justify-center z-50"
      >
        <Transition name="modal-scale" appear>
          <div class="bg-backrooms-dark/98 border-2 border-backrooms-yellow/30 rounded-xl p-6 w-[90%] max-w-lg">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-4xl">{{ selectedKeyItem?.icon }}</span>
              <h2 class="text-backrooms-yellow text-xl font-mono">{{ selectedKeyItem?.name }}</h2>
            </div>

            <p class="text-gray-300 mb-4 leading-relaxed whitespace-pre-line">{{ selectedKeyItem?.description }}</p>

            <button
              @click="showKeyItemModal = false"
              class="w-full py-3 bg-backrooms-yellow/10 border border-backrooms-yellow/40 rounded-lg text-backrooms-yellow font-semibold transition-all duration-300 hover:bg-backrooms-yellow/20"
            >
              Cerrar
            </button>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Menu Overlay -->
    <Transition name="modal-fade">
      <div
        v-if="showMenu"
        @click.self="showMenu = false"
        class="fixed inset-0 bg-black/85 flex items-center justify-center z-50"
      >
        <Transition name="modal-scale" appear>
          <div class="bg-backrooms-dark/98 border-2 border-backrooms-yellow/30 rounded-xl p-8 w-[90%] max-w-md">
            <h2 class="text-backrooms-yellow text-2xl mb-6">Menú</h2>

            <div class="flex flex-col gap-3">
              <button
                @click="continueGame"
                class="w-full py-3 bg-backrooms-yellow/10 border border-backrooms-yellow/40 rounded-lg text-backrooms-yellow font-semibold transition-all duration-300 hover:bg-backrooms-yellow/20"
              >
                ▶️ Continuar
              </button>

              <button
                @click="leaveGame"
                class="w-full py-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 font-semibold transition-all duration-300 hover:bg-red-500/30"
              >
                Salir al menú principal
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { roomAPI } from '@/services/api'
import { roomsMap } from '@/data/roomsMap'

const router = useRouter()
const authStore = useAuthStore()

// Session ID
const currentSessionId = ref(null)

// UI State
const showMenu = ref(false)
const showExamineModal = ref(false)
const examineMessage = ref('')
const selectedItem = ref(null)
const isTransitioning = ref(false)

// Key Items Modal State
const showKeyItemModal = ref(false)
const selectedKeyItem = ref(null)

// Keypad State
const keypadInput = ref('')
const keypadMessage = ref('')
const keypadSuccess = ref(false)
const unlockedDoors = ref([]) // Guarda los IDs de puertas desbloqueadas

// NPC Dialogue State
const showDialogue = ref(false)
const currentDialogue = ref([]) // Array de líneas de diálogo
const dialogueIndex = ref(0) // Índice actual del diálogo
const npcHasItem = ref(false) // Si el jugador tiene el item requerido
const questCompleted = ref([]) // IDs de NPCs con quest completada

// Computed para saber si el keypad actual está desbloqueado
const isKeypadUnlocked = computed(() => {
  return unlockedDoors.value.includes(currentRoomId.value)
})

// Estado actual de la habitación
const currentRoomId = ref('inicio')
const currentRoom = computed(() => roomsMap[currentRoomId.value])

// Acciones disponibles según las conexiones de la habitación actual
const availableActions = computed(() => {
  const room = currentRoom.value
  const actions = []

  if (room.connections.right) {
    actions.push({ id: 1, icon: '➡️', label: 'Ir a la derecha', direction: 'right' })
  }
  if (room.connections.left) {
    actions.push({ id: 2, icon: '⬅️', label: 'Ir a la izquierda', direction: 'left' })
  }
  if (room.connections.forward) {
    actions.push({ id: 3, icon: '⬆️', label: 'Avanzar', direction: 'forward' })
  }
  if (room.connections.backward) {
    actions.push({ id: 4, icon: '⬇️', label: 'Retroceder', direction: 'backward' })
  }

  // Siempre permitir examinar
  actions.push({ id: 5, icon: '🔍', label: 'Examinar cuarto', action: 'examine' })

  return actions
})

// Inventory
const maxSlots = 8
const inventory = ref([])

const quickSlots = ref([
  {
    icon: '📋',
    name: 'Tutorial',
    description: 'Con los botones inferiores puedes moverte entre los pasillos.\n\nEl botón "Examinar" te permite ver la descripción de las escenas e incluso agarrar objetos que veas (tranquilo, se ven a simple vista).'
  },
  {
    icon: '📜',
    name: 'Situación',
    description: 'Anomalías nuevas están apareciendo en el primer piso de las backrooms, no sabemos el porqué de esto.\n\nVe y busca pistas y las anomalías que hay en este piso, debes ingresar a uno de nuestros viejos laboratorios.\n\nBusca la manera de entrar, según viejos incursionistas dejaron pistas.'
  },
  null
])

// Methods
function performAction(action) {
  console.log('Acción:', action)

  if (action.direction) {
    transitionToNewRoom(action.direction)
  } else if (action.action) {
    executeAction(action.action)
  }
}

function transitionToNewRoom(direction) {
  const room = currentRoom.value
  const nextRoomId = room.connections[direction]

  if (!nextRoomId) {
    console.log('No hay salida en esa dirección')
    return
  }

  // Verificar si hay un keypad que bloquea esta dirección
  if (room.keypad && room.keypad.unlocks === direction && !unlockedDoors.value.includes(currentRoomId.value)) {
    // La puerta está bloqueada, mostrar modal de examinar para ingresar código
    examineMessage.value = ''
    showExamineModal.value = true
    return
  }

  // Animación de transición
  isTransitioning.value = true

  setTimeout(() => {
    currentRoomId.value = nextRoomId
    isTransitioning.value = false
    console.log('Ahora estás en:', currentRoom.value.name)
  }, 300) // Duración de la transición
}

function executeAction(action) {
  console.log('Ejecutando acción:', action)

  if (action === 'examine') {
    examineRoom()
  }
}

function examineRoom() {
  const room = currentRoom.value

  // Si hay un NPC en la habitación, iniciar diálogo
  if (room.npc) {
    startDialogue()
    return
  }

  // Buscar items que aún no hemos recogido
  const newItems = room.items?.filter(item => {
    return !inventory.value.find(i => i.id === item.id)
  }) || []

  if (newItems.length > 0) {
    // Hay items nuevos para recoger
    newItems.forEach(item => {
      inventory.value.push({ ...item })
    })

    const itemNames = newItems.map(i => i.name).join(', ')
    examineMessage.value = `Observas detenidamente el lugar... ¡Encontraste: ${itemNames}!`
  } else {
    // No hay nada que recoger
    examineMessage.value = 'Observas detenidamente el lugar, pero no parece haber nada útil que puedas llevarte.'
  }

  showExamineModal.value = true
}

// ===== NPC DIALOGUE SYSTEM =====
const npcMet = ref([]) // IDs de NPCs que ya conocimos (vimos el intro)

function startDialogue() {
  const room = currentRoom.value
  const npc = room.npc

  if (!npc) return

  // Verificar si ya completamos la quest de este NPC
  if (questCompleted.value.includes(currentRoomId.value)) {
    examineMessage.value = `${npc.name} te saluda con una sonrisa.`
    showExamineModal.value = true
    return
  }

  // Verificar si el jugador tiene el item requerido
  const hasRequiredItem = npc.requiredItem && inventory.value.find(i => i.name === npc.requiredItem)
  npcHasItem.value = !!hasRequiredItem

  // Construir el diálogo combinado
  let fullDialogue = []

  // Si no hemos conocido al NPC, mostrar intro primero
  if (!npcMet.value.includes(currentRoomId.value) && npc.dialogueIntro) {
    fullDialogue = [...npc.dialogueIntro]
    npcMet.value.push(currentRoomId.value)
  }

  // Añadir el diálogo según si tiene el item o no
  if (hasRequiredItem && npc.dialogueWithItem) {
    fullDialogue = [...fullDialogue, ...npc.dialogueWithItem]
  } else if (npc.dialogue) {
    fullDialogue = [...fullDialogue, ...npc.dialogue]
  }

  currentDialogue.value = fullDialogue
  dialogueIndex.value = 0
  showDialogue.value = true
}

function nextDialogue() {
  const room = currentRoom.value
  const npc = room.npc

  if (dialogueIndex.value < currentDialogue.value.length - 1) {
    // Avanzar al siguiente diálogo
    dialogueIndex.value++
  } else {
    // Fin del diálogo
    if (npcHasItem.value && npc.reward) {
      // Dar recompensa y quitar el item requerido
      const requiredItemIndex = inventory.value.findIndex(i => i.name === npc.requiredItem)
      if (requiredItemIndex !== -1) {
        inventory.value.splice(requiredItemIndex, 1)
      }

      // Añadir recompensa al inventario
      inventory.value.push({ ...npc.reward })

      // Marcar quest como completada
      questCompleted.value.push(currentRoomId.value)
    }

    closeDialogue()
  }
}

function closeDialogue() {
  showDialogue.value = false
  dialogueIndex.value = 0
  currentDialogue.value = []
  npcHasItem.value = false
}

function handleImageError(event) {
  // Si la imagen no carga, mostrar un placeholder
  console.warn('No se pudo cargar la imagen:', event.target.src)
  event.target.style.display = 'none'
}

// Helpers para obtener acciones por dirección
function getActionByDirection(direction) {
  return availableActions.value.find(a => a.direction === direction)
}

function getExamineAction() {
  return availableActions.value.find(a => a.action === 'examine')
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
    selectedKeyItem.value = quickSlots.value[index]
    showKeyItemModal.value = true
  }
}

function continueGame() {
  showMenu.value = false
}

function leaveGame() {
  if (confirm('¿Seguro que quieres Salir?')) {
    router.push('/game-mode')
  }
}

// Keypad functions
function submitKeypadCode() {
  const room = currentRoom.value

  if (!room.keypad) return

  if (keypadInput.value === room.keypad.code) {
    // Código correcto
    keypadSuccess.value = true
    keypadMessage.value = '✓ Acceso concedido. La puerta se ha desbloqueado.'

    // Esperar a que el usuario vea el mensaje antes de desbloquear
    setTimeout(() => {
      unlockedDoors.value.push(currentRoomId.value)
      keypadMessage.value = ''
      keypadInput.value = ''
      showExamineModal.value = false
    }, 2000)
  } else {
    // Código incorrecto
    keypadSuccess.value = false
    keypadMessage.value = '✗ Código incorrecto. Acceso denegado.'
    keypadInput.value = ''

    // Limpiar mensaje después de un momento
    setTimeout(() => {
      keypadMessage.value = ''
    }, 2000)
  }
}

function filterKeypadInput() {
  // Solo permitir números del 1 al 9
  keypadInput.value = keypadInput.value.replace(/[^1-9]/g, '')
}

function closeExamineModal() {
  showExamineModal.value = false
  keypadInput.value = ''
  keypadMessage.value = ''
}

// ===== PROGRESS SYSTEM =====
onMounted(async () => {
  // Obtener ID de sesión del localStorage
  currentSessionId.value = localStorage.getItem('currentRoomId')

  if (currentSessionId.value) {
    await loadGameProgress()
  }
})

// Auto-guardar cuando cambia el escenario
watch(currentRoomId, async (newSceneId) => {
  if (currentSessionId.value && newSceneId) {
    await saveGameProgress()
  }
})

// Auto-guardar cuando cambia el inventario
watch(inventory, async () => {
  if (currentSessionId.value) {
    await saveGameProgress()
  }
}, { deep: true })

// Cargar progreso guardado
async function loadGameProgress() {
  try {
    const response = await roomAPI.loadProgress(currentSessionId.value)

    if (response.success && response.data) {
      // Cargar escenario guardado
      if (response.data.sceneId) {
        currentRoomId.value = response.data.sceneId
      }

      // Cargar inventario guardado
      if (response.data.inventory && response.data.inventory.length > 0) {
        // Mapear los items guardados a la estructura del inventario
        inventory.value = response.data.inventory.map(item => {
          // Buscar el item completo en roomsMap para obtener todos sus datos
          for (const roomId in roomsMap) {
            const room = roomsMap[roomId]
            if (room.items) {
              const fullItem = room.items.find(i => i.name === item.name)
              if (fullItem) {
                return { ...fullItem, quantity: item.quantity }
              }
            }
          }
          // Si no se encuentra, crear un item básico
          return {
            name: item.name,
            quantity: item.quantity,
            icon: '📦',
            description: 'Item guardado'
          }
        })
      }

      console.log('Progreso cargado:', response.data)
    }
  } catch (error) {
    console.error('Error al cargar progreso:', error)
  }
}

// Guardar progreso
async function saveGameProgress() {
  try {
    // Preparar inventario para guardar (solo nombre y cantidad)
    const inventoryToSave = inventory.value.map(item => ({
      name: item.name,
      quantity: item.quantity || 1
    }))

    console.log('💾 Guardando progreso:', {
      sessionId: currentSessionId.value,
      sceneId: currentRoomId.value,
      inventory: inventoryToSave
    })

    await roomAPI.saveProgress(
      currentSessionId.value,
      currentRoomId.value,
      inventoryToSave
    )

    console.log('✅ Progreso guardado exitosamente')
  } catch (error) {
    console.error('❌ Error al guardar progreso:', error)
  }
}
</script>

<style scoped>
/* Transición del fondo oscuro */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Transición del contenido del modal */
.modal-scale-enter-active {
  transition: all 0.3s ease-out;
}

.modal-scale-leave-active {
  transition: all 0.2s ease-in;
}

.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Transición del diálogo (slide desde abajo) */
.dialogue-slide-enter-active {
  transition: all 0.4s ease-out;
}

.dialogue-slide-leave-active {
  transition: all 0.2s ease-in;
}

.dialogue-slide-enter-from {
  opacity: 0;
  transform: translateY(50px);
}

.dialogue-slide-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
