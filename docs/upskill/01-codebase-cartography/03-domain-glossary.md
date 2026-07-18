# Domain Glossary

| Term | Meaning here | Where it appears |
| --- | --- | --- |
| User | A signed-in CRM actor with a role. | [`backend/prisma/schema.prisma#L10-L27`](../../backend/prisma/schema.prisma#L10-L27) |
| Role | RBAC category like `SYSTEM_ADMIN` or `SALES_REP`. | [`backend/prisma/schema.prisma#L279-L285`](../../backend/prisma/schema.prisma#L279-L285), [`backend/src/auth/permissions.ts#L16-L43`](../../backend/src/auth/permissions.ts#L16-L43) |
| Lead | A pre-conversion sales prospect. | [`backend/prisma/schema.prisma#L29-L57`](../../backend/prisma/schema.prisma#L29-L57) |
| Company | An organization associated with contacts and opportunities. | [`backend/prisma/schema.prisma#L59-L81`](../../backend/prisma/schema.prisma#L59-L81) |
| Contact | A person, optionally linked to a company. | [`backend/prisma/schema.prisma#L83-L104`](../../backend/prisma/schema.prisma#L83-L104) |
| Pipeline stage | A configurable opportunity stage with probability and won/lost flags. | [`backend/prisma/schema.prisma#L106-L120`](../../backend/prisma/schema.prisma#L106-L120) |
| Opportunity | A revenue-bearing sales record tied to a stage and optional company/contact. | [`backend/prisma/schema.prisma#L122-L152`](../../backend/prisma/schema.prisma#L122-L152) |
| Note | A text record attachable to multiple CRM entity types. | [`backend/prisma/schema.prisma#L154-L174`](../../backend/prisma/schema.prisma#L154-L174) |
| Task | A follow-up work item with assignee, creator, and optional CRM links. | [`backend/prisma/schema.prisma#L176-L205`](../../backend/prisma/schema.prisma#L176-L205) |
| Email log | A stored record of email direction, timing, and linked entities. | [`backend/prisma/schema.prisma#L207-L227`](../../backend/prisma/schema.prisma#L207-L227) |
| Activity | User-facing history of important CRM events. | [`backend/prisma/schema.prisma#L229-L250`](../../backend/prisma/schema.prisma#L229-L250) |
| Audit event | Compliance/debug history for actions on entities. | [`backend/prisma/schema.prisma#L252-L266`](../../backend/prisma/schema.prisma#L252-L266) |
| Refresh token | Persisted server-side record used to mint new access tokens. | [`backend/prisma/schema.prisma#L268-L277`](../../backend/prisma/schema.prisma#L268-L277), [`backend/src/modules/auth/auth.service.ts#L89-L96`](../../backend/src/modules/auth/auth.service.ts#L89-L96) |

## Confusing Near-Synonyms

| Pair | Difference |
| --- | --- |
| Activity vs AuditEvent | `Activity` is user-facing business history; `AuditEvent` is more compliance/debug oriented in the design. Today only `AuditEvent` is written in the auth seed path, and runtime auth code does not create activities. |
| Stage vs Status | `PipelineStage` is configurable and ordered; `OpportunityStatus` is a simpler enum like `OPEN`, `WON`, `LOST`. |
| Auth vs Permission | Auth answers “who is this user?” in [`auth.middleware.ts#L6-L27`](../../backend/src/middleware/auth.middleware.ts#L6-L27). Permission answers “may this user do this action?” in [`requirePermission.middleware.ts#L6-L18`](../../backend/src/middleware/requirePermission.middleware.ts#L6-L18). |

## Terms That Exist In The Schema But Not Yet In Runtime Flows

- Lead conversion fields on `Lead` in [`backend/prisma/schema.prisma#L41-L44`](../../backend/prisma/schema.prisma#L41-L44)
- Opportunity won/lost timestamps and reasons in [`backend/prisma/schema.prisma#L136-L138`](../../backend/prisma/schema.prisma#L136-L138)
- Notes, tasks, email logs, activities, and audit events as full feature modules

That mismatch is not automatically wrong. It means the schema is further ahead than the route/service implementation.
