import jwt from 'jsonwebtoken'
import Room from '../models/Room.js'

/**
 * Middleware de autenticación para Socket.io
 */
const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.query.token

  if (!token) {
    return next(new Error('Token de autenticación requerido'))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.user = decoded
    next()
  } catch (error) {
    next(new Error('Token inválido'))
  }
}

/**
 * Configurar eventos de Socket.io
 */
const setupSocketHandlers = (io) => {
  // Aplicar middleware de autenticación
  io.use(authenticateSocket)

  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.user.username} (ID: ${socket.user.id})`)

    // Unirse a sala de socket personal (para notificaciones)
    socket.join(`user:${socket.user.id}`)

    /**
     * Unirse a una sala de juego (para recibir eventos)
     */
    socket.on('room:join', async (roomId) => {
      try {
        const room = await Room.getRoomById(roomId)
        if (!room) {
          socket.emit('error', { message: 'Sala no encontrada' })
          return
        }

        // Verificar que el usuario está en la sala (en la BD)
        const isInRoom = await Room.isPlayerInRoom(roomId, socket.user.id)
        if (!isInRoom) {
          socket.emit('error', { message: 'No estás en esta sala' })
          return
        }

        socket.join(`room:${roomId}`)
        console.log(`${socket.user.username} se unió al socket de sala ${roomId}`)

        // Notificar a otros jugadores
        socket.to(`room:${roomId}`).emit('room:playerConnected', {
          userId: socket.user.id,
          username: socket.user.username
        })
      } catch (error) {
        console.error('Error al unirse a sala:', error)
        socket.emit('error', { message: 'Error al unirse a la sala' })
      }
    })

    /**
     * Salir de una sala de socket
     */
    socket.on('room:leave', (roomId) => {
      socket.leave(`room:${roomId}`)
      console.log(`${socket.user.username} dejó el socket de sala ${roomId}`)

      socket.to(`room:${roomId}`).emit('room:playerDisconnected', {
        userId: socket.user.id,
        username: socket.user.username
      })
    })

    /**
     * Enviar mensaje de chat en sala
     */
    socket.on('chat:message', async ({ roomId, message }) => {
      try {
        if (!message || message.trim() === '') return

        const isInRoom = await Room.isPlayerInRoom(roomId, socket.user.id)
        if (!isInRoom) {
          socket.emit('error', { message: 'No estás en esta sala' })
          return
        }

        io.to(`room:${roomId}`).emit('chat:message', {
          userId: socket.user.id,
          username: socket.user.username,
          message: message.trim(),
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Error al enviar mensaje:', error)
      }
    })

    /**
     * Sincronizar posición del jugador (para el juego)
     */
    socket.on('player:position', ({ roomId, position }) => {
      socket.to(`room:${roomId}`).emit('player:position', {
        userId: socket.user.id,
        position
      })
    })

    /**
     * Acción del jugador (para el juego)
     */
    socket.on('player:action', ({ roomId, action, data }) => {
      socket.to(`room:${roomId}`).emit('player:action', {
        userId: socket.user.id,
        action,
        data
      })
    })

    /**
     * Desconexión
     */
    socket.on('disconnect', async () => {
      console.log(`Usuario desconectado: ${socket.user.username}`)

      // Verificar si estaba en una sala activa
      try {
        const currentRoom = await Room.getUserCurrentRoom(socket.user.id)
        if (currentRoom) {
          io.to(`room:${currentRoom.id}`).emit('room:playerDisconnected', {
            userId: socket.user.id,
            username: socket.user.username,
            temporary: true // Puede reconectarse
          })
        }
      } catch (error) {
        console.error('Error en desconexión:', error)
      }
    })
  })

  return io
}

export default setupSocketHandlers
