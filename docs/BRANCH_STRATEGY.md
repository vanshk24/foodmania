# Food Mania — Git Branch Strategy

## Branch Model: GitHub Flow (simplified) + Long-lived Environment Branches

```
main           ← Production-ready code. Protected. Requires PR + 2 approvals.
develop        ← Integration branch. All feature branches merge here first.
staging        ← Pre-production. Mirrors production infra for QA.
feature/*      ← Feature development (e.g., feature/customer-qr-scan)
fix/*          ← Bug fixes (e.g., fix/business-kds-disconnect)
hotfix/*       ← Emergency production fixes — branch from main, merge to both main + develop
chore/*        ← Config, deps, tooling changes (e.g., chore/upgrade-nextjs-14)
docs/*         ← Documentation only (e.g., docs/update-api-spec)
```

## Naming Convention

`<type>/<scope>-<short-description>`

Examples:
- `feature/customer-restaurant-discovery`
- `feature/business-qr-code-generator`
- `fix/admin-tenant-suspension-bug`
- `hotfix/payment-webhook-timeout`
- `chore/upgrade-tanstack-query-v5`

## Rules

1. **Never commit directly to `main` or `develop`.**
2. All features must be developed in a `feature/*` branch.
3. PRs to `develop` require at minimum 1 reviewer approval.
4. PRs to `main` require 2 reviewer approvals + passing CI.
5. Delete feature branches after merge.
6. Hotfixes MUST be cherry-picked or merged into `develop` after merging to `main`.

## Release Process

```
feature/* ──► develop ──► staging (QA) ──► main (Production Release)
```
