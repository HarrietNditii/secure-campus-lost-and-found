# Campus Return frontend

Responsive React and TypeScript interface for the Secure Campus Lost and Found System.

## Run locally

From this directory:

```sh
npm install
npm run dev
```

The frontend expects the backend to serve the following same-origin API endpoints:

- `GET /api/items` returns an array of items or an object with an `items` array.
- `POST /api/items` accepts a JSON item report.

An item returned by the API has this shape:

```json
{
  "id": "item-id",
  "type": "lost",
  "title": "Blue water bottle",
  "description": "Small bottle with a campus sticker.",
  "category": "Other",
  "location": "Library",
  "dateReported": "2026-11-19T12:00:00.000Z",
  "contactName": "Campus student",
  "contactEmail": "student@university.edu",
  "status": "open",
  "createdAt": "2026-11-19T12:00:00.000Z",
  "updatedAt": "2026-11-19T12:00:00.000Z"
}
```

Reports are submitted with `type`, `title`, `description`, `category`, `location`, `contactName`, and `contactEmail`. The API assigns the item ID, report date, lifecycle status, and timestamps.

## Checks

```sh
npm run lint
npm run build
```

## Container image

Build from the `frontend` directory:

```sh
docker build -t secure-campus-frontend:local .
```

The Nginx image serves the SPA on port 80 and proxies `/api/` to the Docker-network hostname `backend:3000`. Run it on a network where the backend container is reachable under that hostname.
