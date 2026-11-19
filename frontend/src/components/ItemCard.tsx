import type { Item } from '../services/items'

interface ItemCardProps {
  item: Item
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function ItemCard({ item }: ItemCardProps) {
  const parsedDate = new Date(item.dateReported)
  const reportedDate = Number.isNaN(parsedDate.getTime())
    ? item.dateReported
    : dateFormatter.format(parsedDate)

  return (
    <article className="item-card">
      <div className={`item-card-accent ${item.type}`} aria-hidden="true">
        <span>{item.type === 'lost' ? '⌕' : '✦'}</span>
        <span className="card-category">{item.category}</span>
      </div>
      <div className="item-card-content">
        <div className="item-card-topline">
          <div className="item-pills">
            <span className={`status-pill ${item.type}`}>{item.type === 'lost' ? 'Lost' : 'Found'}</span>
            <span className={`record-status ${item.status}`}>{item.status}</span>
          </div>
          <time dateTime={item.dateReported}>{reportedDate}</time>
        </div>
        <h4>{item.title}</h4>
        <p className="item-description">{item.description}</p>
        <div className="item-detail"><span aria-hidden="true">⌖</span>{item.location}</div>
        <div className="contact-detail">
          <span aria-hidden="true">↗</span>
          <a href={`mailto:${item.contactEmail}`}>{item.contactName} · {item.contactEmail}</a>
        </div>
      </div>
    </article>
  )
}
