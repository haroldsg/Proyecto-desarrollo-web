import jwt from 'jsonwebtoken'
import Room from '../models/Room.js'
import Social from '../models/Social.js'

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

  // Mapa de usuarios online: userId -> { username, socketId }
  const onlineUsers = new Map()

  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.user.username} (ID: ${socket.user.id})`)

    // Registrar usuario online
    onlineUsers.set(socket.user.id, { username: socket.user.username, socketId: socket.id })

    // Notificar a todos que este usuario se conectó
    socket.broadcast.emit('global:userOnline', {
      userId: socket.user.id,
      username: socket.user.username
    })

    // Enviar lista de usuarios online al recién conectado
    const onlineList = Array.from(onlineUsers.entries()).map(([id, data]) => ({
      userId: id,
      username: data.username
    }))
    socket.emit('global:onlineList', onlineList)

    // Unirse a sala de socket personal (para notificaciones)
    socket.join(`user:${socket.user.id}`)

    /**
     * Pedir lista de usuarios online (cuando se abre el chat global)
     */
    socket.on('global:requestOnlineList', () => {
      const list = Array.from(onlineUsers.entries()).map(([id, data]) => ({
        userId: id,
        username: data.username
      }))
      socket.emit('global:onlineList', list)
    })

    /**
     * Unirse a una sala de juego (para recibir eventos)
     */
    socket.on('room:join', async (data) => {
      try {
        const roomId = typeof data === 'object' ? data.roomId : data

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
    socket.on('room:leave', (data) => {
      const roomId = typeof data === 'object' ? data.roomId : data

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
     * Fin de partida (jugador llegó al final)
     */
    socket.on('room:gameFinished', ({ roomId }) => {
      console.log(`Partida ${roomId} finalizada por ${socket.user.username}`)
      io.to(`room:${roomId}`).emit('room:gameFinished', {
        roomId,
        finishedBy: socket.user.username
      })
    })

    /**
     * Cambio de escena del jugador
     */
    socket.on('player:sceneChange', ({ roomId, sceneId }) => {
      console.log(`${socket.user.username} cambió a escena: ${sceneId}`)
      socket.to(`room:${roomId}`).emit('player:sceneChange', {
        userId: socket.user.id,
        username: socket.user.username,
        sceneId
      })
    })

    /**
     * Chat global — guardar en DB y broadcast a todos
     */
    socket.on('global:message', async ({ message }) => {
      if (!message || !message.trim()) return
      try {
        const msgId = await Social.saveGlobalMessage(socket.user.id, message.trim())
        io.emit('global:message', {
          id: msgId,
          userId: socket.user.id,
          username: socket.user.username,
          text: message.trim(),
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Error en mensaje global:', error)
      }
    })

    /**
     * Mensaje privado — solo va al destinatario y al remitente
     */
    socket.on('private:message', async ({ receiverId, message }) => {
      if (!message || !message.trim()) return
      try {
        const msgId = await Social.savePrivateMessage(socket.user.id, receiverId, message.trim())
        const payload = {
          id: msgId,
          userId: socket.user.id,
          username: socket.user.username,
          text: message.trim(),
          timestamp: new Date().toISOString(),
          fromUserId: socket.user.id,
          receiverId
        }
        // Al destinatario
        io.to(`user:${receiverId}`).emit('private:message', payload)
        // Echo al remitente
        socket.emit('private:message', payload)
      } catch (error) {
        console.error('Error en mensaje privado:', error)
      }
    })

    /**
     * Solicitud de amistad vía socket
     */
    socket.on('friend:request', async ({ targetUserId }) => {
      try {
        await Social.sendFriendRequest(socket.user.id, targetUserId)
        // Obtener el request recién creado para tener el request_id real
        const requests = await Social.getPendingRequests(targetUserId)
        const newReq = requests.find(r => r.id === socket.user.id)
        io.to(`user:${targetUserId}`).emit('friend:request', {
          request_id: newReq?.request_id,
          id: socket.user.id,
          username: socket.user.username,
          created_at: new Date().toISOString()
        })
      } catch (error) {
        socket.emit('friend:error', { message: error.message })
      }
    })

    /**
     * Desconexión
     */
    socket.on('disconnect', async () => {
      console.log(`Usuario desconectado: ${socket.user.username}`)

      // Quitar de online y notificar
      onlineUsers.delete(socket.user.id)
      io.emit('global:userOffline', { userId: socket.user.id })

      // Verificar si estaba en una sala activa
      try {
        const currentRoom = await Room.getUserCurrentRoom(socket.user.id)
        if (currentRoom) {
          io.to(`room:${currentRoom.id}`).emit('room:playerDisconnected', {
            userId: socket.user.id,
            username: socket.user.username,
            temporary: true
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
