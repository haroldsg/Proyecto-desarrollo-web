import pool from '../config/database.js'

// ========================================
// MENSAJES GLOBALES
// ========================================

export const saveGlobalMessage = async (senderId, text) => {
  const [result] = await pool.execute(
    `INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, NULL, ?)`,
    [senderId, text]
  )
  return result.insertId
}

export const getGlobalMessages = async (limit = 50) => {
  const [rows] = await pool.execute(
    `SELECT m.id, m.message_text, m.created_at,
            u.id as user_id, u.username
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.receiver_id IS NULL
     ORDER BY m.created_at DESC
     LIMIT ?`,
    [limit]
  )
  return rows.reverse()
}

// ========================================
// MENSAJES PRIVADOS
// ========================================

export const savePrivateMessage = async (senderId, receiverId, text) => {
  const [result] = await pool.execute(
    `INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)`,
    [senderId, receiverId, text]
  )
  return result.insertId
}

export const getPrivateHistory = async (userId, friendId, limit = 50) => {
  const [rows] = await pool.execute(
    `SELECT m.id, m.message_text, m.created_at,
            u.id as user_id, u.username
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE (m.sender_id = ? AND m.receiver_id = ?)
        OR (m.sender_id = ? AND m.receiver_id = ?)
     ORDER BY m.created_at DESC
     LIMIT ?`,
    [userId, friendId, friendId, userId, limit]
  )
  return rows.reverse()
}

// ========================================
// AMIGOS
// ========================================

export const sendFriendRequest = async (userId, friendId) => {
  if (userId === friendId) throw new Error('No puedes agregarte a ti mismo')

  // Verificar si ya existe alguna relación en cualquier dirección
  const [existing] = await pool.execute(
    `SELECT id, status, user_id FROM friends
     WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
    [userId, friendId, friendId, userId]
  )

  if (existing.length > 0) {
    const rel = existing[0]
    if (rel.status === 'accepted') throw new Error('Ya son amigos')
    if (rel.status === 'pending' && rel.user_id === userId) throw new Error('Ya enviaste una solicitud')
    if (rel.status === 'pending' && rel.user_id === friendId) throw new Error('Este usuario ya te envió una solicitud')
  }

  await pool.execute(
    `INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, 'pending')`,
    [userId, friendId]
  )
  return true
}

export const acceptFriendRequest = async (requestId, userId) => {
  // Solo el receptor puede aceptar (friend_id = userId)
  const [rows] = await pool.execute(
    `SELECT * FROM friends WHERE id = ? AND friend_id = ? AND status = 'pending'`,
    [requestId, userId]
  )
  if (rows.length === 0) throw new Error('Solicitud no encontrada')

  await pool.execute(
    `UPDATE friends SET status = 'accepted' WHERE id = ?`,
    [requestId]
  )
  return true
}

export const rejectFriendRequest = async (requestId, userId) => {
  await pool.execute(
    `DELETE FROM friends WHERE id = ? AND friend_id = ? AND status = 'pending'`,
    [requestId, userId]
  )
  return true
}

export const removeFriend = async (userId, friendId) => {
  await pool.execute(
    `DELETE FROM friends
     WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
     AND status = 'accepted'`,
    [userId, friendId, friendId, userId]
  )
  return true
}

export const getFriends = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT u.id, u.username,
            f.id as friendship_id, f.created_at as friends_since
     FROM friends f
     JOIN users u ON (
       CASE WHEN f.user_id = ? THEN f.friend_id ELSE f.user_id END = u.id
     )
     WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = 'accepted'`,
    [userId, userId, userId]
  )
  return rows
}

export const getPendingRequests = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT f.id as request_id, u.id, u.username, f.created_at
     FROM friends f
     JOIN users u ON f.user_id = u.id
     WHERE f.friend_id = ? AND f.status = 'pending'
     ORDER BY f.created_at DESC`,
    [userId]
  )
  return rows
}

export const searchUserByUsername = async (username, requestingUserId) => {
  const [rows] = await pool.execute(
    `SELECT id, username FROM users
     WHERE username = ? AND id != ?`,
    [username, requestingUserId]
  )
  return rows[0] || null
}

export default {
  saveGlobalMessage, getGlobalMessages,
  savePrivateMessage, getPrivateHistory,
  sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend,
  getFriends, getPendingRequests, searchUserByUsername
}
