# ADR 0004: Docker Daemon Availability

## Status
Accepted (environmental constraint)

## Context
Docker Desktop is required to run `docker compose up` for local development and final health check verification.

## Decision
- Scaffold creation uses `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` (all local, no Docker)
- Docker Compose serves as the integration environment for health checks
- If Docker is unavailable, the health check exit gate cannot be verified until Docker is started manually

## Consequences
- Phase 0 scaffolding can complete without Docker running
- Final health check requires Docker Desktop running
- Docker Daemon status is environmental, not project-specific
