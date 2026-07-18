# Framework Mental Models

## Express

- Middleware stack is ordered composition. See [`backend/src/app.ts#L13-L21`](../../backend/src/app.ts#L13-L21).
- Routes bind transport concerns to service calls. See [`backend/src/modules/auth/auth.routes.ts#L28-L32`](../../backend/src/modules/auth/auth.routes.ts#L28-L32).
- Controllers here are intentionally thin. See [`backend/src/modules/auth/auth.controller.ts#L5-L32`](../../backend/src/modules/auth/auth.controller.ts#L5-L32).

Pitfall:

- Putting business rules in route handlers feels fast early, but it becomes hard to test and reuse.

## Prisma

- Schema is the central relational contract. See [`backend/prisma/schema.prisma#L10-L345`](../../backend/prisma/schema.prisma#L10-L345).
- Prisma client is shared via a singleton pattern in [`backend/src/db/prisma.ts#L3-L15`](../../backend/src/db/prisma.ts#L3-L15).
- Current auth code uses direct Prisma calls in a service rather than repository classes.

Pitfall:

- Soft-delete fields exist in schema, but no reusable query helpers enforce them yet.

## React Router

- Routes are declared as a tree in [`frontend/src/app/router.tsx#L7-L21`](../../frontend/src/app/router.tsx#L7-L21).
- Protected routes are wrappers around nested children rather than checks inside every page.

## React Query

- The provider is present in [`frontend/src/app/providers.tsx#L1-L8`](../../frontend/src/app/providers.tsx#L1-L8), but no query hooks are implemented yet.
- This is a good teaching moment: scaffolding a tool is not the same as using it well.
