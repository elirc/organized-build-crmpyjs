# Observability And Operations

## What Exists

- HTTP request logging through `morgan` in [`../../backend/src/app.ts#L20-L21`](../../backend/src/app.ts#L20-L21)
- Basic health endpoints in [`../../backend/src/app.ts#L23-L41`](../../backend/src/app.ts#L23-L41)
- Console startup/failure logging in [`../../backend/src/server.ts#L8-L16`](../../backend/src/server.ts#L8-L16)

## What Does Not Exist Yet

- metrics
- tracing
- structured logging
- alerting
- deployment manifests
- rollback automation

## How Would I Know This Broke?

- Login breaks: browser form shows error and backend route logs traffic.
- DB breaks: `/health/db` fails.
- Frontend route guard breaks: `/` redirects incorrectly or never redirects.

Senior note: the repo is at the stage where adding just enough observability matters more than adding sophisticated observability.
