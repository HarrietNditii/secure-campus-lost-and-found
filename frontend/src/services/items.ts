export type ItemType = 'lost' | 'found'

export interface Item {
  id: string
  type: ItemType
  title: string
  description: string
  category: string
  location: string
  dateReported: string
  contactName: string
  contactEmail: string
  status: 'open' | 'claimed' | 'returned' | 'closed'
  createdAt: string
  updatedAt: string
}

export interface NewItem {
  type: ItemType
  title: string
  description: string
  category: string
  location: string
  contactName: string
  contactEmail: string
}

const itemsUrl = '/api/items'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isItem(value: unknown): value is Item {
  return (
    isRecord(value) &&
    (value.type === 'lost' || value.type === 'found') &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.category === 'string' &&
    typeof value.location === 'string' &&
    typeof value.dateReported === 'string' &&
    typeof value.contactName === 'string' &&
    typeof value.contactEmail === 'string' &&
    (value.status === 'open' ||
      value.status === 'claimed' ||
      value.status === 'returned' ||
      value.status === 'closed') &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  )
}

async function responseError(response: Response): Promise<string> {
  const body = await response.text()
  if (body) {
    try {
      const payload: unknown = JSON.parse(body)
      if (isRecord(payload) && typeof payload.message === 'string') return payload.message
    } catch {
      return body
    }
  }
  return `Request failed (${response.status}). Please try again.`
}

export async function getItems(signal?: AbortSignal): Promise<Item[]> {
  const response = await fetch(itemsUrl, { signal })
  if (!response.ok) throw new Error(await responseError(response))

  const payload: unknown = await response.json()
  const items = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.items)
      ? payload.items
      : null

  if (!items || !items.every(isItem)) {
    throw new Error('The server returned items in an unexpected format.')
  }
  return items
}

export async function createItem(item: NewItem): Promise<void> {
  const response = await fetch(itemsUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  if (!response.ok) throw new Error(await responseError(response))
}
