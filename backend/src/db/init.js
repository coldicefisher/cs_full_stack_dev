import mongooose from 'mongoose'

export function initDatabase() {
  const DATABASE_URL = 'mongodb://localhost:27017/blog'
  mongooose.connection.on('open', () => {
    console.info('Successfully connected to the database', DATABASE_URL)
  })
  const connection = mongooose.connect(DATABASE_URL)
  return connection
}
