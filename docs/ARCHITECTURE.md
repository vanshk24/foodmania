# Food Mania — Architecture Overview

## Monorepo Layout

Food Mania uses **Turborepo** to manage a pnpm/npm workspace monorepo containing 3 Next.js applications and 6 shared packages.

## Application Architecture

Each Next.js app follows a **layered architecture**:

```
Page (Next.js App Router)
  └── Component (React)
        └── Hook (custom hook)
              └── Service (business logic)
                    └── API Layer (TanStack Query + fetch)
                          └── Backend REST API / WebSocket
```

## Real-time Architecture

KDS order updates and table status changes use **Socket.io** with a Redis Pub/Sub adapter:

```
Order Placed ──► API Server publishes to Redis channel
                      └── Socket server subscribes
                            └── Broadcasts to KDS clients (business app)
                            └── Broadcasts to diner live tracker (customer app)
```

## Multi-tenancy

- All data is scoped by `tenant_id` (Restaurant) and `outlet_id`.
- PostgreSQL Row-Level Security (RLS) enforces data isolation at database level.
- Application middleware validates JWT tenant context on every request.

## State Management Strategy

| State Type | Tool |
| :--- | :--- |
| Server state (API data) | TanStack Query |
| Global client UI state | Zustand |
| Form state | React Hook Form |
| URL state | Next.js `useSearchParams` |
| Real-time state | Socket.io event handlers |

## Security Layers

1. JWT authentication with role-based claims.
2. Next.js middleware route guards.
3. API-level RBAC validation.
4. PostgreSQL RLS (final safety net).
5. QR URL HMAC signature validation.
6. Zod schema validation on all external inputs.
