# Runtime And Tooling Map

## Package And Build Tooling

| Tool | Evidence | Role |
| --- | --- | --- |
| npm workspaces | [`package.json#L4-L5`](../../package.json#L4-L5) | root coordination across backend and frontend |
| TypeScript | [`backend/package.json#L42-L44`](../../backend/package.json#L42-L44), [`frontend/package.json#L32-L34`](../../frontend/package.json#L32-L34) | static typing and build |
| Vite | [`frontend/package.json#L7-L8`](../../frontend/package.json#L7-L8), [`frontend/vite.config.ts#L1-L6`](../../frontend/vite.config.ts#L1-L6) | frontend dev server and build |
| Vitest | [`backend/package.json#L12-L12`](../../backend/package.json#L12-L12), [`frontend/package.json#L11-L11`](../../frontend/package.json#L11-L11) | tests |
| ESLint | [`backend/package.json#L11-L11`](../../backend/package.json#L11-L11), [`frontend/package.json#L10-L10`](../../frontend/package.json#L10-L10) | lint checks |
| Prisma | [`backend/package.json#L13-L15`](../../backend/package.json#L13-L15) | schema, client generation, seeding |
| Docker Compose | [`docker-compose.yml#L1-L31`](../../docker-compose.yml#L1-L31) | local Postgres and Redis |

## Runtime Boundaries

| Runtime | Files | Mental model |
| --- | --- | --- |
| Browser/React | [`frontend/src/main.tsx#L9-L15`](../../frontend/src/main.tsx#L9-L15) | stateful UI with router and query provider |
| Node/Express | [`backend/src/server.ts#L5-L17`](../../backend/src/server.ts#L5-L17) | long-running HTTP server |
| DB client | [`backend/src/db/prisma.ts#L7-L15`](../../backend/src/db/prisma.ts#L7-L15) | shared Prisma client across requests |
| Local infra | [`docker-compose.yml#L2-L28`](../../docker-compose.yml#L2-L28) | external services required for full local boot |

## Environment Variables

The contract is defined in [`backend/src/config/env.ts#L19-L31`](../../backend/src/config/env.ts#L19-L31) and echoed in the root `.env.example` referenced by [`README.md#L18-L29`](../../README.md#L18-L29).

High-level meaning:

- `DATABASE_URL`: PostgreSQL connection string.
- `REDIS_URL`: currently provisioned but not consumed by app code.
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`: token signing keys.
- `JWT_ACCESS_EXPIRES_IN` and `JWT_REFRESH_EXPIRES_IN`: intended token durations.
- `PORT`: backend listen port.
- `FRONTEND_URL`: allowed CORS origin.

## Tooling Sharp Edges

- The frontend API base URL is hard-coded in [`frontend/src/api/client.ts#L1-L1`](../../frontend/src/api/client.ts#L1-L1) instead of reading an env var.
- Test-time env fallbacks exist in [`backend/src/config/env.ts#L4-L17`](../../backend/src/config/env.ts#L4-L17), which is convenient but can hide missing config if overused.
- Redis is available in Docker but absent from runtime code, so “Redis-connected system” would be an overclaim today.
