import dotenv from 'dotenv'
dotenv.config()
import { initDatabase } from './src/db/init.js'
import { Post } from './src/db/models/post.js'
import { User } from './src/db/models/user.js'
import { Event } from './src/db/models/event.js'
import { createUser } from './src/services/users.js'
import { createPost } from './src/services/posts.js'
import { trackEvent } from './src/services/events.js'
import { v4 as uuidv4 } from 'uuid'

const simulationStart = Date.now() - 1000 * 60 * 60 * 24 * 30
const simulationEnd = Date.now()
const simulatedUsers = 5
const simulatedPosts = 10
const simulatedEvents = 10000

async function simulateEvents() {
  const connection = await initDatabase()
  console.log('database connected:', connection.connection.host)

  await User.deleteMany({})
  const createdUsers = await Promise.all(
    Array(simulatedUsers)
      .fill(null)
      .map(
        async (_, u) =>
          await createUser({
            username: `user-${u}`,
            password: `password-${u}`,
          }),
      ),
  )

  console.log(`created ${createdUsers.length} users`)

  await Post.deleteMany({})
  const createdPosts = await Promise.all(
    Array(simulatedPosts)
      .fill(null)
      .map(async (_, p) => {
        const randomUser =
          createdUsers[Math.floor(Math.random() * simulatedUsers)]
        return await createPost(randomUser._id, {
          title: `Test Post ${p}`,
          contents: `This is a test post ${p}`,
        })
      }),
  )
  console.log(`created ${createdPosts.length} posts`)

  await Event.deleteMany({})

  const createdViews = await Promise.all(
    Array(simulatedEvents)
      .fill(null)
      .map(async () => {
        const randomPost =
          createdPosts[Math.floor(Math.random() * simulatedPosts)]

        const sessionStart =
          simulationStart + Math.random() * (simulationEnd - simulationStart)
        const sessionEnd =
          sessionStart + 1000 + Math.floor(Math.random() * 60 * 5 * 1000)

        const session = uuidv4()
        // start event
        await trackEvent({
          postId: randomPost._id,
          action: 'startView',
          session,
          date: new Date(sessionStart),
        })

        // end event
        return trackEvent({
          postId: randomPost._id,
          action: 'endView',
          session,
          date: new Date(sessionEnd),
        })
      }),
  )

  console.log(`created ${createdViews.length} events`)

  console.log('done.')
}

simulateEvents().catch((err) => {
  console.error(err)
  process.exit(1)
})
