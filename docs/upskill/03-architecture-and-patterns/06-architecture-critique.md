# Architecture Critique

## Strong Choices

1. Thin controller / service split is already in place for auth. Evidence: [`backend/src/modules/auth/auth.controller.ts#L5-L32`](../../backend/src/modules/auth/auth.controller.ts#L5-L32), [`backend/src/modules/auth/auth.service.ts#L32-L167`](../../backend/src/modules/auth/auth.service.ts#L32-L167).
2. Schema-first domain modeling is richer than the current route surface, which is good for forward planning. Evidence: [`backend/prisma/schema.prisma#L29-L277`](../../backend/prisma/schema.prisma#L29-L277).
3. Request validation is explicit and local, not magical. Evidence: [`backend/src/modules/auth/auth.routes.ts#L10-L24`](../../backend/src/modules/auth/auth.routes.ts#L10-L24).
4. Refresh tokens are hashed at rest. Evidence: [`backend/src/modules/auth/auth.service.ts#L10-L12`](../../backend/src/modules/auth/auth.service.ts#L10-L12), [`backend/src/modules/auth/auth.service.ts#L89-L96`](../../backend/src/modules/auth/auth.service.ts#L89-L96).

## Confirmed Risks

| Risk | Evidence | Priority |
| --- | --- | --- |
| Frontend API base URL is hard-coded | [`frontend/src/api/client.ts#L1-L1`](../../frontend/src/api/client.ts#L1-L1) | High |
| RBAC exists but is not yet attached to feature routes | [`backend/src/middleware/requirePermission.middleware.ts#L6-L18`](../../backend/src/middleware/requirePermission.middleware.ts#L6-L18) | High |
| Refresh token DB expiry is hard-coded instead of derived from env | [`backend/src/modules/auth/auth.service.ts#L94-L94`](../../backend/src/modules/auth/auth.service.ts#L94-L94) | Medium |
| Local storage session blob is unvalidated | [`frontend/src/auth/auth.store.ts#L24-L35`](../../frontend/src/auth/auth.store.ts#L24-L35) | Medium |
| Redis is provisioned but unused | [`docker-compose.yml#L19-L28`](../../docker-compose.yml#L19-L28) | Low |

## Hypotheses To Investigate

- `EmailLog.loggedById` lacks an explicit relation in the Prisma schema, which may be intentional staging or unfinished modeling. Evidence: [`backend/prisma/schema.prisma#L207-L220`](../../backend/prisma/schema.prisma#L207-L220).
- Soft-delete fields may not be consistently honored once list/query routes are added. Evidence: [`backend/prisma/schema.prisma#L47-L47`](../../backend/prisma/schema.prisma#L47-L47), [`backend/prisma/schema.prisma#L70-L70`](../../backend/prisma/schema.prisma#L70-L70), [`backend/prisma/schema.prisma#L94-L94`](../../backend/prisma/schema.prisma#L94-L94), [`backend/prisma/schema.prisma#L141-L141`](../../backend/prisma/schema.prisma#L141-L141).

## If I Owned This Repo For 3 Months

1. Add real feature modules for leads, companies, contacts, and opportunities using the auth/service patterns already established.
2. Standardize shared backend validation middleware rather than re-defining validators per route file.
3. Move frontend transport config to environment-driven setup and add typed error codes.
4. Add migrations, CI, and integration tests for login and `/me`.
5. Decide whether Redis is necessary now or should be removed until async work exists.

## Suggested Migration Paths

### Shared validation middleware

- Extract route-local `validateBody` into shared middleware.
- Test with auth routes first.
- Rollback is low-risk because call sites are isolated.

### Safer frontend auth persistence

- Add schema validation when hydrating storage.
- Consider storing only refresh token and deriving user state via `/me`.
- Rollback plan: revert to current storage shape if boot regressions appear.

### Config cleanup

- Replace hard-coded API base URL with Vite env usage.
- Add fallback only for local dev if necessary.
- Test in dev and production builds before merging.

## Verification Notes

- Critique is grounded in inspected current code, not planned features from prompts.
- Items marked hypotheses should be confirmed after more feature code exists.
