import { createServer } from 'node:http'
import { app } from './app.js'
import { config } from './config/env.js'
import { initializeDatabase, pool } from './config/database.js'

const server = createServer(app)

let isShuttingDown = false

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return
  isShuttingDown = true
  console.log(`${signal} received; shutting down gracefully.`)

  const timeout = setTimeout(() => {
    console.error('Graceful shutdown timed out.')
    server.closeAllConnections()
    process.exitCode = 1
  }, 10_000)
  timeout.unref()

  server.close(async (serverError) => {
    if (serverError) {
      console.error('HTTP server shutdown failed:', serverError)
      process.exitCode = 1
    }

    try {
      await pool.end()
    } catch (databaseError) {
      console.error('PostgreSQL pool shutdown failed:', databaseError)
      process.exitCode = 1
    } finally {
      clearTimeout(timeout)
    }
  })
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))

async function startServer(): Promise<void> {
  try {
    await initializeDatabase()
    server.listen(config.port, () => {
      console.log(`Lost and Found API listening on port ${config.port}`)
    })
  } catch (error) {
    console.error('Unable to connect to PostgreSQL or initialize the database:', error)
    try {
      await pool.end()
    } catch (shutdownError) {
      console.error('PostgreSQL pool shutdown failed:', shutdownError)
    }
    process.exitCode = 1
  }
}

void startServer()
