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
- `packages/ui` — shared UI primitives (Button, Card, Badge, tiles) styled with Tailwind tokens from `apps/web`

## Web UI layering
1. `@ori6in/ui` — design-system primitives
2. `apps/web/src/components/cards` — product cards (`ProgramCard`, `MentorCard`, `BlogCard`, `MediaStepCard`)
3. `apps/web/src/services/public-content` — public catalog/CMS reads (DRY over `publicFetch`)
4. Route pages compose cards + services; avoid re-implementing card markup per page
5. Motion (`motion/react`) — intentional entrance/hover animations via `MotionConfig reducedMotion="user"`
6. Styles — `apps/web/src/app/globals.css` is a thin barrel; rules live in `apps/web/src/styles/`. Prefer Tailwind `@utility` in `utilities.css` (`btn`, `btn-accent`, `page`, `cta-row`, `meta`, `type-*`, `surface-tile*`) for shared chrome. Keep `home.css` / `marketing.css` for cinematic layouts until those sections are componentized.
