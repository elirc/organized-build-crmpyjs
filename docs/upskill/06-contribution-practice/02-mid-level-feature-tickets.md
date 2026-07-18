# Mid-Level Feature Tickets

## Ticket 1: App-Boot User Hydration
- Difficulty: Medium
- Cross-layer scope: frontend store, API client, `/api/auth/me`
- Design notes: boot timing, stale token fallback, loading UX
- Risk: redirect loop or flash of protected UI
- Rollback: revert to local-storage-only gating

## Ticket 2: Leads Read API
- Difficulty: Medium
- Scope: Prisma queries, route/controller/service, validation, tests
- Risk: soft-delete semantics and owner filtering
- Rollback: keep route behind non-default mount or revert module only

## Ticket 3: Companies Read API
- Difficulty: Medium
- Scope: backend module + tests
- Design notes: pagination, deleted records, search shape

## Ticket 4: Opportunities Read API With Stage Filter
- Difficulty: Medium
- Scope: schema-aware filtering, response typing, frontend integration later
- Risk: stage/status confusion

## Ticket 5: Shared Frontend Auth Error Model
- Difficulty: Medium
- Scope: API client, login page, future hooks
- Risk: changing thrown error contract

## Ticket 6: Permission-Protected Admin Example Route
- Difficulty: Medium
- Scope: route, middleware, tests, optional UI affordance
- Risk: false confidence if treated as full RBAC rollout

## Ticket 7: Runtime Validation For Persisted Auth State
- Difficulty: Medium
- Scope: frontend store plus tests
- Risk: invalidating existing sessions during upgrade

## Ticket 8: Commit Prisma Migrations And Document Workflow
- Difficulty: Medium
- Scope: database workflow, docs, maybe seed adjustments
- Risk: migration drift

## Ticket 9: Login Integration Test With Real Seeded User
- Difficulty: Medium
- Scope: backend test harness, DB setup
- Risk: test isolation, env coupling

## Ticket 10: Dashboard Data Query Skeleton
- Difficulty: Medium
- Scope: backend summary endpoint + frontend React Query hook + simple card UI
- Risk: inventing contracts too early

For every ticket above, produce design notes covering:

1. public contract
2. validation/auth implications
3. data access plan
4. tests
5. rollback
