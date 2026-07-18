# Interview Prep From This Repo

This file turns the repo into interview practice for mid-level software engineering roles. It also includes Python and JavaScript prep. Important honesty note: the repo itself is TypeScript/React/Node, not Python, so Python sections use direct concept transfer rather than claiming Python code exists here.

## JavaScript Runtime Questions

### Prompt: Why use an async handler wrapper in Express?

- Repo anchor: [`../../backend/src/shared/utils/asyncHandler.ts#L3-L8`](../../backend/src/shared/utils/asyncHandler.ts#L3-L8)
- Junior answer: “It catches async errors.”
- Mid-level answer: “Express does not reliably surface rejected async route promises without forwarding them to `next`, so this wrapper preserves centralized error handling.”
- Senior answer: “It standardizes async failure translation at the transport boundary, reduces duplicated try/catch noise, and makes the error middleware in [`../../backend/src/app.ts#L53-L65`](../../backend/src/app.ts#L53-L65) the single HTTP translation point.”

### Prompt: What is the difference between compile-time and runtime validation?

- Repo anchors: [`../../backend/src/modules/auth/auth.schemas.ts#L3-L25`](../../backend/src/modules/auth/auth.schemas.ts#L3-L25), [`../../frontend/src/auth/auth.store.ts#L34-L35`](../../frontend/src/auth/auth.store.ts#L34-L35)
- Mid-level talking point: Zod protects runtime request input; `as Pick<AuthState, ...>` only tells TypeScript to trust parsed JSON.

## Python Interview Prep Using This Repo’s Concepts

Even though there is no Python source here, these interview concepts transfer directly:

### Prompt: If this auth service were written in Python, what patterns would stay the same?

- Repo anchors: [`../../backend/src/modules/auth/auth.service.ts#L32-L167`](../../backend/src/modules/auth/auth.service.ts#L32-L167)
- Strong answer:
  - keep transport separate from domain logic
  - validate request data at the boundary
  - hash passwords and refresh tokens
  - persist revocation state
  - translate domain errors at the framework edge

### Prompt: How would you explain this codebase to a Python interviewer?

- “The language is different, but the architecture is familiar: framework routes call a service layer; the service owns auth rules and DB coordination; the schema models CRM entities; middleware attaches request identity; the frontend route guard is a UX layer, not a security layer.”

### Prompt: What Python sharp edge is analogous to the local-storage trust issue?

- Repo anchor: [`../../frontend/src/auth/auth.store.ts#L24-L35`](../../frontend/src/auth/auth.store.ts#L24-L35)
- Good answer: `json.loads(...)` followed by trusting the resulting dict shape without Pydantic/dataclass validation.

## Framework Questions

- Why keep controllers thin? See [`../../backend/src/modules/auth/auth.controller.ts#L5-L32`](../../backend/src/modules/auth/auth.controller.ts#L5-L32).
- Why is React Query present even though queries are not yet implemented? See [`../../frontend/src/app/providers.tsx#L1-L8`](../../frontend/src/app/providers.tsx#L1-L8).
- Why is client route protection insufficient? Compare [`../../frontend/src/auth/RequireAuth.tsx#L5-L13`](../../frontend/src/auth/RequireAuth.tsx#L5-L13) with [`../../backend/src/middleware/auth.middleware.ts#L6-L27`](../../backend/src/middleware/auth.middleware.ts#L6-L27).

## Debugging Questions

1. A login succeeds but `/me` returns 401. Walk the likely layers.
2. The frontend works locally but fails in another environment. Where do you inspect first?
3. A refresh token row exists but refresh fails. Which comparisons matter?

## System Design Questions

1. How would you extend this scaffold to support leads list + details safely?
2. How would you migrate from local-storage tokens to httpOnly cookies?
3. Would you keep Redis in the stack now or remove it until async work exists?

## Code Review Questions

1. What is the highest-risk line in the frontend auth flow right now?
2. Where is there a hidden contract between middleware and controller?
3. What existing pattern should a new feature module follow?

## “Tell Me About A Time” Prompts Using This Repo

- Tell me about a time you identified a boundary leak.
- Tell me about a time you improved configuration safety.
- Tell me about a time you found a security tradeoff that was acceptable short term but needed a roadmap.

Use this repo to rehearse answers:

- hard-coded API URL
- unvalidated local-storage parse
- RBAC defined before full route adoption
- richer schema than runtime surface

## Self-Grading

- Weak: describes only technologies.
- Solid: names real boundaries and tradeoffs with anchors.
- Strong: ties code evidence to design judgment, tests, security, and migration strategy.
