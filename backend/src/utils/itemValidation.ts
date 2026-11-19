export type ItemType = 'lost' | 'found'
export type ItemStatus = 'open' | 'claimed' | 'returned' | 'closed'

export interface ItemInput {
  type: ItemType
  title: string
  description: string
  category: string
  location: string
  contactName: string
  contactEmail: string
  status?: ItemStatus
}

export interface ItemFilters {
  type?: ItemType
  category?: string
  search?: string
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readString(
  value: unknown,
  field: string,
  maxLength: number,
  optional = false,
): string | undefined {
  if (value === undefined && optional) return undefined
  if (typeof value !== 'string') {
    throw new ValidationError(`${field} must be a string.`)
  }
  const normalized = value.trim()
  if (!normalized) throw new ValidationError(`${field} is required.`)
  if (normalized.length > maxLength) {
    throw new ValidationError(`${field} must be ${maxLength} characters or fewer.`)
  }
  return normalized
}

export function parseItemInput(value: unknown): ItemInput {
  if (!isRecord(value)) throw new ValidationError('Request body must be a JSON object.')
  if (value.type !== 'lost' && value.type !== 'found') {
    throw new ValidationError('type must be either "lost" or "found".')
  }

  const title = readString(value.title, 'title', 100)!
  const description = readString(value.description, 'description', 1000)!
  const category = readString(value.category, 'category', 80)!
  const location = readString(value.location, 'location', 120)!
  const contactName = readString(value.contactName, 'contactName', 120)!
  const contactEmail = readString(value.contactEmail, 'contactEmail', 254)!.toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    throw new ValidationError('contactEmail must be a valid email address.')
  }
  const rawStatus = readString(value.status, 'status', 20, true)
  if (
    rawStatus !== undefined &&
    rawStatus !== 'open' &&
    rawStatus !== 'claimed' &&
    rawStatus !== 'returned' &&
    rawStatus !== 'closed'
  ) {
    throw new ValidationError('status must be open, claimed, returned, or closed.')
  }

  return {
    type: value.type,
    title,
    description,
    category,
    location,
    contactName,
    contactEmail,
    status: rawStatus,
  }
}

function getQueryString(query: Record<string, unknown>, key: string, maxLength: number): string | undefined {
  return readString(query[key], key, maxLength, true)
}

export function parseItemFilters(value: unknown): ItemFilters {
  if (!isRecord(value)) throw new ValidationError('Query parameters are invalid.')
  const rawType = getQueryString(value, 'type', 10)
  if (rawType !== undefined && rawType !== 'lost' && rawType !== 'found') {
    throw new ValidationError('type must be either "lost" or "found".')
  }

  return {
    type: rawType,
    category: getQueryString(value, 'category', 80),
    search: getQueryString(value, 'search', 200) ?? getQueryString(value, 'q', 200),
  }
}

export function validateItemId(value: unknown): string {
  if (typeof value !== 'string' || !/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(value)) {
    throw new ValidationError('id must be a valid UUID.')
  }
  return value
}
