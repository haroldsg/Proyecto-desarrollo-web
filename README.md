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


### ✅ FASE 1: Backend + Base de Datos (Completada - 22/02/2026)

**Cambios agregados:**
- ✅ Backend inicializado con Node.js + Express
- ✅ 8 dependencias instaladas (Express, MySQL2, JWT, Bcrypt, Socket.io, etc.)
- ✅ Configuración de conexión a MySQL con pool
- ✅ Script SQL completo para crear 8 tablas
- ✅ Sistema de roles (user/admin) y moderación agregado
- ✅ Servidor básico funcionando con health check
- ✅ Diseño de base de datos completo (7 tablas) - `docs/DATABASE_DESIGN.md`
- ✅ Estructura de carpetas backend/frontend - `docs/PROJECT_STRUCTURE.md`

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

## 📚 Documentación

Toda la documentación técnica está en la carpeta `docs/`:
- **DATABASE_DESIGN.md** - Diseño de la base de datos

---

## 🛠️ Stack Tecnológico

**Frontend:** Vue.js 3, Pinia, Vue Router, Tailwind CSS, TypeScript
**Backend:** Node.js, Express, Socket.io
**Database:** MySQL 8.0
**Auth:** JWT + Bcrypt
