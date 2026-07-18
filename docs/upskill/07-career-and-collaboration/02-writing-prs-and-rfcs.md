# Writing PRs And RFCs

## Good PR Description Shape

- What changed
- Why
- How tested
- Risks
- Follow-ups

Example prompt for this repo:

- Added shared auth validation middleware extraction.
- Updated auth routes to use shared helper.
- Verified with `npm run typecheck`, `npm run lint`, `npm test`.
- Risk: route-body typing changes.
- Follow-up: adopt in future feature modules.

## When To Write An RFC

- cross-layer changes
- schema changes with rollback concerns
- auth model changes
- infrastructure additions like Redis jobs

## Lightweight RFC Template

1. Problem
2. Current evidence with file anchors
3. Proposed change
4. Alternatives considered
5. Risks and rollback
6. Test plan
