# ADR 0003: Row-Level Security for Tenant Isolation

## Status
Accepted (Phase 1 implementation)

## Context
Multi-tenant data must be isolated at the database level, not just application logic.

## Decision
We will implement Postgres Row-Level Security (RLS) in Phase 1, using an `app.tenant_id` session variable set by the application layer before each query.

## Consequences
- **Phase 0**: Single tenant schema without RLS; data is logically isolated
- **Phase 1**: Enable RLS policies that enforce `tenant_id` on all tables
- **No app-level filtering needed**: Database enforces isolation automatically
- **Testable**: RLS can be verified with test queries from different session contexts
