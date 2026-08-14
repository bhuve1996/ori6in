# ORI6IN Architecture

## Stack
- **Web:** Next.js (App Router) — public site + role portals
- **API:** NestJS — feature modules
- **Monorepo:** pnpm + Turborepo
- **Default DB:** PostgreSQL
- **Alternate DB:** MongoDB (same repository ports)
- **Queue:** Redis + BullMQ
- **Storage:** S3-compatible
- **Payments:** Razorpay / Stripe adapters

## Layer rules
1. Controllers validate HTTP and call feature services.
2. Feature services contain business rules and depend only on **repository ports**.
3. `packages/db` provides Postgres and Mongo adapters + `DATABASE_DRIVER` factory.
4. Switching DB = change env. Feature code must not import driver SDKs.

## Env
```bash
DATABASE_DRIVER=postgres   # or mongo
DATABASE_URL=...
REDIS_URL=...
```

## Apps
- `apps/web` — Next.js
- `apps/api` — NestJS

## Packages
- `packages/shared` — DTOs, roles, schemas
- `packages/db` — ports + adapters + factory
- `packages/config` — typed env
- `packages/ui` — shared UI primitives
