# File Reading Order

## Junior Path

| Order | File | Why it matters | What to look for | Do not get distracted by |
| --- | --- | --- | --- | --- |
| 1 | [`package.json#L1-L23`](../../package.json#L1-L23) | repo entry point | workspaces and root scripts | version fields |
| 2 | [`backend/package.json#L6-L16`](../../backend/package.json#L6-L16) | backend commands | dev/build/test/Prisma scripts | dependency versions |
| 3 | [`frontend/package.json#L6-L12`](../../frontend/package.json#L6-L12) | frontend commands | dev/build/test flow | dependency versions |
| 4 | [`docker-compose.yml#L1-L31`](../../docker-compose.yml#L1-L31) | local infra map | Postgres and Redis roles | Docker syntax details |
| 5 | [`backend/src/server.ts#L5-L17`](../../backend/src/server.ts#L5-L17) | backend boot flow | connect then listen | console logging |
| 6 | [`backend/src/app.ts#L13-L66`](../../backend/src/app.ts#L13-L66) | HTTP shell | middleware, routes, error handling | styling of JSON payloads |
| 7 | [`backend/src/modules/auth/auth.routes.ts#L10-L32`](../../backend/src/modules/auth/auth.routes.ts#L10-L32) | request boundary | validation and mounted endpoints | TypeScript generics |
| 8 | [`backend/src/modules/auth/auth.controller.ts#L5-L32`](../../backend/src/modules/auth/auth.controller.ts#L5-L32) | controller role | thin transport layer | how trivial it looks |
| 9 | [`backend/src/modules/auth/auth.service.ts#L32-L167`](../../backend/src/modules/auth/auth.service.ts#L32-L167) | real backend logic | where rules live | implementation details before flow shape |
| 10 | [`backend/prisma/schema.prisma#L10-L152`](../../backend/prisma/schema.prisma#L10-L152) | business data model | users, leads, companies, contacts, opportunities | every optional field |
| 11 | [`frontend/src/main.tsx#L1-L15`](../../frontend/src/main.tsx#L1-L15) | frontend boot flow | providers and router | CSS import |
| 12 | [`frontend/src/app/router.tsx#L7-L21`](../../frontend/src/app/router.tsx#L7-L21) | route shape | `/login` vs protected `/` | JSX formatting |
| 13 | [`frontend/src/auth/RequireAuth.tsx#L5-L13`](../../frontend/src/auth/RequireAuth.tsx#L5-L13) | route guard | redirect condition | React Router API details |
| 14 | [`frontend/src/auth/LoginPage.tsx#L15-L29`](../../frontend/src/auth/LoginPage.tsx#L15-L29) | user action | submit path, error handling | visual markup |
| 15 | [`frontend/src/api/client.ts#L9-L29`](../../frontend/src/api/client.ts#L9-L29) | transport wrapper | header creation, error normalization | fetch syntax trivia |

## Mid-Level Path

Continue after the junior path:

16. [`backend/src/config/env.ts#L4-L31`](../../backend/src/config/env.ts#L4-L31) - environment contract and test defaults.
17. [`backend/src/db/prisma.ts#L3-L15`](../../backend/src/db/prisma.ts#L3-L15) - singleton client pattern.
18. [`backend/src/middleware/auth.middleware.ts#L6-L27`](../../backend/src/middleware/auth.middleware.ts#L6-L27) - request identity boundary.
19. [`backend/src/middleware/requirePermission.middleware.ts#L6-L18`](../../backend/src/middleware/requirePermission.middleware.ts#L6-L18) - authorization pattern.
20. [`backend/src/auth/permissions.ts#L1-L47`](../../backend/src/auth/permissions.ts#L1-L47) - RBAC table.
21. [`backend/src/shared/utils/jwt.ts#L18-L54`](../../backend/src/shared/utils/jwt.ts#L18-L54) - token issuance and verification.
22. [`backend/src/shared/utils/password.ts#L3-L10`](../../backend/src/shared/utils/password.ts#L3-L10) - password hashing boundary.
23. [`backend/src/shared/errors/AppError.ts#L1-L10`](../../backend/src/shared/errors/AppError.ts#L1-L10) - structured domain errors.
24. [`backend/src/shared/utils/asyncHandler.ts#L3-L8`](../../backend/src/shared/utils/asyncHandler.ts#L3-L8) - async error forwarding.
25. [`backend/prisma/seed.ts#L7-L437`](../../backend/prisma/seed.ts#L7-L437) - realistic sample scenarios.

## Senior Path

Open these with a risk-review mindset:

26. [`backend/src/modules/auth/auth.service.ts#L89-L95`](../../backend/src/modules/auth/auth.service.ts#L89-L95) - refresh token expiry is hard-coded in milliseconds rather than derived from env.
27. [`frontend/src/auth/auth.store.ts#L24-L35`](../../frontend/src/auth/auth.store.ts#L24-L35) - unvalidated JSON parse from local storage.
28. [`frontend/src/api/client.ts#L1-L1`](../../frontend/src/api/client.ts#L1-L1) - hard-coded API base URL instead of env-driven config.
29. [`backend/prisma/schema.prisma#L207-L220`](../../backend/prisma/schema.prisma#L207-L220) - `EmailLog.loggedById` has no relation defined yet.
30. [`backend/prisma/schema.prisma#L29-L57`](../../backend/prisma/schema.prisma#L29-L57) and [`backend/prisma/schema.prisma#L122-L152`](../../backend/prisma/schema.prisma#L122-L152) - soft-delete fields exist, but no query helpers enforce them yet.

## Pause-And-Predict Prompts

- Before reading `auth.service.ts`, predict where duplicate email rejection lives.
- Before reading `RequireAuth.tsx`, predict whether unauthorized users are blocked on the server, client, or both.
- Before reading `seed.ts`, predict whether the sample credentials are usable for real login.

## Senior Noticing

- Thin controllers are good, but route-local `validateBody` currently duplicates a pattern that likely wants shared middleware later.
- The frontend auth guard is UX-only. It does not replace server authorization.
- Prisma schema ambition exceeds current backend feature surface, which is good for curriculum breadth but important to state honestly.
