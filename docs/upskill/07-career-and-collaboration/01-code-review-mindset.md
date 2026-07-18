# Code Review Mindset

Review in layers:

1. Does it work?
2. Is it correct under bad inputs?
3. Will it stay correct when the repo grows?
4. Does it fit existing boundaries?
5. Is it kind to future maintainers?

Repo-specific checklist:

- Does backend logic stay out of controllers?
- Are new inputs validated with a runtime schema?
- Is server auth enforced, not just client gating?
- Does Prisma access belong in the chosen layer?
- Did the change preserve the current public API response shape?
