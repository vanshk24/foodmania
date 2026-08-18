# Food Mania — Complete Project Details & Technical Context

> **Scan. Order. Enjoy.**  
> *A Modern Multi-Tenant SaaS Restaurant Operations & Customer Experience Platform*

---

## 1. Executive Summary

**Food Mania** is an enterprise-grade, multi-tenant SaaS platform built specifically for the food and hospitality industry. It bridges the gap between restaurant management and customer dining by unifying direct table QR code ordering, online food delivery/takeout, table reservations, live kitchen operations (KDS), and platform-wide SaaS administration into a single cohesive monorepo architecture.

---

## 2. Monorepo Architecture Overview

Food Mania is structured as a high-performance monorepo using **Turborepo** and **npm workspaces**. It decouples frontend user experiences into targeted web applications while utilizing shared packages for type safety, design consistency, and shared business logic.

```
food-mania/
├── apps/
│   ├── admin/       # Super Admin SaaS Operations Portal (Port 3002)
│   ├── api/         # Core Express.js + Prisma ORM REST API Server (Port 5000)
│   ├── business/    # Restaurant Partner & Staff Dashboard (Port 3001)
│   └── customer/    # Consumer Web App & QR Table Ordering Portal (Port 3000)
├── packages/
│   ├── config/      # Shared ESLint, Prettier, and TypeScript configurations
│   ├── shared/      # Repositories, mock services, and API client utilities
│   ├── theme/       # Design system tokens (Colors, Typography, Animations)
│   ├── types/       # Shared TypeScript interfaces, DTOs, and Enums
│   ├── ui/          # Reusable UI component library (Button, Card, Modal, etc.)
│   └── utils/       # Utility functions, formatting helpers, and validators
├── docs/            # Architecture specifications & API contracts
└── scratch/         # Verification suites and integration test scripts
```

---

## 3. Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Monorepo Management** | Turborepo (`v2.0.3`), npm workspaces (`v10.8.2`) |
| **Frontend Frameworks** | Next.js 14 (App Router), React 18, TypeScript 5.4 |
| **Backend API** | Node.js 20+, Express.js, TypeScript |
| **Database & ORM** | PostgreSQL (hosted on Supabase or local), Prisma ORM (`v5`) |
| **Styling & UI** | Modern Vanilla CSS, CSS Modules, Tailwind CSS, Custom Design System Tokens |
| **State & Fetching** | React Hooks, Axios / Fetch API Client, Custom Shared Repositories |
| **Code Quality** | ESLint, Prettier, Husky, Lint-Staged |

---

## 4. Application Breakdown

### 📱 1. Customer Web Application (`apps/customer`)
- **URL**: `http://localhost:3000`
- **Target Audience**: Diners and Online Ordering Customers
- **Key Features**:
  - **Dynamic Restaurant Marketplace**: Search, filter by cuisine, rating, and city.
  - **Dine-In Table QR Code Ordering**: Instant menu loading bound to specific table IDs (`/restaurant/[id]/menu?table=T-01`).
  - **Smart Cart & Checkout**: Real-time total calculation, coupon application, order item variants, and payment handling.
  - **Table Reservation Flow**: Select date, guest count, and time slots with instant confirmation.
  - **Real-Time Order Tracking**: Live status updates from `PENDING` $\rightarrow$ `PREPARING` $\rightarrow$ `READY` $\rightarrow$ `COMPLETED`.
  - **User Reviews & Ratings**: Submit ratings and feedback per restaurant.

### 🏪 2. Business Partner Dashboard (`apps/business`)
- **URL**: `http://localhost:3001`
- **Target Audience**: Restaurant Owners, Managers, Kitchen Staff, and Table Servers
- **Key Features**:
  - **Live Kitchen Display System (KDS)**: Real-time ticket management for kitchen staff.
  - **Order Desk & Pipeline Management**: Accept, prepare, mark ready, or cancel incoming orders.
  - **Reservation Desk**: View, confirm, and assign tables for guest bookings.
  - **Menu & Inventory Manager**: Create categories, toggle dish availability, update prices and variants.
  - **Table & QR Code Manager**: Generate and manage table numbers, capacities, and QR identifiers.
  - **Business Analytics & Reports**: Revenue metrics, top-selling items, peak ordering hours, and customer retention.

### 🛡️ 3. Super Admin Operations Portal (`apps/admin`)
- **URL**: `http://localhost:3002`
- **Target Audience**: Food Mania Platform Owners & SaaS Operators
- **Key Features**:
  - **SaaS Platform Intelligence**: High-level platform GMV, active restaurant metrics, subscription revenue.
  - **Restaurant Onboarding & Management**: Approve, edit, suspend, or activate restaurant tenants.
  - **User & RBAC Controls**: Manage platform roles (`SUPER_ADMIN`, `OWNER`, `STAFF`, `CUSTOMER`).
  - **Audit Logging**: Trace operational logs across all tenant actions for security and compliance.

### ⚙️ 4. Core Backend API Server (`apps/api`)
- **URL**: `http://localhost:5000/api/v1`
- **Target Audience**: Service backend for all 3 web portals
- **Key Features**:
  - **Modular Architecture**: Controller-Service-Repository pattern.
  - **Prisma Data Layer**: Typed database access to PostgreSQL.
  - **Security & Rate Limiting**: CORS control, helmet security headers, sanitized request parsing.
  - **Health Monitoring**: Dedicated health check endpoints (`/api/v1/health`).

---

## 5. Shared Packages Architecture

- **`@foodmania/types`**: Single source of truth for all domain models, request/response DTOs, and enums (`OrderStatus`, `PaymentStatus`, `BookingStatus`, `UserRole`).
- **`@foodmania/theme`**: Core design system variables including color palettes, typography scale, responsive breakpoints, and smooth micro-animations.
- **`@foodmania/ui`**: Atomic UI component library (`Button`, `Card`, `Badge`, `Avatar`, `Input`, `Modal`, `Drawer`, `Table`).
- **`@foodmania/shared`**: API client abstraction (`apiClient.ts`), mock fallback repositories, and business utility wrappers.
- **`@foodmania/utils`**: Date formatters, currency formatters (`formatINR`), string generators, and validators.

---

## 6. Database Schema Summary

The database uses PostgreSQL managed through Prisma ORM (`apps/api/prisma/schema.prisma`):

| Model | Purpose | Key Fields |
| :--- | :--- | :--- |
| `User` | Platform user identity | `id`, `email`, `role`, `restaurantId`, `password`, `is2FAEnabled` |
| `Restaurant` | Tenant profile | `id`, `name`, `slug`, `city`, `code`, `rating`, `deliveryFee`, `status` |
| `RestaurantOwner` | Restaurant owner entity | `id`, `name`, `email`, `phone`, `restaurantId` |
| `RestaurantTable` | Dining tables | `id`, `tableNumber`, `capacity`, `status`, `restaurantId` |
| `MenuCategory` | Menu organization | `id`, `name`, `sortOrder`, `restaurantId` |
| `MenuItem` | Dishes & items | `id`, `name`, `price`, `isAvailable`, `categoryId`, `restaurantId` |
| `Order` | Customer order | `id`, `orderNumber`, `totalAmount`, `status`, `paymentStatus`, `tableId` |
| `OrderItem` | Individual line items | `id`, `orderId`, `menuItemId`, `quantity`, `price` |
| `Booking` | Table reservation | `id`, `bookingCode`, `guestName`, `bookingDate`, `timeSlot`, `status` |
| `Review` | Restaurant rating | `id`, `rating`, `comment`, `customerName`, `restaurantId` |
| `Coupon` | Discounts & promo codes| `id`, `code`, `discountPercent`, `maxDiscount`, `isActive` |
| `AuditLog` | System audit trail | `id`, `action`, `entity`, `performedBy`, `createdAt` |

---

## 7. Current Project State & Verification

The codebase has undergone full end-to-end audit and verification:
- ✅ **Monorepo Build**: Clean TypeScript compilation across all apps and packages.
- ✅ **Database Connectivity**: Connected to PostgreSQL/Supabase database.
- ✅ **API Health**: All REST routes tested and verified.
- ✅ **UI Integrity**: Responsive designs across desktop, tablet, and mobile breakpoints.
- ✅ **Git Synchronization**: Tracked and committed under Git (`origin/main`).
