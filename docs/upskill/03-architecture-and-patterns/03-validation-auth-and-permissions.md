# Validation, Auth, And Permissions

## Validation Layers

| Layer | Example | Purpose |
| --- | --- | --- |
| Env validation | [`backend/src/config/env.ts#L19-L31`](../../backend/src/config/env.ts#L19-L31) | fail fast on invalid process config |
| Request body validation | [`backend/src/modules/auth/auth.schemas.ts#L3-L25`](../../backend/src/modules/auth/auth.schemas.ts#L3-L25), [`backend/src/modules/auth/auth.routes.ts#L10-L24`](../../backend/src/modules/auth/auth.routes.ts#L10-L24) | protect service inputs |
| Password verification | [`backend/src/modules/auth/auth.service.ts#L72-L76`](../../backend/src/modules/auth/auth.service.ts#L72-L76) | credential check |
| Frontend form handling | [`frontend/src/auth/LoginPage.tsx#L15-L29`](../../frontend/src/auth/LoginPage.tsx#L15-L29) | UX feedback only, not trust boundary |

## Authentication

- Access tokens are signed in [`backend/src/shared/utils/jwt.ts#L18-L31`](../../backend/src/shared/utils/jwt.ts#L18-L31).
- Refresh tokens are signed in [`backend/src/shared/utils/jwt.ts#L33-L46`](../../backend/src/shared/utils/jwt.ts#L33-L46).
- Access token verification and request identity hydration happen in [`backend/src/middleware/auth.middleware.ts#L6-L27`](../../backend/src/middleware/auth.middleware.ts#L6-L27).

## Authorization

- Permission vocabulary lives in [`backend/src/auth/permissions.ts#L1-L14`](../../backend/src/auth/permissions.ts#L1-L14).
- Role-to-permission mapping lives in [`backend/src/auth/permissions.ts#L16-L43`](../../backend/src/auth/permissions.ts#L16-L43).
- Permission enforcement middleware lives in [`backend/src/middleware/requirePermission.middleware.ts#L6-L18`](../../backend/src/middleware/requirePermission.middleware.ts#L6-L18).

Important current limitation:

- No route currently uses `requirePermission`, so RBAC is defined but not yet exercised by a feature route.

## What Juniors Usually Miss

- Client redirects are not authorization.
- JWT verification proves token validity, not that the user still has permission for every resource shape.
- Validation is a boundary concern, not a replacement for domain rules.

## What Seniors Check

- Is every sensitive route protected at the server layer?
- Are role names the only auth source, or are there resource ownership checks too?
- Do persisted refresh tokens have lifecycle parity with JWT expiry config?
