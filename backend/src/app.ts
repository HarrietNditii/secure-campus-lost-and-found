import express from 'express'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { healthRoutes } from './routes/healthRoutes.js'
import { itemRoutes } from './routes/itemRoutes.js'

export const app = express()

app.use(express.json({ limit: '100kb' }))
app.use('/api', healthRoutes)
app.use('/api/items', itemRoutes)
app.use(notFoundHandler)
app.use(errorHandler)
