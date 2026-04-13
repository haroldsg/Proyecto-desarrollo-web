# 🗄️ Diseño de Base de Datos - Backrooms Multiplayer

**Versión:** 1.1
**Total de tablas:** 6
**Motor:** MySQL 8.0 (InnoDB, utf8mb4)

> Tablas eliminadas respecto al diseño inicial: `game_progress` y `user_mutes` (no utilizadas en la implementación final).

---

## Diagrama de Relaciones

```
┌─────────────────────────────────────────────────────────────────┐
│                            USERS                                │
├─────────────────────────────────────────────────────────────────┤
│ id (PK)  │ username  │ email  │ password_hash  │ role  │ ...    │
└────┬──────────┬────────────┬────────────┬──────────────┬────────┘
     │          │            │            │              │
     │ 1:N      │ 1:N        │ N:M        │ 1:N          │ 1:N
     ▼          ▼            ▼            ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────┐
│  GAME_   │ │INVENTORIES│ │ FRIENDS  │ │   MESSAGES   │ │   MESSAGES   │
│ SESSIONS │ │          │ │(N:M self)│ │ (como sender)│ │(como receiver│
└────┬─────┘ └──────────┘ └──────────┘ └──────────────┘ └──────────────┘
     │
     │ 1:N
     ▼
┌──────────────┐
│ ROOM_PLAYERS │
└──────────────┘
```

### Diagrama detallado

```
┌──────────────────────────────────┐
│              USERS               │
├──────────────────────────────────┤
│ id            INT PK             │
│ username      VARCHAR(50) UNIQUE │
│ email         VARCHAR(100) UNIQUE│
│ password_hash VARCHAR(255)       │
│ avatar_url    VARCHAR(255)       │
│ role          ENUM(user,admin)   │
│ created_at    TIMESTAMP          │
│ last_login    TIMESTAMP          │
└───┬──────┬──────┬────────┬───────┘
    │      │      │        │
    │      │      │        │
    │ 1:N  │ 1:N  │ N:M    │ 1:N (sender / receiver)
    │      │      │        │
    ▼      ▼      ▼        ▼
┌────────────────┐  ┌─────────────┐  ┌──────────────────────────┐
│ GAME_SESSIONS  │  │   FRIENDS   │  │         MESSAGES         │
├────────────────┤  ├─────────────┤  ├──────────────────────────┤
│ id         PK  │  │ id       PK │  │ id           INT PK      │
│ room_code      │  │ user_id  FK │  │ sender_id    INT FK      │
│ room_name      │  │ friend_id FK│  │ receiver_id  INT FK NULL │
│ host_id    FK  │  │ status      │  │ message_text TEXT        │
│ min_players    │  │   pending   │  │ created_at   TIMESTAMP   │
│ max_players    │  │   accepted  │  │                          │
│ current_level  │  │   rejected  │  │ receiver_id = NULL       │
│ is_public BOOL │  │ created_at  │  │   → mensaje global       │
│ status   ENUM  │  └─────────────┘  │ receiver_id != NULL      │
│ created_at     │                   │   → mensaje privado      │
└───────┬────────┘                   └──────────────────────────┘
        │
        │ 1:N
        ▼
┌────────────────────────┐       ┌──────────────────────┐
│      ROOM_PLAYERS      │       │      INVENTORIES      │
├────────────────────────┤       ├──────────────────────┤
│ id              INT PK │       │ id           INT PK  │
│ session_id      INT FK │       │ session_id   INT FK  │
│ user_id         INT FK │       │ user_id      INT FK  │
│ is_host         BOOL   │       │ item_name    VARCHAR  │
│ current_scene_id VARCHAR│      │ quantity     INT     │
│ joined_at       TIMESTAMP│     │ acquired_at  TIMESTAMP│
│ last_saved      TIMESTAMP│     └──────────────────────┘
└────────────────────────┘
```

---

## 📋 Descripción de Tablas

### 1. USERS — Usuarios del sistema

Almacena todos los jugadores registrados. Las contraseñas se guardan hasheadas con Bcrypt (nunca en texto plano).

| Campo         | Tipo          | Descripción                          |
|---------------|---------------|--------------------------------------|
| id            | INT PK        | Identificador único autoincremental  |
| username      | VARCHAR(50)   | Nombre de usuario, único             |
| email         | VARCHAR(100)  | Correo electrónico, único            |
| password_hash | VARCHAR(255)  | Contraseña hasheada con Bcrypt       |
| avatar_url    | VARCHAR(255)  | URL de imagen de perfil (opcional)   |
| role          | ENUM          | `'user'` o `'admin'`                 |
| created_at    | TIMESTAMP     | Fecha de registro                    |
| last_login    | TIMESTAMP     | Última sesión iniciada               |

**Índices:** `UNIQUE(username)`, `UNIQUE(email)`, `INDEX(role)`

---

### 2. GAME_SESSIONS — Salas de juego multijugador

Cada partida o sala es una sesión con código único de 6 caracteres.

| Campo         | Tipo         | Descripción                                  |
|---------------|--------------|----------------------------------------------|
| id            | INT PK       | Identificador único                          |
| room_code     | VARCHAR(10)  | Código único (ej: `"AB12CD"`)                |
| room_name     | VARCHAR(100) | Nombre visible de la sala                    |
| host_id       | INT FK       | Usuario creador/anfitrión                    |
| min_players   | INT          | Mínimo para iniciar (siempre 2)              |
| max_players   | INT          | Máximo de jugadores (2, 3 o 4)               |
| current_level | INT          | Nivel actual del grupo                       |
| is_public     | BOOLEAN      | `TRUE` = visible en lobby, `FALSE` = privada |
| status        | ENUM         | `'waiting'`, `'playing'`, `'finished'`       |
| created_at    | TIMESTAMP    | Fecha de creación                            |

**Índices:** `UNIQUE(room_code)`, `INDEX(status)`, `INDEX(host_id)`, `INDEX(is_public)`

**Lógica de privacidad:**
- `is_public = TRUE`: Visible en el lobby para todos los usuarios
- `is_public = FALSE`: Solo el host la ve en su lobby; otros se unen con el código

---

### 3. ROOM_PLAYERS — Jugadores en una sala

Relación N:M entre usuarios y sesiones. También guarda el progreso individual de cada jugador (escenario actual, inventario).

| Campo            | Tipo          | Descripción                          |
|------------------|---------------|--------------------------------------|
| id               | INT PK        | Identificador único                  |
| session_id       | INT FK        | Referencia a `game_sessions`         |
| user_id          | INT FK        | Referencia a `users`                 |
| is_host          | BOOLEAN       | Si es el creador/anfitrión           |
| current_scene_id | VARCHAR(50)   | Escenario actual del jugador         |
| joined_at        | TIMESTAMP     | Cuándo se unió a la sala             |
| last_saved       | TIMESTAMP     | Última vez que se guardó su progreso |

**Índices:** `UNIQUE(session_id, user_id)`, `INDEX(session_id)`, `INDEX(user_id)`

---

### 4. INVENTORIES — Items por jugador y partida

Los items son propios de cada combinación jugador+sesión. Nueva partida = inventario vacío.

| Campo       | Tipo          | Descripción                        |
|-------------|---------------|------------------------------------|
| id          | INT PK        | Identificador único                |
| session_id  | INT FK        | En qué partida se obtuvo el item   |
| user_id     | INT FK        | A quién pertenece el item          |
| item_name   | VARCHAR(100)  | Nombre del objeto (ej: "Linterna") |
| quantity    | INT           | Cantidad en posesión               |
| acquired_at | TIMESTAMP     | Cuándo se obtuvo                   |

**Índices:** `INDEX(session_id, user_id)`, `INDEX(item_name)`

---

### 5. MESSAGES — Chat global y mensajes privados

Una sola tabla maneja ambos tipos de mensajes según el valor de `receiver_id`.

| Campo        | Tipo      | Descripción                                   |
|--------------|-----------|-----------------------------------------------|
| id           | INT PK    | Identificador único                           |
| sender_id    | INT FK    | Usuario que envió el mensaje                  |
| receiver_id  | INT FK    | `NULL` = mensaje global / ID = mensaje privado|
| message_text | TEXT      | Contenido sanitizado del mensaje              |
| created_at   | TIMESTAMP | Cuándo se envió                               |

**Índices:** `INDEX(sender_id)`, `INDEX(receiver_id)`, `INDEX(created_at)`

**Regla de negocio:**
- `receiver_id = NULL` → mensaje del chat global (visible para todos)
- `receiver_id = X` → mensaje privado entre `sender_id` y `X`

**Seguridad:** Los mensajes son sanitizados antes de guardarse (eliminación de HTML, scripts y URLs).

---

### 6. FRIENDS — Sistema de amigos

Gestiona solicitudes de amistad y relaciones entre usuarios.

| Campo      | Tipo      | Descripción                              |
|------------|-----------|------------------------------------------|
| id         | INT PK    | Identificador único                      |
| user_id    | INT FK    | Usuario que envía la solicitud           |
| friend_id  | INT FK    | Usuario que recibe la solicitud          |
| status     | ENUM      | `'pending'`, `'accepted'`, `'rejected'`  |
| created_at | TIMESTAMP | Cuándo se envió la solicitud             |

**Índices:** `UNIQUE(user_id, friend_id)`, `INDEX(user_id)`, `INDEX(friend_id)`, `INDEX(status)`

**Flujo:**
1. Usuario A envía solicitud → `status = 'pending'`
2. Usuario B acepta → `status = 'accepted'`
3. Usuario B rechaza → `status = 'rejected'`
4. Eliminación de amigo → `DELETE` del registro

---

## 🔄 Relaciones Principales

| Relación                          | Tipo | Descripción                                        |
|-----------------------------------|------|----------------------------------------------------|
| USERS → GAME_SESSIONS (host_id)   | 1:N  | Un usuario puede crear múltiples salas             |
| GAME_SESSIONS → ROOM_PLAYERS      | 1:N  | Una sala contiene múltiples jugadores              |
| USERS → ROOM_PLAYERS              | 1:N  | Un usuario puede estar en múltiples salas          |
| GAME_SESSIONS → INVENTORIES       | 1:N  | Una sesión tiene múltiples items de todos los jugadores |
| USERS → INVENTORIES               | 1:N  | Un usuario acumula items en cada partida           |
| USERS → MESSAGES (sender)         | 1:N  | Un usuario envía muchos mensajes                   |
| USERS → MESSAGES (receiver)       | 1:N  | Un usuario recibe muchos mensajes privados         |
| USERS ↔ FRIENDS                   | N:M  | Relación simétrica de amistad entre usuarios       |

---

## 🔐 Consideraciones de Seguridad

1. **Contraseñas:** Nunca en texto plano — hasheadas con Bcrypt (10 rounds)
2. **Autenticación:** JWT con expiración en todas las rutas protegidas
3. **Mensajes:** Sanitizados con `sanitize-html` antes de persistir (anti-XSS, anti-scripts, URLs bloqueadas)
4. **Salas privadas:** Filtradas por `host_id` en la query — el backend nunca las expone a otros usuarios
5. **Claves foráneas:** Todas con `ON DELETE CASCADE` para mantener integridad referencial

---

## 📊 Estimación de Volumen de Datos

Para un entorno universitario con ~100 usuarios de prueba:

| Tabla          | Registros estimados |
|----------------|---------------------|
| users          | ~100                |
| game_sessions  | ~50                 |
| room_players   | ~200                |
| inventories    | ~500                |
| messages       | ~1.000              |
| friends        | ~200                |
| **Total**      | **~2.050**          |
