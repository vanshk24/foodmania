# Food Mania 🍽️

> **Scan. Order. Enjoy.**

Food Mania is a production-ready, multi-tenant SaaS platform that powers end-to-end restaurant operations — from customer discovery and table reservations to QR ordering, digital menus, kitchen management, and analytics.

---

## Products

| App | Port | Description |
| :--- | :--- | :--- |
| **Customer** (`apps/customer`) | `:3000` | Restaurant discovery, QR ordering, table reservations |
| **Business** (`apps/business`) | `:3001` | Restaurant dashboard, KDS, staff, analytics, menu builder |
| **Admin** (`apps/admin`) | `:3002` | Platform management, restaurant verification, subscriptions |

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| State | Zustand + TanStack Query |
| Forms | React Hook Form + Zod |
| Real-time | Socket.io |
| Runtime | Node.js 20 LTS |
| Monorepo | Turborepo |

---

## Project Structure

```
food-mania/
├── apps/
│   ├── customer/          # Customer PWA (Discovery, QR Ordering, Reservations)
│   ├── business/          # Restaurant Business Dashboard
│   └── admin/             # Food Mania Super Admin Panel
│
├── packages/
│   ├── ui/                # Shared React component library
│   ├── shared/            # Hooks, contexts, constants, validators
│   ├── types/             # TypeScript interfaces, enums (domain-organized)
│   ├── config/            # ESLint, Tailwind, TypeScript configs
│   ├── utils/             # Pure utility functions
│   └── theme/             # Design tokens (colors, typography, animations)
│
├── .husky/                # Git hooks (pre-commit, commit-msg)
├── .vscode/               # Shared VS Code settings and extensions
├── turbo.json             # Turborepo pipeline configuration
├── tsconfig.json          # Root TypeScript configuration
├── .eslintrc.js           # Root ESLint configuration
├── .prettierrc.json       # Root Prettier configuration
└── package.json           # Root workspace manifest
```

---

## Getting Started

### Prerequisites

- **Node.js** `>= 20.0.0` (use `nvm use` to auto-select via `.nvmrc`)
- **npm** `>= 10.0.0`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/food-mania.git
cd food-mania

# 2. Install all dependencies (runs across all workspaces)
npm install

# 3. Set up environment variables for each app
cp apps/customer/.env.example apps/customer/.env.local
cp apps/business/.env.example apps/business/.env.local
cp apps/admin/.env.example   apps/admin/.env.local
# Edit each .env.local with your actual values

# 4. Initialize git hooks
npm run prepare
```

### Running in Development

```bash
# Run all apps simultaneously (recommended)
npm run dev

# Run a specific app
npm run dev --filter=@food-mania/customer
npm run dev --filter=@food-mania/business
npm run dev --filter=@food-mania/admin
```

### Building for Production

```bash
# Build all apps
npm run build

# Build a specific app
npm run build --filter=@food-mania/customer
```

---

## Development Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps for production |
| `npm run lint` | Run ESLint across all workspaces |
| `npm run lint:fix` | Auto-fix ESLint violations |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check Prettier formatting without writing |
| `npm run type-check` | Run TypeScript compiler checks |
| `npm run clean` | Delete all build outputs and caches |

---

## Documentation

| Document | Description |
| :--- | :--- |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute to Food Mania |
| [docs/DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md) | Full developer setup and workflow guide |
| [docs/CODING_STANDARDS.md](./docs/CODING_STANDARDS.md) | Code style, patterns, and conventions |
| [docs/BRANCH_STRATEGY.md](./docs/BRANCH_STRATEGY.md) | Git branching strategy |
| [docs/COMMIT_CONVENTIONS.md](./docs/COMMIT_CONVENTIONS.md) | Conventional commits guide |
| [docs/FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md) | Detailed folder documentation |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Architecture overview |

---

## License

Proprietary — Food Mania © 2026. All rights reserved.
