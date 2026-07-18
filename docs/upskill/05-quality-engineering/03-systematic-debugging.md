# Systematic Debugging

## Method

1. Reproduce.
2. Narrow the layer.
3. Form a cheap hypothesis.
4. Probe with the smallest useful signal.
5. Fix the root cause.
6. Add regression coverage.

## Scenario: Login Fails With "Request failed"
**Reproduction:** submit the login form with backend down or returning non-JSON.
**First question:** Is the bug in frontend transport or backend auth?
**Narrowing path:**
1. Check browser network panel for `/api/auth/login`.
2. If no request is made, inspect [`../../frontend/src/auth/LoginPage.tsx#L15-L29`](../../frontend/src/auth/LoginPage.tsx#L15-L29).
3. If request is made but target is wrong, inspect [`../../frontend/src/api/client.ts#L1-L17`](../../frontend/src/api/client.ts#L1-L17).
4. If backend returns 401, inspect [`../../backend/src/modules/auth/auth.service.ts#L68-L76`](../../backend/src/modules/auth/auth.service.ts#L68-L76).
**Useful probes:**
- network panel
- temporary console logging in `apiRequest`
- backend console output from `morgan`
**Likely root causes:**
- hard-coded API URL mismatch
- wrong seeded password
- backend not running
**Regression test to add:**
- mocked frontend login failure state test
**Senior lesson:** generic client errors reduce debugging speed.

## Scenario: `/api/auth/me` Returns 401
**Reproduction:** call endpoint without or with bad bearer token.
**First question:** Did the client send a header at all?
**Narrowing path:**
1. Inspect request headers.
2. If header missing, trace caller through [`../../frontend/src/api/client.ts#L12-L16`](../../frontend/src/api/client.ts#L12-L16).
3. If header present, inspect [`../../backend/src/middleware/auth.middleware.ts#L7-L25`](../../backend/src/middleware/auth.middleware.ts#L7-L25).
**Likely root causes:**
- stale local token
- malformed `Bearer` prefix
- wrong signing secret
**Regression test to add:**
- backend `/me` auth rejection tests
**Senior lesson:** auth failures are boundary bugs, not page bugs.

## Scenario: App Boots But DB Health Fails
**Reproduction:** backend runs, `/health` passes, `/health/db` fails.
**Useful probes:**
- `docker compose ps`
- backend logs
- [`../../backend/src/app.ts#L31-L39`](../../backend/src/app.ts#L31-L39)
**Likely root causes:**
- wrong `DATABASE_URL`
- Postgres container not healthy
**Senior lesson:** liveness and readiness are different contracts.

## Scenario: Protected Route Flickers Or Redirects Unexpectedly
**Reproduction:** refresh browser on `/`.
**Useful probes:**
- inspect local storage contents
- inspect [`../../frontend/src/auth/auth.store.ts#L15-L35`](../../frontend/src/auth/auth.store.ts#L15-L35)
- inspect [`../../frontend/src/auth/RequireAuth.tsx#L5-L13`](../../frontend/src/auth/RequireAuth.tsx#L5-L13)
**Likely root causes:**
- invalid stored JSON
- session missing `user`
**Senior lesson:** persisted client state deserves validation too.

## Scenario: Seed Script Partially Applies
**Reproduction:** interrupt `prisma:seed` or introduce a bad relation.
**Useful probes:**
- inspect write order in [`../../backend/prisma/seed.ts#L7-L437`](../../backend/prisma/seed.ts#L7-L437)
**Likely root causes:**
- missing transaction
- schema drift
**Senior lesson:** bootstrap scripts are production code for developer experience.
