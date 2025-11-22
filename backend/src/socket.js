import jwt from 'jsonwebtoken'
import { getUserInfoById } from './services/users.js'

export function handleSocket(io) {
  io.use((socket, next) => {
    if (!socket.handshake.auth?.token) {
      return next(new Error('Authentication failed: No token provided'))
    }
    jwt.verify(
      socket.handshake.auth.token,
      process.env.JWT_SECRET,
      async (err, decodedToken) => {
        if (err) {
          return next(new Error('Authentication failed: Invalid token'))
        }
        socket.auth = decodedToken
        socket.user = await getUserInfoById(socket.auth.sub)
        return next()
      },
    )
  })

  io.on('connection', (socket) => {
    console.log('user connected: ', socket.id)

    const room = socket.handshake.query?.room ?? 'public'
    socket.join(room)
    console.log(socket.id, 'joined room', room)

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })

    socket.on('chat.message', (msg) => {
      console.log(`${socket.id} says: ${msg}`)
      io.to(room).emit('chat.message', { username: socket.user.username, msg })
    })

    socket.on('user.info', async (socketId, callback) => {
      const sockets = await io.in(socketId).fetchSockets()
      if (sockets.length === 0) return callback(null)
      const socket = sockets[0]
      const userInfo = {
        socketId,
        rooms: Array.from(socket.rooms),
        user: socket.user,
      }
      return callback(userInfo)
    })
  })
}
