import express from 'express'
import { postsRoutes } from './routes/posts.js'
import { usersRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'
import bodyParser from 'body-parser'
import cors from 'cors'

import { ApolloServer } from '@apollo/server'
import { typeDefs, resolvers } from './graphql/index.js'
import { optionalAuth } from './middleware/jwt.js'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

import { handleSocket } from './socket.js'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})
import { expressMiddleware } from '@apollo/server/express4'

const app = express()
app.use(bodyParser.json())
app.use(cors())
apolloServer.start().then(() =>
  app.use(
    '/graphql',
    optionalAuth,
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        return { auth: req.auth }
      },
    }),
  ),
)

postsRoutes(app)
usersRoutes(app)
eventRoutes(app)

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})
handleSocket(io)

app.get('/', (req, res) => {
  res.send('Hello from Express Nodemon!')
})

// export { app }
export { server as app }
