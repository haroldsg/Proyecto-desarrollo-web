# 🗄️ Diseño de Base de Datos - Backrooms Multiplayer

**Total de tablas:** 8

## Diagrama de Relaciones

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (PK)         │
│ username        │
│ email           │
│ password_hash   │
│ avatar_url      │
│ role            │ ENUM('user','admin')
│ created_at      │
│ last_login      │
└────┬───┬───┬────┘
     │   │   │
     │   │   │ 1:N (como muteado)
     │   │   │
     │   │   └──────────────────┐
     │   │                      │
     │   │ 1:N (como moderador) │
     │   │                      │
     │   └──────────┐           │
     │              │           │
     │ 1:N          │           │
     │              │           │
┌────▼──────────┐  │  ┌────────▼─────────┐
│ GAME_SESSIONS │  │  │   USER_MUTES     │
├───────────────┤  │  ├──────────────────┤
│ id (PK)       │  │  │ id (PK)          │
│ room_code     │  │  │ user_id (FK)     │◄─┘
│ max_players   │  │  │ muted_by (FK)    │◄──┘
│ current_level │  │  │ session_id (FK)  │
│ status        │  │  │ reason           │
│ created_at    │  │  │ mute_until       │
└───┬───────────┘  │  │ is_global        │
    │              │  │ created_at       │
    │ 1:N          │  └──────────────────┘
    │              │
┌───▼──────────┐   │  ┌─────────────────┐
│ ROOM_PLAYERS │◄──┼──┤  (N:M relation) │
├──────────────┤   │  └─────────────────┘
│ id (PK)      │   │
│ session_id   │   │
│ user_id (FK) │◄──┘
│ is_host      │
│ joined_at    │
└──────────────┘

┌─────────────────┐
│   INVENTORIES   │
├─────────────────┤
│ id (PK)         │
│ session_id (FK) │──┐
│ user_id (FK)    │──┼──► Referencia a USERS
│ item_name       │  └──► Referencia a GAME_SESSIONS
│ quantity        │
│ acquired_at     │
└─────────────────┘

┌─────────────────┐          ┌─────────────────┐
│   MESSAGES      │          │    FRIENDS      │
├─────────────────┤          ├─────────────────┤
│ id (PK)         │          │ id (PK)         │
│ sender_id (FK)  │──►USERS  │ user_id (FK)    │──►USERS
│ session_id (FK) │──►SESS   │ friend_id (FK)  │──►USERS
│ message_text    │          │ status          │
│ is_global       │          │ created_at      │
│ created_at      │          └─────────────────┘
└─────────────────┘

┌─────────────────┐
│  GAME_PROGRESS  │
├─────────────────┤
│ id (PK)         │
│ session_id (FK) │──►GAME_SESSIONS
│ user_id (FK)    │──►USERS
│ current_level   │
│ decisions_made  │ (JSON)
│ checkpoints     │ (JSON)
│ updated_at      │
└─────────────────┘
```

---

## 📋 Descripción de Tablas

### 1. **USERS** - Usuarios del sistema
Almacena información de todos los jugadores registrados.

| Campo          | Tipo         | Descripción                           |
|----------------|--------------|---------------------------------------|
| id             | INT (PK)     | Identificador único                   |
| username       | VARCHAR(50)  | Nombre de usuario único               |
| email          | VARCHAR(100) | Correo electrónico único              |
| password_hash  | VARCHAR(255) | Contraseña hasheada con Bcrypt        |
| avatar_url     | VARCHAR(255) | URL de la imagen de perfil            |
| role           | ENUM         | 'user', 'admin'                       |
| created_at     | TIMESTAMP    | Fecha de registro                     |
| last_login     | TIMESTAMP    | Última vez que inició sesión          |

**Índices:**
- UNIQUE(username)
- UNIQUE(email)

**Notas:**
- `role = 'admin'`: Puede moderar chats, mutear usuarios, gestionar salas
- `role = 'user'`: Usuario normal con permisos estándar

---

### 2. **GAME_SESSIONS** - Salas de juego
Cada partida multijugador es una sesión con un código único.

| Campo         | Tipo         | Descripción                              |
|---------------|--------------|------------------------------------------|
| id            | INT (PK)     | Identificador único                      |
| room_code     | VARCHAR(10)  | Código único para unirse (ej: "AB12CD")  |
| max_players   | INT          | Máximo de jugadores (2 o 4)              |
| current_level | INT          | Nivel/escenario actual del grupo         |
| status        | ENUM         | 'waiting', 'playing', 'finished'         |
| created_at    | TIMESTAMP    | Cuándo se creó la sala                   |

**Índices:**
- UNIQUE(room_code)

---

### 3. **ROOM_PLAYERS** - Relación N:M entre usuarios y sesiones
Quién está en qué sala.

| Campo       | Tipo         | Descripción                           |
|-------------|--------------|---------------------------------------|
| id          | INT (PK)     | Identificador único                   |
| session_id  | INT (FK)     | Referencia a game_sessions            |
| user_id     | INT (FK)     | Referencia a users                    |
| is_host     | BOOLEAN      | Si es el creador de la sala           |
| joined_at   | TIMESTAMP    | Cuándo se unió                        |

**Índices:**
- UNIQUE(session_id, user_id) - Un usuario no puede estar 2 veces en la misma sala

---

### 4. **INVENTORIES** - Items de cada jugador por partida
Los items son únicos por sesión (cada partida nueva empieza vacía).

| Campo       | Tipo         | Descripción                           |
|-------------|--------------|---------------------------------------|
| id          | INT (PK)     | Identificador único                   |
| session_id  | INT (FK)     | En qué partida se obtuvo              |
| user_id     | INT (FK)     | Quién tiene el item                   |
| item_name   | VARCHAR(100) | Nombre del objeto (ej: "Linterna")    |
| quantity    | INT          | Cuántos tiene                         |
| acquired_at | TIMESTAMP    | Cuándo lo obtuvo                      |

---

### 5. **MESSAGES** - Chat global y por sala
Almacena mensajes tanto del chat global como de las salas.

| Campo        | Tipo         | Descripción                           |
|--------------|--------------|---------------------------------------|
| id           | INT (PK)     | Identificador único                   |
| sender_id    | INT (FK)     | Quién envió el mensaje                |
| session_id   | INT (FK)     | NULL si es chat global                |
| message_text | TEXT         | Contenido del mensaje                 |
| is_global    | BOOLEAN      | True si es chat global                |
| created_at   | TIMESTAMP    | Cuándo se envió                       |

---

### 6. **FRIENDS** - Sistema de amigos
Relación de amistad entre usuarios.

| Campo      | Tipo         | Descripción                           |
|------------|--------------|---------------------------------------|
| id         | INT (PK)     | Identificador único                   |
| user_id    | INT (FK)     | Usuario que envía solicitud           |
| friend_id  | INT (FK)     | Usuario que recibe solicitud          |
| status     | ENUM         | 'pending', 'accepted', 'rejected'     |
| created_at | TIMESTAMP    | Cuándo se envió la solicitud          |

**Índices:**
- UNIQUE(user_id, friend_id) - No duplicar solicitudes

---

### 7. **GAME_PROGRESS** - Progreso individual en partidas
Guarda el progreso de cada jugador en cada partida.

| Campo          | Tipo         | Descripción                           |
|----------------|--------------|---------------------------------------|
| id             | INT (PK)     | Identificador único                   |
| session_id     | INT (FK)     | En qué partida                        |
| user_id        | INT (FK)     | Quién es el jugador                   |
| current_level  | INT          | Nivel actual del jugador              |
| decisions_made | JSON         | Decisiones tomadas (para narrativa)   |
| checkpoints    | JSON         | Puntos de guardado                    |
| updated_at     | TIMESTAMP    | Última actualización                  |

---

### 8. **USER_MUTES** - Sistema de moderación de chat
Gestiona usuarios muteados temporal o permanentemente.

| Campo       | Tipo         | Descripción                           |
|-------------|--------------|---------------------------------------|
| id          | INT (PK)     | Identificador único                   |
| user_id     | INT (FK)     | Usuario que fue muteado               |
| muted_by    | INT (FK)     | Admin que aplicó el mute              |
| session_id  | INT (FK)     | NULL si es mute global, o sala específica |
| reason      | TEXT         | Razón del mute                        |
| mute_until  | TIMESTAMP    | NULL = permanente, fecha = temporal   |
| is_global   | BOOLEAN      | True si no puede hablar en ningún chat |
| created_at  | TIMESTAMP    | Cuándo se aplicó el mute              |

**Índices:**
- INDEX(user_id, session_id) - Búsqueda rápida de mutes por usuario y sala

**Lógica de moderación:**
- Si `is_global = true`: Usuario no puede enviar mensajes en ningún lado
- Si `is_global = false` y `session_id` existe: Solo muteado en esa sala
- Si `mute_until` es NULL: Mute permanente (hasta que admin lo quite)
- Si `mute_until` es una fecha futura: Mute temporal hasta esa fecha

---

## 🔄 Relaciones Principales

1. **USERS 1:N ROOM_PLAYERS** - Un usuario puede estar en múltiples salas (históricamente)
2. **GAME_SESSIONS 1:N ROOM_PLAYERS** - Una sala tiene múltiples jugadores
3. **GAME_SESSIONS 1:N INVENTORIES** - Cada sesión tiene múltiples items
4. **USERS 1:N INVENTORIES** - Un usuario tiene items en cada partida
5. **USERS 1:N MESSAGES** - Un usuario envía muchos mensajes
6. **USERS N:M FRIENDS** - Relación simétrica de amistad
7. **USERS 1:N USER_MUTES** - Un usuario puede tener múltiples mutes
8. **USERS(admin) 1:N USER_MUTES** - Un admin aplica múltiples mutes

---

## 📊 Estimación de Volumen de Datos

Para un proyecto universitario con ~100 usuarios de prueba:

- **USERS:** ~100 registros
- **GAME_SESSIONS:** ~50 partidas
- **ROOM_PLAYERS:** ~200 registros (4 jugadores × 50 partidas)
- **INVENTORIES:** ~500 registros
- **MESSAGES:** ~1000 mensajes
- **FRIENDS:** ~200 relaciones
- **GAME_PROGRESS:** ~200 registros

**Total estimado:** ~2250 registros en total (base de datos ligera y manejable)

---

## 🔐 Consideraciones de Seguridad

1. **password_hash:** NUNCA almacenar contraseñas en texto plano
2. **room_code:** Usar generación aleatoria segura para códigos de sala
3. **Validación:** Todos los campos deben ser validados en el backend antes de insertar
4. **Índices:** Optimizan búsquedas frecuentes (username, email, room_code)
