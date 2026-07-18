# Senior Build Projects

## Project 1: Finish The CRM Read Model
- Problem statement: schema exists for core CRM entities but runtime read modules are mostly absent.
- Product value: turns scaffold into a usable internal CRM foundation.
- Design checklist: routing conventions, pagination, deleted-record handling, response contracts.
- Likely files/modules: new backend modules for leads/companies/contacts/opportunities, frontend query hooks.
- Migration plan: additive endpoints only.
- Test plan: route tests, service tests, frontend hook smoke tests.
- Security plan: apply auth and role checks from first endpoint.
- Performance plan: paginated queries and index-aware filters.
- Rollout/rollback plan: merge module by module.
- Open questions: ownership filtering, search shape, response normalization.
- Stretch goals: shared query helpers.

## Project 2: Auth Hardening And Session Lifecycle
- Problem statement: auth works, but frontend session hydration and refresh flows are thin.
- Product value: more trustworthy login/session behavior.
- Design checklist: refresh cadence, expiry alignment, logout semantics, storage model.
- Likely files/modules: auth service, JWT utils, frontend auth store, API client.
- Migration plan: preserve current login contract first.
- Test plan: login, me, refresh, logout happy and sad paths.
- Security plan: evaluate move away from local-storage access token strategy.
- Performance plan: avoid eager repeated `/me` calls.
- Rollout/rollback plan: feature-flagged or incremental hydration changes.
- Open questions: cookies vs bearer storage, refresh failure UX.
- Stretch goals: session schema validation and revocation metrics.

## Project 3: CI And Contribution Safety Net
- Problem statement: no CI workflow was found.
- Product value: trust in changes and onboarding consistency.
- Design checklist: install, typecheck, lint, tests, build, Prisma generate.
- Likely files/modules: workflow files, docs, maybe package scripts.
- Migration plan: start with non-blocking workflow if needed.
- Test plan: validate on pull request and manual branches.
- Security plan: secret handling and fork-safe workflows.
- Performance plan: cache dependencies and avoid redundant work.
- Rollout/rollback plan: easy to revert workflow-only changes.
- Open questions: whether DB-backed tests should run in CI.
- Stretch goals: artifact upload and coverage reporting.

## Project 4: Redis Decision Project
- Problem statement: Redis is provisioned but unused.
- Product value: either remove cognitive overhead or justify async capability.
- Design checklist: keep, remove, or implement one concrete job-backed feature.
- Likely files/modules: `docker-compose.yml`, docs, possible future worker package.
- Migration plan: no-op if removed; additive if implemented.
- Test plan: local infra docs and worker smoke tests if added.
- Security plan: secrets and queue access model.
- Performance plan: job retries and backpressure.
- Rollout/rollback plan: if adding worker, keep API independent first.
- Open questions: what first background job actually matters.
- Stretch goals: notification or audit export jobs.

## Project 5: Frontend Data Layer Standardization
- Problem statement: React Query provider exists, but no query hooks or cache patterns exist yet.
- Product value: future features land with consistent data-fetching patterns.
- Design checklist: hook naming, cache keys, error model, loading UI, invalidation rules.
- Likely files/modules: `frontend/src/app/providers.tsx`, `frontend/src/api/*`, future `features/*`.
- Migration plan: add one feature path first, then document pattern.
- Test plan: hook tests or component integration tests.
- Security plan: ensure auth headers remain centralized.
- Performance plan: avoid duplicate network requests and overbroad invalidation.
- Rollout/rollback plan: feature-by-feature adoption.
- Open questions: whether to centralize hooks by entity or page.
- Stretch goals: suspense or optimistic UI later.
