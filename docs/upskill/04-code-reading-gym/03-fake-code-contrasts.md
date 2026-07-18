# Fake Code Contrasts

## Contrast 1: Coupling UI Shape To DB Shape

```ts
// Illustrative fake code: not from this repo.
setLead({ ...dbLeadRow });
```

Better shape: use frontend contracts like [`../../frontend/src/api/auth.api.ts#L3-L22`](../../frontend/src/api/auth.api.ts#L3-L22) instead of assuming DB rows are page state.

## Contrast 2: Missing Permission Middleware

```ts
// Illustrative fake code: not from this repo.
router.post("/admin-only", asyncHandler(controller.doThing));
```

Better shape: compose auth and permission middleware like the existing pattern in [`../../backend/src/middleware/requirePermission.middleware.ts#L6-L18`](../../backend/src/middleware/requirePermission.middleware.ts#L6-L18).

## Contrast 3: Swallowing Async Errors

```ts
// Illustrative fake code: not from this repo.
app.get("/x", async (_req, res) => {
  await doWork();
  res.json({ ok: true });
});
```

Better shape: wrap with [`../../backend/src/shared/utils/asyncHandler.ts#L5-L8`](../../backend/src/shared/utils/asyncHandler.ts#L5-L8).

## Contrast 4: Storing Raw Refresh Tokens

```ts
// Illustrative fake code: not from this repo.
await prisma.refreshToken.create({ data: { token: refreshToken } });
```

Better shape: hash before storage as in [`../../backend/src/modules/auth/auth.service.ts#L89-L96`](../../backend/src/modules/auth/auth.service.ts#L89-L96).

## Contrast 5: Treating Route Guard As Security

```ts
// Illustrative fake code: not from this repo.
if (!user) return null;
```

Better shape: keep client guard for UX, but enforce auth on the backend with [`../../backend/src/middleware/auth.middleware.ts#L6-L27`](../../backend/src/middleware/auth.middleware.ts#L6-L27).

## Contrast 6: Unsafe Local Storage Parse

```ts
// Illustrative fake code: not from this repo.
const session = JSON.parse(localStorage.getItem("auth")!);
```

Better shape: at minimum guard missing data as in [`../../frontend/src/auth/auth.store.ts#L24-L31`](../../frontend/src/auth/auth.store.ts#L24-L31); ideally add schema validation too.

## Contrast 7: Casual Public Contract Change

```ts
// Illustrative fake code: not from this repo.
return { token, userId };
```

Better shape: honor the existing login response shape in [`../../frontend/src/api/auth.api.ts#L18-L22`](../../frontend/src/api/auth.api.ts#L18-L22) and [`../../backend/src/modules/auth/auth.service.ts#L98-L102`](../../backend/src/modules/auth/auth.service.ts#L98-L102).

## Contrast 8: Config Hidden In Code

```ts
// Illustrative fake code: not from this repo.
fetch("http://prod.example.com/api/login");
```

Better shape: centralize transport config. The repo currently centralizes but hard-codes it in [`../../frontend/src/api/client.ts#L1-L1`](../../frontend/src/api/client.ts#L1-L1); the next step is env-driven centralization.
