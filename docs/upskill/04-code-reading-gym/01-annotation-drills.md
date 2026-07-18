# Annotation Drills

Annotate each target for inputs, outputs, dependencies, invariants, side effects, and failure modes.

## Drill 1

- Target: [`../../backend/src/config/env.ts#L4-L31`](../../backend/src/config/env.ts#L4-L31)
- Task: annotate which values are optional, which are test-only fallbacks, and which crash startup.

## Drill 2

- Target: [`../../backend/src/db/prisma.ts#L3-L15`](../../backend/src/db/prisma.ts#L3-L15)
- Task: annotate why `globalThis` is involved and what environment assumption it encodes.

## Drill 3

- Target: [`../../backend/src/modules/auth/auth.routes.ts#L10-L32`](../../backend/src/modules/auth/auth.routes.ts#L10-L32)
- Task: annotate where validation ends and route registration begins.

## Drill 4

- Target: [`../../backend/src/modules/auth/auth.service.ts#L63-L103`](../../backend/src/modules/auth/auth.service.ts#L63-L103)
- Task: annotate every read, write, secret-handling step, and thrown error.

## Drill 5

- Target: [`../../backend/src/middleware/auth.middleware.ts#L6-L27`](../../backend/src/middleware/auth.middleware.ts#L6-L27)
- Task: annotate the trust boundary and what shape `req.user` has after the middleware runs.

## Drill 6

- Target: [`../../frontend/src/auth/LoginPage.tsx#L15-L29`](../../frontend/src/auth/LoginPage.tsx#L15-L29)
- Task: annotate UI state transitions during submit.

## Drill 7

- Target: [`../../frontend/src/auth/auth.store.ts#L15-L35`](../../frontend/src/auth/auth.store.ts#L15-L35)
- Task: annotate what happens on first boot, malformed storage, and server-side rendering.

## Drill 8

- Target: [`../../frontend/src/api/client.ts#L9-L29`](../../frontend/src/api/client.ts#L9-L29)
- Task: annotate where request configuration becomes runtime behavior and where error detail is lost.

## Drill 9

- Target: [`../../backend/prisma/schema.prisma#L29-L57`](../../backend/prisma/schema.prisma#L29-L57)
- Task: annotate the business lifecycle implied by the `Lead` model.

## Drill 10

- Target: [`../../backend/prisma/seed.ts#L152-L269`](../../backend/prisma/seed.ts#L152-L269)
- Task: annotate how the seed file expresses relationships between leads and opportunities.

## Self-Grading Rubric

- Weak: identifies only syntax or broad intent.
- Solid: names input/output/dependencies and at least one invariant.
- Strong: also names hidden coupling, realistic failure modes, and a test you would add.
