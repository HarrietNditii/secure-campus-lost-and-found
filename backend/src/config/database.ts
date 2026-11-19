import { readFile } from 'node:fs/promises'
import { Pool } from 'pg'
import { config } from './env.js'

const ssl = config.databaseSsl ? { rejectUnauthorized: true } : undefined

export const pool = new Pool(config.databaseUrl
  ? { connectionString: config.databaseUrl, ssl }
  : {
      host: config.databaseHost,
      port: config.databasePort,
      database: config.databaseName,
      user: config.databaseUser,
      password: config.databasePassword,
      ssl,
    })

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error)
})

export async function initializeDatabase(): Promise<void> {
  const schema = await readFile(new URL('../../database/schema.sql', import.meta.url), 'utf8')
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    await client.query(schema)
    await client.query('COMMIT')
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch (rollbackError) {
      console.error('Database initialization rollback failed:', rollbackError)
    }
    throw error
  } finally {
    client.release()
  }
}
