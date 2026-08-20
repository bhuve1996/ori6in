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
- [Roadmap (Phase 2 focus / skips)](./docs/roadmap.md)
- [Demo logins](./docs/demo-logins.md) (temporary walkthrough accounts)
- [Deploy (Railway + Docker)](./docs/deploy-railway.md)
- Scope Decision Sheet: `docs/scope-decision-sheet/`

## Containers (local prod-like)

```bash
docker compose up -d postgres redis
docker compose -f docker-compose.app.yml up --build
```

See [docs/deploy-railway.md](./docs/deploy-railway.md) for Railway steps (portable Docker → GCP/AWS later).

## Production domains

| Domain | Role |
|--------|------|
| [https://ori6ineducation.com](https://ori6ineducation.com/) | Primary site (Railway web) |
| `ori6ineducation.in` | Forward to `.com` (GoDaddy domain forward, 301) |

### Railway DNS — `ori6ineducation.com` (apex)

Add these in DNS (Cloudflare recommended for `@`; GoDaddy cannot CNAME the root):

| Type | Name | Value |
|------|------|--------|
| CNAME | `@` | `dj1uxmjp.up.railway.app` |
| TXT | `_railway-verify` | `railway-verify=e076d0994f47f9de7c1438a3aabf611da0db87a68898d766d4fea610136fc592` |

### Railway DNS — `www.ori6ineducation.com`

These work on GoDaddy or Cloudflare:

| Type | Name | Value |
|------|------|--------|
| CNAME | `www` | `m8tci38b.up.railway.app` |
| TXT | `_railway-verify.www` | `railway-verify=a62798c8a87b35fb52576a20f1042ba6a3371e00b0fad53f09669a9a54f59f66` |

Env on Railway web (rebuild after change):

```bash
NEXT_PUBLIC_SITE_URL=https://ori6ineducation.com
NEXT_PUBLIC_COMING_SOON=true
```

API: set `WEB_URL=https://ori6ineducation.com`.

