# Food Mania — Development Guide

## Prerequisites

| Tool | Required Version | Install |
| :--- | :--- | :--- |
| Node.js | >= 20.0.0 (LTS) | [nodejs.org](https://nodejs.org) or `nvm install 20` |
| npm | >= 10.0.0 | Included with Node.js |
| Git | >= 2.40.0 | [git-scm.com](https://git-scm.com) |
| VS Code | Latest | [code.visualstudio.com](https://code.visualstudio.com) |

---

## Initial Setup

```bash
# 1. Clone
git clone https://github.com/your-org/food-mania.git
cd food-mania

# 2. Use correct Node version
nvm use          # reads .nvmrc automatically

# 3. Install dependencies (installs all workspaces)
npm install

# 4. Set up environment variables
cp apps/customer/.env.example apps/customer/.env.local
cp apps/business/.env.example apps/business/.env.local
cp apps/admin/.env.example   apps/admin/.env.local

# 5. Initialize Husky git hooks
npm run prepare
```

---

## Running Applications

### All apps simultaneously

```bash
npm run dev
# Customer → http://localhost:3000
# Business → http://localhost:3001
# Admin    → http://localhost:3002
```

### Single app

```bash
npm run dev --filter=@food-mania/customer
npm run dev --filter=@food-mania/business
npm run dev --filter=@food-mania/admin
```

---

## Environment Variables

Each app has its own `.env.example` template. Key variables:

| Variable | App | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | All | Backend API base URL |
| `NEXT_PUBLIC_WS_URL` | All | WebSocket server URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Customer | Google OAuth client ID |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Business | Razorpay public key |
| `NEXT_PUBLIC_QR_BASE_URL` | Business | Base URL for QR code deep links |

> ⚠️ Never commit `.env.local` files. They are listed in `.gitignore`.

---

## Workspace Commands Reference

```bash
# Run across all workspaces
npm run build
npm run lint
npm run lint:fix
npm run format
npm run type-check
npm run clean

# Run against a specific workspace
npm run build --filter=@food-mania/customer
npm run lint  --filter=@food-mania/ui
```

---

## Adding a New Shared Component

```bash
# 1. Create the component in packages/ui/src/components/
# 2. Export it from packages/ui/src/index.ts
# 3. Import in any app:
#    import { MyComponent } from "@food-mania/ui";
```

---

## Adding a New Shared Type

```bash
# 1. Add the type in the appropriate domain file in packages/types/src/<domain>/
# 2. It is automatically exported via packages/types/src/index.ts barrel
# 3. Import in any app or package:
#    import type { MyType } from "@food-mania/types";
```

---

## Turborepo Caching

Turborepo caches task outputs automatically. To force a clean rebuild:

```bash
npm run clean      # clears all .next, dist, .turbo folders
npm run build      # full rebuild
```

---

## Code Quality Gates

All of the following must pass before merging to `develop`:

| Check | Command | Enforced By |
| :--- | :--- | :--- |
| Linting | `npm run lint` | Husky pre-commit |
| Formatting | `npm run format:check` | Husky pre-commit |
| TypeScript | `npm run type-check` | CI Pipeline |
| Build | `npm run build` | CI Pipeline |
| Commit message | Conventional commits | Husky commit-msg |

---

## VS Code Setup

Open the workspace from the root folder. VS Code will:
- Auto-suggest installing recommended extensions (`.vscode/extensions.json`)
- Auto-format on save via Prettier
- Auto-fix ESLint violations on save
- Enable Tailwind CSS IntelliSense for class autocompletion
