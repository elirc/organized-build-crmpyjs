# Refactor And Design Katas

1. Identify the config boundary leak around the frontend API base URL and write a short RFC.
2. Propose a shared validation middleware extraction and migration plan.
3. Design how soft-delete filtering should be enforced consistently once list endpoints exist.
4. Improve auth store type safety with runtime parsing.
5. Design rate limiting for auth routes.
6. Propose an outbox/job architecture only if Redis remains.
7. Review whether the auth service should be split into token service plus credential service.
8. Write a migration plan for committed Prisma migrations and seeded data updates.

Self-grade:

- Weak: proposes change without blast-radius analysis.
- Solid: includes boundaries, tests, rollback.
- Strong: also includes migration sequencing and maintainer empathy.
