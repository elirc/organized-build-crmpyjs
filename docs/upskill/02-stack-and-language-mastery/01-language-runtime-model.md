# Language And Runtime Model

## JavaScript And Node

### Concept -> Code -> Drill

**Concept:** JavaScript async work is promise-based and can fail after the current call stack returns.  
**Why it matters:** In backend code, one missed rejection path can turn into hung requests or unhandled errors.  
**Code:** [`backend/src/shared/utils/asyncHandler.ts#L3-L8`](../../backend/src/shared/utils/asyncHandler.ts#L3-L8) wraps async route handlers so rejections go to Express error handling.  
**Failure modes:** Without this wrapper, thrown async errors can bypass Express’s sync error path.  
**Drill:** Explain why `void handler(...).catch(next)` is preferable to calling `handler` without awaiting it.  
**Self-grade:** Strong answers mention promise rejection forwarding, not just “it catches errors.”

Other runtime anchors:

- Import-time config parsing in [`backend/src/config/env.ts#L19-L31`](../../backend/src/config/env.ts#L19-L31)
- Process boot sequencing in [`backend/src/server.ts#L5-L17`](../../backend/src/server.ts#L5-L17)
- Browser-only globals in [`frontend/src/auth/auth.store.ts#L15-L35`](../../frontend/src/auth/auth.store.ts#L15-L35)

## React Runtime

**Concept:** React renders based on state snapshots, not direct DOM mutation.  
**Code:** [`frontend/src/auth/LoginPage.tsx#L10-L13`](../../frontend/src/auth/LoginPage.tsx#L10-L13) stores form and UI state with `useState`, then uses async submission logic in [`frontend/src/auth/LoginPage.tsx#L15-L29`](../../frontend/src/auth/LoginPage.tsx#L15-L29).  
**Why it matters:** You need to know where state lives so you do not fight the render cycle or duplicate server state in the wrong place.  
**Pitfall checklist:**

- Do not store backend collections in Zustand just because it is available.
- Do not mutate values in place and expect React to notice.
- Do not confuse route protection UI with backend authorization.

**Drill:** Why is auth stored in Zustand but routed data not yet stored there?

## Browser vs Server Constraints

| Constraint | Repo example | Lesson |
| --- | --- | --- |
| Browser has `window` and `localStorage` | [`frontend/src/auth/auth.store.ts#L16-L24`](../../frontend/src/auth/auth.store.ts#L16-L24) | guard browser-only globals |
| Server has direct DB access | [`backend/src/modules/auth/auth.service.ts#L40-L58`](../../backend/src/modules/auth/auth.service.ts#L40-L58) | services can use Prisma directly |
| Browser can be bypassed | frontend auth guard vs backend middleware | never trust client-only checks |
