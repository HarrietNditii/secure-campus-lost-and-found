# Secure Campus Lost and Found System

## Project Overview

The Secure Campus Lost and Found System is a responsive web application for university students and staff to report lost belongings, register found items, and search campus reports. Each report includes a title, description, category, location, report date, and contact information.

The application currently provides public item reporting and browsing. User accounts, claim workflows, and administrative review are future work.

## Technology Stack

- **Frontend:** React 19, TypeScript 6, Vite 8
- **Frontend web server:** Nginx
- **Backend:** Node.js, Express 5, TypeScript
- **Database:** PostgreSQL 16
- **Containers:** Docker and Docker Compose
- **Quality checks:** ESLint, TypeScript builds, Node.js test runner

## Application Architecture

```text
Browser
  │ http://localhost:8080
  ▼
Frontend container (Nginx + React SPA)
  │ /api requests
  ▼
Backend container (Express, port 3000)
  │ parameterized SQL over the Compose network
  ▼
PostgreSQL container (port 5432, internal)
  │
  ▼
Named volume: postgres_data
```

Compose runs the `frontend`, `backend`, and `db` services on a dedicated network. Nginx serves the frontend and proxies `/api` requests to the backend service. The backend initializes the schema and waits for PostgreSQL to be healthy before accepting traffic. The database uses the `postgres_data` named volume so records survive container restarts and recreation.

## Prerequisites

- Docker Engine (or Docker Desktop) with the Docker Compose plugin.
- Git, if cloning the repository.
- Node.js and npm only for running frontend/backend checks or developing outside Docker.

## Environment Configuration

From the repository root, create a local environment file if one does not already exist:

```powershell
if (!(Test-Path .env)) { Copy-Item .env.example .env }
```

Set `POSTGRES_PASSWORD` in `.env` to a strong local-only value before starting the stack. The template also defines:

| Variable | Purpose | Default |
| --- | --- | --- |
| `POSTGRES_DB` | Application database name | `secure_campus_lost_found` |
| `POSTGRES_USER` | Application database user | `campus_app` |
| `POSTGRES_PASSWORD` | Local database password | Replace the example value |
| `FRONTEND_PORT` | Host port for the frontend | `8080` |
| `BACKEND_PORT` | Host port for direct backend access | `3000` |

The root `.env` is ignored by Git. Do not commit it or put production credentials in source files or container images.

## Docker Deployment

Run these commands from the repository root:

```powershell
docker compose config
docker compose up --build -d
docker compose ps
```

The frontend is available at [http://localhost:8080](http://localhost:8080). The API health check can be reached directly at [http://localhost:3000/api/health](http://localhost:3000/api/health) or through the frontend proxy at [http://localhost:8080/api/health](http://localhost:8080/api/health).

The named `postgres_data` volume stores PostgreSQL's data directory outside the database container. Normal container restarts and `docker compose down` preserve this volume. Do not use `docker compose down -v` if the database records must be retained.

## API Endpoints

All endpoints use the `/api` base path. The backend is directly available on host port `3000`; the same paths are proxied by the frontend.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Reports API and database connectivity |
| `GET` | `/api/items` | Lists items; supports filters described below |
| `GET` | `/api/items/:id` | Retrieves one item by UUID |
| `POST` | `/api/items` | Creates an item |
| `PUT` | `/api/items/:id` | Replaces an item's report fields |
| `DELETE` | `/api/items/:id` | Deletes an item |

`GET /api/items` supports these query parameters:

- `type=lost` or `type=found`
- `category=<category>`
- `search=<text>` (also accepted as `q=<text>`); searches the title, description, and location

The create and update request body is JSON. `type`, `title`, `description`, `category`, `location`, `contactName`, and `contactEmail` are required. `status` is optional and may be `open`, `claimed`, `returned`, or `closed`.

```json
{
  "type": "lost",
  "title": "Blue notebook",
  "description": "Blue notebook with a campus sticker",
  "category": "Books & stationery",
  "location": "Main library",
  "contactName": "Campus member",
  "contactEmail": "member@example.edu"
}
```

Successful reads and updates return `200`, creates return `201`, and deletes return `204`. Invalid input returns `400`; a syntactically valid but unknown item UUID returns `404`.

## Testing and Local Quality Checks

Install dependencies and run the available checks from each project directory:

```powershell
Set-Location frontend
npm ci
npm run lint
npm run build

Set-Location ..\backend
npm ci
npm test
npm run lint
npm run build
```

The backend tests cover request validation and do not require a running database. The full application requires the PostgreSQL service; use `docker compose up --build -d` to run the integrated stack. The frontend Vite development server proxies `/api` to `http://localhost:3000`.

## Container Management

Run these commands from the repository root:

```powershell
docker compose ps                         # Service and health status
docker compose logs -f                    # Follow logs from all services
docker compose logs -f backend            # Follow one service
docker compose restart backend            # Restart a service
docker compose stop                       # Stop services and keep containers
docker compose start                      # Start stopped services
docker compose down                       # Remove the stack, preserve named data volume
```

To inspect database records interactively:

```powershell
docker compose exec db sh -lc 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Avoid `docker compose down -v` and volume-pruning commands unless deleting the database is intentional.

## Objectives

- Report lost and found items.
- Browse and search campus reports.
- Filter reports by category and lost/found type.
- Maintain traceability of changes through Git and GitHub.

## Software Configuration Management

This project uses GitHub Flow. The `main` branch contains the stable version, while short-lived feature and bug-fix branches are used to develop changes.

Issues will track requirements and defects. Pull requests will document proposed changes, and testing will be performed before merging into `main`.

## Project Status

The local Docker Compose deployment includes the React frontend, Express API, and PostgreSQL database. The API supports item CRUD, validation, search, and filtering. Authentication, claims, and administrator review are not implemented yet.

## Future Features

1. Ownership claim workflows.
2. Administrator review and listing management.
3. Authentication and authorization.
4. Automated CI and deployment.

## Author

Student Software Engineering Project
