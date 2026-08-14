# syntax=docker/dockerfile:1
# Build from monorepo root:
#   docker build -f apps/api/Dockerfile -t ori6in-api .

FROM node:20-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY apps/api ./apps/api
COPY packages/config ./packages/config
COPY packages/db ./packages/db
COPY packages/shared ./packages/shared
RUN pnpm --filter @ori6in/api... build \
  && pnpm --filter @ori6in/api deploy --prod /out

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
RUN groupadd -r ori6in && useradd -r -g ori6in ori6in
COPY --from=build --chown=ori6in:ori6in /out ./
USER ori6in
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3001)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/main.js"]
