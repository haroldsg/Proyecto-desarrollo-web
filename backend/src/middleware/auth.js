import { verifyToken } from '../utils/jwt.js'

/**
 * Middleware para verificar token JWT
 * Protege rutas que requieren autenticación
 */
export function authenticateToken(req, res, next) {
  // Obtener token del header Authorization
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado',
    })
  }

  // Verificar token
  const payload = verifyToken(token)

  if (!payload) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido o expirado',
    })
  }

  // Agregar datos del usuario a req
  req.user = payload

  next()
}

/**
 * Middleware para verificar si el usuario es admin
 * Debe usarse DESPUÉS de authenticateToken
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'No autenticado',
    })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Requiere permisos de administrador',
    })
  }

  next()
}
