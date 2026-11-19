import { pool } from '../config/database.js'
import type { ItemFilters, ItemInput, ItemStatus } from '../utils/itemValidation.js'

export interface Item {
  id: string
  type: 'lost' | 'found'
  title: string
  description: string
  category: string
  location: string
  dateReported: string
  contactName: string
  contactEmail: string
  status: ItemStatus
  createdAt: string
  updatedAt: string
}

interface ItemRow {
  id: string
  type: 'lost' | 'found'
  title: string
  description: string
  category: string
  location: string
  dateReported: Date
  contactName: string
  contactEmail: string
  status: ItemStatus
  createdAt: Date
  updatedAt: Date
}

const itemColumns = `
  id::text,
  item_type AS type,
  title,
  description,
  category,
  location,
  date_reported AS "dateReported",
  contact_name AS "contactName",
  contact_email AS "contactEmail",
  status,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`

function mapItem(row: ItemRow): Item {
  return {
    ...row,
    dateReported: row.dateReported.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function listItems(filters: ItemFilters): Promise<Item[]> {
  const conditions: string[] = []
  const values: string[] = []

  if (filters.type) {
    values.push(filters.type)
    conditions.push(`item_type = $${values.length}`)
  }
  if (filters.category) {
    values.push(filters.category)
    conditions.push(`category = $${values.length}`)
  }
  if (filters.search) {
    values.push(`%${filters.search.replace(/[\\%_]/g, '\\$&')}%`)
    const parameter = `$${values.length}`
    conditions.push(
      `(title ILIKE ${parameter} ESCAPE E'\\\\' OR description ILIKE ${parameter} ESCAPE E'\\\\' OR location ILIKE ${parameter} ESCAPE E'\\\\')`,
    )
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const result = await pool.query<ItemRow>(
    `SELECT ${itemColumns} FROM items ${whereClause} ORDER BY date_reported DESC`,
    values,
  )
  return result.rows.map(mapItem)
}

export async function findItem(id: string): Promise<Item | null> {
  const result = await pool.query<ItemRow>(
    `SELECT ${itemColumns} FROM items WHERE id = $1`,
    [id],
  )
  return result.rows[0] ? mapItem(result.rows[0]) : null
}

export async function insertItem(input: ItemInput): Promise<Item> {
  const result = await pool.query<ItemRow>(
    `INSERT INTO items (
       item_type, title, description, category, location, contact_name, contact_email, status
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${itemColumns}`,
    [
      input.type,
      input.title,
      input.description,
      input.category,
      input.location,
      input.contactName,
      input.contactEmail,
      input.status ?? 'open',
    ],
  )
  return mapItem(result.rows[0]!)
}

export async function replaceItem(id: string, input: ItemInput): Promise<Item | null> {
  const result = await pool.query<ItemRow>(
    `UPDATE items
     SET item_type = $1,
         title = $2,
         description = $3,
         category = $4,
         location = $5,
         contact_name = $6,
         contact_email = $7,
         status = COALESCE($8, status)
     WHERE id = $9
     RETURNING ${itemColumns}`,
    [
      input.type,
      input.title,
      input.description,
      input.category,
      input.location,
      input.contactName,
      input.contactEmail,
      input.status ?? null,
      id,
    ],
  )
  return result.rows[0] ? mapItem(result.rows[0]) : null
}

export async function removeItem(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM items WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}
