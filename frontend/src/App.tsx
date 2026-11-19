import { useEffect, useMemo, useState } from 'react'
import { ItemCard } from './components/ItemCard'
import { ReportForm } from './components/ReportForm'
import { getItems } from './services/items'
import type { Item } from './services/items'
import './App.css'

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const [reportOpen, setReportOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      setLoading(true)
      setError('')
      try {
        setItems(await getItems(controller.signal))
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load items.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadItems()
    return () => controller.abort()
  }, [refreshKey])

  const categories = useMemo(
    () => ['All categories', ...new Set(items.map((item) => item.category))],
    [items],
  )

  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return items.filter((item) => {
      const matchesCategory = category === 'All categories' || item.category === category
      const searchableText = [
        item.title,
        item.description,
        item.category,
        item.location,
      ].join(' ').toLocaleLowerCase()
      return matchesCategory && (!query || searchableText.includes(query))
    })
  }, [category, items, search])

  const lostItems = filteredItems.filter((item) => item.type === 'lost')
  const foundItems = filteredItems.filter((item) => item.type === 'found')

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Campus Return home">
          <span className="brand-mark" aria-hidden="true">CR</span>
          <span className="brand-copy">
            <strong>Campus Return</strong>
            <span>LOST &amp; FOUND</span>
          </span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-link active" href="#home">Overview</a>
          <a className="nav-link" href="#lost-items">Lost items</a>
          <a className="nav-link" href="#found-items">Found items</a>
        </nav>
        <button className="button button-primary top-report" onClick={() => setReportOpen(true)}>
          <span aria-hidden="true">+</span> Report an item
        </button>
      </header>

      <main id="home">
        <section className="welcome-panel">
          <div className="welcome-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> YOUR CAMPUS, CONNECTED</span>
            <h1>Lost something?<br /><em>Let’s bring it home.</em></h1>
            <p>A little help from your campus community can make all the difference. Search recent reports or let us know what you’ve found.</p>
            <button className="button button-light" onClick={() => setReportOpen(true)}>
              Report a lost or found item <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="welcome-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="art-sun" />
            <div className="art-building">
              <span className="building-roof" />
              <span className="building-top" />
              <span className="building-body"><i /><i /><i /><i /><i /></span>
              <span className="building-steps" />
            </div>
            <div className="art-pin"><span>✦</span></div>
            <div className="art-leaf leaf-one" />
            <div className="art-leaf leaf-two" />
          </div>
          <div className="welcome-note"><span>✦</span> Together, we find a way.</div>
        </section>

        <section className="overview-section" aria-label="Campus item overview">
          <div className="section-intro">
            <div>
              <span className="eyebrow muted-eyebrow">THE COMMUNITY BOARD</span>
              <h2>Items making their way home</h2>
            </div>
            <p>Every report brings someone one step closer.</p>
          </div>
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-icon lost-icon" aria-hidden="true">↗</span>
              <span className="stat-value">{loading ? '—' : items.filter((item) => item.type === 'lost').length}</span>
              <span className="stat-label">Looking for their owner</span>
              <span className="stat-caption">Lost items</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon found-icon" aria-hidden="true">✓</span>
              <span className="stat-value">{loading ? '—' : items.filter((item) => item.type === 'found').length}</span>
              <span className="stat-label">Ready to be reunited</span>
              <span className="stat-caption">Found items</span>
            </div>
            <div className="stat-card stat-message">
              <span className="stat-icon community-icon" aria-hidden="true">♡</span>
              <span className="stat-message-title">Good things happen<br />when we look out for each other.</span>
              <span className="stat-caption">That’s campus spirit.</span>
            </div>
          </div>
        </section>

        <section className="listings-section" aria-labelledby="listings-title">
          <div className="listings-header">
            <div>
              <span className="eyebrow muted-eyebrow">THE LATEST REPORTS</span>
              <h2 id="listings-title">Browse campus items</h2>
            </div>
            <button className="button button-outline" onClick={() => setReportOpen(true)}>
              <span aria-hidden="true">+</span> Add a report
            </button>
          </div>

          <div className="filter-toolbar">
            <label className="search-field">
              <span className="search-icon" aria-hidden="true" />
              <span className="sr-only">Search items</span>
              <input
                type="search"
                placeholder="Search by item, place or keyword..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label className="category-select">
              <span className="sr-only">Filter by category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>

          {error && (
            <div className="error-banner" role="alert">
              <span>{error}</span>
              <button onClick={() => setRefreshKey((key) => key + 1)}>Try again</button>
            </div>
          )}

          {loading && (
            <div className="loading-state" role="status">
              <span className="spinner" />
              <span>Loading campus reports…</span>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="empty-board">
              <span className="empty-symbol" aria-hidden="true">✦</span>
              <h3>A fresh start for the board</h3>
              <p>There aren’t any reports yet. Be the first to help a belonging find its way back.</p>
              <button className="button button-primary" onClick={() => setReportOpen(true)}>Report an item</button>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <>
              <ItemSection
                id="lost-items"
                title="Lost items"
                subtitle="Help someone find what they’re missing."
                items={lostItems}
                emptyMessage="No lost items match your search. Try another keyword or category."
              />
              <ItemSection
                id="found-items"
                title="Found items"
                subtitle="Something found on campus, waiting to be claimed."
                items={foundItems}
                emptyMessage="No found items match your search. Try another keyword or category."
              />
            </>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark" aria-hidden="true">CR</span>
          <span className="brand-copy"><strong>Campus Return</strong><span>LOOK OUT FOR ONE ANOTHER</span></span>
        </a>
        <span>Made for a more thoughtful campus community.</span>
      </footer>

      {reportOpen && (
        <ReportForm
          onClose={() => setReportOpen(false)}
          onCreated={() => {
            setReportOpen(false)
            setRefreshKey((key) => key + 1)
          }}
        />
      )}
    </div>
  )
}

interface ItemSectionProps {
  id: string
  title: string
  subtitle: string
  items: Item[]
  emptyMessage: string
}

function ItemSection({ id, title, subtitle, items, emptyMessage }: ItemSectionProps) {
  return (
    <section className="item-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="item-section-heading">
        <div>
          <h3 id={`${id}-title`}>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <span className="item-count">{items.length} {items.length === 1 ? 'report' : 'reports'}</span>
      </div>
      {items.length > 0 ? (
        <div className="item-grid">
          {items.map((item) => <ItemCard key={item.id} item={item} />)}
        </div>
      ) : (
        <p className="filtered-empty">{emptyMessage}</p>
      )}
    </section>
  )
}

export default App
