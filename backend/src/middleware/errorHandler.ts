import type { ErrorRequestHandler, RequestHandler } from 'express'
import { ValidationError } from '../utils/itemValidation.js'

export const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(404).json({ message: 'Route not found.' })
}

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  void _next
  if (error instanceof ValidationError) {
    response.status(400).json({ message: error.message })
    return
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    error.type === 'entity.parse.failed'
  ) {
    response.status(400).json({ message: 'Request body contains invalid JSON.' })
    return
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof error.status === 'number' &&
    error.status === 413
  ) {
    response.status(413).json({ message: 'Request body is too large.' })
    return
  }

  console.error('Unhandled API error:', error)
  response.status(500).json({ message: 'Internal server error.' })
}
