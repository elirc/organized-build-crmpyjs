# Trace Tables

## UI To API Trace: Login Submit

| Step | File | Value shape | Owner | Transformation | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | [`../../frontend/src/auth/LoginPage.tsx#L10-L23`](../../frontend/src/auth/LoginPage.tsx#L10-L23) | `string` email/password | component state | form state -> request payload | empty values rely on backend validation |
| 2 | [`../../frontend/src/api/auth.api.ts#L24-L29`](../../frontend/src/api/auth.api.ts#L24-L29) | `{email,password}` | API module | payload -> `apiRequest` call | thin wrapper, no retry |
| 3 | [`../../frontend/src/api/client.ts#L9-L29`](../../frontend/src/api/client.ts#L9-L29) | request options | transport helper | options -> `fetch` request | hard-coded base URL |
| 4 | [`../../backend/src/modules/auth/auth.routes.ts#L29-L29`](../../backend/src/modules/auth/auth.routes.ts#L29-L29) | raw JSON | route | raw -> validated body | route-local validation only |
| 5 | [`../../backend/src/modules/auth/auth.service.ts#L78-L102`](../../backend/src/modules/auth/auth.service.ts#L78-L102) | user row -> tokens | service | credentials -> tokens + DB row | no rate limiting |

## Persistence Trace: Refresh Token Storage

| Step | File | Value shape | Owner | Transformation | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | [`../../backend/src/modules/auth/auth.service.ts#L78-L87`](../../backend/src/modules/auth/auth.service.ts#L78-L87) | raw token strings | auth service | token payload -> signed JWTs | secret misuse |
| 2 | [`../../backend/src/modules/auth/auth.service.ts#L10-L12`](../../backend/src/modules/auth/auth.service.ts#L10-L12) | token string | auth service | raw token -> SHA-256 hash | no salt, but acceptable for random token material |
| 3 | [`../../backend/src/modules/auth/auth.service.ts#L89-L96`](../../backend/src/modules/auth/auth.service.ts#L89-L96) | refresh token row | Prisma | hash + expiry -> persisted row | expiry drift |

## Auth Trace: `Authorization` Header To `req.user`

| Step | File | Value shape | Owner | Transformation | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | [`../../frontend/src/api/client.ts#L12-L16`](../../frontend/src/api/client.ts#L12-L16) | header map | client | token -> `Bearer ...` | missing token |
| 2 | [`../../backend/src/middleware/auth.middleware.ts#L7-L13`](../../backend/src/middleware/auth.middleware.ts#L7-L13) | header string | middleware | header -> raw JWT | malformed prefix |
| 3 | [`../../backend/src/shared/utils/jwt.ts#L48-L53`](../../backend/src/shared/utils/jwt.ts#L48-L53) | JWT string | JWT util | JWT -> payload | invalid signature |
| 4 | [`../../backend/src/middleware/auth.middleware.ts#L16-L21`](../../backend/src/middleware/auth.middleware.ts#L16-L21) | payload | middleware | payload -> typed request user | route ordering contract |

## Error Trace: Wrong Password

| Step | File | Value shape | Owner | Transformation | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | [`../../backend/src/modules/auth/auth.service.ts#L72-L76`](../../backend/src/modules/auth/auth.service.ts#L72-L76) | bcrypt result | service | false -> `AppError` | none |
| 2 | [`../../backend/src/app.ts#L56-L60`](../../backend/src/app.ts#L56-L60) | `AppError` | error middleware | domain error -> HTTP JSON | logs may be noisy |
| 3 | [`../../frontend/src/api/client.ts#L19-L21`](../../frontend/src/api/client.ts#L19-L21) | error response body | transport helper | JSON -> generic `Error` | loses code |
| 4 | [`../../frontend/src/auth/LoginPage.tsx#L24-L26`](../../frontend/src/auth/LoginPage.tsx#L24-L26) | thrown error | UI | error -> message state | weak differentiation |

## Startup Trace: Config To Listener

| Step | File | Value shape | Owner | Transformation | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | [`../../backend/src/config/env.ts#L19-L31`](../../backend/src/config/env.ts#L19-L31) | env strings | config | strings -> typed config | startup crash |
| 2 | [`../../backend/src/server.ts#L5-L8`](../../backend/src/server.ts#L5-L8) | Prisma promise | server bootstrap | connect before listen | boot hang |
| 3 | [`../../backend/src/server.ts#L8-L10`](../../backend/src/server.ts#L8-L10) | port number | server bootstrap | config -> listener | port collision |
