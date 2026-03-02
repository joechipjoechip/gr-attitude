# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GR attitude** is a structured mutual aid platform — an action-oriented social network for organizing help requests (Missions) and help offers (Offres). The platform transforms needs into structured "tickets" that can be tracked from creation to resolution.

**Current Status**: ✅ **Active Development** — Functional prototype with backend API and frontend UI.

## Core Concepts

- **Mission** (UI: "Besoin"): A structured help request with fields for title, description, category, help_type (financière/conseil/matériel/relation/autre), urgency, location, and status (ouverte → en_cours → résolue/expirée)
- **Offre** (UI: "Proposition"): A help offer with offer_type (don/compétence/matériel/service/écoute/autre) that auto-correlates with matching Missions
- **Contribution**: User engagement on a Mission (types: participe/propose/finance/conseille)
- **Matching**: Algorithm correlating Missions ↔ Offres based on tags, geography, help type, and recency

## Implemented Technology Stack

### Backend (NestJS)
- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5
- **Database**: SQLite (better-sqlite3 12.6.2) with TypeORM 11.0.0
  - ⚠️ **Note**: PRD mentions PostgreSQL + PostGIS, but current implementation uses SQLite for MVP
- **Auth**: Passport (JWT + OAuth2 Google/Facebook), bcrypt 6.0.0
- **Security**: Helmet 8.1.0, Throttler 6.5.0
- **Scheduled Tasks**: @nestjs/schedule 6.1.1

### Frontend (Next.js)
- **Framework**: Next.js 16.1.6 + React 19.2.3
- **Language**: TypeScript 5
- **State Management**: TanStack React Query 5.90.21
- **UI**: Radix UI + Tailwind CSS 4 + shadcn/ui
- **Icons**: Lucide React
- **Themes**: next-themes 0.4.6

### Shared Types
- Located in `/shared` directory
- Shared TypeScript types/interfaces between frontend and backend

### Infrastructure
- **Containerization**: Docker Compose (docker-compose.yml)
- **Deployment**: Render.com (render.yaml configured)
- **Development**: `dev.sh` script for quick start

## Project Structure

```
gr-attitude/
├── backend/               # NestJS API
│   ├── src/
│   │   ├── auth/         # JWT + OAuth2 (Google/Facebook)
│   │   ├── missions/     # Mission CRUD + business logic
│   │   ├── offers/       # Offer CRUD
│   │   ├── contributions/# User engagement
│   │   ├── correlations/ # Matching engine
│   │   ├── matching/     # Correlation algorithm
│   │   ├── notifications/
│   │   ├── users/
│   │   ├── crons/        # Scheduled tasks (expiration, reminders)
│   │   └── seeds/        # Test data
│   └── dist/             # Compiled TypeScript
│
├── frontend/             # Next.js App Router
│   ├── src/
│   │   ├── app/          # Next.js 16 App Router
│   │   │   ├── (auth)/   # Auth pages (login, register)
│   │   │   ├── missions/ # Mission pages
│   │   │   ├── offers/   # Offer pages
│   │   │   ├── notifications/
│   │   │   └── profile/
│   │   ├── hooks/        # 15+ React Query hooks
│   │   ├── i18n/         # Translations (fr.json) + t() function
│   │   └── lib/          # Utils (api, auth, types, constants)
│   └── node_modules/
│
├── shared/               # Shared TypeScript types
├── docs/                 # Technical documentation (12 files)
├── PRD.md                # Product Requirements Document (607+ lines)
└── docker-compose.yml    # Local orchestration
```

## Key Files

- **Backend entry**: `backend/src/main.ts`
- **Frontend entry**: `frontend/src/app/layout.tsx`, `frontend/src/app/page.tsx`
- **Environment**: 
  - Backend: `backend/.env` (see `.env.example`)
  - Frontend: `frontend/.env.local`
- **Types**: `shared/src/`

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (optional, for PostgreSQL/Redis)

### Quick Start

```bash
# 1. Clone and install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ../shared && npm install

# 2. Setup environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your OAuth credentials

# 3. Run development servers
# Option A: Using dev script
./dev.sh

# Option B: Manual
cd backend && npm run start:dev    # http://localhost:3001
cd frontend && npm run dev          # http://localhost:3000
```

### Database

Current: **SQLite** (better-sqlite3) in dev and production.
- Dev DB: auto-created with `synchronize: true`
- Prod DB: auto-created with `synchronize: true` + auto-seed on empty DB
- **Render free tier = ephemeral disk** → DB is reset on every redeploy
- Schema is always rebuilt from entities (no migrations needed for SQLite)
- Demo data (5 users, 6 missions, 4 offers) is auto-seeded at startup if DB is empty
- Seeding endpoints: `POST /seed`, `POST /seed/clear`, `GET /seed/status`

Future (Production): **PostgreSQL + PostGIS** recommended (re-enable `migrationsRun: true`, set `synchronize: false`).

### OAuth Setup

Configure Google and Facebook OAuth in `backend/.env`:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3001/auth/facebook/callback
```

See `docs/auth.md` for detailed setup instructions.

## API Structure

Full endpoint specification in PRD (§11.4) and `docs/api-endpoints.md`.

Main resource groups:
- `/auth/*` - Authentication (JWT, OAuth2, RGPD account deletion)
- `/missions/*` - Mission CRUD, closure, contributions, correlations
- `/offers/*` - Offer CRUD and correlations
- `/contributions/*` - User engagement
- `/notifications/*` - User notifications
- `/users/me/*` - Profile, stats, notifications

## Testing

⚠️ **Current Status**: No tests implemented yet.

**Recommended** (Post-MVP):
- Backend: Jest + Supertest for e2e API tests
- Frontend: Vitest + Testing Library
- Focus: Auth flows, Mission CRUD, Matching algorithm

## CI/CD

⚠️ **Current Status**: No CI/CD pipeline.

**Recommended**: GitHub Actions workflow for:
- Lint (backend + frontend)
- Build verification
- Auto-deploy to Render on `main` push

## Architecture Decisions

### Current (MVP)
- SQLite for rapid prototyping
- Monorepo with separate backend/frontend/shared
- JWT + OAuth2 for authentication
- React Query for client state management

### Future Considerations (Production)
- **Database**: Migrate to PostgreSQL + PostGIS for geospatial queries and concurrency
- **Caching**: Add Redis for sessions and matching cache
- **Storage**: S3 or similar for user-uploaded images
- **Monitoring**: Add Prometheus/Grafana for performance metrics

## Product Principles

- **Radical simplicity** — minimal friction to publish a need
- **Bilateral responsibility** — both requester and helper are actors
- **Transparency** — immutable history, visible progress
- **Non-toxic gamification** — private stats only, no public leaderboards
- **No humiliation** of help-seekers
- **Action over scroll** — this is not a social feed

## MVP Priorities (in order)

1. ✅ Mission creation with guided form
2. ✅ 4-type engagement system on Missions
3. ✅ Simple correlation (tags + geography)
4. ✅ Closure workflow with notifications
5. ✅ Exploration feed with filters
6. ✅ Offer creation
7. ✅ User profile + history

## i18n (Internationalization)

All user-facing strings are centralized in `frontend/src/i18n/fr.json` and accessed via the `t()` function from `frontend/src/i18n/index.ts`.

**Wording convention**: In code/architecture, we use `mission` and `offer`. In the UI (fr.json), these are displayed as **"Besoin"** and **"Proposition"** respectively.

To change any UI text, edit `fr.json` only — no need to touch component files.

```typescript
import { t } from '@/i18n';
t('besoins.title')                        // "Besoins"
t('besoins.count_other', { count: 5 })    // "5 besoins"
```

## Shared Constants

`frontend/src/lib/constants.ts` contains shared values used across multiple components:
- `MIN_TITLE_LENGTH`, `MIN_DESCRIPTION_LENGTH` — form validation
- `CATEGORY_ICONS` — emoji map for mission categories

`frontend/src/components/ui/filter-chip.tsx` — reusable filter chip component (used in missions + offers list pages)

## Design System — Stitch "Liquid Glass"

The frontend uses a custom glassmorphism design system inspired by Stitch prototypes:

- **CSS classes** defined in `frontend/src/app/globals.css`: `glass-card-liquid`, `glass-hero`, `glass-header-liquid`, `glass-sidebar-liquid`, `bg-gradient-stitch`, `animate-float`, `text-glow`
- **Fonts**: Public Sans (body), Marck Script (decorative italic headings)
- **Primary**: `#9333ea` (purple), emerald/teal variants for offers
- **Cards**: Glassmorphism with `backdrop-blur`, rounded corners (`rounded-[2rem]`+), semi-transparent backgrounds
- **Category icons**: Colored circles with low-opacity background (`categoryAccent + '25'`)
- **Layout**: Header is `sticky top-0 h-20`, each page's first element has `pt-20` for spacing
- **Stitch reference**: `docs/stitch/besoins-reference.png`, `docs/stitch/besoins-screen.html`

## Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (configured)
- **Linting**: ESLint (NestJS + Next.js configs)
- **Naming**: 
  - Components: PascalCase
  - Functions/variables: camelCase
  - Files: kebab-case for pages, PascalCase for components

### Deployment

- **Render free tier** with auto-deploy on git push to fork `caracole-ai/gr-attitude`
- Push workflow: `git push origin master && git push fork master`
- Backend: `synchronize: true` for SQLite (schema from entities), auto-seed on empty DB
- See `docs/deployment.md` for full details

## Documentation

- **Technical docs**: `/docs` directory (architecture, API, DTOs, deployment, etc.)
- **Product spec**: `PRD.md` (comprehensive product requirements)
- **Deployment**: `docs/deployment.md` (Render setup, DB strategy, env vars)
