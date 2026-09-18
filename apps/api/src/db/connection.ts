import mongoose from 'mongoose'
import { env } from '../config/env.js'

let isConnected = false

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    isConnected = true
    return
  }

  if (isConnected) return

  mongoose.set('strictQuery', true)

  const uri = process.env.MONGODB_URI ?? env.MONGODB_URI

  try {
    await mongoose.connect(uri, {
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 3_000,
    })
    isConnected = true
    console.log('[DB] Connected to MongoDB at', uri)
  } catch (err) {
    if (env.isDev) {
      console.warn('[DB] Local MongoDB connection failed. Initializing in-memory MongoMemoryServer for development...')
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server')
        const mongod = await MongoMemoryServer.create()
        const memUri = mongod.getUri()
        await mongoose.connect(memUri)
        isConnected = true
        console.log('[DB] Connected to in-memory MongoMemoryServer at', memUri)
        return
      } catch (memErr) {
        console.error('[DB] Failed to start MongoMemoryServer:', memErr)
      }
    }
    throw err
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return
  await mongoose.disconnect()
  isConnected = false
}

export function getDatabaseStatus(): 'connected' | 'disconnected' {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}
