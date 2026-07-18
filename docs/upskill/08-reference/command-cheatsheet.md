# Command Cheat Sheet

| Command | Purpose | Status |
| --- | --- | --- |
| `npm install --workspaces --include-workspace-root` | install all deps | Verified |
| `npm run dev` | run frontend and backend together | Inferred |
| `npm run build` | build both workspaces | Inferred |
| `npm run typecheck` | typecheck both workspaces | Verified |
| `npm run lint` | lint both workspaces | Verified |
| `npm test` | run both test suites | Verified |
| `npm --workspace backend run prisma:generate` | generate Prisma client | Verified |
| `npm --workspace backend run prisma:migrate:dev -- --name init` | create/apply local migration | Inferred |
| `npm --workspace backend run prisma:seed` | populate local DB | Inferred |
| `docker compose up -d` | start Postgres and Redis | Inferred |
| `docker --version` | verify Docker is installed | Verified |
| `docker compose version` | verify Docker Compose is installed | Verified |
