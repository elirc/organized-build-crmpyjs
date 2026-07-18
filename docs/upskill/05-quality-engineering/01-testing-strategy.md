# Testing Strategy

## Current Test Layers

| Layer | Evidence | Current status |
| --- | --- | --- |
| Backend HTTP-shell test | [`../../backend/src/app.test.ts#L6-L13`](../../backend/src/app.test.ts#L6-L13) | present |
| Frontend render smoke test | [`../../frontend/src/App.test.tsx#L6-L11`](../../frontend/src/App.test.tsx#L6-L11) | present |
| Integration tests | none found | missing |
| E2E tests | none found | missing |
| Type checks | root scripts in [`../../package.json#L13-L14`](../../package.json#L13-L14) | present |

## What Belongs Where

- Unit test: pure helpers like token hashing or permission checks.
- Service test: auth service behavior with DB setup or mocks.
- Router/API test: payload validation and status codes.
- UI test: login page interactions and route guard behavior.
- E2E test: full login and protected route navigation once full boot is stable.

## What Not To Test

- Do not snapshot CSS-heavy presentation by default.
- Do not test Prisma internals.
- Do not duplicate the same happy path at every layer unless you need contract coverage.
