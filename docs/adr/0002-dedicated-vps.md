# ADR 0002: Dedicated VPS Isolation

## Status
Accepted

## Context
Ddotsmedia operates shared infrastructure on srv988590, but the Business Portal is a separate product line requiring independent lifecycle management.

## Decision
The Business Portal is **never deployed to srv988590**. It runs on dedicated infrastructure determined in Phase 1.

## Consequences
- Independent scaling, secret rotation, and incident response
- No shared resource contention with legacy systems
- Separate monitoring, logs, and backups
- Deployment workflow (CI/CD) can be optimized for this app's needs
