import bcrypt from 'bcrypt'

/**
 * Hashea una contraseña usando bcrypt
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} - Hash de la contraseña
 */
export async function hashPassword(password) {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Compara una contraseña con su hash
 * @param {string} password - Contraseña en texto plano
 * @param {string} hash - Hash almacenado en la base de datos
 * @returns {Promise<boolean>} - True si coinciden, false si no
 */
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash)
}
