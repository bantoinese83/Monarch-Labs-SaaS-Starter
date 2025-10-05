# Monarch Labs Next.js SaaS Starter

![Build](https://img.shields.io/github/actions/workflow/status/your-org/your-repo/ci.yml?label=CI)
![Lighthouse CI](https://img.shields.io/badge/lighthouse-automated-green)
![Tests](https://img.shields.io/badge/tests-vitest%20%2B%20playwright-blue)
![Code Style](https://img.shields.io/badge/code%20style-prettier-ff69b4)
![Conventional Commits](https://img.shields.io/badge/commits-conventional-ffb86c)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

Production‑grade starter for building modern SaaS with Next.js 15, TypeScript, Prisma, Stripe, and Supabase. Comes with secure auth, billing, multi‑tenant teams, robust CI, code quality tooling, performance optimizations, and a cohesive “Grunge” UI theme.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone and Install](#1-clone-and-install)
  - [2. Environment Setup](#2-environment-setup)
  - [3. Database Setup](#3-database-setup)
  - [4. Stripe Setup](#4-stripe-setup)
  - [5. Run the Application](#5-run-the-application)
  - [6. Optional: On‑Demand Revalidation](#6-optional-on%E2%80%91demand-revalidation)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Scripts](#scripts)
- [CI / Quality Gates](#ci--quality-gates)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

## Screenshots

### App Screenshots (2xl)

Home

![Home – 2xl](.playwright-mcp/home-2xl.png)

Pricing

![Pricing – 2xl](.playwright-mcp/pricing-2xl.png)

Dashboard

![Dashboard – 2xl](.playwright-mcp/dashboard-2xl-hero.png)

- 🚀 **Next.js 15 (App Router)** with React Server Components
- 🧱 **Strict TypeScript** + Zod runtime validation (T3 Env‑style `src/env.ts`)
- 🔐 **Auth**: JWT cookies (HttpOnly, Secure, SameSite=Strict), middleware protection, RBAC
- 💳 **Stripe Billing**: Checkout, Portal, secure webhook (idempotent), plan/status sync
- 👥 **Teams**: Multi‑tenant, members/roles, owner controls
- 🗺️ **Routing**: ISR (`revalidate`) + on‑demand revalidation endpoint
- 📦 **Bundle analyzer** + **CI bundle budget** guard (First Load JS threshold)
- 🧪 **Testing**: Vitest + RTL (unit), Playwright (e2e), Lighthouse CI workflow
- 🧰 **DX**: ESLint 9, Prettier, Husky + Commitlint, lint‑staged, Renovate
- 🧭 **Observability**: OpenTelemetry scaffold (env‑guarded exporter)
- 🎨 **UI**: Tailwind CSS v4, Radix‑ready, CVA helpers, cohesive Grunge theme
- 🩺 **Health**: `/api/health` (DB round‑trip), Kubernetes‑friendly

## Tech Stack

- **App**: Next.js 15 (App Router), React 19, TypeScript
- **DB/ORM**: Supabase Postgres, Prisma
- **Auth**: JWT + cookies (JOSE, bcrypt)
- **Billing**: Stripe
- **Validation**: Zod (+ env validation)
- **Styles**: Tailwind CSS v4, CVA, Radix‑ready
- **CI/CD**: GitHub Actions (lint/typecheck/build/test + budget + Lighthouse CI)

## Getting Started

### 🚀 Quick Start (Recommended)

Get your SaaS running in under 5 minutes:

```bash
# Clone and setup automatically
git clone https://github.com/bantoinese83/Monarch-Labs-SaaS-Starter.git my-saas
cd my-saas
npm run setup
```

This will:
- ✅ Install all dependencies
- ✅ Create `.env` file with secure defaults
- ✅ Setup database automatically
- ✅ Run tests to verify everything works
- ✅ Generate secure JWT secrets

### 🐳 Local Development (Docker)

For local development with PostgreSQL:

```bash
# Start local database
docker-compose up -d

# Run setup (uses local database)
npm run setup
```

### ☁️ Production Setup (Supabase)

For production deployment:

1. **Create Supabase Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create new project
   - Copy database URL and keys

2. **Update Environment**
   ```bash
   # Edit .env file with your Supabase credentials
   DATABASE_URL=postgresql://postgres.[project-ref]:[password]@db.[project-ref].supabase.co:5432/postgres
   NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Setup Database**
   ```bash
   npm run db:push
   ```

### 💳 Stripe Configuration

1. **Get Stripe Keys**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Copy your test keys

2. **Update Environment**
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_PRICE_STARTER=price_...
   STRIPE_PRICE_PRO=price_...
   ```

3. **Setup Webhooks**
   - Add webhook endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

### 🚀 Deployment

#### Option 1: Automated Deploy
```bash
npm run deploy
```

#### Option 2: Manual Vercel Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel --prod
```

#### Environment Variables for Production
Set these in your Vercel dashboard:
- `DATABASE_URL`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_PRO`
- `NEXT_PUBLIC_APP_URL`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── items/         # Items CRUD endpoints
│   │   ├── teams/         # Team management endpoints
│   │   └── stripe/        # Stripe integration endpoints
│   ├── dashboard/         # Protected dashboard pages
│   │   ├── loading.tsx    # Route-level skeletons
│   ├── login/             # Authentication pages
│   ├── signup/
│   ├── pricing/
│   └── page.tsx           # Landing page
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication helpers
│   ├── db.ts             # Database connection
│   ├── hash.ts           # Password hashing
│   ├── jwt.ts            # JWT token handling
│   ├── rbac.ts           # Role-based access control
│   ├── stripe.ts         # Stripe integration
│   ├── validation.ts     # Zod schemas
│   ├── activity-logger.ts # Activity logging
│   ├── csp.ts            # CSP nonce helpers
│   ├── http.ts           # JSON helpers
│   ├── guards.ts         # Guard helpers
│   ├── otel.ts           # Otel tracing scaffold
│   └── env.ts            # Env validation (T3 Env‑style)
└── generated/            # Generated Prisma client
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users

- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update current user

### Teams

- `GET /api/teams/current` - Get current team
- `PUT /api/teams/current` - Update team
- `POST /api/teams/current/members` - Add team member
- `PUT /api/teams/current/members/[id]/role` - Update member role
- `DELETE /api/teams/current/members/[id]` - Remove member

### Items

- `GET /api/items` - List items
- `POST /api/items` - Create item
- `GET /api/items/[id]` - Get item
- `PUT /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item

### Stripe

- `POST /api/stripe/checkout-session` - Create checkout session
- `POST /api/stripe/customer-portal` - Create customer portal session
- `POST /api/stripe/webhook` - Stripe webhook handler

### Health & Revalidation

- `GET /api/health` - DB round‑trip health check
- `POST /api/revalidate?path=/&secret=...` - On‑demand ISR

### Activity Logs

- `GET /api/activity-logs` - Get activity logs

## Database Schema

### User

- `id` (String): Unique identifier
- `email` (String): User's email address
- `passwordHash` (String): Hashed password
- `name` (String): Display name
- `teamId` (String): Foreign key to Team
- `role` (String): User's role within team
- `stripeCustomerId` (String): Stripe customer ID
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

### Team

- `id` (String): Unique identifier
- `name` (String): Team name
- `ownerId` (String): Foreign key to User (owner)
- `stripeSubscriptionId` (String): Stripe subscription ID
- `stripePriceId` (String): Stripe price ID
- `subscriptionStatus` (String): Subscription status
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

### TeamMember

- `id` (String): Unique identifier
- `teamId` (String): Foreign key to Team
- `userId` (String): Foreign key to User
- `role` (String): Member role (Owner/Member)
- `createdAt` (DateTime): Creation timestamp

### ActivityLog

- `id` (String): Unique identifier
- `userId` (String): Foreign key to User
- `teamId` (String): Foreign key to Team
- `eventType` (String): Type of event
- `details` (Json): Event details
- `timestamp` (DateTime): Event timestamp

### Item

- `id` (String): Unique identifier
- `teamId` (String): Foreign key to Team
- `name` (String): Item name
- `description` (String): Item description
- `status` (String): Item status (active/draft/archived)
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

## Scripts

### 🚀 Setup & Development
```bash
npm run setup        # Complete automated setup
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### 🗄️ Database
```bash
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Seed database with sample data
```

### 🚀 Deployment
```bash
npm run deploy       # Deploy to Vercel (automated)
```

### 🧪 Testing & Quality
```bash
npm run test         # Run unit tests (Vitest)
npm run e2e          # Run end-to-end tests (Playwright)
npm run e2e:install  # Install Playwright browsers
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### 📊 Analysis
```bash
npm run analyze      # Bundle analysis
npm run storybook    # Component development
npm run storybook:build # Build Storybook
```

### 🐳 Docker (Local Development)
```bash
docker-compose up -d  # Start PostgreSQL and Redis
docker-compose down   # Stop services
docker-compose logs   # View logs
```

## CI / Quality Gates

- **GitHub Actions**: Lint, typecheck, build, tests.
- **Bundle budget**: `scripts/check-bundle.mjs` parses build output and fails if First Load JS exceeds threshold (defaults to 130 kB). Set `BUNDLE_MAX_INITIAL_KB` to override.
- **Lighthouse CI**: Manual workflow (`.github/workflows/lighthouse.yml`).
- **Conventional commits**: Commitlint + Husky pre-commit/pre-push hooks; lint‑staged formats staged files.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

#### Vercel environment variables

- Required
  - `JWT_SECRET` (32-byte base64)
  - `NEXT_PUBLIC_APP_URL`
    - Production: `https://<your-domain>.vercel.app`
    - Preview: `https://$VERCEL_BRANCH_URL`
    - Development: `http://localhost:3000`
  - `DATABASE_URL` (Supabase Postgres connection string)
  - `NEXT_PUBLIC_SUPABASE_URL` (e.g., `https://<project-ref>.supabase.co`)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- Recommended (server-side Supabase helpers)
  - `SUPABASE_URL` (same as `NEXT_PUBLIC_SUPABASE_URL`)
  - `SUPABASE_ANON_KEY` (same as `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

- Stripe (if billing enabled)
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

- Optional
  - `REVALIDATE_SECRET`

Auth redirect setup
- In Supabase Auth settings, add `https://<your-domain>.vercel.app/reset-password` to Redirect URLs

Notes
- You can reference Vercel system vars like `$VERCEL_BRANCH_URL` for Preview envs
- After changing env vars, trigger a redeploy to apply

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes (keep it small and focused)
4. Add/update tests (unit/e2e) as needed
5. Follow Conventional Commits (e.g., `feat:`, `fix:`, `chore:`)
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built by Monarch Labs.
