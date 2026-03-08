---
title: "How to contribute"
description: "Thank you for your interest in contributing to Hikma Health! This guide will help you get started with contributing to our projects."
order: 1
---

## How to contribute

Thank you for your interest in contributing to the Hikma Health project! We're excited to have you as part of our community.

- Website: [hikmahealth.org](https://hikmahealth.org)
- GitHub: [github.com/hikmahealth](https://github.com/hikmahealth)

### Development workflow

We use trunk-based development with `dev` as the main development branch.

1. Fork the repository and clone it locally.
2. Create feature branches from `dev` (not `main`).
3. Make changes with clear commit messages.
4. Run tests.
5. Submit PRs against `dev`.
6. Await code review and address feedback.
7. Merge to `dev` once approved.
8. Periodically, `dev` is merged to `main` for production releases.

**Branch strategy:**

- `main` — Production-ready, stable releases
- `dev` — Active development
- `feature/*` — Feature branches from `dev`
- `fix/*` — Bug fix branches from `dev`

### Getting started

**Prerequisites:**

- Node.js 22.14 or higher
- pnpm (package manager)
- PostgreSQL (local or remote)
- Git

**Setup steps:**

```bash
git clone https://github.com/YOUR_USERNAME/hikma-health-backend.git
cd hikma-health-backend
git remote add upstream https://github.com/hikmahealth/hikma-health-backend.git
pnpm install
# Create your .env file (see Environment Variables below)
pnpm run migrate:latest
pnpm dev  # runs on http://localhost:3000
```

**Keeping your fork updated:**

```bash
git fetch upstream
git checkout dev
git merge upstream/dev
```

### Running tests

**Unit tests (Vitest):**

- `pnpm test` — run all tests
- `pnpm test:watch` — watch mode
- `pnpm test:coverage` — with coverage

**E2E tests (Playwright):**

- `pnpm test:e2e` — run all E2E tests
- `pnpm test:e2e:ui` — with UI
- `pnpm test:e2e:debug` — debug mode

Before submitting a PR, run `pnpm test` and `pnpm test:e2e`.

### Code style and quality

We use **Biome** for formatting and linting.

**Commands:**

- `pnpm check` — check formatting and linting
- `pnpm format` — format code
- `pnpm lint` — lint code

**Guidelines:**

- Use TypeScript for all new code
- Follow the existing code structure
- Use meaningful names
- Add comments for complex logic
- Keep functions small and focused
- Write tests for new features
- Update documentation

### Pull request process

1. Create a feature branch from `dev`.
2. Make your changes — write clean code, follow the style guide, add tests, and update docs.
3. Run `pnpm check`, `pnpm test`, and `pnpm test:e2e`.
4. Commit using conventional commit messages.
5. Push to your fork.
6. Create a PR with a description, motivation, related issues, screenshots, and a checklist.
7. Respond to feedback and request re-review when ready.

### Environment variables

**Development (.env file):**

```
DATABASE_URL=postgresql://username:password@localhost:5432/hikma_health
APP_ENV=dev
SERVER_URL=http://localhost:3000
VITE_APP_TITLE=Hikma Health
```

**Testing (E2E credentials):**

```
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_PASS=your-test-password
```

**Sentry (optional):**

```
VITE_SENTRY_ORG=your-org
VITE_SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-token
```

**Security notes:**

- Never commit `.env` files
- Never share credentials publicly
- Use different credentials for development and production
- Follow HIPAA regulations

### Commit guidelines

**Format:** `<type>(<scope>): <subject>`

**Types:**

- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation
- `style` — formatting
- `refactor` — code refactoring
- `perf` — performance
- `test` — tests
- `chore` — maintenance
- `ci` — CI/CD changes

**Examples:**

- `feat(pharmacy): add medication inventory tracking`
- `fix(auth): resolve login redirect issue`
- `docs(readme): update installation instructions`
- `test(api): add tests for user creation endpoint`

### Tech stack

- **Framework:** TanStack Start (React-based full-stack framework)
- **Language:** TypeScript
- **Database:** PostgreSQL with Kysely
- **Styling:** Tailwind CSS 4.0
- **UI:** Radix UI + shadcn/ui
- **State:** TanStack Store, XState
- **Forms:** TanStack Form with React Hook Form
- **Testing:** Vitest + Playwright
- **Quality:** Biome
- **Monitoring:** Sentry
- **Build:** Vite

### Getting help

- **Issues:** Submit on the appropriate [GitHub repository](https://github.com/hikmahealth)
- **Community:** Visit our [GitHub organization](https://github.com/hikmahealth)
- **Resources:** Check existing issues, use GitHub Discussions, and review the README and docs

### Code of conduct

Please be respectful and professional in all interactions. We're building software for healthcare in low-resource settings, and every contribution makes a difference.

Thank you for contributing to Hikma Health! Your efforts help improve healthcare access around the world.
