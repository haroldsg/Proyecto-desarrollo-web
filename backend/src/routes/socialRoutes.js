import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import {
  getGlobalMessages, getPrivateHistory,
  getFriends, getPendingRequests,
  sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend
} from '../controllers/socialController.js'

const router = Router()

// Todas las rutas requieren autenticación
router.use(authenticateToken)

// Mensajes
router.get('/messages/global', getGlobalMessages)
router.get('/messages/private/:friendId', getPrivateHistory)

// Amigos
router.get('/friends', getFriends)
router.get('/friends/requests', getPendingRequests)
router.post('/friends/request', sendFriendRequest)
router.post('/friends/accept/:requestId', acceptFriendRequest)
router.delete('/friends/reject/:requestId', rejectFriendRequest)
router.delete('/friends/:friendId', removeFriend)

export default router
