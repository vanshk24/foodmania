# Food Mania — Commit Message Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

## Types

| Type | When to Use |
| :--- | :--- |
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, whitespace — no logic change |
| `refactor` | Code change that is neither a fix nor a feature |
| `test` | Adding or updating tests |
| `chore` | Dependency updates, build tools, config |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration changes |
| `build` | Build system changes |
| `revert` | Reverts a previous commit |

## Scopes

| Scope | App / Package |
| :--- | :--- |
| `customer` | apps/customer |
| `business` | apps/business |
| `admin` | apps/admin |
| `ui` | packages/ui |
| `shared` | packages/shared |
| `types` | packages/types |
| `config` | packages/config |
| `utils` | packages/utils |
| `theme` | packages/theme |
| `root` | Root monorepo changes |
| `api` | Backend API (when applicable) |

## Examples

```
feat(customer): add restaurant search with cuisine filters
fix(business): resolve QR code generation PDF encoding error
docs(root): update branch strategy with hotfix process
chore(root): upgrade turborepo to v2.0.3
refactor(shared): extract OTP validation to shared utils
perf(customer): cache menu API response with TanStack Query
```

## Breaking Changes

Append `!` after the type/scope and include `BREAKING CHANGE:` in the footer:

```
feat(types)!: rename OrderStatus enum values to uppercase

BREAKING CHANGE: All OrderStatus references must be updated to use uppercase values.
```
