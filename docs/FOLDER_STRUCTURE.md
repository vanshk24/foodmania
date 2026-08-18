# Food Mania — Folder Structure Documentation

## App Internal Structure (applies to all 3 apps)

```
apps/<app-name>/
├── src/
│   ├── app/                    # Next.js App Router pages and layouts
│   │   ├── (routes)/           # Route groups (no URL segment)
│   │   ├── layout.tsx          # Root layout (fonts, providers)
│   │   └── page.tsx            # Entry page
│   │
│   ├── components/             # UI Components
│   │   ├── ui/                 # shadcn/ui base primitives (auto-generated)
│   │   ├── common/             # Shared components used across multiple pages
│   │   ├── layouts/            # Page layout shells (Sidebar, Header, Footer)
│   │   ├── forms/              # Form components with React Hook Form
│   │   └── modals/             # Modal and drawer components
│   │
│   ├── hooks/                  # App-specific custom React hooks
│   ├── contexts/               # React Context providers
│   ├── services/               # Business logic layer (no direct API calls here)
│   ├── api/                    # API layer: fetch wrappers, TanStack Query keys
│   ├── store/                  # Zustand global state stores
│   ├── lib/                    # Third-party library configurations (queryClient, socket)
│   ├── middleware/             # Next.js middleware (auth guards, redirects)
│   ├── assets/
│   │   ├── images/             # Static images
│   │   ├── icons/              # Custom SVG icons
│   │   └── fonts/              # Self-hosted font files
│   ├── styles/                 # Global CSS, Tailwind base overrides
│   ├── constants/              # App-level constants (route paths, etc.)
│   ├── types/                  # App-specific TypeScript types (extends @food-mania/types)
│   └── utils/                  # App-specific utility functions
│
├── public/                     # Static public files (favicon, og-images, robots.txt)
├── .env.example                # Environment variable template
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration (extends root)
└── package.json                # App dependencies
```

## Package Structure

### packages/types
Organized by business domain — matches the Food Mania domain model.
```
src/
├── common/         # ApiResponse, Pagination, etc.
├── user/           # Customer, Staff, Admin types
├── restaurant/     # Restaurant, Outlet, Table types
├── menu/           # Category, Item, Variant, AddOn types
├── order/          # Cart, Order, OrderItem types
├── reservation/    # Reservation, Slot types
├── payment/        # Payment, Transaction types
├── notification/   # Notification types
├── subscription/   # Plan, Subscription types
├── analytics/      # Metric types
├── enums.ts        # All platform enumerations (single file)
└── index.ts        # Barrel export
```

### packages/theme
```
src/tokens/
├── colors.ts        # Brand, primary, neutral, semantic, table status colors
├── typography.ts    # Font families, size scale, weights
└── animations.ts    # Framer Motion variants, easing, stagger presets
```

### packages/shared
```
src/
├── hooks/           # useDebounce, useLocalStorage, useMediaQuery, etc.
├── contexts/        # QueryClientProvider, ThemeProvider, ToastProvider
├── constants/       # platform.constants.ts (all magic numbers centralized)
├── validators/      # Shared Zod schemas
├── utils/           # Cross-app utility functions
└── lib/             # Shared library configs
```
