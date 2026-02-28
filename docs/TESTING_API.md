# 🧪 Guía de Prueba de Endpoints - Fase 2

Cómo probar los endpoints de autenticación de forma visual o usando herramientas de testing.

---

## 🎨 **MÉTODO RECOMENDADO: Interfaz Visual (Más Fácil)**

### **test-auth.html - Panel de Pruebas Interactivo**

La forma más fácil y visual de probar los endpoints:

1. **Inicia el servidor backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Abre el archivo de pruebas:**
   - Ve a la carpeta `backend/`
   - Abre `test-auth.html` con doble click (se abrirá en tu navegador)

3. **Prueba los endpoints visualmente:**
   - ✅ **Estado del servidor**: Verifica si el backend está online
   - 📝 **Register**: Registra un nuevo usuario con formulario
   - 🔐 **Login**: Inicia sesión con email y contraseña
   - 👤 **Get Me**: Obtén datos del usuario autenticado
   - 🔑 **Token JWT**: Se guarda automáticamente y puedes copiarlo

**Características:**
- Interfaz visual amigable
- Respuestas en formato JSON coloreadas (verde = éxito, rojo = error)
- Token JWT se guarda automáticamente
- No necesitas escribir comandos curl
- Perfecto para hacer pruebas rápidas

---

## 🚀 Preparación

### 1. Asegúrate de que el servidor esté corriendo
```bash
cd backend
npm run dev
```

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3000
✅ Conexión exitosa a MySQL
```

### 2. Verifica que la base de datos esté creada
```bash
mysql -u root -p < database/schema.sql
```

---

## 📝 Endpoints Disponibles

### 1. POST `/api/auth/register` - Registrar Usuario

**Descripción:** Crea un nuevo usuario en el sistema

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jugador1",
    "email": "jugador1@test.com",
    "password": "password123"
  }'
```

**Response exitoso (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "username": "jugador1",
      "email": "jugador1@test.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores posibles:**
- **409:** Email o username ya registrado
- **400:** Datos inválidos (validación Joi)

---

### 2. POST `/api/auth/login` - Iniciar Sesión

**Descripción:** Autentica un usuario y devuelve un token JWT

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jugador1@test.com",
    "password": "password123"
  }'
```

**Response exitoso (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "username": "jugador1",
      "email": "jugador1@test.com",
      "role": "user",
      "avatar_url": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores posibles:**
- **401:** Credenciales inválidas
- **400:** Datos inválidos (email o password faltantes)

---

### 3. GET `/api/auth/me` - Obtener Usuario Actual

**Descripción:** Obtiene los datos del usuario autenticado (requiere token)

**Request:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Response exitoso (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "jugador1",
      "email": "jugador1@test.com",
      "avatar_url": null,
      "role": "user",
      "created_at": "2026-02-22T...",
      "last_login": "2026-02-22T..."
    }
  }
}
```

**Errores posibles:**
- **401:** Token no proporcionado
- **403:** Token inválido o expirado
- **404:** Usuario no encontrado

---

## 🔄 Flujo Completo de Prueba

### Paso 1: Registrar un usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "mypassword123"
  }'
```

**Guardar el token** que te devuelve.

### Paso 2: Hacer login con ese usuario
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "mypassword123"
  }'
```

### Paso 3: Usar el token para acceder a ruta protegida
```bash
# Reemplaza YOUR_TOKEN con el token obtenido
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✅ Validaciones Implementadas

### Registro:
- **username:**
  - Solo alfanumérico (sin espacios ni caracteres especiales)
  - Mínimo 3 caracteres, máximo 30
  - Único (no puede repetirse)

- **email:**
  - Debe ser un email válido
  - Único (no puede repetirse)

- **password:**
  - Mínimo 8 caracteres
  - Se hashea con Bcrypt antes de guardar

### Login:
- **email:** Debe ser un email válido
- **password:** Requerido

---

---

## 🧰 MÉTODO ALTERNATIVO 1: Thunder Client (VSCode)

Si prefieres usar Thunder Client dentro de VSCode:

### 1. Crear Request para Register
- **Method:** POST
- **URL:** `http://localhost:3000/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "username": "player1",
  "email": "player1@test.com",
  "password": "password123"
}
```

### 2. Crear Request para Login
- **Method:** POST
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "email": "player1@test.com",
  "password": "password123"
}
```

### 3. Crear Request para Get Me
- **Method:** GET
- **URL:** `http://localhost:3000/api/auth/me`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

---

## 🧪 MÉTODO ALTERNATIVO 2: cURL (Línea de comandos)

Para usuarios avanzados que prefieren la terminal, puedes usar los comandos curl mostrados arriba.

---

## 🔒 Seguridad Implementada

✅ **Contraseñas hasheadas** con Bcrypt (10 rounds)
✅ **JWT tokens** firmados con clave secreta
✅ **Validación de datos** con Joi
✅ **CORS** configurado para frontend
✅ **SQL Injection** prevenido con prepared statements
✅ **Tokens expiran** después de 7 días (configurable)

---

## 🐛 Errores Comunes

### Error: "Token no proporcionado"
- **Causa:** No enviaste el header `Authorization`
- **Solución:** Agrega `-H "Authorization: Bearer TU_TOKEN"`

### Error: "El email ya está registrado"
- **Causa:** Intentas registrar un email que ya existe
- **Solución:** Usa otro email o haz login con ese usuario

### Error: "Credenciales inválidas"
- **Causa:** Email o password incorrectos
- **Solución:** Verifica los datos

### Error: "Error conectando a MySQL"
- **Causa:** Base de datos no está corriendo o credenciales incorrectas
- **Solución:** Verifica tu `.env` y que MySQL esté activo

---

## 📊 Respuestas de la API

Todas las respuestas siguen este formato:

### Éxito:
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { ... }
}
```

### Error:
```json
{
  "success": false,
  "message": "Mensaje de error",
  "errors": [ ... ]  // Solo en errores de validación
}
```