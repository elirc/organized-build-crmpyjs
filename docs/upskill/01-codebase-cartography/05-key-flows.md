# Key Flows

## Flow: Backend Startup
**Why this flow matters:** Every request path depends on startup sequencing. If the DB client is not connected or env parsing fails, the app should die early instead of serving partial behavior.
**Open these files first:**
- [`../../backend/src/server.ts#L5-L17`](../../backend/src/server.ts#L5-L17) - process boot path
- [`../../backend/src/config/env.ts#L19-L31`](../../backend/src/config/env.ts#L19-L31) - config contract
- [`../../backend/src/db/prisma.ts#L7-L15`](../../backend/src/db/prisma.ts#L7-L15) - shared DB client
**Trace:**
| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | Node process | `backend/src/server.ts` | calls `bootstrap()` | none | app never starts if promise rejects |
| 2 | Config layer | `backend/src/config/env.ts` | parses env eagerly on import | strings to typed config | startup crash if env missing |
| 3 | DB layer | `backend/src/server.ts` | `await prisma.$connect()` | Prisma connection | hanging or rejection on DB outage |
| 4 | HTTP layer | `backend/src/server.ts` | `app.listen` binds port | numeric port | partial boot if DB connect were skipped |
**Validation and authorization:** No request validation here. The invariant is “no listener until config and Prisma are ready.”
**Persistence and side effects:** DB connect is the key side effect.
**Tests that cover it:** No direct startup integration test found. Only shell health behavior is tested in [`../../backend/src/app.test.ts#L6-L13`](../../backend/src/app.test.ts#L6-L13).
**What juniors usually miss:**
- Import-time env parsing is part of startup behavior.
- A process can be “running” but still not be “ready.”
**What seniors notice:**
- No graceful shutdown hooks yet.
- No separate readiness/liveness split beyond lightweight endpoints.
**Drill:** Explain why `prisma.$connect()` is in `server.ts` instead of `app.ts`.
**Self-grade:**
- Basic: can say startup connects DB before listen.
- Solid: can name the env and Prisma boundaries.
- Strong: can discuss failure visibility and graceful shutdown gaps.

## Flow: Health Check Request
**Why this flow matters:** Health checks are often the first ops contract and the first false confidence trap.
**Open these files first:**
- [`../../backend/src/app.ts#L23-L41`](../../backend/src/app.ts#L23-L41) - health endpoints
- [`../../backend/src/app.test.ts#L6-L13`](../../backend/src/app.test.ts#L6-L13) - current test coverage
**Trace:**
| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | Client | `backend/src/app.ts` | GET `/health` | no body | can succeed even if DB is down |
| 2 | API shell | `backend/src/app.ts` | returns JSON status | `{status, service, timestamp}` | shallow signal only |
| 3 | Client | `backend/src/app.ts` | GET `/health/db` | no body | DB query may fail |
| 4 | Prisma | `backend/src/app.ts` | executes `SELECT 1` | SQL ping | only verifies DB connectivity, not write health |
**Validation and authorization:** None.
**Persistence and side effects:** `/health/db` touches the DB, `/health` does not.
**Tests that cover it:** Direct test only covers `/health`.
**What juniors usually miss:**
- “Health endpoint exists” is not the same as “system is healthy.”
**What seniors notice:**
- There is no structured health model for Redis even though Redis is provisioned.
**Drill:** Design a better readiness endpoint without adding unnecessary expensive queries.
**Self-grade:**
- Basic: can distinguish `/health` from `/health/db`.
- Solid: can explain what each endpoint does not prove.
- Strong: can propose readiness semantics and alerting implications.

## Flow: Login From Browser To JWT
**Why this flow matters:** This is the richest real end-to-end business flow implemented today.
**Open these files first:**
- [`../../frontend/src/auth/LoginPage.tsx#L15-L29`](../../frontend/src/auth/LoginPage.tsx#L15-L29) - submit handler
- [`../../frontend/src/api/auth.api.ts#L24-L29`](../../frontend/src/api/auth.api.ts#L24-L29) - auth API call
- [`../../frontend/src/api/client.ts#L9-L29`](../../frontend/src/api/client.ts#L9-L29) - HTTP wrapper
- [`../../backend/src/modules/auth/auth.routes.ts#L28-L31`](../../backend/src/modules/auth/auth.routes.ts#L28-L31) - route definition
- [`../../backend/src/modules/auth/auth.service.ts#L63-L103`](../../backend/src/modules/auth/auth.service.ts#L63-L103) - login logic
**Trace:**
| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | UI | `frontend/src/auth/LoginPage.tsx` | gathers email/password and submits | `{email, password}` | user-facing error state only |
| 2 | API client | `frontend/src/api/auth.api.ts` | calls `/auth/login` | login payload | tight coupling to backend route naming |
| 3 | Fetch wrapper | `frontend/src/api/client.ts` | serializes body, parses JSON, throws generic `Error` | raw JSON | loses structured error codes |
| 4 | Validation | `backend/src/modules/auth/auth.routes.ts` | `loginSchema.safeParse` | zod-validated payload | route-local validator not reused |
| 5 | Service | `backend/src/modules/auth/auth.service.ts` | finds user, verifies password, signs tokens | user row + token strings | missing rate limiting |
| 6 | Persistence | `backend/src/modules/auth/auth.service.ts` | stores hashed refresh token row | `RefreshToken` record | expiry is hard-coded to 7 days |
| 7 | UI state | `frontend/src/auth/auth.store.ts#L39-L53` | persists session to local storage | user + tokens | storage parse failures are unchecked |
**Validation and authorization:** Validation happens in [`../../backend/src/modules/auth/auth.schemas.ts#L18-L24`](../../backend/src/modules/auth/auth.schemas.ts#L18-L24). Login itself is pre-auth, so authorization is not yet relevant.
**Persistence and side effects:** Refresh token creation in [`../../backend/src/modules/auth/auth.service.ts#L89-L96`](../../backend/src/modules/auth/auth.service.ts#L89-L96) is the important write.
**Tests that cover it:** No direct login test found.
**What juniors usually miss:**
- The frontend route guard is not a substitute for server auth.
- The refresh token is persisted hashed, not raw.
**What seniors notice:**
- `apiRequest` throws only a message, not a code, which weakens typed UI handling.
- Hard-coded refresh expiry can drift from `JWT_REFRESH_EXPIRES_IN`.
**Drill:** Trace where a wrong password becomes a user-visible message.
**Self-grade:**
- Basic: can name the files in order.
- Solid: can explain where validation, password comparison, and token persistence happen.
- Strong: can identify two contract weaknesses and propose safer shapes.

## Flow: Authenticated `GET /api/auth/me`
**Why this flow matters:** It shows the full auth boundary: token parsing, request identity, controller thinness, service lookup.
**Open these files first:**
- [`../../backend/src/modules/auth/auth.routes.ts#L32-L32`](../../backend/src/modules/auth/auth.routes.ts#L32-L32) - route protection
- [`../../backend/src/middleware/auth.middleware.ts#L6-L27`](../../backend/src/middleware/auth.middleware.ts#L6-L27) - token parsing
- [`../../backend/src/modules/auth/auth.controller.ts#L26-L28`](../../backend/src/modules/auth/auth.controller.ts#L26-L28) - controller
- [`../../backend/src/modules/auth/auth.service.ts#L154-L164`](../../backend/src/modules/auth/auth.service.ts#L154-L164) - user lookup
**Trace:**
| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | Client | route | sends `Authorization: Bearer ...` | header string | malformed header |
| 2 | Middleware | `auth.middleware.ts` | verifies JWT and hydrates `req.user` | `{id,email,role}` | token forgery or expiry |
| 3 | Controller | `auth.controller.ts` | forwards `req.user!.id` | string id | non-null assertion assumes middleware ran |
| 4 | Service | `auth.service.ts` | fetches user and strips private fields | user row | no caching |
**Validation and authorization:** Auth middleware is the gate. No extra permission middleware is applied to `/me`.
**Persistence and side effects:** Read-only `prisma.user.findUnique`.
**Tests that cover it:** No direct `/me` tests found.
**What juniors usually miss:**
- `req.user` is not native Express behavior; it is added by declaration merging in [`../../backend/src/types/express.d.ts#L3-L17`](../../backend/src/types/express.d.ts#L3-L17).
**What seniors notice:**
- `req.user!` is safe only because route registration order is correct.
**Drill:** Remove `authMiddleware` mentally. What breaks first, and where?
**Self-grade:**
- Basic: can explain the happy path.
- Solid: can explain why `req.user` exists.
- Strong: can explain the hidden contract between route and controller.

## Flow: Frontend Protected Route Decision
**Why this flow matters:** It is a good example of client-only authorization ergonomics versus real security boundaries.
**Open these files first:**
- [`../../frontend/src/app/router.tsx#L7-L21`](../../frontend/src/app/router.tsx#L7-L21)
- [`../../frontend/src/auth/RequireAuth.tsx#L5-L13`](../../frontend/src/auth/RequireAuth.tsx#L5-L13)
- [`../../frontend/src/auth/auth.store.ts#L15-L35`](../../frontend/src/auth/auth.store.ts#L15-L35)
**Trace:**
| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | Browser | router | resolves path | URL path | deep-link access |
| 2 | Guard | `RequireAuth.tsx` | checks `state.user` | `AuthUser \| null` | stale local session |
| 3 | Navigation | `RequireAuth.tsx` | redirects to `/login` if absent | route state | no token freshness check |
| 4 | Store | `auth.store.ts` | rehydrates from local storage | JSON payload | parse/runtime shape mismatch |
**Validation and authorization:** None on the client. This is UX gating only.
**Persistence and side effects:** local storage read/write.
**Tests that cover it:** No direct route guard tests found.
**What juniors usually miss:**
- A user can still call backend endpoints directly unless the server also checks auth.
**What seniors notice:**
- There is no schema validation for the stored session blob.
**Drill:** Explain why this guard improves UX but does not secure data by itself.
**Self-grade:**
- Basic: says unauthenticated users are redirected.
- Solid: distinguishes client gating from server authorization.
- Strong: names at least two stale-session failure modes.

## Flow: Seed Data Bootstrapping
**Why this flow matters:** Seed scripts are often the fastest way to learn domain relationships and realistic test fixtures.
**Open these files first:**
- [`../../backend/prisma/seed.ts#L7-L71`](../../backend/prisma/seed.ts#L7-L71) - users
- [`../../backend/prisma/seed.ts#L82-L99`](../../backend/prisma/seed.ts#L82-L99) - pipeline stages
- [`../../backend/prisma/seed.ts#L152-L269`](../../backend/prisma/seed.ts#L152-L269) - leads and opportunities
- [`../../backend/prisma/seed.ts#L294-L437`](../../backend/prisma/seed.ts#L294-L437) - tasks, emails, activities, audits
**Trace:**
| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | Seed script | `seed.ts` | clears tables | deleteMany calls | order matters with relations |
| 2 | Seed script | `seed.ts` | hashes shared password | bcrypt hash | fixture password drift |
| 3 | Seed script | `seed.ts` | inserts users and stages | arrays of creates | assumptions about unique fields |
| 4 | Seed script | `seed.ts` | inserts companies, contacts, leads, opportunities | linked IDs | mismatch with schema evolution |
| 5 | Seed script | `seed.ts` | inserts activities and audit events | history rows | seed realism vs maintenance cost |
**Validation and authorization:** None; it is a privileged dev-time script.
**Persistence and side effects:** Pure DB writes.
**Tests that cover it:** No direct seed script test found.
**What juniors usually miss:**
- Seeds are executable architecture documents.
**What seniors notice:**
- There is no transaction wrapping the whole seed, so partial state is possible on failure.
**Drill:** Use the seed file to explain the relationship between `Company`, `Contact`, and `Opportunity`.
**Self-grade:**
- Basic: can identify the major entity groups.
- Solid: can trace one seeded opportunity to its company/contact.
- Strong: can explain how seed scripts can rot as schemas change.
