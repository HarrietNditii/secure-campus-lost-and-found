import type { Request, Response } from 'express'
import {
  findItem,
  insertItem,
  listItems,
  removeItem,
  replaceItem,
} from '../models/itemRepository.js'
import {
  parseItemFilters,
  parseItemInput,
  validateItemId,
} from '../utils/itemValidation.js'

export async function getItems(request: Request, response: Response): Promise<void> {
  response.json(await listItems(parseItemFilters(request.query)))
}

export async function getItem(request: Request, response: Response): Promise<void> {
  const item = await findItem(validateItemId(request.params.id))
  if (!item) {
    response.status(404).json({ message: 'Item not found.' })
    return
  }
  response.json(item)
}

export async function createItem(request: Request, response: Response): Promise<void> {
  const item = await insertItem(parseItemInput(request.body))
  response.status(201).json(item)
}

export async function updateItem(request: Request, response: Response): Promise<void> {
  const item = await replaceItem(
    validateItemId(request.params.id),
    parseItemInput(request.body),
  )
  if (!item) {
    response.status(404).json({ message: 'Item not found.' })
    return
  }
  response.json(item)
}

export async function deleteItem(request: Request, response: Response): Promise<void> {
  const deleted = await removeItem(validateItemId(request.params.id))
  if (!deleted) {
    response.status(404).json({ message: 'Item not found.' })
    return
  }
  response.status(204).end()
}
