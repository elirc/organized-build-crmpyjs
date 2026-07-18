# Data Model And Persistence

## Core Entities

- Users: [`backend/prisma/schema.prisma#L10-L27`](../../backend/prisma/schema.prisma#L10-L27)
- Leads: [`backend/prisma/schema.prisma#L29-L57`](../../backend/prisma/schema.prisma#L29-L57)
- Companies: [`backend/prisma/schema.prisma#L59-L81`](../../backend/prisma/schema.prisma#L59-L81)
- Contacts: [`backend/prisma/schema.prisma#L83-L104`](../../backend/prisma/schema.prisma#L83-L104)
- Pipeline stages: [`backend/prisma/schema.prisma#L106-L120`](../../backend/prisma/schema.prisma#L106-L120)
- Opportunities: [`backend/prisma/schema.prisma#L122-L152`](../../backend/prisma/schema.prisma#L122-L152)

Supporting entities:

- Notes, Tasks, EmailLog, Activity, AuditEvent, RefreshToken in [`backend/prisma/schema.prisma#L154-L277`](../../backend/prisma/schema.prisma#L154-L277)

## Relationship Highlights

- `Lead.ownerId -> User.id`
- `Contact.companyId -> Company.id`
- `Opportunity.stageId -> PipelineStage.id`
- `Opportunity.companyId/contactId/ownerId` create the central sales graph
- `Task` and `Note` are polymorphic by nullable foreign keys rather than a join table abstraction

## Indexing

Useful indexes already exist on:

- status and owner filters for leads and opportunities
- company/email lookups
- due dates for tasks
- chronology for activities and email logs

Evidence: [`backend/prisma/schema.prisma#L53-L56`](../../backend/prisma/schema.prisma#L53-L56), [`backend/prisma/schema.prisma#L147-L151`](../../backend/prisma/schema.prisma#L147-L151), [`backend/prisma/schema.prisma#L198-L204`](../../backend/prisma/schema.prisma#L198-L204), [`backend/prisma/schema.prisma#L245-L249`](../../backend/prisma/schema.prisma#L245-L249).

## Consistency Expectations

- Auth flow writes refresh tokens after successful login in [`backend/src/modules/auth/auth.service.ts#L89-L96`](../../backend/src/modules/auth/auth.service.ts#L89-L96).
- There are no explicit Prisma transactions in runtime code yet.
- Seed script performs many ordered writes without one outer transaction.

## How To Safely Change The Schema

1. Update [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma).
2. Generate Prisma client.
3. Create and inspect a migration. Inferred because no `migrations/` folder exists yet.
4. Update seed data if required.
5. Update backend service code and frontend payload contracts.
6. Add or update tests.

## What A Senior Checks

- Are soft deletes consistently enforced or only modeled?
- Are nullable foreign keys intentional or accidental convenience?
- Are indexes aligned with planned query paths, not just current seed shape?
