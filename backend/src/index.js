import dotenv from 'dotenv'
import { app } from './app.js'
dotenv.config()
const PORT = process.env.PORT
app.listen(PORT)

console.info(`Server is running on http://localhost:${PORT}`)
