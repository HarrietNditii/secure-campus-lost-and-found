# Secure Campus Lost and Found API

Express and TypeScript REST API backed by PostgreSQL.

## Setup

From this directory, install dependencies and create a local `.env` based on `.env.example`. Set `DATABASE_URL`, or configure `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`. `DB_SSL=true` enables certificate-verified TLS. No credentials are committed. The API connects and applies the repeatable schema migration before listening.

```sh
npm install
Copy-Item .env.example .env
```

The schema is initialized automatically on startup. PostgreSQL 16 or a compatible version is required. The API listens on port `3000` by default; set `PORT` to override it.

The Vite development server proxies `/api` requests to `http://localhost:3000`.

## API endpoints

All responses use JSON except successful item deletion (`204 No Content`).

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Checks API and PostgreSQL availability. |
| `GET` | `/api/items` | Lists reports; optional `search` (or `q`), `category`, and `type=lost\|found` filters. |
| `GET` | `/api/items/:id` | Gets one item by UUID. |
| `POST` | `/api/items` | Creates an item report; returns `201` and the created record. |
| `PUT` | `/api/items/:id` | Replaces an item's report fields. |
| `DELETE` | `/api/items/:id` | Deletes an item. |

Item create/update bodies require `type`, `title`, `description`, `category`, `location`, `contactName`, and `contactEmail`; `status` may also be supplied (`open`, `claimed`, `returned`, or `closed`). New reports default to `open`. The API assigns `id`, `dateReported`, `createdAt`, and `updatedAt`. Invalid input returns `400`, missing items return `404`, and unexpected errors return `500`.

## Development checks

```sh
npm run lint
npm test
npm run build
```

## Container image

Build from the `backend` directory:

```sh
docker build -t secure-campus-backend:local .
```

The production image runs as the unprivileged `node` user, includes only production dependencies and the compiled application/schema, and initializes PostgreSQL on startup. Supply database settings to the container at runtime; `.env` files and credentials are not copied into the image.
