import type { Request, Response } from 'express'
import { pool } from '../config/database.js'

export async function getHealth(_request: Request, response: Response): Promise<void> {
  try {
    await pool.query('SELECT 1')
    response.status(200).json({ status: 'ok', database: 'connected' })
  } catch (error) {
    console.error('Health check could not reach PostgreSQL:', error)
    response.status(503).json({ status: 'error', database: 'unavailable' })
  }
}
