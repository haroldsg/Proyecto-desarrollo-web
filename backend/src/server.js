import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { testConnection } from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import setupSocketHandlers from './socket/socketHandler.js'

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Crear servidor HTTP para Socket.io
const httpServer = createServer(app)

// Configurar CORS
const corsOptions = process.env.NODE_ENV === 'production'
  ? { origin: process.env.FRONTEND_URL, credentials: true }
  : { origin: true, credentials: true }

// Configurar Socket.io
const io = new Server(httpServer, {
  cors: corsOptions
})

// Configurar handlers de Socket.io
setupSocketHandlers(io)

// Middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Middleware para pasar io a los controllers
app.use((req, res, next) => {
  req.io = io
  next()
})

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: '🎮 Backrooms API - Server running',
    version: '1.0.0',
    status: 'active',
  })
})

// Ruta de health check
app.get('/health', async (req, res) => {
  const dbConnected = await testConnection()
  res.json({
    status: 'ok',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
})

// ========================================
// RUTAS DE LA API
// ========================================
app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)

// Iniciar servidor
httpServer.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`🔌 Socket.io habilitado`)
  console.log(`📁 Entorno: ${process.env.NODE_ENV || 'development'}`)

  // Verificar conexión a la base de datos
  await testConnection()
})

export default app
