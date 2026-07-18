# Upskilling Curriculum

This curriculum turns the current CRM repository into a training lab for junior-to-senior growth. It is for engineers who want to understand this codebase deeply, contribute safely, and practice transferable software engineering judgment rather than memorizing repo trivia.

The repository today is a small but real full-stack monorepo: a React frontend, an Express backend, a Prisma/PostgreSQL data model, local Docker infrastructure, seeded CRM data, and an auth/RBAC foundation. The project is still early, which makes it unusually good for study: the core layers are visible, the runtime boundaries are easy to trace, and the missing pieces are obvious enough to become design exercises. The strongest real flows today are backend startup, environment parsing, Prisma client lifecycle, JWT login, request auth, frontend login, and local persistence/bootstrap wiring. There are also important absences: no CI workflow, no background workers, no migrations checked in, and no feature modules beyond auth yet. Those absences are part of the curriculum.

## Who This Is For

- Brand-new junior engineer learning how a full-stack TypeScript app is assembled.
- Junior engineer with some React or Node experience who wants to become safe at cross-layer changes.
- Mid-level engineer new to this repo who wants a fast architecture map and concrete contribution ideas.
- Senior engineer doing an architecture and risk review on an early-stage codebase.

## How To Use It

### One weekend

- Start with [00-fast-track.md](./00-fast-track.md).
- Read [01-codebase-cartography/01-system-map.md](./01-codebase-cartography/01-system-map.md) and [01-codebase-cartography/05-key-flows.md](./01-codebase-cartography/05-key-flows.md).
- Trace the login flow from frontend form to backend token issuance.
- Run the verified checks in [08-reference/command-cheatsheet.md](./08-reference/command-cheatsheet.md).

### Two weeks

- Finish the cartography and stack modules.
- Work through the annotation drills, trace tables, and debugging scenarios.
- Pick 2-3 tickets from [06-contribution-practice/01-good-first-tickets.md](./06-contribution-practice/01-good-first-tickets.md).
- Practice writing tests and PR descriptions using the repo-specific guides.

### Eight weeks

- Progress in order through all modules.
- Implement at least one junior ticket, one mid-level ticket, and one design kata.
- Use [07-career-and-collaboration/04-interview-prep-from-this-repo.md](./07-career-and-collaboration/04-interview-prep-from-this-repo.md) for mock interview prep.
- Revisit [03-architecture-and-patterns/06-architecture-critique.md](./03-architecture-and-patterns/06-architecture-critique.md) after each real change.

### Ongoing contribution practice

- Use the command cheat sheet, review checklist, and risk register before opening PRs.
- Treat the code-reading gym as a reusable lab whenever the repo gains a new feature.
- Update the verification log when the repo shape changes.

## Recommended Paths

### Brand-new junior

1. [00-fast-track.md](./00-fast-track.md)
2. [01-codebase-cartography/README.md](./01-codebase-cartography/README.md)
3. [02-stack-and-language-mastery/01-language-runtime-model.md](./02-stack-and-language-mastery/01-language-runtime-model.md)
4. [04-code-reading-gym/01-annotation-drills.md](./04-code-reading-gym/01-annotation-drills.md)
5. [05-quality-engineering/03-systematic-debugging.md](./05-quality-engineering/03-systematic-debugging.md)

### Junior with basic stack familiarity

1. [01-codebase-cartography/05-key-flows.md](./01-codebase-cartography/05-key-flows.md)
2. [03-architecture-and-patterns/01-boundaries-and-layers.md](./03-architecture-and-patterns/01-boundaries-and-layers.md)
3. [05-quality-engineering/02-writing-tests-here.md](./05-quality-engineering/02-writing-tests-here.md)
4. [06-contribution-practice/01-good-first-tickets.md](./06-contribution-practice/01-good-first-tickets.md)

### Mid-level engineer new to this repo

1. [01-codebase-cartography/01-system-map.md](./01-codebase-cartography/01-system-map.md)
2. [03-architecture-and-patterns/05-pattern-catalog.md](./03-architecture-and-patterns/05-pattern-catalog.md)
3. [03-architecture-and-patterns/06-architecture-critique.md](./03-architecture-and-patterns/06-architecture-critique.md)
4. [06-contribution-practice/02-mid-level-feature-tickets.md](./06-contribution-practice/02-mid-level-feature-tickets.md)

### Senior engineer doing architecture review

1. [03-architecture-and-patterns/06-architecture-critique.md](./03-architecture-and-patterns/06-architecture-critique.md)
2. [08-reference/risk-register.md](./08-reference/risk-register.md)
3. [05-quality-engineering/05-security-checklist.md](./05-quality-engineering/05-security-checklist.md)
4. [06-contribution-practice/03-senior-build-projects.md](./06-contribution-practice/03-senior-build-projects.md)

## Learning Tracks

- `01-codebase-cartography`: what exists, where it lives, how to navigate it.
- `02-stack-and-language-mastery`: JavaScript, TypeScript, React, Node, Prisma, and tooling through real repo examples.
- `03-architecture-and-patterns`: boundaries, invariants, persistence, auth, risk, and design tradeoffs.
- `04-code-reading-gym`: active reading drills, trace exercises, and review practice.
- `05-quality-engineering`: tests, debugging, performance, security, and observability.
- `06-contribution-practice`: realistic tickets, feature work, refactors, and design katas.
- `07-career-and-collaboration`: PR writing, code review, maintainer communication, and interview prep.
- `08-reference`: commands, risks, rubrics, and verification history.

## Conventions

- File anchors point to exact files and current line ranges, for example [`backend/src/app.ts#L13-L21`](../../backend/src/app.ts#L13-L21).
- Fake code is always labeled:

```ts
// Illustrative fake code: not from this repo.
```

- Drills are meant to be done actively before reading the explanation.
- Self-grading sections distinguish weak, solid, and strong answers.
- Verification Notes sections record what was inspected, what commands were run, and what remains uncertain.

## Senior Mindset

Junior engineers often ask, “How do I make it work?” Mid-level engineers ask, “Is this the right pattern here, and how do I test it safely?” Senior engineers ask, “What does this commit us to, who pays the cost, what are the invariants, what is the blast radius, and how do we reduce risk before this becomes expensive to change?” This curriculum is designed to help you climb that ladder intentionally.

## Verification Notes

- Repo inventory inspected with `rg --files -g "!node_modules"`.
- Root tooling inspected in [`package.json`](../../package.json#L1-L23), [`backend/package.json`](../../backend/package.json#L1-L49), and [`frontend/package.json`](../../frontend/package.json#L1-L36).
- Core implementation files inspected in backend auth, Prisma schema, frontend auth, and router files.
- Verified commands and uncertainties are recorded in [08-reference/verification-log.md](./08-reference/verification-log.md).
