# Tooling And Build System

## Verified Commands

- Root checks in [`package.json#L7-L20`](../../package.json#L7-L20)
- Backend scripts in [`backend/package.json#L6-L16`](../../backend/package.json#L6-L16)
- Frontend scripts in [`frontend/package.json#L6-L12`](../../frontend/package.json#L6-L12)

## Build Mental Model

1. Root script delegates to workspace scripts.
2. Backend uses `tsx` for dev and `tsc` for build.
3. Frontend uses Vite for dev/build and Vitest for tests.
4. Prisma client generation is explicit, not implicit.

## Sharp Edges

- No formatter script was found.
- No CI config was found.
- No migration folder was found, so schema evolution practice is currently inferred rather than inspectable.
