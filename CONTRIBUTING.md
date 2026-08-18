# Contributing to Food Mania

Thank you for contributing to Food Mania! Please read this guide before opening a PR.

---

## Development Workflow

1. **Fork** the repository (external contributors) or create a branch (team members).
2. Follow the **[Branch Strategy](./docs/BRANCH_STRATEGY.md)** — all work goes through feature branches into `develop`.
3. Follow the **[Coding Standards](./docs/CODING_STANDARDS.md)**.
4. Follow the **[Commit Conventions](./docs/COMMIT_CONVENTIONS.md)** — enforced by Husky commit-msg hook.
5. Open a Pull Request to `develop` with a clear description.

## Before You Push

The pre-commit hook runs `lint-staged` automatically. Ensure locally:

```bash
npm run lint        # No ESLint errors
npm run type-check  # No TypeScript errors
npm run format:check # Prettier formatting is clean
```

## Pull Request Requirements

- PR title must match commit convention format.
- Must include a description of what changed and why.
- Screenshots / screen recordings required for any UI change.
- All checks must pass (lint, type-check, build).
- Minimum 1 reviewer approval required (2 for `main`).

## Reporting Issues

Use GitHub Issues with one of these labels:
- `bug` — Something is broken.
- `enhancement` — A new feature or improvement.
- `documentation` — Docs need updating.
- `question` — Clarification needed.

## Code of Conduct

Be respectful. Be professional. Build great software together.
