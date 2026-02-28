import User from '../models/User.js'
import { hashPassword, comparePassword } from '../utils/hashPassword.js'
import { generateToken } from '../utils/jwt.js'

/**
 * Controlador de Autenticación
 */
class AuthController {
  /**
   * POST /api/auth/register
   * Registrar un nuevo usuario
   */
  static async register(req, res) {
    try {
      const { username, email, password } = req.body

      // Verificar si el email ya existe
      const existingEmail = await User.findByEmail(email)
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'El email ya está registrado',
        })
      }

      // Verificar si el username ya existe
      const existingUsername = await User.findByUsername(username)
      if (existingUsername) {
        return res.status(409).json({
          success: false,
          message: 'El username ya está en uso',
        })
      }

      // Hashear la contraseña
      const password_hash = await hashPassword(password)

      // Crear el usuario
      const user = await User.create({
        username,
        email,
        password_hash,
        role: 'user', // Por defecto todos son 'user'
      })

      // Generar token JWT
      const token = generateToken({
        id: user.id,
        username: user.username,
        role: user.role,
      })

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          token,
        },
      })
    } catch (error) {
      console.error('Error en register:', error)
      res.status(500).json({
        success: false,
        message: 'Error al registrar usuario',
        error: error.message,
      })
    }
  }

  /**
   * POST /api/auth/login
   * Iniciar sesión
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body

      // Buscar usuario por email
      const user = await User.findByEmail(email)
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas',
        })
      }

      // Verificar contraseña
      const isPasswordValid = await comparePassword(password, user.password_hash)
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas',
        })
      }

      // Actualizar último login
      await User.updateLastLogin(user.id)

      // Generar token JWT
      const token = generateToken({
        id: user.id,
        username: user.username,
        role: user.role,
      })

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar_url: user.avatar_url,
          },
          token,
        },
      })
    } catch (error) {
      console.error('Error en login:', error)
      res.status(500).json({
        success: false,
        message: 'Error al iniciar sesión',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/auth/me
   * Obtener datos del usuario autenticado
   */
  static async getMe(req, res) {
    try {
      // req.user viene del middleware de autenticación
      const user = await User.findById(req.user.id)

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        })
      }

      res.json({
        success: true,
        data: { user },
      })
    } catch (error) {
      console.error('Error en getMe:', error)
      res.status(500).json({
        success: false,
        message: 'Error al obtener datos del usuario',
        error: error.message,
      })
    }
  }
}

export default AuthController
