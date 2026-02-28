import pool from '../config/database.js'

/**
 * Modelo de Usuario
 * Maneja todas las operaciones CRUD relacionadas con usuarios
 */
class User {
  /**
   * Crear un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} - Usuario creado
   */
  static async create({ username, email, password_hash, role = 'user' }) {
    const query = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `
    const [result] = await pool.execute(query, [username, email, password_hash, role])

    return {
      id: result.insertId,
      username,
      email,
      role,
    }
  }

  /**
   * Buscar usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<Object|null>} - Usuario o null
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?'
    const [rows] = await pool.execute(query, [email])
    return rows[0] || null
  }

  /**
   * Buscar usuario por username
   * @param {string} username - Nombre de usuario
   * @returns {Promise<Object|null>} - Usuario o null
   */
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?'
    const [rows] = await pool.execute(query, [username])
    return rows[0] || null
  }

  /**
   * Buscar usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<Object|null>} - Usuario o null
   */
  static async findById(id) {
    const query = 'SELECT id, username, email, avatar_url, role, created_at, last_login FROM users WHERE id = ?'
    const [rows] = await pool.execute(query, [id])
    return rows[0] || null
  }

  /**
   * Actualizar último login
   * @param {number} id - ID del usuario
   */
  static async updateLastLogin(id) {
    const query = 'UPDATE users SET last_login = NOW() WHERE id = ?'
    await pool.execute(query, [id])
  }

  /**
   * Actualizar perfil de usuario
   * @param {number} id - ID del usuario
   * @param {Object} updates - Campos a actualizar
   */
  static async updateProfile(id, updates) {
    const allowedFields = ['username', 'avatar_url']
    const fields = []
    const values = []

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`)
        values.push(updates[key])
      }
    })

    if (fields.length === 0) {
      throw new Error('No hay campos válidos para actualizar')
    }

    values.push(id)
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`
    await pool.execute(query, values)

    return this.findById(id)
  }

  /**
   * Eliminar usuario
   * @param {number} id - ID del usuario
   */
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?'
    await pool.execute(query, [id])
  }
}

export default User
