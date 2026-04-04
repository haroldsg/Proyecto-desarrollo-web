import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('backrooms_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('backrooms_token')
      localStorage.removeItem('backrooms_user')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error.message)
  }
)

// ========================================
// AUTH ENDPOINTS
// ========================================
export const authAPI = {
  register: (username, email, password) =>
    api.post('/api/auth/register', { username, email, password }),

  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),

  getMe: () =>
    api.get('/api/auth/me')
}

// ========================================
// ROOM ENDPOINTS
// ========================================
export const roomAPI = {
  createRoom: (roomName, maxPlayers, isPublic = true) =>
    api.post('/api/rooms', { roomName, maxPlayers, isPublic }),

  getAvailableRooms: () =>
    api.get('/api/rooms'),

  getCurrentRoom: () =>
    api.get('/api/rooms/current'),

  getRoomDetails: (roomId) =>
    api.get(`/api/rooms/${roomId}`),

  joinRoom: (roomId) =>
    api.post(`/api/rooms/${roomId}/join`),

  joinRoomByCode: (code) =>
    api.post('/api/rooms/join', { code }),

  leaveRoom: (roomId) =>
    api.post(`/api/rooms/${roomId}/leave`),

  startGame: (roomId) =>
    api.post(`/api/rooms/${roomId}/start`),

  saveProgress: (sessionId, sceneId, inventory) =>
    api.post(`/api/rooms/${sessionId}/progress/save`, { sceneId, inventory }),

  loadProgress: (sessionId) =>
    api.get(`/api/rooms/${sessionId}/progress/load`)
}

export default api
