import assert from 'node:assert/strict'
import test from 'node:test'
import {
  parseItemFilters,
  parseItemInput,
  ValidationError,
  validateItemId,
} from './utils/itemValidation.js'

test('parses valid item data and trims user input', () => {
  assert.deepEqual(
    parseItemInput({
      type: 'lost',
      title: '  Notebook ',
      description: ' Blue cover ',
      category: 'Books & stationery',
      location: ' Library ',
      contactName: ' Ada Campus ',
      contactEmail: ' ADA@UNIVERSITY.EDU ',
    }),
    {
      type: 'lost',
      title: 'Notebook',
      description: 'Blue cover',
      category: 'Books & stationery',
      location: 'Library',
      contactName: 'Ada Campus',
      contactEmail: 'ada@university.edu',
      status: undefined,
    },
  )
})

test('rejects invalid item types and missing required fields', () => {
  assert.throws(
    () => parseItemInput({ type: 'missing' }),
    (error: unknown) => error instanceof ValidationError && /type/.test(error.message),
  )
  assert.throws(
    () => parseItemInput({ type: 'found', title: '  ' }),
    (error: unknown) => error instanceof ValidationError && /title/.test(error.message),
  )
  assert.throws(
    () => parseItemInput({
      type: 'found',
      title: 'Keys',
      description: 'A key ring',
      category: 'Keys & cards',
      location: 'Library',
      contactName: 'Sam',
      contactEmail: 'not-an-email',
    }),
    (error: unknown) => error instanceof ValidationError && /contactEmail/.test(error.message),
  )
})

test('accepts supported search filters and rejects unsupported item types', () => {
  assert.deepEqual(parseItemFilters({ type: 'found', category: 'Keys', search: 'library' }), {
    type: 'found',
    category: 'Keys',
    search: 'library',
  })
  assert.throws(
    () => parseItemFilters({ type: 'other' }),
    (error: unknown) => error instanceof ValidationError,
  )
})

test('validates UUID item identifiers', () => {
  assert.equal(validateItemId('d9428888-122b-4b3b-9f4f-2a8406c0d3a1'), 'd9428888-122b-4b3b-9f4f-2a8406c0d3a1')
  assert.throws(() => validateItemId('not-a-uuid'), ValidationError)
})
