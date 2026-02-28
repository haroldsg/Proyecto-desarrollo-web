import jwt from 'jsonwebtoken'

/**
 * Genera un token JWT para un usuario
 * @param {Object} payload - Datos del usuario (id, username, role)
 * @returns {string} - Token JWT firmado
 */
export function generateToken(payload) {
  const secret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

  if (!secret) {
    throw new Error('JWT_SECRET no está configurado en .env')
  }

  return jwt.sign(payload, secret, { expiresIn })
}

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Object|null} - Payload decodificado o null si es inválido
 */
export function verifyToken(token) {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET no está configurado en .env')
  }

  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}
