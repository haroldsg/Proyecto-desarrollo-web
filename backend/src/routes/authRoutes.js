import express from 'express'
import AuthController from '../controllers/authController.js'
import { validate, registerSchema, loginSchema } from '../middleware/validation.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
router.post('/register', validate(registerSchema), AuthController.register)

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', validate(loginSchema), AuthController.login)

/**
 * GET /api/auth/me
 * Obtener datos del usuario autenticado (requiere token)
 */
router.get('/me', authenticateToken, AuthController.getMe)

export default router
