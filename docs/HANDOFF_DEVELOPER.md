# Food Mania — Developer Handoff Guide

> **Developer Documentation & Engineering Handoff**  
> *Everything you need to set up, run, maintain, and extend the Food Mania codebase.*

---

## 1. Quick Start & Prerequisites

### Required Software
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher (Workspace manager)
- **Git**: `v2.40+`
- **PostgreSQL Database**: Local PostgreSQL instance OR a hosted [Supabase](https://supabase.com) database.

---

## 2. Environment Setup

Copy `.env.example` to `.env` in `apps/api` (and optionally in frontend apps if custom API URLs are needed):

```bash
# apps/api/.env
PORT=5000
NODE_ENV=development

# Database Connection String (PostgreSQL or Supabase)
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/foodmania_dev?schema=public"

# CORS Configuration
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002"

# JWT Secret & Security
JWT_SECRET="super-secret-foodmania-jwt-key"
```

---

## 3. Installation & Local Development

### 1. Install Dependencies
In the root directory of the monorepo:
```bash
npm install
```

### 2. Set Up Database Schema & Prisma Client
```bash
# Generate Prisma Client
cd apps/api
npx prisma generate

# Push Schema to Database
npx prisma db push
```

### 3. Run All Applications Concurrently
Return to the root directory and start the Turborepo dev server:
```bash
npm run dev
```

This starts all four services concurrently:
- 🌐 **Customer App**: `http://localhost:3000`
- 🏪 **Business Dashboard**: `http://localhost:3001`
- 🛡️ **Super Admin Portal**: `http://localhost:3002`
- ⚙️ **Express API**: `http://localhost:5000`

---

## 4. Workspaces & Package Navigation

| Workspace Path | Package Name | Role |
| :--- | :--- | :--- |
| `apps/customer` | `@foodmania/customer` | Consumer Next.js App Router frontend |
| `apps/business` | `@foodmania/business` | Partner & Kitchen Next.js App Router dashboard |
| `apps/admin` | `@foodmania/admin` | Platform Super Admin Next.js App Router portal |
| `apps/api` | `@foodmania/api` | Core Express.js backend REST service |
| `packages/ui` | `@foodmania/ui` | Shared React design component library |
| `packages/theme` | `@foodmania/theme` | Central design tokens (Colors, Typography, Spacing) |
| `packages/types` | `@foodmania/types` | TypeScript interfaces, DTOs, and Enums |
| `packages/shared` | `@foodmania/shared` | API clients, repositories, and mock fallback layer |
| `packages/utils` | `@foodmania/utils` | Date, currency, and validator utility functions |
| `packages/config` | `@foodmania/config` | Shared ESLint, Prettier, and TSConfig rules |

---

## 5. Helpful Commands & Scripts

Run from the root directory:

```bash
# Build all workspaces
npm run build

# Run linting across monorepo
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Run TypeScript type-checking
npm run type-check

# Clean all build artifacts (.next, dist, node_modules/.cache)
npm run clean
```

To target a specific package or app using Turbo filters:
```bash
# Run dev only for API
npm run dev --filter=@foodmania/api

# Run build only for Customer app
npm run build --filter=@foodmania/customer
```

---

## 6. Key File Index for Engineers

- **Prisma Schema**: `apps/api/prisma/schema.prisma`
- **Express App Entry**: `apps/api/src/index.ts`
- **API Routes**: `apps/api/src/routes/`
- **Shared API Client**: `packages/shared/src/services/apiClient.ts`
- **Design Tokens**: `packages/theme/src/tokens/`
- **Domain Enums**: `packages/types/src/enums.ts`
- **Verification Scripts**: `scratch/` directory contains automated test and audit scripts (`test_all_endpoints.ts`, `verify_e2e_flow.ts`).

---

## 7. Architecture Guidelines & Best Practices

1. **Importing Workspace Packages**: Always use alias names (e.g., `import { Button } from '@foodmania/ui'`, `import { OrderStatus } from '@foodmania/types'`).
2. **Database Queries**: Keep raw database access inside `apps/api/src/services/` or `repositories/`. Frontend applications must communicate via `@foodmania/shared` API client.
3. **Styling Standards**: Use CSS variables derived from `@foodmania/theme` tokens to ensure design system consistency across Customer, Business, and Admin portals.
4. **Git Branching Strategy**:
   - `main`: Production-ready branch.
   - `feature/<name>`: New features or component additions.
   - `fix/<name>`: Bug fixes and refactoring.
