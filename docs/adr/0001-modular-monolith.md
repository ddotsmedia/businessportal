# ADR 0001: Modular Monolith Architecture

## Status
Accepted

## Context
The Ddotsmedia Business Portal requires a production-shaped architecture that scales with complexity while maintaining developer experience.

## Decision
We chose a modular monolith with these components:
- **Next.js 15** app router for web frontend and API routes
- **pg-boss** for async job processing (uses PostgreSQL, no external Redis)
- **Postgres 16** as the single persistent datastore with Row-Level Security (Phase 1)
- **pnpm workspaces** for monorepo organization

## Consequences
- **Simple deployment**: Single Docker Compose stack with 3 services (db, web, worker)
- **No microservice complexity**: Monolith can be split later if needed
- **In-process job queue**: pg-boss eliminates Redis ops cost, jobs are durable in the database
- **Type safety**: Shared TypeScript packages with Zod validation
