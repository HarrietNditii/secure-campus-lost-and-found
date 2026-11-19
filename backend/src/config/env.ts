import 'dotenv/config'

function readPort(value: string | undefined, name: string, defaultValue: number): number {
  const port = Number(value ?? defaultValue)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${name} must be an integer between 1 and 65535.`)
  }
  return port
}

const databaseUrl = process.env.DATABASE_URL?.trim()
const databaseHost = process.env.DB_HOST
const databaseName = process.env.DB_NAME
const databaseUser = process.env.DB_USER
const databasePassword = process.env.DB_PASSWORD

if (
  !databaseUrl &&
  (!databaseHost || !databaseName || !databaseUser || databasePassword === undefined)
) {
  throw new Error(
    'Configure DATABASE_URL or provide DB_HOST, DB_NAME, DB_USER, and DB_PASSWORD.',
  )
}

export const config = {
  port: readPort(process.env.PORT, 'PORT', 3000),
  databaseUrl,
  databaseHost,
  databasePort: readPort(process.env.DB_PORT, 'DB_PORT', 5432),
  databaseName,
  databaseUser,
  databasePassword,
  databaseSsl: process.env.DB_SSL === 'true',
}
