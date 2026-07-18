# Side Effects, Async, And Reliability

## Side Effects Present Today

| Side effect | Where | Reliability concern |
| --- | --- | --- |
| Prisma DB connect | [`backend/src/server.ts#L5-L8`](../../backend/src/server.ts#L5-L8) | startup availability |
| Refresh token persistence | [`backend/src/modules/auth/auth.service.ts#L89-L96`](../../backend/src/modules/auth/auth.service.ts#L89-L96) | token write consistency |
| Token revocation update | [`backend/src/modules/auth/auth.service.ts#L140-L151`](../../backend/src/modules/auth/auth.service.ts#L140-L151) | idempotent update semantics |
| Local storage write | [`frontend/src/auth/auth.store.ts#L39-L47`](../../frontend/src/auth/auth.store.ts#L39-L47) | browser state corruption |

## Async Concepts This Repo Naturally Teaches

- Promise rejection forwarding with `asyncHandler`
- Process boot sequencing
- Client submit pending state in [`frontend/src/auth/LoginPage.tsx#L18-L28`](../../frontend/src/auth/LoginPage.tsx#L18-L28)

## Patterns Not Yet Implemented

- Queues, retries, or jobs
- Webhooks
- Idempotency keys
- Outbox/event publishing

Redis in [`docker-compose.yml#L19-L28`](../../docker-compose.yml#L19-L28) suggests future async plans, but no worker code exists yet.

## Risky Places To Watch

- Login writes a refresh token, but there is no transaction because only one write follows the read path.
- Seed script can partially populate if it fails mid-run.
- Frontend local storage writes are not guarded by try/catch.
