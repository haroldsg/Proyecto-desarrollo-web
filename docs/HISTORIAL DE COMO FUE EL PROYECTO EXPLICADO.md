# 🎮 Backrooms Multiplayer

Juego de exploración y puzzles multijugador en tiempo real inspirado en los Backrooms.

**Stack:** Vue.js 3 + Node.js + Express + MySQL + Socket.io

---

## 🚀 Instalación Rápida

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

Luego abre http://localhost:5173

---

## 📋 Progreso del Proyecto


### ✅ FASE 1: Backend + Base de Datos

**Cambios agregados:**
- ✅ Backend inicializado con Node.js + Express
- ✅ 8 dependencias instaladas (Express, MySQL2, JWT, Bcrypt, Socket.io, etc.)
- ✅ Configuración de conexión a MySQL con pool
- ✅ Script SQL completo para crear 8 tablas
- ✅ Sistema de roles (user/admin) y moderación agregado
- ✅ Servidor básico funcionando con health check
- ✅ Diseño de base de datos completo (7 tablas) - `docs/DATABASE_DESIGN.md`

**Archivos creados:**
```
backend/
├── package.json            # Dependencias del backend
├── .env.example            # Template de variables de entorno
├── README.md               # Guía del backend
├── src/
│   ├── server.js           # Servidor Express
│   └── config/
│       └── database.js     # Conexión MySQL
└── database/
    └── schema.sql          # Script para crear tablas
```

**Cómo probar (Se explica mejor en backend\README_HOW_RUN_SERVER.md) :**
```bash
cd backend
cp .env.example .env  # Configurar credenciales
mysql -u root -p < database/schema.sql
npm run dev
curl http://localhost:3000/health
```

---

### ✅ FASE 2: Sistema de Autenticación
**Cambios agregados:**
- ✅ Endpoints de registro y login funcionando
- ✅ Hasheo de contraseñas con Bcrypt (10 rounds)
- ✅ Generación y verificación de JWT tokens
- ✅ Middleware de autenticación para proteger rutas
- ✅ Validación de datos con Joi
- ✅ Modelo de User con operaciones CRUD

**Archivos creados:**
```
backend/
├── test-auth.html            # 🎨 Panel visual para probar endpoints
├── src/
│   ├── controllers/
│   │   └── authController.js    # Login, register, getMe
│   ├── models/
│   │   └── User.js               # Modelo de usuario
│   ├── routes/
│   │   └── authRoutes.js         # Rutas de autenticación
│   ├── middleware/
│   │   ├── auth.js               # Verificación JWT
│   │   └── validation.js         # Validación con Joi
│   └── utils/
│       ├── hashPassword.js       # Bcrypt utilities
│       └── jwt.js                # JWT utilities
```

**Endpoints disponibles:**
```bash
POST /api/auth/register  # Registrar usuario
POST /api/auth/login     # Iniciar sesión
GET  /api/auth/me        # Obtener usuario actual (requiere token)
```

**Cómo probar:**

**Opción 1 - Interfaz Visual (Recomendado):**
1. Abre `backend/test-auth.html` en tu navegador
2. Prueba los endpoints visualmente con formularios
3. El token se guarda automáticamente

**Opción 2 - Thunder Client/cURL:**
```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Ver guía completa en [TESTING_API.md](docs/TESTING_API.md)

---

### ✅ FASE 3: Sistema de Salas/Lobby Multijugador

**Cambios agregados:**
- ✅ Modelo Room.js con operaciones CRUD completas
- ✅ Controlador de salas con 8 endpoints
- ✅ Rutas protegidas con autenticación JWT
- ✅ Socket.io configurado para tiempo real
- ✅ Chat en sala funcionando
- ✅ Sistema de host con transferencia automática
- ✅ Soporte para 2-4 jugadores por sala
- ✅ Se agrearon nuevos campos en la base de datos

**Archivos creados:**
```
backend/
├── test-rooms.html              # Panel visual para probar salas
├── src/
│   ├── controllers/
│   │   └── roomController.js    # Controlador de salas
│   ├── models/
│   │   └── Room.js              # Modelo de sala
│   ├── routes/
│   │   └── roomRoutes.js        # Rutas de salas
│   └── socket/
│       └── socketHandler.js     # Eventos Socket.io
```

**Endpoints disponibles:**
```bash
POST /api/rooms           # Crear sala
GET  /api/rooms           # Listar salas disponibles
GET  /api/rooms/current   # Obtener sala actual del usuario
GET  /api/rooms/:id       # Detalles de una sala
POST /api/rooms/:id/join  # Unirse por ID
POST /api/rooms/join      # Unirse por código
POST /api/rooms/:id/leave # Salir de sala
POST /api/rooms/:id/start # Iniciar juego (solo host)
```

**Eventos Socket.io:**
```javascript
// Cliente -> Servidor
'room:join'      // Unirse al socket de una sala
'room:leave'     // Salir del socket de una sala
'chat:message'   // Enviar mensaje de chat

// Servidor -> Cliente
'room:playerJoined'      // Un jugador se unió
'room:playerLeft'        // Un jugador salió
'room:gameStarted'       // El juego comenzó
'room:deleted'           // La sala fue eliminada
'chat:message'           // Mensaje de chat recibido
```

**Cómo probar:**
1. Importa la base de datos con nuevas tablas
2. Inicia el servidor: `cd backend && npm run dev`
3. Abre `backend/test-rooms.html` en el navegador
4. Regístrate o inicia sesión
5. Crea una sala o únete a una existente
6. Abre otra pestaña para probar multijugador

---
## **Panel de Pruebas Visual** (Recomendado)

Incluye un panel de pruebas interactivo para testear la API sin escribir código:

**Ubicación:** `backend/test-auth.html`

**Cómo usar:**
1. Asegúrate que el servidor esté corriendo (`npm run dev` en `backend/`)
2. Debes tender un `.env` dentro de la carpeta `backend/`
3. Abre `backend/test-auth.html` con doble click en tu navegador
4. Usa los formularios para probar:
   - 📝 **Register** - Registrar nuevos usuarios
   - 🔐 **Login** - Iniciar sesión
   - 👤 **Get Me** - Obtener perfil del usuario autenticado

**Características:**
- ✅ Interfaz visual amigable
- ✅ Muestra respuestas JSON coloreadas
- ✅ Guarda el token JWT automáticamente
- ✅ Indicador de estado del servidor en tiempo real
- ✅ Botón para copiar el token al portapapeles

**Alternativas:**
- Thunder Client (extensión de VSCode)
- cURL (línea de comandos)
- Postman

Ver guía completa en [docs/TESTING_API.md]

---

### 🔄 FASE 4: Frontend Vue.js (EN DESARROLLO)

**Progreso actual:**
- ✅ Commit 1: Reestructuración del proyecto (backend/ y frontend/ separados) e Instalación de dependencias (axios, socket.io-client)
- ✅ Commit 2: Configuración de servicios API y Socket.io
  - Creado `frontend/src/services/api.js` (cliente Axios con interceptores JWT)
  - Creado `frontend/src/services/socket.js` (cliente Socket.io)
  - Creado `frontend/.env` (configuración de URL del backend)
- ✅ Commit 3: Store Pinia para gestión de estado global
  - Creado `frontend/src/stores/auth.js` (state: user, token, loading, error)
  - Getters: isAuthenticated, username, userId
  - Actions: register(), login(), logout(), getMe(), init()
  - Persistencia con localStorage
  - Auto-conexión de Socket.io al login
  - Modificado `main.ts` para inicializar el store
- ✅ Commit 4: Router con Navigation Guards (protección de rutas)
  - Rutas configuradas: `/`, `/login`, `/register`, `/lobby`, `/room/:id`, `/game`
  - Navigation Guard `beforeEach` para proteger rutas privadas
  - Meta fields: `requiresAuth` (rutas protegidas), `requiresGuest` (login/register)
  - Redirección automática según estado de autenticación
- ✅ Commit 5: Migración completa a Tailwind CSS + Vistas del juego

  **Instalación y configuración de Tailwind CSS:**
  - Instalado Tailwind CSS 3.4.1, PostCSS 8.4.35, Autoprefixer 10.4.17
  - Creado `tailwind.config.js` con tema personalizado Backrooms:
    - Colores custom: `backrooms-yellow (#ffdc64)`, `backrooms-yellow-dark (#d4a437)`, `backrooms-dark (#141414)`, `backrooms-dark-light (#1a1a1a)`
    - Safelist configurada con regex patterns para clases dinámicas con opacidad (`bg-backrooms-yellow/20`, etc.)
    - Animación custom `flicker` para efectos Backrooms
  - Creado `postcss.config.js` para procesamiento CSS
  - Actualizado `main.css` con directivas Tailwind (@tailwind base/components/utilities)

  **Migración de componentes/vistas a Tailwind (8 archivos):**
  - ✅ `NavBar.vue` - Navegación con pestañas + dropdown de perfil funcional
  - ✅ `LoginView.vue` - Formulario de login con validación
  - ✅ `RegisterView.vue` - Formulario de registro con confirmación de contraseña
  - ✅ `LobbyView.vue` - Lista de salas disponibles + modal crear sala + auto-refresh (5s)
  - ✅ `RoomView.vue` - Sala de espera con chat, lista de jugadores, host controls
  - ✅ `GameView.vue` - Interfaz de juego rediseñada (ver abajo)
  - ✅ `GameModeView.vue` - Selector de modo de juego (Solo/Multijugador)
  - ✅ `ChatGlobalView.vue` - Chat global con Socket.io

  **Características generales:**
  - 🎨 Diseño 100% responsive (móvil, tablet, desktop) con breakpoints Tailwind
  - 🌙 Tema oscuro Backrooms consistente en todas las vistas
  - ✨ Animaciones de hover y transiciones suaves
  - 🔐 Integración con authStore y roomAPI

**FASE 4 FRONTEND COMPLETADA -**

---

### ✅ FASE 5: Sistema de Guardado de Progreso y Gestión de Salas Multijugador

#### **FASE 5.0: Sistema de Guardado Automático de Progreso**

**1. Sistema de Guardado Automático**
- ✅ Guardado automático del escenario actual del jugador
- ✅ Guardado automático del inventario completo
- ✅ Carga automática del progreso al reiniciar la partida
- ✅ Sistema de "Continuar Partida" en GameModeView
- ✅ Advertencia al crear nueva partida (pérdida de progreso)

**2. Modificaciones de Base de Datos**
```sql
-- Campos agregados a room_players:
- current_scene_id VARCHAR(50) DEFAULT 'inicio'  -- Escenario actual
- last_saved TIMESTAMP                            -- Última vez guardado
- INDEX idx_current_scene                         -- Índice para búsquedas
```

**3. Nuevos Endpoints de Backend**
```bash
POST /api/rooms/:sessionId/progress/save  # Guardar progreso (escenario + inventario)
GET  /api/rooms/:sessionId/progress/load  # Cargar progreso guardado
```

**4. Funciones del Modelo (Room.js)**
```javascript
savePlayerProgress(sessionId, userId, sceneId)    // Guardar escenario
getPlayerProgress(sessionId, userId)              // Obtener escenario
savePlayerInventory(sessionId, userId, items)     // Guardar items
getPlayerInventory(sessionId, userId)             // Obtener items
```

**Política de sesiones:**
- Solo 1 partida activa por usuario a la vez
- Al crear nueva partida, se abandona automáticamente la anterior (con confirmación)
- El sistema previene conflictos entre partidas solo/multijugador

---

#### **FASE 5.1: Sistema de Salas Multijugador Completo**

**1. Sistema de Salas Públicas/Privadas**
- ✅ Salas públicas visibles en el lobby
- ✅ Salas privadas accesibles solo con código de 6 caracteres
- ✅ Vista de lobby con grid de salas disponibles
- ✅ Modal de "Unirse con Código" para salas privadas
- ✅ Auto-refresh del lobby cada 5 segundos

**2. Vista de Sala (RoomView)**
- ✅ Sistema de chat en tiempo real con Socket.io
- ✅ Lista de jugadores con indicador de host (👑)
- ✅ Slots vacíos visuales para jugadores pendientes
- ✅ Botón de "Iniciar Juego" para el host (activo con ≥2 jugadores)
- ✅ Sistema simplificado sin estado "listo" (el host inicia cuando quiere)
- ✅ Transferencia automática de host al salir
- ✅ Eliminación automática de sala cuando el último jugador sale

**3. Modificaciones de Base de Datos**
```sql
-- Campo agregado a game_sessions:
- is_public BOOLEAN DEFAULT TRUE

-- Campo ELIMINADO de room_players:
- is_ready BOOLEAN  -- Sistema simplificado sin estado "listo"
```

**4. Eventos de Socket.io Implementados**
```javascript
// Eventos de sala
'room:join'              // Unirse a una sala (socket room)
'room:leave'             // Salir de una sala
'room:playerJoined'      // Notificación cuando un jugador se une
'room:playerLeft'        // Notificación cuando un jugador sale
'room:gameStarted'       // Host inicia el juego, redirige a todos
'room:playerConnected'   // Jugador se conecta al socket
'room:playerDisconnected' // Jugador se desconecta

// Eventos de chat
'chat:message'           // Enviar/recibir mensajes
```

**5. Flujo Mejorado de Navegación**
- ✅ Ruta raíz redirige a `/game-mode` (en lugar de `/lobby`)
- ✅ GameModeView como hub central del juego
- ✅ Botón "Crear Sala" va directamente al lobby (sin warnings)
- ✅ Botón "Salir de la Partida" con modal de confirmación
- ✅ Separación clara entre acciones destructivas y navegación

**6. Sistema de Socket.io Mejorado**
- ✅ Autenticación mediante JWT en handshake
- ✅ Soporte para datos en formato objeto o primitivo
- ✅ Verificación de permisos (usuario debe estar en la sala)
- ✅ Notificaciones en tiempo real a todos los jugadores
- ✅ Manejo de desconexiones temporales

**Arquitectura del Sistema Multijugador:**
1. Usuario crea sala (pública/privada) → se une automáticamente como host
2. Otros jugadores ven la sala en lobby (si es pública) o usan código (si es privada)
3. Jugadores se unen → RoomView muestra lista actualizada en tiempo real
4. Host puede iniciar cuando hay ≥2 jugadores
5. Al iniciar, todos los jugadores son redirigidos a `/game` simultáneamente
6. Chat funcional durante la espera en la sala

---

#### **FASE 5.2: Chat en Partida y Presencia de Jugadores**

**1. Panel de Chat Integrado en GameView**
- ✅ Chat siempre visible como panel izquierdo fijo (350px) en partidas multijugador
- ✅ Layout de 3 columnas: Chat | Escena | Inventario
- ✅ Mensajes del sistema para cuando un jugador entra o sale de la partida
- ✅ Mensajes del sistema para conexiones/desconexiones de socket
- ✅ Mensajes de usuarios con nombre y timestamp
- ✅ Scroll automático al recibir nuevos mensajes
- ✅ En partidas solo, el panel no aparece (layout de 2 columnas normal)

**2. Contador de Jugadores por Escena**
- ✅ Indicador en el header del chat mostrando cuántas personas están en la misma escena
- ✅ Sincronización en tiempo real: al moverse, el contador se actualiza para todos
- ✅ El jugador local también cuenta en el indicador de su escena actual
- ✅ Reactividad corregida usando `splice` para que Vue detecte los cambios del array

**3. Ingreso Directo a Partidas en Curso**
- ✅ Jugadores pueden unirse a salas con status `playing` (antes solo `waiting`)
- ✅ Al unirse a una sala en curso, se redirige directamente a `/game` en lugar del lobby de sala
- ✅ Al unirse a una sala en espera, sigue yendo a `/room/:id` normalmente
- ✅ Salas `finished` siguen siendo inaccesibles

**4. Nuevos Eventos de Socket.io**
```javascript
'player:sceneChange'  // Emitido al cambiar de escena, broadcast a los demás jugadores
```

**5. Correcciones de Backend**
```sql
-- Campo agregado al SELECT de getRoomPlayers:
rp.current_scene_id  -- Faltaba en la consulta, causaba que el contador siempre fuera 0
```

**6. Item Clave "Guía Online"**
- ✅ Al entrar a una partida multijugador, el tercer slot de items clave se llena con la guía online
- ✅ Explica el funcionamiento del chat y el contador de jugadores por escena

**Flujo de presencia por escena:**
1. Jugador se mueve a una nueva escena → se actualiza su entrada en `roomPlayers` localmente
2. Se emite `player:sceneChange` al backend vía Socket.io
3. El backend hace broadcast a todos los demás jugadores de la sala
4. Cada cliente actualiza el array `roomPlayers` con `splice` (reactividad correcta)
5. El computed `playersInScene` recalcula el contador automáticamente

---

#### **FASE 5.3: Final del Juego y Rediseño de Controles**

**1. Cinemática Final**
- ✅ Al avanzar desde `puerta-laboratorio-abierta`, se dispara una secuencia cinemática de fondo negro
- ✅ 5 slides con animación de fade + slide-up entre cada uno, avanzados con clic
- ✅ Texto diferenciado para modo solo y modo multijugador
- ✅ Último slide muestra "CONTINUARÁ..." en amarillo y tamaño grande
- ✅ Al terminar, limpia la sesión (localStorage) y redirige a `/game-mode`

**2. Sincronización de Final en Multijugador**
- ✅ Al entrar al final, se emite `room:gameFinished` vía Socket.io de forma inmediata
- ✅ Todos los jugadores de la sala ven la cinemática simultáneamente
- ✅ El jugador que disparó el evento sale de la sala en el backend al terminar los slides
- ✅ Los demás clientes arrancan la cinemática localmente sin re-emitir el socket (evita loop)

**3. Flujo de la Puerta del Laboratorio**
- ✅ Al ingresar el código correcto en `panel-numerico`, navega automáticamente a `puerta-laboratorio-abierta` (800ms de espera)
- ✅ La conexión `forward` de `puerta-laboratorio-abierta` apunta a `__ending__`, un identificador especial interceptado en `transitionToNewRoom()`
- ✅ El campo `opensTo` en el keypad del mapa permite definir a qué escena navegar al acertar el código

**4. Nuevos Eventos de Socket.io**
```javascript
'room:gameFinished'  // Emitido al iniciar la cinemática final, broadcast a toda la sala
```

**5. Rediseño de Controles de Movimiento**
- ✅ Cruceta estilo gamepad en lugar de botones de texto
- ✅ Flechas ▲ ▼ ◀ ▶ con etiqueta pequeña debajo
- ✅ Botón Examinar separado visualmente con un divisor vertical
- ✅ Animación `hover:scale-105` y `active:scale-95` para feedback táctil
- ✅ Diseño más compacto y limpio sin emojis de flecha

---

### ✅ FASE 6: Sistema Social y Chat Global

#### **FASE 6.1: Chat Global en Tiempo Real**

**1. Chat Global con Socket.io**
- ✅ Mensajes guardados en base de datos (tabla `messages`, `receiver_id = NULL`)
- ✅ Historial de los últimos 50 mensajes cargado al abrir la vista
- ✅ Broadcast en tiempo real a todos los usuarios conectados
- ✅ Burbujas diferenciadas: mensajes propios (derecha) vs ajenos (izquierda)
- ✅ Timestamps relativos ("Ahora", "Hace 5m", "Hace 2h")
- ✅ Sin mensajes de sistema por conexión/desconexión (solo actualización silenciosa de la lista)

**2. Lista de Usuarios En Línea**
- ✅ Presencia en tiempo real mediante `Map` en memoria del servidor (volátil, sin DB)
- ✅ Al abrir el chat, se solicita la lista actualizada (`global:requestOnlineList`)
- ✅ Actualizaciones automáticas al conectarse/desconectarse usuarios
- ✅ El usuario propio se excluye de la lista

---

#### **Sistema de Amigos**

**1. Solicitudes de Amistad**
- ✅ Buscar usuario por nombre exacto y enviar solicitud via REST API
- ✅ Enviar solicitud directamente desde la lista de usuarios en línea (botón ➕)
- ✅ Indicador "Enviada ✓" al pulsar ➕ (sin necesidad de recargar)
- ✅ Notificación en tiempo real al receptor via Socket.io
- ✅ Tab de "Solicitudes" con badge contador de solicitudes pendientes
- ✅ Aceptar/rechazar solicitudes desde la interfaz

**2. Lista de Amigos**
- ✅ Amigos ordenados con indicador de estado en línea/desconectado
- ✅ Botón para eliminar amigo con confirmación

**3. Chat Privado**
- ✅ Mensajes privados guardados en DB (`receiver_id != NULL`)
- ✅ Historial de conversación cargado al abrir el chat privado
- ✅ Entrega en tiempo real vía Socket.io (al receptor y echo al remitente)
- ✅ Routing correcto del chat: clave por `userId` del interlocutor (`chatKey`)
- ✅ Cambio de contexto: "← Volver al global" para regresar al chat global

---

#### **Mejoras al Sistema de Salas**

**1. Salas Privadas Solo Visibles para el Host**
- ✅ Las salas privadas ya NO aparecen en el lobby para otros jugadores
- ✅ El host sí ve sus propias salas privadas en el lobby (con ícono 🔒)
- ✅ Otros jugadores pueden unirse únicamente con el código de 6 caracteres
- ✅ Texto del modal aclarado: "Solo tú la verás en el lobby. Comparte el código para que otros se unan"

**2. Priorización de Sala Propia**
- ✅ La sala creada por el usuario siempre aparece primera en el lobby
- ✅ Ordenamiento en base de datos: `CASE WHEN host_id = userId THEN 0 ELSE 1 END`

---

#### **FASE 6.2: Sanitización de Mensajes**

**1. Sanitización en el Backend (fuente de verdad)**
- ✅ Instalado `sanitize-html` para eliminar etiquetas HTML y scripts maliciosos
- ✅ Todas las etiquetas HTML son removidas antes de guardar o emitir (`allowedTags: []`)
- ✅ URLs bloqueadas (`http://`, `https://`, `ftp://`, `www.`) → reemplazadas por `[enlace eliminado]`
- ✅ Mensajes truncados a 300 caracteres máximo
- ✅ Sanitización aplicada en los tres canales: chat de sala, chat global y mensajes privados
- ✅ Vue.js ya protege el frontend usando `{{ }}` (textContent), por lo que no se renderizan etiquetas

**Archivos creados:**
```
backend/src/utils/sanitize.js   # Utilidad sanitizeMessage() reutilizable
```

---

#### **Cambios de Base de Datos (FASE 6)**

```sql
-- Tabla messages rediseñada:
-- receiver_id = NULL  → mensaje global
-- receiver_id != NULL → mensaje privado entre sender y receiver
CREATE TABLE messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  sender_id   INT NOT NULL,
  receiver_id INT NULL DEFAULT NULL,
  message_text TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla friends (nueva):
CREATE TABLE friends (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  user_id   INT NOT NULL,
  friend_id INT NOT NULL,
  status    ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_friendship (user_id, friend_id)
);

-- Tablas eliminadas: game_progress, user_mutes (no utilizadas)
```

#### **Nuevos Endpoints REST**

```bash
GET    /api/social/messages/global           # Historial chat global (últimos 50)
GET    /api/social/messages/private/:friendId # Historial chat privado
GET    /api/social/friends                   # Lista de amigos
GET    /api/social/friends/requests          # Solicitudes pendientes recibidas
POST   /api/social/friends/request           # Enviar solicitud por username
POST   /api/social/friends/accept/:requestId # Aceptar solicitud
DELETE /api/social/friends/reject/:requestId # Rechazar solicitud
DELETE /api/social/friends/:friendId         # Eliminar amigo
```

#### **Nuevos Eventos Socket.io**

```javascript
// Chat global
'global:message'          // Enviar/recibir mensaje global
'global:onlineList'       // Lista completa de usuarios en línea
'global:requestOnlineList'// Solicitar lista actualizada
'global:userOnline'       // Un usuario se conectó
'global:userOffline'      // Un usuario se desconectó

// Chat privado
'private:message'         // Enviar/recibir mensaje privado (incluye fromUserId y receiverId)

// Amigos
'friend:request'          // Solicitud de amistad recibida
'friend:requestAccepted'  // Solicitud de amistad aceptada
'friend:error'            // Error en operación de amistad
```


## 📚 Documentación

Toda la documentación técnica está en la carpeta `docs/`:
- **DATABASE_DESIGN.md** - Diseño de la base de datos

---

## 🛠️ Stack Tecnológico

**Frontend:** Vue.js 3, Pinia, Vue Router, Tailwind CSS, TypeScript
**Backend:** Node.js, Express, Socket.io
**Database:** MySQL 8.0
**Auth:** JWT + Bcrypt
