# Review Katas

## Kata 1: Move Login Logic Into Controller
**Author intent:** simplify service indirection.
**Fake diff summary:**
- delete `auth.service.ts`
- move Prisma and bcrypt calls into controller
**Files this resembles:**
- [`../../backend/src/modules/auth/auth.controller.ts#L5-L32`](../../backend/src/modules/auth/auth.controller.ts#L5-L32)
**Your task:** Review this PR.
**Expected findings:**
Blocking:
- breaks transport/domain boundary
Important:
- makes testing and reuse harder
Optional:
- none
**Good review comment example:**
> I’d keep this logic in the service layer. The current split keeps HTTP concerns thin and makes auth rules easier to test independently.

## Kata 2: Store Raw Refresh Tokens For Debugging
**Author intent:** easier manual support debugging.
**Fake diff summary:** save `refreshToken` directly in DB instead of a hash.
**Files this resembles:** [`../../backend/src/modules/auth/auth.service.ts#L89-L96`](../../backend/src/modules/auth/auth.service.ts#L89-L96)
**Your task:** Review this PR.
**Expected findings:**
Blocking:
- sensitive token-at-rest regression
Important:
- support convenience does not outweigh leak impact
Optional:
- add debug tooling instead
**Good review comment example:**
> This would make database exposure materially worse. We should preserve hashed-at-rest behavior and solve support visibility another way.

## Kata 3: Add Frontend-Only Admin Guard
**Author intent:** hide admin functionality from non-admins quickly.
**Fake diff summary:** checks role in React and skips backend changes.
**Files this resembles:** [`../../frontend/src/auth/RequireAuth.tsx#L5-L13`](../../frontend/src/auth/RequireAuth.tsx#L5-L13)
**Your task:** Review this PR.
**Expected findings:**
Blocking:
- client-only gating is not authorization
Important:
- UX guard can remain but server enforcement is required
Optional:
- none
**Good review comment example:**
> This helps navigation UX, but it does not secure the action. We need the server route to enforce permissions as well.

## Kata 4: Remove Zod Validation Because TypeScript Exists
**Author intent:** reduce boilerplate.
**Fake diff summary:** route now passes raw `req.body` directly to service.
**Files this resembles:** [`../../backend/src/modules/auth/auth.routes.ts#L10-L24`](../../backend/src/modules/auth/auth.routes.ts#L10-L24)
**Your task:** Review this PR.
**Expected findings:**
Blocking:
- removes runtime trust boundary
Important:
- invalid external input reaches service
Optional:
- consider shared middleware instead of removal
**Good review comment example:**
> TypeScript cannot validate runtime JSON. I’m in favor of reducing duplication, but the replacement should be a shared runtime validator, not no validator.

## Kata 5: Replace Zustand Store With Module Variable
**Author intent:** simpler auth state.
**Fake diff summary:** export `let currentUser` and mutate it directly.
**Files this resembles:** [`../../frontend/src/auth/auth.store.ts#L37-L63`](../../frontend/src/auth/auth.store.ts#L37-L63)
**Your task:** Review this PR.
**Expected findings:**
Blocking:
- loses React reactivity across consumers
Important:
- loses persistence shape
Optional:
- none
**Good review comment example:**
> This would simplify syntax, but it removes subscription-based updates and makes UI consistency much harder. The current store is doing more than holding a variable.

## Kata 6: Return 200 On Invalid Login With `{ ok: false }`
**Author intent:** simplify frontend error handling.
**Fake diff summary:** login failure becomes status 200.
**Files this resembles:** [`../../backend/src/app.ts#L56-L60`](../../backend/src/app.ts#L56-L60)
**Your task:** Review this PR.
**Expected findings:**
Blocking:
- weakens HTTP semantics and current client assumptions
Important:
- monitoring and debugging become harder
Optional:
- improve frontend error abstraction instead
**Good review comment example:**
> I’d keep auth failures as proper 4xx responses. If the client handling feels clumsy, the better fix is a richer client error abstraction.

## Kata 7: Scatter API URLs Across Components
**Author intent:** make each API call explicit.
**Fake diff summary:** multiple components call `fetch("http://localhost:4000/...")`.
**Files this resembles:** [`../../frontend/src/api/client.ts#L1-L29`](../../frontend/src/api/client.ts#L1-L29)
**Your task:** Review this PR.
**Expected findings:**
Blocking:
- none
Important:
- config duplication and environment fragility
Optional:
- central transport wrapper already exists
**Good review comment example:**
> We already have a transport boundary. I’d rather improve that single abstraction than duplicate host and header logic throughout the app.

## Kata 8: Delete `/health/db` Because `/health` Exists
**Author intent:** reduce endpoints.
**Fake diff summary:** removes DB health route and test coverage stays minimal.
**Files this resembles:** [`../../backend/src/app.ts#L23-L41`](../../backend/src/app.ts#L23-L41)
**Your task:** Review this PR.
**Expected findings:**
Blocking:
- none
Important:
- loses readiness signal for DB dependency
Optional:
- consider renaming or documenting semantics instead
**Good review comment example:**
> I agree we should avoid noisy endpoints, but `/health` and `/health/db` are answering different operational questions right now.
