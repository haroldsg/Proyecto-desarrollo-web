import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class SocketService {
  constructor() {
    this.socket = null
    this.connected = false
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket.io conectado')
      this.connected = true
    })

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.io desconectado')
      this.connected = false
    })

    this.socket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected = false
    }
  }

  // ========================================
  // ROOM EVENTS
  // ========================================
  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit('room:join', roomId)
    }
  }

  leaveRoom(roomId) {
    if (this.socket) {
      this.socket.emit('room:leave', roomId)
    }
  }

  // ========================================
  // CHAT EVENTS
  // ========================================
  sendMessage(roomId, message) {
    if (this.socket) {
      this.socket.emit('chat:message', { roomId, message })
    }
  }

  onChatMessage(callback) {
    if (this.socket) {
      this.socket.on('chat:message', callback)
    }
  }

  // ========================================
  // ROOM EVENTS LISTENERS
  // ========================================
  onPlayerJoined(callback) {
    if (this.socket) {
      this.socket.on('room:playerJoined', callback)
    }
  }

  onPlayerLeft(callback) {
    if (this.socket) {
      this.socket.on('room:playerLeft', callback)
    }
  }

  onGameStarted(callback) {
    if (this.socket) {
      this.socket.on('room:gameStarted', callback)
    }
  }

  onRoomDeleted(callback) {
    if (this.socket) {
      this.socket.on('room:deleted', callback)
    }
  }

  onPlayerConnected(callback) {
    if (this.socket) {
      this.socket.on('room:playerConnected', callback)
    }
  }

  onPlayerDisconnected(callback) {
    if (this.socket) {
      this.socket.on('room:playerDisconnected', callback)
    }
  }

  // ========================================
  // REMOVE LISTENERS
  // ========================================
  off(event) {
    if (this.socket) {
      this.socket.off(event)
    }
  }
}

export default new SocketService()
