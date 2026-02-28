# 🎮 Backrooms Multiplayer

Juego de exploración y puzzles multijugador en tiempo real inspirado en los Backrooms.

**Stack:** Vue.js 3 + Node.js + Express + MySQL + Socket.io

---

## 🚀 Instalación Rápida

```bash
# Frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

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

## 🧪 Probar los Endpoints

### **Panel de Pruebas Visual** (Recomendado)

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
