# Performance Thinking

## Measure First

The repo is small enough that premature optimization would mostly be noise. Still, there are performance domains worth recognizing now.

| Domain | Current example | Likely future hotspot |
| --- | --- | --- |
| Browser render | [`../../frontend/src/App.tsx#L8-L30`](../../frontend/src/App.tsx#L8-L30) | large dashboard tables and filters |
| Network | [`../../frontend/src/api/client.ts#L9-L29`](../../frontend/src/api/client.ts#L9-L29) | duplicated fetches, missing caching |
| Server | [`../../backend/src/modules/auth/auth.service.ts#L63-L103`](../../backend/src/modules/auth/auth.service.ts#L63-L103) | auth rate limiting, serial DB calls |
| DB | [`../../backend/prisma/schema.prisma#L53-L56`](../../backend/prisma/schema.prisma#L53-L56) | list endpoints with missing composite indexes |

## What To Watch

- N+1 query risk will arrive when lead/company/contact list endpoints are added.
- React Query provider exists, so cache key design will matter once data fetching grows.
- Hard-coded API base URL makes multi-environment profiling harder.
