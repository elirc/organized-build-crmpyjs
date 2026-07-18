# Boundaries And Layers

## Current Layers

| Layer | Files | Owns | Must not own |
| --- | --- | --- | --- |
| UI | [`frontend/src/App.tsx#L8-L30`](../../frontend/src/App.tsx#L8-L30), [`frontend/src/auth/LoginPage.tsx#L31-L56`](../../frontend/src/auth/LoginPage.tsx#L31-L56) | rendering and user interaction | DB access |
| Client state + transport | [`frontend/src/auth/auth.store.ts#L37-L63`](../../frontend/src/auth/auth.store.ts#L37-L63), [`frontend/src/api/client.ts#L9-L29`](../../frontend/src/api/client.ts#L9-L29) | persisted session, HTTP calls | core auth rules |
| API/transport | [`backend/src/modules/auth/auth.routes.ts#L10-L32`](../../backend/src/modules/auth/auth.routes.ts#L10-L32), [`backend/src/modules/auth/auth.controller.ts#L5-L32`](../../backend/src/modules/auth/auth.controller.ts#L5-L32) | validation wiring and HTTP responses | password verification logic |
| Application/service | [`backend/src/modules/auth/auth.service.ts#L32-L167`](../../backend/src/modules/auth/auth.service.ts#L32-L167) | auth rules and DB coordination | Express response construction |
| Persistence | [`backend/src/db/prisma.ts#L7-L15`](../../backend/src/db/prisma.ts#L7-L15), [`backend/prisma/schema.prisma#L10-L345`](../../backend/prisma/schema.prisma#L10-L345) | relational data access and model contract | UI behavior |
| Infra/config | [`backend/src/config/env.ts#L19-L31`](../../backend/src/config/env.ts#L19-L31), [`docker-compose.yml#L1-L31`](../../docker-compose.yml#L1-L31) | runtime config and local services | request semantics |

## Good Boundaries

- Controllers are thin and defer to services.
- The Prisma client is centralized.
- Auth identity is attached in middleware, not recomputed in every route.

## Boundary Leaks Or Near-Leaks

- Route-local `validateBody` in [`backend/src/modules/auth/auth.routes.ts#L10-L24`](../../backend/src/modules/auth/auth.routes.ts#L10-L24) is fine today but will duplicate quickly as feature count grows.
- Client auth persistence mixes storage I/O and state creation in [`frontend/src/auth/auth.store.ts#L15-L63`](../../frontend/src/auth/auth.store.ts#L15-L63).
- The frontend hard-codes the backend base URL in [`frontend/src/api/client.ts#L1-L1`](../../frontend/src/api/client.ts#L1-L1), which is a config concern leaking into transport code.

## Junior vs Senior Reading

- Junior: identify where one request crosses layers.
- Mid-level: identify where each layer converts data shape.
- Senior: identify where coupling would make change expensive later.
