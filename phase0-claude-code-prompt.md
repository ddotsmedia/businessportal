# Ddotsmedia Business Portal — Phase 0 (Claude Code prompt)
Model: Haiku. Repo: https://github.com/ddotsmedia/businessportal (empty, branch main).
Run from: "C:\websites\business portal" (path has a space — always quote it). If folder missing or has no .git: `git clone https://github.com/ddotsmedia/businessportal.git "C:\websites\business portal"`; if folder exists with files but no .git: `git init -b main` + `git remote add origin https://github.com/ddotsmedia/businessportal.git` (never delete existing files). Work inside it. First commit goes to main.

## Rules
- 100% autonomous. Zero questions. Make reasonable decisions and record them in docs/adr/.
- Token reduction: concise commands, minimal output, no re-explaining, inline comments over long docs, minimal diffs, no full-file rewrites after creation.
- LOCAL ONLY. Do NOT SSH, deploy, or touch any server. srv988590 is out of scope for this project, permanently.
- Never claim success unless the command actually ran and passed. Paste real output tails in the final report.
- No mock data in app code. Seed data only in packages/db/seed.ts (dev only).

## Goal
Empty but production-shaped monorepo: web app + worker + DB package, Postgres in Docker, health check, tests, CI. Exit gate: `pnpm lint && pnpm typecheck && pnpm test && pnpm build` pass locally, `docker compose up` serves `GET http://localhost:3100/api/health` → 200 `{"status":"ok","db":"ok"}`.

## Stack (pin exact versions in package.json)
Node 22 LTS, pnpm 9 workspaces, TypeScript strict, Next.js 15 App Router, Prisma 6 + PostgreSQL 16, pg-boss 10 (queue in Postgres, NO Redis), Zod, Vitest, Playwright, ESLint + Prettier, Tailwind 4 + shadcn/ui.

## Files to create
```
package.json                 # workspaces, scripts: dev, lint, typecheck, test, build, db:migrate, db:seed
pnpm-workspace.yaml          # apps/*, packages/*
.nvmrc                       # 22
.gitignore                   # node_modules, .env*, !.env.example, .next, dist, coverage
.env.example                 # NODE_ENV, APP_URL=http://localhost:3100, DATABASE_URL=postgresql://portal:portal@localhost:5433/portal, AUTH_SECRET=change-me, EMAIL_PROVIDER=log, EMAIL_FROM, S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY, LOG_LEVEL=info, SENTRY_DSN=
docker-compose.yml           # project name: portal; services: db (postgres:16-alpine, host port 5433, volume portal_db, healthcheck pg_isready), web (port 3100:3000), worker; all: mem_limit, logging max-size 50m max-file 3, restart unless-stopped
apps/web/                    # Next.js; src/app/page.tsx (simple branded placeholder home, no fake features)
apps/web/src/app/api/health/route.ts   # SELECT 1 via Prisma → {status, db, version}; 503 if DB down
apps/web/src/env.ts          # Zod-validated env; throw at startup if required vars missing in production
apps/web/Dockerfile          # multi-stage, output: 'standalone', non-root user, HEALTHCHECK curl /api/health
apps/worker/src/index.ts     # starts pg-boss, registers 'heartbeat' job every 5 min that logs; graceful SIGTERM
apps/worker/Dockerfile
packages/db/prisma/schema.prisma  # only: Tenant(id uuid v7, name, slug unique, createdAt, updatedAt). No other models yet.
packages/db/src/index.ts     # PrismaClient singleton export
packages/db/seed.ts          # 1 tenant "Ddotsmedia" (dev only)
packages/core/src/index.ts   # empty module barrel; folders: customers/, quotations/, contracts/ with README one-liner each
packages/ui/                 # shadcn init, tokens in tailwind theme (colors, radius, spacing); Button component only
docs/adr/0001-modular-monolith.md   # Next.js + worker + Postgres; why no NestJS/Redis
docs/adr/0002-dedicated-vps.md      # portal never runs on srv988590
docs/adr/0003-rls-tenant-isolation.md # RLS planned in Phase 1 via app.tenant_id session var
docs/README.md               # exact setup commands (Windows PowerShell, quoted path "C:\websites\business portal"), ports, scripts
.github/workflows/ci.yml
.github/workflows/deploy.yml
```

## Tests (must pass)
- packages/db: vitest integration test → connects, creates + reads a Tenant, cleans up.
- apps/web: vitest test for env.ts (missing var in production throws).
- apps/web: Playwright smoke → GET /api/health returns 200; home page renders title "Ddotsmedia Business Portal".

## .github/workflows/ci.yml
- on: pull_request, push (all branches)
- service container postgres:16-alpine (port 5432, user/pass portal)
- steps: checkout → pnpm/action-setup → setup-node 22 with pnpm cache → `pnpm install --frozen-lockfile` → `pnpm db:migrate` (prisma migrate deploy) → lint → typecheck → test → build → `docker build` both images (no push)
- concurrency group per branch, cancel-in-progress

## .github/workflows/deploy.yml (written now, DISABLED until VPS exists)
- on: push to main, workflow_dispatch(input: environment staging|production)
- every job: `if: vars.DEPLOY_ENABLED == 'true'`
- job build: build + push `ghcr.io/ddotsmedia/businessportal-web:<sha>` and `ghcr.io/ddotsmedia/businessportal-worker:<sha>` (GITHUB_TOKEN, packages: write)
- job deploy-staging (needs build): appleboy/ssh-action with secrets VPS_HOST, VPS_USER, VPS_SSH_KEY, VPS_PORT → `cd /srv/portal-staging && IMAGE_TAG=<sha> docker compose pull && docker compose run --rm web pnpm db:migrate && docker compose up -d` → curl health with 10 retries, fail job if not 200
- job deploy-production: workflow_dispatch only, GitHub environment `production` (required reviewer), same steps in /srv/portal-prod; on failed health check redeploy previous tag stored in /srv/portal-prod/.last_good_tag
- comment block at top listing required secrets/vars

## Steps
1. Scaffold files above. 2. `pnpm install`. 3. `docker compose up -d db`. 4. `pnpm db:migrate` (create init migration) + `pnpm db:seed`. 5. Run lint, typecheck, test, build; fix until green. 6. `docker compose up -d --build`; curl http://localhost:3100/api/health. 7. Run Playwright smoke. 8. `docker compose down` (keep volume). 9. git add, commit "chore: phase 0 scaffold", push to main.

## Final report (short)
Files created (tree), commands run with pass/fail and last 5 lines of output, health response JSON, CI run URL/status after push, known issues, next = Phase 1 (auth, tenants, memberships, roles, RLS, audit log, app shell).
