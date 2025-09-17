// src/config/db.ts

import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    console.log('✅ Database connected successfully!')
  } catch (error) {
    console.error('❌ Database connection error:', error)
    process.exit(1) // Fatal error হলে server বন্ধ করে দিবে
  }
}

export default connectDB
