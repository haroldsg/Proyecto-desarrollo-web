import pool from '../config/database.js'

// Generar código único de sala (6 caracteres)
const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Crear una nueva sala
export const createRoom = async (hostId, roomName, maxPlayers = 4, isPublic = true) => {
  const roomCode = generateRoomCode()
  const minPlayers = 2

  const [result] = await pool.execute(
    `INSERT INTO game_sessions (room_code, room_name, host_id, min_players, max_players, is_public, status)
     VALUES (?, ?, ?, ?, ?, ?, 'waiting')`,
    [roomCode, roomName, hostId, minPlayers, maxPlayers, isPublic]
  )

  // Agregar al host como primer jugador
  await pool.execute(
    `INSERT INTO room_players (session_id, user_id, is_host) VALUES (?, ?, TRUE)`,
    [result.insertId, hostId]
  )

  return {
    id: result.insertId,
    roomCode,
    roomName,
    hostId,
    minPlayers,
    maxPlayers,
    isPublic,
    status: 'waiting'
  }
}

// Obtener sala por ID
export const getRoomById = async (roomId) => {
  const [rooms] = await pool.execute(
    `SELECT gs.*, u.username as host_username
     FROM game_sessions gs
     JOIN users u ON gs.host_id = u.id
     WHERE gs.id = ?`,
    [roomId]
  )
  return rooms[0] || null
}

// Obtener sala por código
export const getRoomByCode = async (roomCode) => {
  const [rooms] = await pool.execute(
    `SELECT gs.*, u.username as host_username
     FROM game_sessions gs
     JOIN users u ON gs.host_id = u.id
     WHERE gs.room_code = ?`,
    [roomCode]
  )
  return rooms[0] || null
}

// Obtener todas las salas disponibles (en espera y con espacio) - SOLO PÚBLICAS
export const getAvailableRooms = async () => {
  const [rooms] = await pool.execute(
    `SELECT
       gs.id,
       gs.room_code,
       gs.room_name,
       gs.host_id,
       u.username as host_username,
       gs.min_players,
       gs.max_players,
       gs.is_public,
       gs.status,
       gs.created_at,
       COUNT(rp.id) as current_players
     FROM game_sessions gs
     JOIN users u ON gs.host_id = u.id
     LEFT JOIN room_players rp ON gs.id = rp.session_id
     WHERE gs.status = 'waiting' AND gs.is_public = TRUE
     GROUP BY gs.id
     HAVING current_players < gs.max_players
     ORDER BY gs.created_at DESC`
  )
  return rooms
}

// Obtener jugadores de una sala
export const getRoomPlayers = async (roomId) => {
  const [players] = await pool.execute(
    `SELECT
       rp.id as player_id,
       rp.user_id,
       rp.is_host,
       rp.current_scene_id,
       rp.joined_at,
       u.username,
       u.avatar_url
     FROM room_players rp
     JOIN users u ON rp.user_id = u.id
     WHERE rp.session_id = ?
     ORDER BY rp.joined_at ASC`,
    [roomId]
  )
  return players
}

// Contar jugadores en una sala
export const getPlayerCount = async (roomId) => {
  const [result] = await pool.execute(
    `SELECT COUNT(*) as count FROM room_players WHERE session_id = ?`,
    [roomId]
  )
  return result[0].count
}

// Verificar si un usuario está en una sala
export const isPlayerInRoom = async (roomId, userId) => {
  const [result] = await pool.execute(
    `SELECT id FROM room_players WHERE session_id = ? AND user_id = ?`,
    [roomId, userId]
  )
  return result.length > 0
}

// Unirse a una sala
export const joinRoom = async (roomId, userId) => {
  // Verificar que no esté ya en la sala
  const alreadyIn = await isPlayerInRoom(roomId, userId)
  if (alreadyIn) {
    throw new Error('Ya estás en esta sala')
  }

  // Verificar que la sala existe y tiene espacio
  const room = await getRoomById(roomId)
  if (!room) {
    throw new Error('La sala no existe')
  }

  // Permitir unirse a salas en 'waiting' o 'playing', pero no a 'finished'
  if (room.status === 'finished') {
    throw new Error('La sala ya ha terminado')
  }

  const playerCount = await getPlayerCount(roomId)
  if (playerCount >= room.max_players) {
    throw new Error('La sala está llena')
  }

  // Unirse a la sala
  await pool.execute(
    `INSERT INTO room_players (session_id, user_id, is_host) VALUES (?, ?, FALSE)`,
    [roomId, userId]
  )

  return true
}

// Salir de una sala
export const leaveRoom = async (roomId, userId) => {
  const room = await getRoomById(roomId)
  if (!room) {
    throw new Error('La sala no existe')
  }

  // Eliminar al jugador de la sala
  await pool.execute(
    `DELETE FROM room_players WHERE session_id = ? AND user_id = ?`,
    [roomId, userId]
  )

  // Si el que sale es el host, transferir host o eliminar sala
  if (room.host_id === userId) {
    const remainingPlayers = await getRoomPlayers(roomId)

    if (remainingPlayers.length > 0) {
      // Transferir host al siguiente jugador
      const newHost = remainingPlayers[0]
      await pool.execute(
        `UPDATE game_sessions SET host_id = ? WHERE id = ?`,
        [newHost.user_id, roomId]
      )
      await pool.execute(
        `UPDATE room_players SET is_host = TRUE WHERE session_id = ? AND user_id = ?`,
        [roomId, newHost.user_id]
      )
      return { newHostId: newHost.user_id, roomDeleted: false }
    } else {
      // No hay más jugadores, eliminar la sala
      await deleteRoom(roomId)
      return { newHostId: null, roomDeleted: true }
    }
  }

  return { newHostId: null, roomDeleted: false }
}

// Eliminar una sala
export const deleteRoom = async (roomId) => {
  // Los jugadores se eliminan automáticamente por CASCADE
  await pool.execute(
    `DELETE FROM game_sessions WHERE id = ?`,
    [roomId]
  )
  return true
}

// Actualizar estado de la sala
export const updateRoomStatus = async (roomId, status) => {
  await pool.execute(
    `UPDATE game_sessions SET status = ? WHERE id = ?`,
    [status, roomId]
  )
  return true
}

// Iniciar juego (cambiar status a playing)
export const startGame = async (roomId, hostId) => {
  const room = await getRoomById(roomId)

  if (!room) {
    throw new Error('La sala no existe')
  }

  if (room.host_id !== hostId) {
    throw new Error('Solo el host puede iniciar el juego')
  }

  const playerCount = await getPlayerCount(roomId)
  if (playerCount < room.min_players) {
    throw new Error(`Se necesitan al menos ${room.min_players} jugadores para iniciar`)
  }

  await updateRoomStatus(roomId, 'playing')
  return true
}

// Obtener sala donde está un usuario
export const getUserCurrentRoom = async (userId) => {
  const [rooms] = await pool.execute(
    `SELECT gs.*, rp.is_host, rp.current_scene_id
     FROM game_sessions gs
     JOIN room_players rp ON gs.id = rp.session_id
     WHERE rp.user_id = ? AND gs.status IN ('waiting', 'playing')`,
    [userId]
  )
  return rooms[0] || null
}

// Guardar progreso del jugador (escenario actual)
export const savePlayerProgress = async (sessionId, userId, sceneId) => {
  await pool.execute(
    `UPDATE room_players
     SET current_scene_id = ?, last_saved = CURRENT_TIMESTAMP
     WHERE session_id = ? AND user_id = ?`,
    [sceneId, sessionId, userId]
  )
  return true
}

// Obtener progreso del jugador
export const getPlayerProgress = async (sessionId, userId) => {
  const [result] = await pool.execute(
    `SELECT current_scene_id, last_saved
     FROM room_players
     WHERE session_id = ? AND user_id = ?`,
    [sessionId, userId]
  )
  return result[0] || null
}

// Guardar inventario del jugador
export const savePlayerInventory = async (sessionId, userId, items) => {
  // Primero eliminar items anteriores
  await pool.execute(
    `DELETE FROM inventories WHERE session_id = ? AND user_id = ?`,
    [sessionId, userId]
  )

  // Insertar nuevos items uno por uno
  if (items && items.length > 0) {
    for (const item of items) {
      await pool.execute(
        `INSERT INTO inventories (session_id, user_id, item_name, quantity) VALUES (?, ?, ?, ?)`,
        [sessionId, userId, item.name, item.quantity || 1]
      )
    }
  }

  return true
}

// Obtener inventario del jugador
export const getPlayerInventory = async (sessionId, userId) => {
  const [items] = await pool.execute(
    `SELECT item_name, quantity, acquired_at
     FROM inventories
     WHERE session_id = ? AND user_id = ?
     ORDER BY acquired_at ASC`,
    [sessionId, userId]
  )
  return items
}

export default {
  createRoom,
  getRoomById,
  getRoomByCode,
  getAvailableRooms,
  getRoomPlayers,
  getPlayerCount,
  isPlayerInRoom,
  joinRoom,
  leaveRoom,
  deleteRoom,
  updateRoomStatus,
  startGame,
  getUserCurrentRoom,
  savePlayerProgress,
  getPlayerProgress,
  savePlayerInventory,
  getPlayerInventory
}
