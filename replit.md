# InSureGig — Workspace

## Overview

InSureGig is a full-stack parametric insurance platform for gig delivery workers (Zomato, Swiggy, Dunzo, Rapido). Workers register, choose a plan, and receive auto-triggered claims when disruptions (rain, heat, pollution, curfew) are detected in their city. Includes a full admin console.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + wouter
- **Auth**: JWT (stored in localStorage as `insure_gig_token` + `insure_gig_role`)

## Key Packages

- `artifacts/api-server` — Express backend on port 8080
- `artifacts/insure-gig` — React frontend (main app)
- `lib/api-client-react` — Generated React Query hooks from OpenAPI spec
- `lib/api-spec/openapi.yaml` — Full API contract
- `lib/db` — Drizzle ORM schema + migrations

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Demo Credentials

- **Admin**: admin@insuregig.com / admin123
- **Worker**: rahul@example.com / admin123

## Architecture

### Auth
- JWT stored in localStorage as `insure_gig_token` and `insure_gig_role`
- `setAuthTokenGetter()` from api-client-react attaches Bearer header to all requests
- Worker routes require `role=worker`, admin routes require `role=admin`

### Plans
- **Basic**: ₹20/week, ₹500 coverage
- **Standard**: ₹35/week, ₹1000 coverage (popular)
- **Premium**: ₹63/week, ₹1500 coverage

### Cities
Mumbai, Delhi, Hyderabad, Bengaluru, Chennai, Kolkata, Pune, Ahmedabad

### Risk Engine
City-specific rain/pollution/heat adjustments + safe zone -₹5 discount

### Auto-claim Workflow
Admin activates disruption → all workers with active policies in that city get auto-approved claims + transactionId

## Frontend Pages

### Worker
- `/` — Landing page
- `/register` — Worker registration
- `/login` — Worker login
- `/dashboard` — Worker dashboard
- `/plans` — Choose/change plan with risk calculation
- `/risk` — Risk analysis calculator
- `/disruptions` — Live disruption alerts
- `/claims` — Claim history
- `/claims/:id` — Claim detail with transaction info
- `/profile` — Edit profile

### Admin
- `/admin/login` — Admin login
- `/admin/dashboard` — Overview metrics, recent claims, city breakdown
- `/admin/workers` — Worker list with search
- `/admin/disruptions` — Create disruptions, activate/deactivate, trigger auto-claims
- `/admin/claims` — All claims with fraud flag column
- `/admin/fraud` — Fraud alerts list

## DB Schema Tables

workers, plans, policies, disruptions, claims, fraud_alerts, admins
