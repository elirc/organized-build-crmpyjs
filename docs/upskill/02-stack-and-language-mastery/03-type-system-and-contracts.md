# Type System And Contracts

## TypeScript Contracts In This Repo

| Contract type | Example | Why it matters |
| --- | --- | --- |
| Runtime config contract | [`backend/src/config/env.ts#L19-L31`](../../backend/src/config/env.ts#L19-L31) | invalid env crashes early |
| Request payload contract | [`backend/src/modules/auth/auth.schemas.ts#L3-L25`](../../backend/src/modules/auth/auth.schemas.ts#L3-L25) | transport validation |
| Request augmentation contract | [`backend/src/types/express.d.ts#L3-L17`](../../backend/src/types/express.d.ts#L3-L17) | typed `req.user` |
| Frontend auth response contract | [`frontend/src/api/auth.api.ts#L3-L22`](../../frontend/src/api/auth.api.ts#L3-L22) | client expectation for login payload |

## What A Mid-Level Engineer Should Notice

- The frontend trust boundary is weaker than the backend trust boundary because `JSON.parse` results in [`frontend/src/auth/auth.store.ts#L34-L35`](../../frontend/src/auth/auth.store.ts#L34-L35) are cast, not validated.
- The backend exposes `role` as a Prisma `Role` type in service logic but serializes it as JSON to the frontend.
- `apiRequest<T>` in [`frontend/src/api/client.ts#L9-L29`](../../frontend/src/api/client.ts#L9-L29) is compile-time helpful but runtime-trusting.

## Drill

Find one place where the repo has strong runtime validation and one where it has only compile-time trust.
