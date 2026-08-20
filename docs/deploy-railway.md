# Deploy ORI6IN (Railway + Docker)

Containers are portable: same images work on Railway now and Cloud Run / ECS / App Runner later.

## What was added

| Path | Purpose |
|------|---------|
| `apps/api/Dockerfile` | Nest API image |
| `apps/web/Dockerfile` | Next.js standalone image |
| `apps/api/railway.toml` | Railway API service config |
| `apps/web/railway.toml` | Railway web service config |
| `docker-compose.app.yml` | Local prod-like containers |
| `.dockerignore` | Smaller / safer builds |
| `GET /api/health` | Health check for orchestrators |

## Local container smoke test

```bash
# Infra
docker compose up -d postgres redis

# Apps (API + web)
docker compose -f docker-compose.app.yml up --build
```

- Web: http://localhost:3000  
- API health: http://localhost:3001/api/health  

## Railway setup (recommended)

### 1. Create project

1. Push this repo to GitHub.
2. [Railway](https://railway.app) → **New Project** → **Deploy from GitHub repo**.

### 2. Add Postgres + Redis

In the same Railway project:

1. **+ New** → **Database** → **PostgreSQL**
2. **+ New** → **Database** → **Redis**

Copy their connection URLs (or use Railway variable references).

### 3. API service

1. **+ New** → **GitHub Repo** (same repo) → service name `api`
2. Settings:
   - **Root Directory:** empty / `.` (monorepo root)
   - **Config file:** `apps/api/railway.toml`  
     (or set Dockerfile path to `apps/api/Dockerfile` manually)
3. Variables:

```bash
NODE_ENV=production
PORT=3001
WEB_URL=https://YOUR-WEB-DOMAIN
API_URL=https://YOUR-API-DOMAIN
DATABASE_DRIVER=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
ENABLE_DEMO_LOGINS=true
```

Use Railway’s variable references for DB/Redis if the UI offers them (names may differ slightly).

4. Generate a public domain for the API service (Settings → Networking → Generate Domain).
5. Confirm `https://YOUR-API-DOMAIN/api/health` returns `{ "ok": true }`.

### 4. Web service (on Railway)

1. Another service from the same repo → name `web`
2. Config file: `apps/web/railway.toml`
3. **Docker build args** (Railway → Variables / Build args):

```bash
NEXT_PUBLIC_SITE_URL=https://YOUR-WEB-DOMAIN
NEXT_PUBLIC_API_URL=https://YOUR-API-DOMAIN/api
NEXT_PUBLIC_COMING_SOON=true
```

These are baked in at **build** time — set them before the first successful web build.

Coming soon mode: with `NEXT_PUBLIC_COMING_SOON=true`, **every** public route redirects to `/coming-soon`. Brand assets under `/brand/` return 404 while locked.

Override with query param (sets a cookie):

- `?comingSoon=0` — show full site  
- `?comingSoon=1` — force coming soon  
- `?comingSoon=clear` — clear cookie, use env again  

Turn soft launch off for everyone by setting `NEXT_PUBLIC_COMING_SOON=false` and redeploying web.

Notify form emails go to `COMING_SOON_NOTIFY_TO` (default `rishi@ori6ineducation.com`). Configure **one** of:

```bash
# Resend
RESEND_API_KEY=re_...
NOTIFY_FROM_EMAIL=ORI6IN <noreply@your-domain.com>

# or SMTP (e.g. Google Workspace)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=rishi@ori6ineducation.com
SMTP_PASS=your-app-password
NOTIFY_FROM_EMAIL=ORI6IN <rishi@ori6ineducation.com>
```

These are **runtime** vars on the web service (not build args).

4. Runtime env (optional):

```bash
PORT=3000
HOSTNAME=0.0.0.0
NODE_ENV=production
```

5. Generate a public domain for web, then set `WEB_URL` on the API to that exact origin (CORS).

### 5. Wire CORS

API CORS allows only `WEB_URL`. After both domains exist:

1. Set API `WEB_URL` = web public URL (no trailing slash)
2. Redeploy API if needed
3. Hard-refresh the site and test login / demo login

## Web on Vercel instead

Also fine: keep API on Railway, put `apps/web` on Vercel.

Vercel env:

```bash
NEXT_PUBLIC_SITE_URL=https://YOUR-VERCEL-DOMAIN
NEXT_PUBLIC_API_URL=https://YOUR-API-DOMAIN/api
```

Then set API `WEB_URL` to the Vercel URL.

## Switching later (GCP / AWS)

Same Dockerfiles:

```bash
# API
docker build -f apps/api/Dockerfile -t ori6in-api .

# Web
docker build -f apps/web/Dockerfile -t ori6in-web \
  --build-arg NEXT_PUBLIC_SITE_URL=https://... \
  --build-arg NEXT_PUBLIC_API_URL=https://.../api .
```

Push to Artifact Registry / ECR, then:

- **GCP:** Cloud Run (API + web) + Cloud SQL + Memorystore/Upstash  
- **AWS:** App Runner or ECS/Fargate + RDS + ElastiCache/Upstash  

No app rewrite required — only env vars and networking.

## Build commands (reference)

```bash
docker build -f apps/api/Dockerfile -t ori6in-api .
docker build -f apps/web/Dockerfile -t ori6in-web \
  --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001/api .
```
