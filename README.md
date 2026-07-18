# Lightweight CRM / Sales Pipeline Platform

This repository contains a full-stack internal CRM and sales pipeline platform built with:

- React + TypeScript + Vite
- TanStack Query + Zustand + React Router
- Node.js + TypeScript + Express
- PostgreSQL + Prisma
- JWT auth + refresh tokens + RBAC
- Docker Compose for local infrastructure

## Current Status

Phase-by-phase implementation is in progress. The repository currently includes:

- Monorepo scaffolding for `backend` and `frontend`
- Docker Compose services for PostgreSQL and Redis
- Backend healthcheck endpoint and configuration wiring
- Frontend app shell and CRM landing dashboard
- Prisma schema and seed data foundation

## Quick Start

1. Copy `.env.example` to `.env`.
2. Start infrastructure:

```bash
docker compose up -d
```

3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client and seed the database:

```bash
npm --workspace backend run prisma:generate
npm --workspace backend run prisma:migrate:dev -- --name init
npm --workspace backend run prisma:seed
```

5. Run the apps:

```bash
npm run dev
```

## App URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Health endpoint: `http://localhost:4000/health`
