# Backrooms Multiplayer

**Stack:** Vue.js 3 · Node.js · Express · MySQL 8 · Socket.io

---

## Requisitos Previos

Antes de instalar, asegúrate de tener:

| Herramienta | Versión mínima | Verificar con |
|-------------|---------------|---------------|
| Node.js     | 18.x          | `node -v`     |
| npm         | 9.x           | `npm -v`      |
| MySQL       | 8.0           | `mysql --version` |
| Git         | cualquiera    | `git --version` |

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/HaroldF58/backrooms.git
cd backrooms
```

### 2. Configurar la base de datos

Abre MySQL y ejecuta el schema:

```bash
mysql -u root -p < backend/database/schema.sql
```

Esto crea la base de datos `backrooms_db` con todas las tablas necesarias.

### 3. Configurar el Backend

```bash
cd backend
cp .env.example .env
```

Abre `.env` y completa tus credenciales:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=backrooms_db

JWT_SECRET=una_clave_secreta_larga_y_segura
JWT_EXPIRES_IN=7d

PORT=3000
```

Instala las dependencias e inicia el servidor:

```bash
npm install
npm run dev
```

El backend estará corriendo en: `http://localhost:3000`

Puedes verificarlo con: `http://localhost:3000/health`

### 4. Configurar el Frontend

Abre una **nueva terminal** en la raíz del proyecto:

```bash
cd frontend
npm install
npm run dev
```

El frontend estará corriendo en: `http://localhost:5173`
