# Good First Tickets

## Ticket 1: Move frontend API base URL to env
**Difficulty:** Easy
**Estimated time:** 45-90 minutes
**Skills practiced:** configuration, Vite envs
**Story:** As a developer, I want the frontend API URL configurable so deployments do not require code edits.
**Why this is a good contribution:** Small blast radius and obvious user value.
**Acceptance criteria:**
- [ ] API base URL is no longer hard-coded
- [ ] local development remains documented
**Read these anchors first:**
- [`../../frontend/src/api/client.ts#L1-L29`](../../frontend/src/api/client.ts#L1-L29) - current transport config
**Files likely touched:**
- `frontend/src/api/client.ts`
- `README.md`
**Implementation plan:**
1. Introduce env-driven base URL.
2. Keep one central transport wrapper.
3. Document required env.
**Illustrative fake-code shape:**
```ts
// Illustrative fake code: adapt to the repo.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";
```
**What could go wrong:**
- broken tests or dev boot from missing env
**Suggested checks:**
- `npm run typecheck`
- `npm run lint`
- `npm test`
**Review questions:**
- Is config still centralized?

## Ticket 2: Add backend login rejection test
**Difficulty:** Easy
**Estimated time:** 1-2 hours
**Skills practiced:** API testing
**Story:** As a maintainer, I want a wrong-password test so auth regressions are caught.
**Why this is a good contribution:** Extends existing backend test style.
**Acceptance criteria:**
- [ ] invalid credentials return `401`
**Read these anchors first:**
- [`../../backend/src/app.test.ts#L1-L13`](../../backend/src/app.test.ts#L1-L13)
- [`../../backend/src/modules/auth/auth.service.ts#L68-L76`](../../backend/src/modules/auth/auth.service.ts#L68-L76)
**Files likely touched:** `backend/src/*.test.ts`
**Implementation plan:** seed or mock user, post bad credentials, assert status and message.
**Illustrative fake-code shape:**
```ts
// Illustrative fake code: adapt to the repo.
await request(app).post("/api/auth/login").send({ email, password: "wrong" }).expect(401);
```
**What could go wrong:** test data setup
**Suggested checks:** `npm --workspace backend run test`
**Review questions:** Does the test prove behavior rather than implementation detail?

## Ticket 3: Add `/api/auth/me` happy-path test
**Difficulty:** Easy
**Estimated time:** 1-2 hours
**Skills practiced:** auth boundary testing
**Story:** Verify authenticated identity lookup works.
**Why this is a good contribution:** Covers a real route with no current test.
**Acceptance criteria:** bearer token returns current user JSON.
**Read these anchors first:** [`../../backend/src/middleware/auth.middleware.ts#L6-L27`](../../backend/src/middleware/auth.middleware.ts#L6-L27), [`../../backend/src/modules/auth/auth.controller.ts#L26-L28`](../../backend/src/modules/auth/auth.controller.ts#L26-L28)
**Files likely touched:** backend auth tests
**Implementation plan:** obtain token through login or sign one in test, call `/api/auth/me`, assert shape.
**What could go wrong:** token fixture drift with secrets
**Suggested checks:** backend tests
**Review questions:** Does the test cover middleware plus service together?

## Ticket 4: Add `/api/auth/me` missing-token rejection test
**Difficulty:** Easy
**Estimated time:** 30-60 minutes
**Skills practiced:** negative testing
**Story:** Verify server-side protection exists even without frontend guard.
**Why this is a good contribution:** Teaches auth vs UX gating.
**Acceptance criteria:** missing header returns `401`.
**Read these anchors first:** [`../../backend/src/middleware/auth.middleware.ts#L7-L10`](../../backend/src/middleware/auth.middleware.ts#L7-L10)
**Files likely touched:** backend auth tests
**Implementation plan:** GET `/api/auth/me` without header, assert `401`.
**What could go wrong:** none major
**Suggested checks:** backend tests
**Review questions:** Is the error shape asserted too tightly?

## Ticket 5: Extract shared `validateBody` middleware
**Difficulty:** Easy
**Estimated time:** 1-2 hours
**Skills practiced:** deduplication, middleware design
**Story:** As the repo grows, I want one reusable request validation helper.
**Why this is a good contribution:** Low-risk cleanup before more modules land.
**Acceptance criteria:** auth routes use shared helper with no behavior change.
**Read these anchors first:** [`../../backend/src/modules/auth/auth.routes.ts#L10-L24`](../../backend/src/modules/auth/auth.routes.ts#L10-L24)
**Files likely touched:** new shared middleware file, auth routes
**Implementation plan:** extract helper, preserve signatures, update imports.
**What could go wrong:** generic typing complexity
**Suggested checks:** all checks
**Review questions:** Did extraction improve reuse without obscuring behavior?

## Ticket 6: Guard `localStorage` JSON parse failures
**Difficulty:** Easy
**Estimated time:** 45-90 minutes
**Skills practiced:** client resilience
**Story:** If storage is corrupted, the app should not crash on boot.
**Why this is a good contribution:** Realistic bug prevention with tiny blast radius.
**Acceptance criteria:** malformed stored JSON falls back to logged-out state.
**Read these anchors first:** [`../../frontend/src/auth/auth.store.ts#L24-L35`](../../frontend/src/auth/auth.store.ts#L24-L35)
**Files likely touched:** auth store, frontend tests
**Implementation plan:** add try/catch and safe fallback.
**What could go wrong:** hiding real migration issues silently
**Suggested checks:** frontend tests
**Review questions:** Should failure be logged?

## Ticket 7: Add logout button to app shell
**Difficulty:** Easy
**Estimated time:** 45-90 minutes
**Skills practiced:** Zustand state usage, UX flow
**Story:** Signed-in users should be able to clear session state.
**Why this is a good contribution:** Useful and isolated.
**Acceptance criteria:** button clears store and routes back to login.
**Read these anchors first:** [`../../frontend/src/App.tsx#L8-L30`](../../frontend/src/App.tsx#L8-L30), [`../../frontend/src/auth/auth.store.ts#L55-L62`](../../frontend/src/auth/auth.store.ts#L55-L62)
**Files likely touched:** `frontend/src/App.tsx`
**Implementation plan:** read `clearSession`, wire button, navigate or rely on guard.
**What could go wrong:** stale UI after session clear
**Suggested checks:** typecheck, lint, frontend test
**Review questions:** Is session clearing centralized?

## Ticket 8: Add seeded-credentials section to README
**Difficulty:** Easy
**Estimated time:** 20-40 minutes
**Skills practiced:** onboarding docs
**Story:** New developers need obvious login credentials after seeding.
**Why this is a good contribution:** reduces onboarding friction.
**Acceptance criteria:** README lists sample emails and shared password.
**Read these anchors first:** [`../../backend/prisma/seed.ts#L7-L71`](../../backend/prisma/seed.ts#L7-L71), [`../../frontend/src/auth/LoginPage.tsx#L36-L36`](../../frontend/src/auth/LoginPage.tsx#L36-L36)
**Files likely touched:** `README.md`
**Implementation plan:** add concise credentials table.
**What could go wrong:** doc drift if seed changes
**Suggested checks:** manual doc read
**Review questions:** Is the note clearly dev-only?

## Ticket 9: Add unit tests for `hasPermission`
**Difficulty:** Easy
**Estimated time:** 45-90 minutes
**Skills practiced:** pure-function testing
**Story:** Role matrix behavior should be explicit.
**Why this is a good contribution:** fast, low-risk test coverage.
**Acceptance criteria:** representative roles and permissions are asserted.
**Read these anchors first:** [`../../backend/src/auth/permissions.ts#L1-L47`](../../backend/src/auth/permissions.ts#L1-L47)
**Files likely touched:** new backend unit test
**Implementation plan:** write direct assertions for allowed and denied combinations.
**What could go wrong:** testing duplicates the table blindly
**Suggested checks:** backend tests
**Review questions:** Are chosen assertions representative rather than exhaustive noise?

## Ticket 10: Add frontend route-guard test
**Difficulty:** Easy
**Estimated time:** 1-2 hours
**Skills practiced:** React Router testing
**Story:** Unauthenticated users should be redirected consistently.
**Why this is a good contribution:** covers a real UX boundary.
**Acceptance criteria:** unauthenticated render goes to login, authenticated render allows child route.
**Read these anchors first:** [`../../frontend/src/auth/RequireAuth.tsx#L5-L13`](../../frontend/src/auth/RequireAuth.tsx#L5-L13), [`../../frontend/src/app/router.tsx#L7-L21`](../../frontend/src/app/router.tsx#L7-L21)
**Files likely touched:** frontend test files
**Implementation plan:** render under router with mocked store state.
**What could go wrong:** test complexity around browser router
**Suggested checks:** frontend tests
**Review questions:** Does the test assert behavior, not implementation details?

## Ticket 11: Add shared error-code handling to `apiRequest`
**Difficulty:** Easy
**Estimated time:** 1-2 hours
**Skills practiced:** API contract hygiene
**Story:** Frontend should preserve backend error codes when possible.
**Why this is a good contribution:** improves future UX without major architecture change.
**Acceptance criteria:** thrown client error includes backend `code` when present.
**Read these anchors first:** [`../../frontend/src/api/client.ts#L19-L21`](../../frontend/src/api/client.ts#L19-L21), [`../../backend/src/app.ts#L56-L60`](../../backend/src/app.ts#L56-L60)
**Files likely touched:** api client, maybe login page
**Implementation plan:** parse `code`, create richer error object.
**What could go wrong:** over-engineered custom error shape
**Suggested checks:** typecheck, tests
**Review questions:** Is the new client contract documented?

## Ticket 12: Add note in docs that Redis is currently unused
**Difficulty:** Easy
**Estimated time:** 15-30 minutes
**Skills practiced:** architecture documentation
**Story:** Learners should not assume Redis-backed jobs already exist.
**Why this is a good contribution:** clarifies repo truth.
**Acceptance criteria:** README or architecture docs mention Redis is provisioned but unused.
**Read these anchors first:** [`../../docker-compose.yml#L19-L28`](../../docker-compose.yml#L19-L28)
**Files likely touched:** README or docs
**Implementation plan:** add one accurate sentence.
**What could go wrong:** none
**Suggested checks:** doc review
**Review questions:** Is the statement precise and time-bounded?

## Ticket 13: Add auth-service test for duplicate-email registration
**Difficulty:** Easy
**Estimated time:** 1-2 hours
**Skills practiced:** service-level negative testing
**Story:** duplicate email should reject predictably.
**Why this is a good contribution:** covers a real branch in auth service.
**Acceptance criteria:** duplicate register attempt throws conflict behavior.
**Read these anchors first:** [`../../backend/src/modules/auth/auth.service.ts#L40-L46`](../../backend/src/modules/auth/auth.service.ts#L40-L46)
**Files likely touched:** backend auth tests
**Implementation plan:** seed existing user, attempt second registration.
**What could go wrong:** test fixture contamination
**Suggested checks:** backend tests
**Review questions:** Does the test prove business behavior instead of specific DB method calls?

## Ticket 14: Add `.env.example` mention to command cheat sheet
**Difficulty:** Easy
**Estimated time:** 15-30 minutes
**Skills practiced:** onboarding docs
**Story:** setup should not assume readers remember env bootstrapping.
**Why this is a good contribution:** tiny but practical.
**Acceptance criteria:** cheat sheet includes copy/create env step.
**Read these anchors first:** [`../../README.md#L18-L29`](../../README.md#L18-L29)
**Files likely touched:** docs
**Implementation plan:** add one row or note.
**What could go wrong:** none
**Suggested checks:** manual review
**Review questions:** Is the command marked verified or inferred correctly?

## Ticket 15: Add `npm run build` to verification workflow
**Difficulty:** Easy
**Estimated time:** 30-60 minutes
**Skills practiced:** release hygiene
**Story:** maintainers should know whether builds pass, not only tests.
**Why this is a good contribution:** strengthens CI readiness.
**Acceptance criteria:** docs and workflow notes include build verification.
**Read these anchors first:** [`../../package.json#L10-L12`](../../package.json#L10-L12), [`../../backend/package.json#L7-L9`](../../backend/package.json#L7-L9), [`../../frontend/package.json#L7-L8`](../../frontend/package.json#L7-L8)
**Files likely touched:** docs, maybe local verification script guidance
**Implementation plan:** run build, record result in docs.
**What could go wrong:** build exposes untested issues
**Suggested checks:** `npm run build`
**Review questions:** Should build become part of default contribution checklist?
