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

### 🔄 FASE 4: Frontend Vue.js (EN DESARROLLO)

**Progreso actual:**
- ✅ Commit 1: Reestructuración del proyecto (backend/ y frontend/ separados)
- ✅ Commit 2: Instalación de dependencias (axios, socket.io-client)
- ⏳ Commit 3: Configuración de servicios pendiente...

---


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

## 📚 Documentación

Toda la documentación técnica está en la carpeta `docs/`:
- **DATABASE_DESIGN.md** - Diseño de la base de datos

---

## 🛠️ Stack Tecnológico

**Frontend:** Vue.js 3, Pinia, Vue Router, Tailwind CSS, TypeScript
**Backend:** Node.js, Express, Socket.io
**Database:** MySQL 8.0
**Auth:** JWT + Bcrypt
