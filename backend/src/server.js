import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { testConnection } from './config/database.js'
import authRoutes from './routes/authRoutes.js'

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
// En desarrollo permitimos cualquier origen para testing
const corsOptions = process.env.NODE_ENV === 'production'
  ? { origin: process.env.FRONTEND_URL, credentials: true }
  : { origin: true, credentials: true }

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📁 Entorno: ${process.env.NODE_ENV || 'development'}`)

  // Verificar conexión a la base de datos
  await testConnection()
})

export default app
