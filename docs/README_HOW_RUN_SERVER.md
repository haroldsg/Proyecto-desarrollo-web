# 🔧 Backend - Backrooms Multiplayer

API REST del servidor Node.js + Express para el juego Backrooms Multiplayer.

---

## 📦 Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env` en la raíz del backend:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de MySQL:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=backrooms_db
DB_PORT=3306

JWT_SECRET=tu_secreto_aqui
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Crear la base de datos
Ejecutar el script SQL en MySQL:

**Opción 1: Desde MySQL Workbench**
- Abrir `database/schema.sql`
- Ejecutar todo el script

**Opción 2: Desde terminal (Hacerlo directamente en el cmd, no powershell)**
```bash
sudo mysql -u root -p < database/schema.sql
```
**Opción 3:Importenlo directamente en la pagina admin**


Esto creará:
- Base de datos `backrooms_db`
- 8 tablas (users, game_sessions, room_players, inventories, messages, friends, game_progress, user_mutes)
- 3 usuarios de prueba (1 admin + 2 users)

---

## 🚀 Ejecutar el servidor

### Modo desarrollo (con auto-reload)
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

---

## 🧪 Probar la API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-02-22T...",
  "message": "🎮 Backrooms API - Server running",
  "version": "1.0.0",
  "status": "active"
}

---

## 🗄️ Base de Datos

### Tablas creadas (8):
1. **users** - Usuarios (con roles: user/admin)
2. **game_sessions** - Salas de juego
3. **room_players** - Jugadores en salas
4. **inventories** - Items de jugadores
5. **messages** - Chat global y por sala
6. **friends** - Sistema de amigos
7. **game_progress** - Progreso en partidas
8. **user_mutes** - Sistema de moderación

Ver diseño completo en: `../docs/DATABASE_DESIGN.md`

---

## 🔐 Usuarios de Prueba

El script SQL crea automáticamente:

| Usuario  | Email                | Password | Rol   |
|----------|----------------------|----------|-------|
| admin    | admin@backrooms.com  | admin123 | admin |
| player1  | player1@test.com     | user123  | user  |
| player2  | player2@test.com     | user123  | user  |

**Nota:** Los hashes de password son de ejemplo. Al implementar el registro, se generarán con Bcrypt correctamente.

---

## 🛠️ Dependencias Instaladas

- **express** - Framework web
- **mysql2** - Cliente MySQL con Promises
- **jsonwebtoken** - Autenticación JWT
- **bcrypt** - Hashing de contraseñas
- **socket.io** - WebSockets
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Variables de entorno
- **joi** - Validación de datos