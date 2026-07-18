# Risk Register

| Risk | Evidence | File anchors | Impact | Likelihood | Suggested test | Suggested fix | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hard-coded frontend API base URL | literal URL in client | [`../../frontend/src/api/client.ts#L1-L1`](../../frontend/src/api/client.ts#L1-L1) | environment breakage | High | build and run in alternate host env | move to Vite env config | High |
| RBAC not exercised by routes yet | middleware exists but no route usage beyond auth middleware | [`../../backend/src/middleware/requirePermission.middleware.ts#L6-L18`](../../backend/src/middleware/requirePermission.middleware.ts#L6-L18) | future auth gaps | Medium | add protected sample route tests | adopt permission middleware in feature routes | High |
| Refresh token expiry drift | DB expiry is hard-coded | [`../../backend/src/modules/auth/auth.service.ts#L94-L94`](../../backend/src/modules/auth/auth.service.ts#L94-L94) | session inconsistency | Medium | login + refresh expiry contract test | derive DB expiry from config | High |
| Unvalidated local-storage parse | direct cast from parsed JSON | [`../../frontend/src/auth/auth.store.ts#L34-L35`](../../frontend/src/auth/auth.store.ts#L34-L35) | boot/runtime bugs | Medium | malformed storage hydration test | validate storage payload | High |
| Seed script partial failure | many writes, no outer transaction | [`../../backend/prisma/seed.ts#L7-L437`](../../backend/prisma/seed.ts#L7-L437) | broken local dev state | Medium | intentionally fail mid-seed | wrap in transaction where feasible | Medium |
| Redis drift | Redis service exists, no app usage | [`../../docker-compose.yml#L19-L28`](../../docker-compose.yml#L19-L28) | ops confusion | Low | doc review | remove or implement queue use | High |
