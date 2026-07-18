# System Map

## Repo Shape

This is a two-workspace monorepo defined in [`package.json#L1-L23`](../../package.json#L1-L23).

```text
buildCRMPYJS/
├─ backend/
│  ├─ prisma/        # schema and seed data
│  └─ src/           # Express app, auth, shared utils, middleware
├─ frontend/
│  └─ src/           # React app shell, router, auth UI/store, API wrapper
├─ docker-compose.yml
├─ README.md
└─ docs/upskill/     # this curriculum
```

## Ownership Map

| Area | Primary files | What it owns | What it should not own |
| --- | --- | --- | --- |
| Root workspace | [`package.json#L6-L20`](../../package.json#L6-L20) | cross-workspace scripts | backend or frontend business logic |
| Backend HTTP shell | [`backend/src/app.ts#L13-L66`](../../backend/src/app.ts#L13-L66) | middleware, route mounting, error translation | password logic, token persistence, domain rules |
| Backend startup | [`backend/src/server.ts#L5-L17`](../../backend/src/server.ts#L5-L17) | connect Prisma, start listener, fail fast | request handling |
| Auth transport | [`backend/src/modules/auth/auth.routes.ts#L26-L32`](../../backend/src/modules/auth/auth.routes.ts#L26-L32), [`backend/src/modules/auth/auth.controller.ts#L5-L32`](../../backend/src/modules/auth/auth.controller.ts#L5-L32) | validation wiring and HTTP responses | core auth decisions |
| Auth domain logic | [`backend/src/modules/auth/auth.service.ts#L32-L167`](../../backend/src/modules/auth/auth.service.ts#L32-L167) | register/login/refresh/logout/me behavior | Express response objects |
| Persistence model | [`backend/prisma/schema.prisma#L10-L345`](../../backend/prisma/schema.prisma#L10-L345) | entity shape, relations, indexes | HTTP concerns |
| Local data bootstrap | [`backend/prisma/seed.ts#L1-L437`](../../backend/prisma/seed.ts#L1-L437) | sample data creation | runtime auth flow |
| Frontend routing | [`frontend/src/app/router.tsx#L7-L21`](../../frontend/src/app/router.tsx#L7-L21) | public vs protected route tree | data fetching logic |
| Frontend auth state | [`frontend/src/auth/auth.store.ts#L37-L63`](../../frontend/src/auth/auth.store.ts#L37-L63) | client session persistence | server-side permission checks |
| Frontend API boundary | [`frontend/src/api/client.ts#L9-L29`](../../frontend/src/api/client.ts#L9-L29) | fetch wrapper, header shape, error normalization | page rendering |

## Public Interfaces

### Public runtime interfaces

- Backend HTTP endpoints:
  - `/health` and `/health/db` in [`backend/src/app.ts#L23-L41`](../../backend/src/app.ts#L23-L41)
  - `/api/auth/*` mounted in [`backend/src/app.ts#L51-L51`](../../backend/src/app.ts#L51-L51)
- Frontend browser routes:
  - `/login` and `/` in [`frontend/src/app/router.tsx#L7-L21`](../../frontend/src/app/router.tsx#L7-L21)
- Database schema contract:
  - Prisma models and enums in [`backend/prisma/schema.prisma#L10-L345`](../../backend/prisma/schema.prisma#L10-L345)

### Private internals

- Token hashing helper in [`backend/src/modules/auth/auth.service.ts#L10-L12`](../../backend/src/modules/auth/auth.service.ts#L10-L12)
- Prisma singleton details in [`backend/src/db/prisma.ts#L3-L15`](../../backend/src/db/prisma.ts#L3-L15)
- Local storage persistence details in [`frontend/src/auth/auth.store.ts#L13-L35`](../../frontend/src/auth/auth.store.ts#L13-L35)

## Runtime Surfaces

| Surface | Evidence | Notes |
| --- | --- | --- |
| Browser | [`frontend/src/main.tsx#L9-L15`](../../frontend/src/main.tsx#L9-L15) | React app bootstraps into `#root`. |
| Node API | [`backend/src/server.ts#L5-L17`](../../backend/src/server.ts#L5-L17) | Express app started after Prisma connects. |
| PostgreSQL | [`backend/prisma/schema.prisma#L5-L8`](../../backend/prisma/schema.prisma#L5-L8), [`docker-compose.yml#L2-L17`](../../docker-compose.yml#L2-L17) | Main persistence store. |
| Redis | [`docker-compose.yml#L19-L28`](../../docker-compose.yml#L19-L28) | Provisioned but unused by code today. |

## Senior Noticing

- Redis is provisioned but no job/queue code exists yet, so infrastructure intent is ahead of implementation.
- The frontend uses React Query provider setup in [`frontend/src/app/providers.tsx#L1-L8`](../../frontend/src/app/providers.tsx#L1-L8), but current pages do not use query hooks yet.
- The repo has schema and seed data, but no committed migration files were found under `backend/prisma/migrations`.

## Verification Notes

- Inspected root inventory with `rg --files -g "!node_modules"`.
- Inspected top-level repo shape with `Get-ChildItem -Force`.
- No `.git` metadata or CI workflow folder was present during inspection.
