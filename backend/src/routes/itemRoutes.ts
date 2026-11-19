import { Router } from 'express'
import {
  createItem,
  deleteItem,
  getItem,
  getItems,
  updateItem,
} from '../controllers/itemsController.js'

export const itemRoutes = Router()

itemRoutes.get('/', getItems)
itemRoutes.get('/:id', getItem)
itemRoutes.post('/', createItem)
itemRoutes.put('/:id', updateItem)
itemRoutes.delete('/:id', deleteItem)
