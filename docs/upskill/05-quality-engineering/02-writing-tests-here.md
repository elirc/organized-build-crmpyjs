# Writing Tests Here

## Existing Recipes

- Backend request test pattern: [`../../backend/src/app.test.ts#L1-L13`](../../backend/src/app.test.ts#L1-L13)
- Frontend render test pattern: [`../../frontend/src/App.test.tsx#L1-L11`](../../frontend/src/App.test.tsx#L1-L11)

## Recipes To Add Next

1. Happy-path login returns tokens.
2. Wrong password returns `401`.
3. Invalid login payload returns `400`.
4. `/api/auth/me` rejects missing bearer token.
5. Permission middleware rejects missing permission.
6. Auth store clears persisted session correctly.
7. Route guard redirects unauthenticated users.

## Commands

```bash
npm --workspace backend run test
npm --workspace frontend run test
npm test
```

Verified in this repo.
