import Social from '../models/Social.js'

// GET /api/social/messages/global
export const getGlobalMessages = async (req, res) => {
  try {
    const messages = await Social.getGlobalMessages(50)
    res.json({ success: true, data: messages })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET /api/social/messages/private/:friendId
export const getPrivateHistory = async (req, res) => {
  try {
    const messages = await Social.getPrivateHistory(req.user.id, req.params.friendId, 50)
    res.json({ success: true, data: messages })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET /api/social/friends
export const getFriends = async (req, res) => {
  try {
    const friends = await Social.getFriends(req.user.id)
    res.json({ success: true, data: friends })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET /api/social/friends/requests
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await Social.getPendingRequests(req.user.id)
    res.json({ success: true, data: requests })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST /api/social/friends/request
export const sendFriendRequest = async (req, res) => {
  try {
    const { username } = req.body
    if (!username) return res.status(400).json({ success: false, message: 'Username requerido' })

    const targetUser = await Social.searchUserByUsername(username, req.user.id)
    if (!targetUser) return res.status(404).json({ success: false, message: 'Usuario no encontrado' })

    await Social.sendFriendRequest(req.user.id, targetUser.id)

    // Obtener el request recién creado para enviar el request_id real
    const requests = await Social.getPendingRequests(targetUser.id)
    const newReq = requests.find(r => r.id === req.user.id)

    if (req.io) {
      req.io.to(`user:${targetUser.id}`).emit('friend:request', {
        request_id: newReq?.request_id,
        id: req.user.id,
        username: req.user.username,
        created_at: new Date().toISOString()
      })
    }

    res.json({ success: true, message: 'Solicitud enviada', data: { targetUser } })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// POST /api/social/friends/accept/:requestId
export const acceptFriendRequest = async (req, res) => {
  try {
    await Social.acceptFriendRequest(req.params.requestId, req.user.id)

    // Notificar al que envió la solicitud
    if (req.io) {
      req.io.to(`user:${req.body.senderId}`).emit('friend:requestAccepted', {
        userId: req.user.id,
        username: req.user.username
      })
    }

    res.json({ success: true, message: 'Solicitud aceptada' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// DELETE /api/social/friends/reject/:requestId
export const rejectFriendRequest = async (req, res) => {
  try {
    await Social.rejectFriendRequest(req.params.requestId, req.user.id)
    res.json({ success: true, message: 'Solicitud rechazada' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// DELETE /api/social/friends/:friendId
export const removeFriend = async (req, res) => {
  try {
    await Social.removeFriend(req.user.id, req.params.friendId)
    res.json({ success: true, message: 'Amigo eliminado' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export default {
  getGlobalMessages, getPrivateHistory,
  getFriends, getPendingRequests,
  sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend
}
