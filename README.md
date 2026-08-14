# ORI6IN

Education and career platform monorepo (public website + student / mentor / admin portals).

## Quick start

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm --filter @ori6in/api dev
pnpm --filter @ori6in/web dev
```

- Web: http://localhost:3000
- API: http://localhost:3001

## Switch database

Set `DATABASE_DRIVER=postgres` or `DATABASE_DRIVER=mongo` in `.env`. Feature code uses repository ports only; adapters live in `packages/db`.

## Docs

- [Website Overview](./docs/website-overview.md)
- [Architecture](./docs/architecture.md)
- [MVP Checklist](./docs/mvp-checklist.md)
- [Demo logins](./docs/demo-logins.md) (temporary walkthrough accounts)
- [Deploy (Railway + Docker)](./docs/deploy-railway.md)
- Scope Decision Sheet: `docs/scope-decision-sheet/`

## Containers (local prod-like)

```bash
docker compose up -d postgres redis
docker compose -f docker-compose.app.yml up --build
```

See [docs/deploy-railway.md](./docs/deploy-railway.md) for Railway steps (portable Docker → GCP/AWS later).
