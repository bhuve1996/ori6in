# syntax=docker/dockerfile:1
# Build from monorepo root:
#   docker build -f apps/web/Dockerfile -t ori6in-web \
#     --build-arg NEXT_PUBLIC_SITE_URL=https://example.com \
#     --build-arg NEXT_PUBLIC_API_URL=https://api.example.com/api .

FROM node:20-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
RUN pnpm install --frozen-lockfile

FROM deps AS build
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_API_URL=http://localhost:3001/api
ARG NEXT_PUBLIC_COMING_SOON=false
# Bumped every deploy so browsers clear soft-launch cookies / client storage.
ARG NEXT_PUBLIC_DEPLOY_ID=
ARG RAILWAY_GIT_COMMIT_SHA=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_COMING_SOON=$NEXT_PUBLIC_COMING_SOON
ENV NEXT_TELEMETRY_DISABLED=1
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui
RUN DEPLOY_ID="${NEXT_PUBLIC_DEPLOY_ID:-${RAILWAY_GIT_COMMIT_SHA:-}}" \
  && if [ -z "$DEPLOY_ID" ]; then DEPLOY_ID="b$(date -u +%Y%m%d%H%M%S)"; fi \
  && export NEXT_PUBLIC_DEPLOY_ID="$DEPLOY_ID" \
  && echo "NEXT_PUBLIC_DEPLOY_ID=$NEXT_PUBLIC_DEPLOY_ID" \
  && pnpm --filter @ori6in/shared build \
  && pnpm --filter @ori6in/web build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
RUN groupadd -r ori6in && useradd -r -g ori6in ori6in

COPY --from=build --chown=ori6in:ori6in /app/apps/web/public ./apps/web/public
COPY --from=build --chown=ori6in:ori6in /app/apps/web/.next/standalone ./
COPY --from=build --chown=ori6in:ori6in /app/apps/web/.next/static ./apps/web/.next/static

USER ori6in
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
