# Fast Track

This is the weekend path. The goal is not mastery. The goal is to get the project running, trace one real feature, and make one small safe change without getting lost.

## What You Will Learn

- How the monorepo starts and where the backend/frontend split lives.
- How login works from React form to Express service.
- How schema, seed data, and auth are connected.
- How to run the checks maintainers would care about today.

## Install, Run, Test

Commands below are marked as verified or inferred.

1. Start infrastructure. Verified via Docker tooling availability, not by starting containers in this pass.

```bash
docker compose up -d
```

2. Install workspace dependencies. Verified.

```bash
npm install --workspaces --include-workspace-root
```

3. Generate Prisma client. Verified.

```bash
npm --workspace backend run prisma:generate
```

4. Apply a local schema. Inferred from package scripts and README.

```bash
npm --workspace backend run prisma:migrate:dev -- --name init
```

5. Seed the CRM data. Inferred from package scripts and seed file.

```bash
npm --workspace backend run prisma:seed
```

6. Start the apps. Inferred from script shape.

```bash
npm run dev
```

7. Run checks. Verified.

```bash
npm run typecheck
npm run lint
npm test
```

## Two End-to-End Flows To Trace

### Flow 1: Frontend login to token issuance

Open these files first:

- [`frontend/src/auth/LoginPage.tsx#L7-L56`](../../frontend/src/auth/LoginPage.tsx#L7-L56)
- [`frontend/src/api/auth.api.ts#L24-L35`](../../frontend/src/api/auth.api.ts#L24-L35)
- [`frontend/src/api/client.ts#L9-L29`](../../frontend/src/api/client.ts#L9-L29)
- [`backend/src/modules/auth/auth.routes.ts#L26-L32`](../../backend/src/modules/auth/auth.routes.ts#L26-L32)
- [`backend/src/modules/auth/auth.service.ts#L63-L103`](../../backend/src/modules/auth/auth.service.ts#L63-L103)

What to notice:

- The React form does not talk to `fetch` directly; it goes through an API wrapper.
- Validation happens in the backend route layer before the service sees the payload.
- Password verification and refresh token persistence both happen in the service layer.

### Flow 2: Protected route guard in the browser

Open these files first:

- [`frontend/src/app/router.tsx#L7-L21`](../../frontend/src/app/router.tsx#L7-L21)
- [`frontend/src/auth/RequireAuth.tsx#L5-L13`](../../frontend/src/auth/RequireAuth.tsx#L5-L13)
- [`frontend/src/auth/auth.store.ts#L37-L63`](../../frontend/src/auth/auth.store.ts#L37-L63)

What to notice:

- The router nests the protected app under `RequireAuth`.
- The auth store persists session state in local storage.
- There is no token refresh flow in the frontend yet. That is a future ownership exercise.

## The First 10 Files To Open

1. [`package.json#L1-L23`](../../package.json#L1-L23) - root scripts and workspace shape.
2. [`README.md#L1-L35`](../../README.md#L1-L35) - intended setup path.
3. [`docker-compose.yml#L1-L31`](../../docker-compose.yml#L1-L31) - runtime dependencies.
4. [`backend/package.json#L1-L49`](../../backend/package.json#L1-L49) - backend commands.
5. [`frontend/package.json#L1-L36`](../../frontend/package.json#L1-L36) - frontend commands.
6. [`backend/prisma/schema.prisma#L10-L345`](../../backend/prisma/schema.prisma#L10-L345) - domain model.
7. [`backend/src/app.ts#L13-L66`](../../backend/src/app.ts#L13-L66) - HTTP boundary and middleware.
8. [`backend/src/modules/auth/auth.service.ts#L32-L167`](../../backend/src/modules/auth/auth.service.ts#L32-L167) - core implemented business logic.
9. [`frontend/src/app/router.tsx#L7-L21`](../../frontend/src/app/router.tsx#L7-L21) - UI routing.
10. [`frontend/src/auth/LoginPage.tsx#L15-L29`](../../frontend/src/auth/LoginPage.tsx#L15-L29) - real user action.

## One Small Safe Change

Try changing the text in the dashboard card title from `Phase 1 Ready` to `Foundation Ready` in [`frontend/src/App.tsx#L20-L27`](../../frontend/src/App.tsx#L20-L27), then run:

```bash
npm run typecheck
npm run lint
npm test
```

Why this is safe:

- It is UI-only.
- It does not change runtime contracts.
- It gives you practice with the edit-check loop.

## One Test Or Check To Run

Run the backend health test:

```bash
npm --workspace backend run test
```

Then open [`backend/src/app.test.ts#L6-L13`](../../backend/src/app.test.ts#L6-L13) and explain why this test only proves the HTTP shell is alive, not that auth or database writes work.

## Teach-Back Exercise

Write 5-8 sentences answering:

1. Where does login validation happen?
2. Where does password checking happen?
3. Where is the access token created?
4. Where is the refresh token stored?
5. What stops an unauthenticated user from seeing `/` in the browser?

## What This Fast Path Does Not Cover

- Prisma migrations in depth.
- Background jobs, because none are implemented yet.
- Real feature modules like leads or opportunities, because the repo does not have them yet.
- CI pipelines, because no workflow files were found.

## Verification Notes

- Verified: `npm install --workspaces --include-workspace-root`, `npm --workspace backend run prisma:generate`, `npm run typecheck`, `npm run lint`, `npm test`.
- Inferred: `docker compose up -d`, `npm --workspace backend run prisma:migrate:dev -- --name init`, `npm --workspace backend run prisma:seed`, `npm run dev`.
- No `.git` directory was present during inspection, so branch/PR workflow notes are necessarily inferred.
