import Room from '../models/Room.js'

// Crear una nueva sala
export const createRoom = async (req, res) => {
  try {
    const { roomName, maxPlayers = 4 } = req.body
    const hostId = req.user.id

    // Validar maxPlayers (2-4)
    if (maxPlayers < 2 || maxPlayers > 4) {
      return res.status(400).json({
        success: false,
        message: 'El número de jugadores debe ser entre 2 y 4'
      })
    }

    // Verificar si el usuario ya está en una sala
    const currentRoom = await Room.getUserCurrentRoom(hostId)
    if (currentRoom) {
      return res.status(400).json({
        success: false,
        message: 'Ya estás en una sala. Debes salir primero.'
      })
    }

    const room = await Room.createRoom(hostId, roomName || 'Sala de Backrooms', maxPlayers)

    // Emitir evento de socket (si está disponible)
    if (req.io) {
      req.io.emit('room:created', room)
    }

    res.status(201).json({
      success: true,
      message: 'Sala creada exitosamente',
      data: { room }
    })
  } catch (error) {
    console.error('Error al crear sala:', error)
    res.status(500).json({
      success: false,
      message: 'Error al crear la sala',
      error: error.message
    })
  }
}

// Obtener todas las salas disponibles
export const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.getAvailableRooms()

    res.json({
      success: true,
      data: { rooms }
    })
  } catch (error) {
    console.error('Error al obtener salas:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener las salas',
      error: error.message
    })
  }
}

// Obtener detalles de una sala
export const getRoomDetails = async (req, res) => {
  try {
    const { id } = req.params
    const room = await Room.getRoomById(id)

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Sala no encontrada'
      })
    }

    const players = await Room.getRoomPlayers(id)

    res.json({
      success: true,
      data: {
        room: {
          ...room,
          players,
          currentPlayers: players.length
        }
      }
    })
  } catch (error) {
    console.error('Error al obtener sala:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener la sala',
      error: error.message
    })
  }
}

// Unirse a una sala por ID
export const joinRoom = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    // Verificar si el usuario ya está en otra sala
    const currentRoom = await Room.getUserCurrentRoom(userId)
    if (currentRoom && currentRoom.id !== parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Ya estás en otra sala. Debes salir primero.'
      })
    }

    await Room.joinRoom(id, userId)

    const room = await Room.getRoomById(id)
    const players = await Room.getRoomPlayers(id)

    // Emitir evento de socket
    if (req.io) {
      req.io.to(`room:${id}`).emit('room:playerJoined', {
        roomId: id,
        userId,
        username: req.user.username,
        players
      })
      req.io.emit('room:updated', { roomId: id, currentPlayers: players.length })
    }

    res.json({
      success: true,
      message: 'Te has unido a la sala',
      data: {
        room: {
          ...room,
          players,
          currentPlayers: players.length
        }
      }
    })
  } catch (error) {
    console.error('Error al unirse a sala:', error)
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Unirse a una sala por código
export const joinRoomByCode = async (req, res) => {
  try {
    const { code } = req.body
    const userId = req.user.id

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Código de sala requerido'
      })
    }

    const room = await Room.getRoomByCode(code.toUpperCase())

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Sala no encontrada con ese código'
      })
    }

    // Verificar si el usuario ya está en otra sala
    const currentRoom = await Room.getUserCurrentRoom(userId)
    if (currentRoom && currentRoom.id !== room.id) {
      return res.status(400).json({
        success: false,
        message: 'Ya estás en otra sala. Debes salir primero.'
      })
    }

    await Room.joinRoom(room.id, userId)

    const players = await Room.getRoomPlayers(room.id)

    // Emitir evento de socket
    if (req.io) {
      req.io.to(`room:${room.id}`).emit('room:playerJoined', {
        roomId: room.id,
        userId,
        username: req.user.username,
        players
      })
      req.io.emit('room:updated', { roomId: room.id, currentPlayers: players.length })
    }

    res.json({
      success: true,
      message: 'Te has unido a la sala',
      data: {
        room: {
          ...room,
          players,
          currentPlayers: players.length
        }
      }
    })
  } catch (error) {
    console.error('Error al unirse a sala por código:', error)
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Salir de una sala
export const leaveRoom = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const result = await Room.leaveRoom(id, userId)

    // Emitir evento de socket
    if (req.io) {
      if (result.roomDeleted) {
        req.io.emit('room:deleted', { roomId: id })
      } else {
        const players = await Room.getRoomPlayers(id)
        req.io.to(`room:${id}`).emit('room:playerLeft', {
          roomId: id,
          userId,
          username: req.user.username,
          newHostId: result.newHostId,
          players
        })
        req.io.emit('room:updated', { roomId: id, currentPlayers: players.length })
      }
    }

    res.json({
      success: true,
      message: result.roomDeleted ? 'Sala eliminada (eras el último jugador)' : 'Has salido de la sala',
      data: result
    })
  } catch (error) {
    console.error('Error al salir de sala:', error)
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Iniciar el juego
export const startGame = async (req, res) => {
  try {
    const { id } = req.params
    const hostId = req.user.id

    await Room.startGame(id, hostId)

    const room = await Room.getRoomById(id)
    const players = await Room.getRoomPlayers(id)

    // Emitir evento de socket
    if (req.io) {
      req.io.to(`room:${id}`).emit('room:gameStarted', {
        roomId: id,
        room,
        players
      })
      req.io.emit('room:updated', { roomId: id, status: 'playing' })
    }

    res.json({
      success: true,
      message: 'Juego iniciado',
      data: {
        room: {
          ...room,
          players
        }
      }
    })
  } catch (error) {
    console.error('Error al iniciar juego:', error)
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// Obtener la sala actual del usuario
export const getCurrentRoom = async (req, res) => {
  try {
    const userId = req.user.id
    const room = await Room.getUserCurrentRoom(userId)

    if (!room) {
      return res.json({
        success: true,
        data: { room: null }
      })
    }

    const players = await Room.getRoomPlayers(room.id)

    res.json({
      success: true,
      data: {
        room: {
          ...room,
          players,
          currentPlayers: players.length
        }
      }
    })
  } catch (error) {
    console.error('Error al obtener sala actual:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener la sala actual',
      error: error.message
    })
  }
}

export default {
  createRoom,
  getAvailableRooms,
  getRoomDetails,
  joinRoom,
  joinRoomByCode,
  leaveRoom,
  startGame,
  getCurrentRoom
}
