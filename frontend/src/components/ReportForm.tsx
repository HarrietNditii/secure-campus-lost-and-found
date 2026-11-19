import { useState, type FormEvent } from 'react'
import { createItem, type ItemType, type NewItem } from '../services/items'

interface ReportFormProps {
  onClose: () => void
  onCreated: () => void
}

const categories = [
  'Electronics',
  'Clothing & accessories',
  'Books & stationery',
  'Keys & cards',
  'Bags',
  'Other',
]

export function ReportForm({ onClose, onCreated }: ReportFormProps) {
  const [type, setType] = useState<ItemType>('lost')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const item: NewItem = {
      type,
      title: String(formData.get('title') ?? '').trim(),
      description: String(formData.get('description') ?? '').trim(),
      category: String(formData.get('category') ?? ''),
      location: String(formData.get('location') ?? '').trim(),
      contactName: String(formData.get('contactName') ?? '').trim(),
      contactEmail: String(formData.get('contactEmail') ?? '').trim(),
    }

    try {
      await createItem(item)
      onCreated()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit your report.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !submitting) onClose()
    }}>
      <section className="report-dialog" role="dialog" aria-modal="true" aria-labelledby="report-title">
        <div className="dialog-header">
          <div>
            <span className="eyebrow muted-eyebrow">HELP YOUR COMMUNITY</span>
            <h2 id="report-title">Report an item</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close report form" disabled={submitting}>×</button>
        </div>
        <p className="dialog-intro">Share a few details so the right person can find their way to it.</p>

        <form className="report-form" onSubmit={handleSubmit}>
          <fieldset className="type-picker">
            <legend>What would you like to report?</legend>
            <label className={type === 'lost' ? 'selected' : ''}>
              <input type="radio" name="type" value="lost" checked={type === 'lost'} onChange={() => setType('lost')} />
              <span className="type-option-icon">⌕</span>
              <span><strong>I lost something</strong><small>Looking for a belonging</small></span>
            </label>
            <label className={type === 'found' ? 'selected' : ''}>
              <input type="radio" name="type" value="found" checked={type === 'found'} onChange={() => setType('found')} />
              <span className="type-option-icon">✦</span>
              <span><strong>I found something</strong><small>Help reunite it with its owner</small></span>
            </label>
          </fieldset>

          <label className="form-field">
            <span>Item name</span>
            <input name="title" required maxLength={100} placeholder="e.g. Blue water bottle" />
          </label>
          <div className="form-row">
            <label className="form-field">
              <span>Category</span>
              <select name="category" required defaultValue="">
                <option value="" disabled>Select a category</option>
                {categories.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="form-field">
              <span>{type === 'lost' ? 'Last seen near' : 'Found near'}</span>
              <input name="location" required maxLength={120} placeholder="Building, room or area" />
            </label>
          </div>
          <label className="form-field">
            <span>Description</span>
            <textarea name="description" required maxLength={1000} rows={3} placeholder="Add identifying details to help someone recognize it." />
          </label>
          <div className="form-row">
            <label className="form-field">
              <span>Contact name</span>
              <input name="contactName" required maxLength={120} autoComplete="name" placeholder="Your name" />
            </label>
            <label className="form-field">
              <span>Contact email</span>
              <input name="contactEmail" type="email" required maxLength={254} autoComplete="email" placeholder="you@university.edu" />
            </label>
          </div>
          <small className="contact-consent">Your contact details will be visible to the campus community. Share an email you’re comfortable using for this report.</small>

          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions">
            <button type="button" className="button button-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="button button-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit report'} <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
