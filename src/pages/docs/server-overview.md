---
title: Server Overview
description: A modern full-stack TypeScript server that combines the API backend and admin portal in a single unified application
---

The Hikma Health Server is a full-stack TypeScript application that serves as the backbone of the entire EHR platform. It combines both the API backend (for mobile applications) and the admin web interface into a single unified application, designed for offline-first operation in low-resource settings.

---

## What Does the Server Do?

The server's main responsibilities include:

- **Authentication & Authorization**: Secure user management and access control
- **Database Management**: All data operations through a type-safe query builder
- **API Endpoints**: RESTful API for mobile applications to sync data
- **Admin Web Interface**: Browser-based portal for system administration
- **Data Synchronization**: Handles offline-first sync from mobile devices
- **Patient Records**: Manages patient information, visits, and medical history
- **Forms Management**: Dynamic medical forms that can be customized
- **Reports & Analytics**: Data export and reporting capabilities

---

## Technology Stack

The server is built with modern web technologies optimized for reliability and performance:

### Core Framework
- **Runtime**: [Node.js 22.14+](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Framework**: [TanStack Start](https://tanstack.com/start) - React-based full-stack framework
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast build and hot module replacement

### Database & Queries
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Reliable relational database
- **Query Builder**: [Kysely](https://kysely.dev/) - Type-safe SQL query builder
- **Migrations**: SQL-based schema migrations in the `db/` directory

### Frontend (Admin Portal)
- **UI Framework**: React with TypeScript
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) - Utility-first CSS
- **Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Forms**: [TanStack Form](https://tanstack.com/form) with React Hook Form
- **Routing**: [TanStack Router](https://tanstack.com/router) - Type-safe file-based routing

### State Management
- **Client State**: [TanStack Store](https://tanstack.com/store)
- **State Machines**: [XState](https://xstate.js.org/)
- **Data Caching**: TanStack Query (React Query)

### Development & Testing
- **Testing**: [Vitest](https://vitest.dev/) for unit tests, [Playwright](https://playwright.dev/) for E2E
- **Linting & Formatting**: [Biome](https://biomejs.dev/) - Fast linter and formatter
- **Type Checking**: TypeScript strict mode
- **Monitoring**: [Sentry](https://sentry.io/) for error tracking

### Package Management
- **Package Manager**: [pnpm](https://pnpm.io/) - Fast, disk-efficient package manager

---

## Architecture

The server uses a modern full-stack architecture where the frontend and backend are tightly integrated:

```text
┌─────────────────────────────────────────────┐
│         Hikma Health Server                 │
│    (Single Unified Application)             │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐      ┌─────────────┐     │
│  │   Admin UI  │      │  API Routes │     │
│  │  (Browser)  │      │   (Mobile)  │     │
│  └──────┬──────┘      └──────┬──────┘     │
│         │                     │             │
│         └──────────┬──────────┘             │
│                    │                        │
│         ┌──────────▼──────────┐            │
│         │   Business Logic    │            │
│         │   & Middleware      │            │
│         └──────────┬──────────┘            │
│                    │                        │
│         ┌──────────▼──────────┐            │
│         │  Kysely Query       │            │
│         │  Builder Layer      │            │
│         └──────────┬──────────┘            │
└────────────────────┼────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │   PostgreSQL        │
          │   Database          │
          └─────────────────────┘
```

---

## Project Structure

Understanding the project structure helps you navigate and modify the codebase:

```text
hikma-health-server/
├── db/                      # Database migrations (SQL files)
│   ├── 001_initial.sql
│   └── 002_add_feature.sql
│
├── src/
│   ├── app/                 # Application-level layouts & components
│   ├── components/          # Reusable UI components (shadcn/ui)
│   ├── data/                # Data fetching & caching logic
│   ├── db/                  # Database connection & utilities
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # Third-party service integrations
│   ├── lib/                 # Utility functions & helpers
│   ├── middleware/          # Server middleware (auth, etc.)
│   ├── models/              # TypeScript data models & types
│   ├── routes/              # File-based routing (API + pages)
│   ├── stores/              # State management stores
│   ├── env.ts               # Environment variable validation
│   ├── router.tsx           # Router configuration
│   └── styles.css           # Global styles
│
├── tests/                   # Unit test files
├── e2e/                     # End-to-end test files
├── scripts/                 # Utility scripts
├── public/                  # Static assets
│
├── .env                     # Environment variables (DO NOT COMMIT)
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Build configuration
```

### Key Directories Explained

- **`src/routes/`**: File-based routing powered by TanStack Router. Each file represents a route in the application (both API endpoints and UI pages).
- **`src/components/`**: Reusable UI components built with Radix UI and styled with Tailwind CSS.
- **`src/db/`**: Database connection setup, query builders, and Kysely configuration.
- **`db/`**: SQL migration files that define the database schema evolution.
- **`src/models/`**: TypeScript types and interfaces for data structures (patients, visits, forms, etc.).
- **`src/middleware/`**: Server middleware for authentication, authorization, error handling, etc.

---

## Environment Variables

The server uses environment variables for configuration. Create a `.env` file in the root directory:

### Required Variables

```bash
# Database connection string
DATABASE_URL=postgresql://username:password@host:port/database

# Example for local development
DATABASE_URL=postgresql://hikma_health:hikma_health@localhost:5432/hikma_health
```

### Optional Variables

```bash
# Node environment (development, production, test)
NODE_ENV=development

# Server port (default: 3000)
PORT=3000

# Sentry DSN for error monitoring (production)
SENTRY_DSN=your-sentry-dsn-here

# JWT secret for authentication
JWT_SECRET=your-secret-key-here

# Session configuration
SESSION_SECRET=your-session-secret-here
```

### Security Best Practices

- **NEVER commit the `.env` file** to version control (it's in `.gitignore`)
- Use strong, unique values for all secrets
- Rotate secrets regularly
- Use different `.env` files for development, staging, and production
- In production, use environment variables provided by your hosting platform (e.g., Render, DigitalOcean)

---

## Database Management

### Migrations

The server uses SQL-based migrations stored in the `db/` directory. Migrations are numbered and run in order.

#### Running Migrations

```bash
# Run all pending migrations
pnpm run migrate:latest

# Rollback last migration
pnpm run migrate:down

# Create a new migration
# Create a new file in db/ directory with the next number
# Example: db/003_add_new_table.sql
```

#### Migration Best Practices

- Always test migrations locally before deploying
- Migrations should be reversible when possible
- Use transactions to ensure atomicity
- Include both `up` and `down` migrations
- Document complex migrations with comments

### Query Builder (Kysely)

The server uses Kysely for type-safe database queries:

```typescript
// Example: Fetching patients
const patients = await db
  .selectFrom('patients')
  .selectAll()
  .where('clinic_id', '=', clinicId)
  .execute()

// Example: Creating a visit
const visit = await db
  .insertInto('visits')
  .values({
    patient_id: patientId,
    clinic_id: clinicId,
    provider_id: providerId,
    visit_date: new Date(),
  })
  .returningAll()
  .executeTakeFirstOrThrow()
```

Benefits of Kysely:
- Full TypeScript type safety
- Auto-completion for table names and columns
- Compile-time error checking
- No ORM overhead - just SQL
- Easy to debug - see the actual SQL being generated

---

## Development Workflow

### Running Locally

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
pnpm run migrate:latest

# Start development server (with hot reload)
pnpm dev
```

The application will be available at `http://localhost:3000`

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server on port 3000 |
| `pnpm build` | Build for production |
| `pnpm start` | Run production server (with migrations) |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm db:migrate` | Run database migrations |
| `pnpm format` | Format code with Biome |
| `pnpm lint` | Lint code with Biome |
| `pnpm check` | Run format + lint checks |

### Testing

The server includes comprehensive testing:

**Unit Tests** (Vitest):
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

**E2E Tests** (Playwright):
```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui
```

---

## API Routes

The API provides endpoints for the mobile application to sync data. All API routes are in the `src/routes/api/` directory.

### Authentication

All API requests (except login) require authentication via JWT tokens or session cookies.

### Common Endpoints

- `POST /api/login` - User authentication
- `GET /api/patients` - List patients
- `POST /api/patients` - Create new patient
- `GET /api/patients/:id` - Get patient details
- `POST /api/visits` - Record a visit
- `GET /api/forms` - Get available forms
- `POST /api/sync` - Sync offline data

### Sync Mechanism

The server handles offline-first synchronization from mobile devices:

1. Mobile app collects data offline
2. When online, app sends batch sync request
3. Server validates and processes each item
4. Conflicts are resolved based on timestamps
5. Server responds with sync status and any server updates
6. Mobile app updates local database

---

## Admin Web Interface

The admin interface is served at the same URL as the API. It provides:

- **Dashboard**: Overview of system status and recent activity
- **Patient Management**: Search, view, and edit patient records
- **User Management**: Create and manage clinician accounts
- **Forms Editor**: Create and customize medical forms
- **Reports**: Generate and export data reports
- **Settings**: Configure system settings
- **QR Code Generator**: Create QR codes for mobile app activation

---

## Deployment

### Quick Deploy

Use the one-click deploy buttons for easy deployment:

- [Deploy to Render](https://render.com/deploy?repo=https://github.com/hikmahealth/hikma-health-server)
- [Deploy to DigitalOcean](https://cloud.digitalocean.com/apps/new?repo=https://github.com/hikmahealth/hikma-health-server)

### Manual Deployment

For other platforms:

1. Ensure Node.js 22.14+ is available
2. Set environment variables (especially `DATABASE_URL`)
3. Install dependencies: `pnpm install`
4. Build the application: `pnpm build`
5. Run migrations and start: `pnpm start`

### Production Considerations

- Use a production-grade PostgreSQL database
- Enable SSL/TLS for database connections
- Set up regular database backups
- Configure monitoring and error tracking (Sentry)
- Use environment variables for all secrets
- Set up health check endpoints
- Configure proper CORS policies
- Enable rate limiting for API endpoints

---

## Monitoring & Debugging

### Logging

The server includes structured logging for debugging:

```typescript
console.log('Patient created:', { patientId, clinicId })
console.error('Failed to sync visit:', error)
```

In production, logs are available through your hosting provider's dashboard.

### Error Tracking

Configure Sentry for automatic error tracking:

```bash
SENTRY_DSN=your-sentry-dsn
```

Sentry will capture and report:
- Unhandled exceptions
- API errors
- Frontend errors
- Performance issues

### Health Checks

The server exposes health check endpoints:

- `GET /health` - Basic health check
- `GET /health/db` - Database connectivity check

---

## Migration from Python Version

If you're migrating from the old Python/Flask backend:

### Key Differences

| Aspect | Old (Python) | New (TypeScript) |
|--------|-------------|------------------|
| Language | Python 3.10 | TypeScript (Node.js 22+) |
| Framework | Flask | TanStack Start |
| Admin | Separate Next.js app | Integrated in same app |
| ORM | psycopg2 | Kysely query builder |
| Port | 8000 | 3000 |
| Migrations | Flask-Migrate | SQL files |
| Testing | pytest | Vitest + Playwright |

### Migration Steps

1. Deploy the new server using your existing database
2. The application will automatically run migrations
3. Update mobile app QR codes to point to new URL
4. Test all functionality
5. Retire old Python backend and admin deployments

Your data remains safe - the new system uses the same PostgreSQL database and migrates the schema automatically.

---

## Contributing

To contribute to the server:

1. Fork the [repository](https://github.com/hikmahealth/hikma-health-server)
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test && pnpm test:e2e`
5. Run checks: `pnpm check`
6. Submit a pull request

See the [CONTRIBUTING.md](https://github.com/hikmahealth/hikma-health-server/blob/main/CONTRIBUTING.md) for detailed guidelines.

---

## Further Reading

- [Architecture Guide](/docs/architecture-guide) - Understand the full system architecture
- [Deployment Guide](/docs/deployment-quick-start) - Deploy your own instance
- [Customization](/docs/customizing-hh) - Customize forms and workflows
- [API Documentation](/docs/api-reference) - Detailed API endpoint documentation
- [Security Best Practices](/docs/security) - Secure your deployment