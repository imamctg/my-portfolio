// src/server.ts

import app from './app'
import dotenv from 'dotenv'
import connectDB from './config/db'

dotenv.config() // env variables load

const PORT = process.env.PORT || 5000

// database connect
connectDB()

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
