import express from 'express'
import {
  createRoom,
  getAvailableRooms,
  getRoomDetails,
  joinRoom,
  joinRoomByCode,
  leaveRoom,
  startGame,
  getCurrentRoom
} from '../controllers/roomController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Todas las rutas de salas requieren autenticación
router.use(authenticateToken)

/**
 * POST /api/rooms
 * Crear una nueva sala
 */
router.post('/', createRoom)

/**
 * GET /api/rooms
 * Obtener todas las salas disponibles
 */
router.get('/', getAvailableRooms)

/**
 * GET /api/rooms/current
 * Obtener la sala actual del usuario
 */
router.get('/current', getCurrentRoom)

/**
 * GET /api/rooms/:id
 * Obtener detalles de una sala específica
 */
router.get('/:id', getRoomDetails)

/**
 * POST /api/rooms/:id/join
 * Unirse a una sala por ID
 */
router.post('/:id/join', joinRoom)

/**
 * POST /api/rooms/join
 * Unirse a una sala por código
 */
router.post('/join', joinRoomByCode)

/**
 * POST /api/rooms/:id/leave
 * Salir de una sala
 */
router.post('/:id/leave', leaveRoom)

/**
 * POST /api/rooms/:id/start
 * Iniciar el juego (solo host)
 */
router.post('/:id/start', startGame)

export default router
