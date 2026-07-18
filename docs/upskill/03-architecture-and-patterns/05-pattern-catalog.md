# Pattern Catalog

## Pattern: Fail-Fast Environment Parsing
**Problem it solves:** accidental runtime drift from missing or malformed env vars.  
**General shape:** parse process env at startup and crash early.  
**Real example:** [`backend/src/config/env.ts#L19-L31`](../../backend/src/config/env.ts#L19-L31)  
**Second example:** No second example found.  
**Why this implementation works:** imports cannot proceed with invalid config.  
**Failure modes:**
- test-only defaults can mask missing env if copied too broadly
- import-time crash can surprise people who expected lazy config
**Use it when:**
- secrets, URLs, and ports are required for boot
**Avoid it when:**
- optional feature flags should degrade gracefully
**Drill:** Add one hypothetical required env var and describe every place that would fail first.

## Pattern: Test-Only Config Fallback
**Problem it solves:** lets unit tests run without full external setup.  
**General shape:** provide safe defaults only when `NODE_ENV === "test"`.  
**Real example:** [`backend/src/config/env.ts#L4-L17`](../../backend/src/config/env.ts#L4-L17)  
**Second example:** No second example found.  
**Why this implementation works:** keeps production strict while easing local tests.  
**Failure modes:** overuse turns missing configuration into silent coupling.  
**Use it when:** tests need deterministic local values.  
**Avoid it when:** the fallback would meaningfully change production semantics.  
**Drill:** Explain why a database URL fallback is safer in tests than in development.

## Pattern: Shared Prisma Singleton
**Problem it solves:** avoids creating one DB client per import chain.  
**General shape:** reuse one client via `globalThis` in non-production.  
**Real example:** [`backend/src/db/prisma.ts#L3-L15`](../../backend/src/db/prisma.ts#L3-L15)  
**Second example:** No second example found.  
**Why this implementation works:** helps during dev reloads and centralizes DB logging config.  
**Failure modes:** hidden global state can complicate tests.  
**Use it when:** one process should share one Prisma client.  
**Avoid it when:** each tenant/request must isolate DB connections.  
**Drill:** Describe why this helps `tsx watch`.

## Pattern: Thin Controller, Fat Service
**Problem it solves:** keeps HTTP transport separate from business decisions.  
**General shape:** controller reads request and returns response; service owns rules.  
**Real example:** [`backend/src/modules/auth/auth.controller.ts#L5-L32`](../../backend/src/modules/auth/auth.controller.ts#L5-L32) and [`backend/src/modules/auth/auth.service.ts#L32-L167`](../../backend/src/modules/auth/auth.service.ts#L32-L167)  
**Second example:** app-level route shell in [`backend/src/app.ts#L23-L51`](../../backend/src/app.ts#L23-L51) also stays thin.  
**Why this implementation works:** service logic is easier to reason about and test.  
**Failure modes:** services can become large “god classes” if not split later.  
**Use it when:** logic spans multiple persistence steps or auth checks.  
**Avoid it when:** the handler is trivial and abstraction would be ceremony only.  
**Drill:** Point to one line in the controller that would be a bad place for password logic.

## Pattern: Route-Local Zod Validation
**Problem it solves:** rejects malformed requests before service execution.  
**General shape:** schema + middleware-like wrapper.  
**Real example:** [`backend/src/modules/auth/auth.routes.ts#L10-L24`](../../backend/src/modules/auth/auth.routes.ts#L10-L24)  
**Second example:** schema definitions in [`backend/src/modules/auth/auth.schemas.ts#L3-L25`](../../backend/src/modules/auth/auth.schemas.ts#L3-L25)  
**Why this implementation works:** validated data replaces raw `req.body`.  
**Failure modes:** duplicated validator helpers across modules.  
**Use it when:** payload shape is small and route count is low.  
**Avoid it when:** many modules need a shared validation middleware abstraction.  
**Drill:** Sketch how this should evolve once multiple modules exist.

## Pattern: Async Error Forwarding Wrapper
**Problem it solves:** Express does not automatically handle rejected async route promises cleanly.  
**General shape:** wrap async handlers and `catch(next)`.  
**Real example:** [`backend/src/shared/utils/asyncHandler.ts#L3-L8`](../../backend/src/shared/utils/asyncHandler.ts#L3-L8)  
**Second example:** used in every auth route in [`backend/src/modules/auth/auth.routes.ts#L28-L32`](../../backend/src/modules/auth/auth.routes.ts#L28-L32)  
**Why this implementation works:** centralizes async-to-Express error bridging.  
**Failure modes:** forgetting to wrap new routes.  
**Use it when:** Express handlers return promises.  
**Avoid it when:** framework already handles async errors natively.  
**Drill:** Find the first bug you would get if a new async route skipped this wrapper.

## Pattern: Domain Error Translation
**Problem it solves:** gives services a typed way to signal HTTP-relevant failures without coupling to Express directly.  
**General shape:** throw domain-aware error, translate once at edge.  
**Real example:** [`backend/src/shared/errors/AppError.ts#L1-L10`](../../backend/src/shared/errors/AppError.ts#L1-L10) and [`backend/src/app.ts#L53-L65`](../../backend/src/app.ts#L53-L65)  
**Second example:** usage in [`backend/src/modules/auth/auth.service.ts#L44-L46`](../../backend/src/modules/auth/auth.service.ts#L44-L46)  
**Why this implementation works:** services stay framework-light.  
**Failure modes:** generic `Error` throws bypass structured codes.  
**Use it when:** services need to express user-facing and status-specific failures.  
**Avoid it when:** every error is truly unexpected infrastructure failure.  
**Drill:** Find one auth failure that currently uses `AppError`.

## Pattern: Password Hash Boundary
**Problem it solves:** keeps raw password handling out of most code.  
**General shape:** dedicated hash and verify helpers.  
**Real example:** [`backend/src/shared/utils/password.ts#L3-L10`](../../backend/src/shared/utils/password.ts#L3-L10)  
**Second example:** usage in [`backend/src/modules/auth/auth.service.ts#L48-L48`](../../backend/src/modules/auth/auth.service.ts#L48-L48) and [`backend/src/modules/auth/auth.service.ts#L72-L72`](../../backend/src/modules/auth/auth.service.ts#L72-L72)  
**Why this implementation works:** isolates bcrypt usage.  
**Failure modes:** accidental logging of plaintext before helper call.  
**Use it when:** credentials are handled anywhere.  
**Avoid it when:** secrets are not passwords and need a different algorithm.  
**Drill:** Explain why `passwordHash` never leaves `toPublicUser`.

## Pattern: Split Access And Refresh Tokens
**Problem it solves:** separates short-lived auth from longer-lived session continuity.  
**General shape:** issue two token classes with different payloads and storage semantics.  
**Real example:** [`backend/src/shared/utils/jwt.ts#L18-L54`](../../backend/src/shared/utils/jwt.ts#L18-L54)  
**Second example:** usage in [`backend/src/modules/auth/auth.service.ts#L78-L102`](../../backend/src/modules/auth/auth.service.ts#L78-L102)  
**Why this implementation works:** access tokens stay compact, refresh tokens support server-side revocation.  
**Failure modes:** expiry drift between JWT config and DB persistence.  
**Use it when:** you need revocable long-lived sessions.  
**Avoid it when:** a simpler stateless token is enough.  
**Drill:** Compare the payload shape of access vs refresh tokens.

## Pattern: Hash Refresh Tokens At Rest
**Problem it solves:** reduces damage if refresh token rows leak.  
**General shape:** hash before storage, compare hash on use.  
**Real example:** [`backend/src/modules/auth/auth.service.ts#L10-L12`](../../backend/src/modules/auth/auth.service.ts#L10-L12), [`backend/src/modules/auth/auth.service.ts#L89-L96`](../../backend/src/modules/auth/auth.service.ts#L89-L96), [`backend/src/modules/auth/auth.service.ts#L116-L118`](../../backend/src/modules/auth/auth.service.ts#L116-L118)  
**Second example:** No second example found.  
**Why this implementation works:** server does not keep reusable raw refresh tokens in DB.  
**Failure modes:** unhashed logs or debug output still leak secrets.  
**Use it when:** long-lived tokens are persisted.  
**Avoid it when:** tokens are never stored server-side.  
**Drill:** Explain why hashing a refresh token is different from encrypting it.

## Pattern: Request Identity Hydration
**Problem it solves:** downstream code should not repeatedly parse JWT headers.  
**General shape:** middleware verifies token and stores typed user context on the request.  
**Real example:** [`backend/src/middleware/auth.middleware.ts#L6-L27`](../../backend/src/middleware/auth.middleware.ts#L6-L27)  
**Second example:** request type support in [`backend/src/types/express.d.ts#L3-L17`](../../backend/src/types/express.d.ts#L3-L17)  
**Why this implementation works:** centralizes auth parsing and typing.  
**Failure modes:** hidden route-controller contract when `req.user!` is non-null asserted.  
**Use it when:** many handlers need user identity.  
**Avoid it when:** route-specific auth contexts differ radically.  
**Drill:** Find the exact line where the controller trusts middleware ordering.

## Pattern: Role-To-Permission Table
**Problem it solves:** avoids scattering ad hoc role checks.  
**General shape:** permission vocabulary + role mapping + middleware consumer.  
**Real example:** [`backend/src/auth/permissions.ts#L1-L47`](../../backend/src/auth/permissions.ts#L1-L47)  
**Second example:** consumer in [`backend/src/middleware/requirePermission.middleware.ts#L6-L18`](../../backend/src/middleware/requirePermission.middleware.ts#L6-L18)  
**Why this implementation works:** central source of truth.  
**Failure modes:** dead permissions if routes never consume them.  
**Use it when:** auth policy is broad enough to centralize.  
**Avoid it when:** resource-level rules need richer policy objects.  
**Drill:** Which defined permission is not exercised by any current route?

## Pattern: Client Transport Wrapper
**Problem it solves:** pages should not duplicate fetch setup and error parsing.  
**General shape:** one request helper used by API modules.  
**Real example:** [`frontend/src/api/client.ts#L9-L29`](../../frontend/src/api/client.ts#L9-L29)  
**Second example:** usage in [`frontend/src/api/auth.api.ts#L24-L35`](../../frontend/src/api/auth.api.ts#L24-L35)  
**Why this implementation works:** centralizes headers and 204 handling.  
**Failure modes:** hard-coded base URL and lossy error handling.  
**Use it when:** multiple modules call one backend.  
**Avoid it when:** transport needs typed per-endpoint middleware or retries.  
**Drill:** Name one improvement that would keep the abstraction but strengthen the contract.

## Pattern: Persisted Client Auth Store
**Problem it solves:** browser refresh should not instantly discard auth state.  
**General shape:** initialize from local storage, update storage on session set/clear.  
**Real example:** [`frontend/src/auth/auth.store.ts#L13-L63`](../../frontend/src/auth/auth.store.ts#L13-L63)  
**Second example:** consumer in [`frontend/src/auth/RequireAuth.tsx#L5-L13`](../../frontend/src/auth/RequireAuth.tsx#L5-L13)  
**Why this implementation works:** simple UX continuity.  
**Failure modes:** stale tokens, bad JSON, security tradeoffs of token storage.  
**Use it when:** a lightweight client session is acceptable.  
**Avoid it when:** httpOnly cookies or stronger browser-side security boundaries are required.  
**Drill:** List two reasons local storage auth can be convenient and two reasons it is risky.

## Pattern: Seed Data As Architecture Narrative
**Problem it solves:** makes local boot and learning concrete.  
**General shape:** create users, domain entities, and history records that tell a story.  
**Real example:** [`backend/prisma/seed.ts#L82-L437`](../../backend/prisma/seed.ts#L82-L437)  
**Second example:** No second example found.  
**Why this implementation works:** the repo immediately has realistic CRM nouns for demos and tests.  
**Failure modes:** seed file drifts as schema or product semantics evolve.  
**Use it when:** the project needs a learning/demo baseline.  
**Avoid it when:** the seed becomes a brittle copy of production data shape.  
**Drill:** Pick one seeded opportunity and describe the business story it tells.
