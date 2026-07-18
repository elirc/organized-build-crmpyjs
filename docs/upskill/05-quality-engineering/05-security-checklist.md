# Security Checklist

## Current Risk Map

| Risk area | Current state | Evidence |
| --- | --- | --- |
| Input validation | present for auth payloads | [`../../backend/src/modules/auth/auth.schemas.ts#L3-L25`](../../backend/src/modules/auth/auth.schemas.ts#L3-L25) |
| Auth token verification | present | [`../../backend/src/middleware/auth.middleware.ts#L6-L27`](../../backend/src/middleware/auth.middleware.ts#L6-L27) |
| Authorization enforcement | defined but underused | [`../../backend/src/middleware/requirePermission.middleware.ts#L6-L18`](../../backend/src/middleware/requirePermission.middleware.ts#L6-L18) |
| Token storage | hashed in DB, raw in local storage | [`../../backend/src/modules/auth/auth.service.ts#L89-L96`](../../backend/src/modules/auth/auth.service.ts#L89-L96), [`../../frontend/src/auth/auth.store.ts#L39-L47`](../../frontend/src/auth/auth.store.ts#L39-L47) |
| Secrets config | env-driven | [`../../backend/src/config/env.ts#L19-L31`](../../backend/src/config/env.ts#L19-L31) |
| Rate limiting | not found | no middleware found |
| CSRF | not relevant to bearer-token flow today | current auth uses JSON + Authorization header |
| XSS | normal React escaping applies, but token-in-local-storage raises impact | frontend auth store |

## Pre-Merge Security Checklist

- Is the route authenticated on the server if it touches user data?
- If role-based, does it use `requirePermission` or equivalent?
- Are request bodies validated at runtime?
- Are secrets kept out of logs, responses, and client storage where possible?
- Did you add or update negative tests for auth failure?
- Did you change any public contract shape that could weaken auth assumptions?
