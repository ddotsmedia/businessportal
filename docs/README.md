# Ddotsmedia Business Portal - Setup Guide

## Prerequisites
- Node 22 LTS
- pnpm 9+
- Docker Desktop
- PowerShell (on Windows)

## Windows PowerShell Setup

```powershell
# Navigate to the project folder (note the quoted path with a space)
cd "C:\websites\business portal"

# Install dependencies
pnpm install

# Start the database (runs on port 5433)
docker compose up -d db

# Wait for the database to be healthy, then run migrations
pnpm db:migrate

# Seed the database with initial data
pnpm db:seed

# Run linting, type checking, tests, and build
pnpm lint
pnpm typecheck
pnpm test
pnpm build

# Start all services (web on 3100, worker runs in background)
docker compose up -d --build

# Check the health endpoint
curl http://localhost:3100/api/health

# Expected response:
# {"status":"ok","db":"ok","version":"0.0.1"}
```

## Key Ports
- **3100**: Web app (mapped from container 3000)
- **5433**: PostgreSQL (mapped from container 5432)

## Available Scripts

### Root workspace
- `pnpm dev` — Start all services in dev mode (web, worker)
- `pnpm build` — Build all packages
- `pnpm lint` — Lint TypeScript files
- `pnpm typecheck` — Type check without emitting
- `pnpm test` — Run Vitest suite
- `pnpm db:migrate` — Prisma migrate deploy
- `pnpm db:seed` — Seed the database

### Per-app
- `pnpm -F @businessportal/web dev` — Start Next.js dev server
- `pnpm -F @businessportal/worker dev` — Start worker with file watching
- `pnpm -F @businessportal/db prisma studio` — Open Prisma Studio

## Docker Compose Services

- **db**: postgres:16-alpine, healthcheck with `pg_isready`
- **web**: Next.js standalone build, curl healthcheck
- **worker**: pg-boss background job processor

## Health Check
The web service exposes `GET /api/health` which:
1. Runs `SELECT 1` via Prisma
2. Returns `{"status":"ok","db":"ok","version":"0.0.1"}` on success
3. Returns 503 with error details if the database is down

## Next Steps
- Phase 1: Authentication, tenant management, RLS, and audit logging
- Phase 2: Business logic (quotations, contracts, customers)
