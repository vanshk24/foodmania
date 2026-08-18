# Food Mania — Coding Standards

## General Principles

1. **Readability first.** Code is written once and read many times.
2. **Explicit over implicit.** Avoid magic values — use constants from `@food-mania/shared/constants`.
3. **Type everything.** No `any`. No implicit `any`. TypeScript strict mode is enabled.
4. **Small, focused files.** A file should do one thing well.
5. **Colocation.** Keep related code together (component + hook + types in same folder).

## TypeScript

- Always define return types on exported functions.
- Use `type` imports: `import type { Restaurant } from "@food-mania/types"`.
- Use `satisfies` operator over type assertions where possible.
- Prefer `interface` for object shapes, `type` for unions and aliases.
- Never use `as any` — use `as unknown as T` if absolutely necessary and document why.

## React

- Use **functional components** only. No class components.
- Use `"use client"` directive only when the component requires client-side APIs.
- Keep components small. If a component exceeds ~150 lines, split it.
- Use **named exports** for components. No default exports (except Next.js `page.tsx`).
- Co-locate component-specific hooks and types alongside the component file.

## File Naming

| Type | Convention | Example |
| :--- | :--- | :--- |
| React Component | PascalCase | `RestaurantCard.tsx` |
| Hook | camelCase, `use` prefix | `useRestaurantSearch.ts` |
| Utility / Helper | camelCase | `formatCurrency.ts` |
| Type file | camelCase, `.types.ts` | `restaurant.types.ts` |
| Constant file | camelCase, `.constants.ts` | `platform.constants.ts` |
| Test file | same name, `.test.ts` | `RestaurantCard.test.tsx` |

## Import Order

Enforced by ESLint `import/order` rule:
1. Node built-ins
2. External packages
3. Internal packages (`@food-mania/*`)
4. Parent directory imports
5. Sibling imports
6. Index imports
7. Type imports

## Styling (Tailwind CSS)

- Use Tailwind utility classes. No inline `style={{}}` unless animating with Framer Motion.
- Use `clsx` + `tailwind-merge` (via `cn()` helper from `@food-mania/ui/lib`) for conditional classes.
- Avoid arbitrary Tailwind values (`w-[347px]`). Use design token spacing scale.
- Use `cva` (class-variance-authority) for component variant styles.

## Error Handling

- All API calls must handle error states. Use TanStack Query error boundaries.
- Never silently catch errors. Either show user feedback or re-throw.
- Use Zod for all external data validation (API responses, form inputs, URL params).
