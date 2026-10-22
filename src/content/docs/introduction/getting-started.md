---
title: "Getting started"
description: "Learn how to get Hikma Health set up in your project in under thirty minutes."
order: 1
---

## Quick start

This documentation is continuously improving and expanding. If you have any questions, issues, or general feedback, please [open an issue](https://github.com/hikmahealth/hikma-health-server/issues).

### Overview

For the rest of this documentation, it is important to keep in mind that the platform is a collection of 3 different core technologies/applications:

- **Hikma Health Server** - A full-stack application (combines server API and admin web interface)
- **Hikma Health Mobile Application** (Android and iOS)
- **Database**

Together they form the Hikma Health platform. The server is the core of the platform and includes both the API backend and the admin web interface in a single application. It's built with TypeScript and TanStack Start, designed for offline-first operation. The mobile application allows users to collect data in the field. The database is a relational database (PostgreSQL) that stores all the data.

All of the applications live in one repository, [hikma-health-server](https://github.com/hikmahealth/hikma-health-server), on the default branch `v3`:

- `apps/server/` — the server (API + admin web interface)
- `apps/mobile/` — the mobile application (Expo / React Native)
- `apps/aiproxy/` — the optional AI proxy used for report generation
- `apps/local-hub/` — the optional Local Sync Hub desktop app

> **Working in a low-connectivity clinic?** There is an optional fourth component — the [Local Sync Hub](/docs/local-sync-hub/overview), a desktop app that mobile devices sync to over the local network when there is no internet, letting them share data through the hub, which relays to the cloud later. It is not required to get started; set it up only if your clinic needs offline device-to-device sync.

> **Upgrading an existing deployment?** If you run a deployment from the old `main` branch, or from the separate `hikma-health-backend` (Python/Flask) and `hikma-health-admin` (Next.js) repositories, point it at the `v3` branch. Your PostgreSQL database is kept, and migrations run automatically on startup, including databases migrated with the legacy Alembic migrations. See [Upgrading to v3](/docs/introduction/hikma-health-v3#upgrading-to-v3) for the steps.

### Requirements

To get started with each of the applications, you will need to have the following installed on your machine:

**For the Server (API + Admin):**

- **Git:** A version control system that allows you to download the code from GitHub.
- **Node.js (v24.14.0):** A JavaScript runtime that allows you to run JavaScript code outside of a browser.
- **pnpm 12:** A fast, disk space efficient package manager (install with `npm install -g pnpm@12`).
- **PostgreSQL:** A relational database that stores all the data.
- **PGAdmin (Recommended):** A tool that allows you to manage PostgreSQL databases. Can save you a lot of time.

**For the Mobile Application:** _ℹ️ It is recommended that you download the latest application from the Google Play Store or Apple App Store instead of building it from source._

- **Android Studio** (for Android) or **Xcode** (for iOS).
- **Expo / React Native toolchain:** see the [Expo setup guide](https://docs.expo.dev/get-started/installation/).
- **pnpm 12:** the same package manager as the server.
- **ngrok (Optional):** A tool that allows you to expose a local server to the internet. This makes it easier to test the mobile application.

### Clone the repository

Everything is in one repository, so you only need to clone it once:

```
# Clone the repository (includes the server, mobile app, AI proxy and Local Sync Hub)
git clone https://github.com/hikmahealth/hikma-health-server.git
cd hikma-health-server

# Install dependencies
pnpm install
```

(Recommended) Download the Hikma Health mobile app from the App Store or Google Play Store instead of building it yourself.

## Local set up

Make sure you have all the requirements installed on your machine. Then, follow the instructions below to set up the platform locally.

### PostgreSQL database

The database is a relational database (PostgreSQL) that stores all the data. You will need to install PostgreSQL on your machine and create a database for the platform.

```
# Start the PostgreSQL server
pg_ctl -D /usr/local/var/postgres start

# Create a database for the platform
createdb hikma_health

# Create a user for the platform
createuser hikma_health

# Grant all privileges to the user
grant all privileges on database hikma_health to hikma_health;

# Set the password for the user
alter user hikma_health with encrypted password 'hikma_health';

# Set the user as the owner of the database
alter database hikma_health owner to hikma_health;
```

### Hikma Health Server (API + Admin)

The server is a full-stack application built with TypeScript and TanStack Start, in `apps/server/`. It combines both the API backend and the admin web interface into a single application. Make sure you have Node.js (v24.14.0) and pnpm installed on your computer. Also make sure you have a database set up and running - as shown above.

Create `apps/server/.env` and configure your database connection. The simplest approach is to set the `DATABASE_URL`:

```
DATABASE_URL=postgresql://hikma_health:hikma_health@localhost:5432/hikma_health
```

Alternatively, you can configure individual database variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`). Localhost databases don't need any SSL settings. See [Environment variables](/docs/deployment/quick-start#environment-variables) and `apps/server/README.md` for all available options, including database TLS, storage, and Sentry monitoring.

Once your `.env` is configured, run these from the repository root:

```
# Run database migrations and start the development server (with hot reload)
pnpm exec just dev-server
```

The application will be available at `http://localhost:3000` and includes both:

- **API endpoints** for the mobile application
- **Admin web interface** for managing data through your browser

> **Creating the first administrator:** On a new database, open `http://localhost:3000/setup` and enter the setup token to create your organization, first clinic and administrator account. If you haven't set `SETUP_TOKEN` in your `.env`, the token is printed in the server logs. See [Creating the first administrator](/docs/deployment/quick-start#creating-the-first-administrator).

#### Available scripts

Run these from the repository root:

| Command | Description |
|---|---|
| `pnpm exec just dev-server` | Run migrations and start the dev server with hot reload on port 3000 |
| `pnpm run server:install-build` | Install dependencies and build the server for production |
| `pnpm run server:build` | Build the server (assumes dependencies are installed) |
| `pnpm run server:start` | Production start (runs migrations, permission recovery and setup-token generation) |
| `pnpm exec just setup-token-reset` | Replace a generated first-run setup token |
| `pnpm run lint` | Run the linter (oxlint) |

App-specific scripts run with a pnpm filter:

| Command | Description |
|---|---|
| `pnpm --filter hikma-health-server run test` | Run all tests (unit + integration) |
| `pnpm --filter hikma-health-server run test:watch` | Run unit tests in watch mode |
| `pnpm --filter hikma-health-server run test:e2e` | Run Playwright end-to-end tests |
| `pnpm --filter hikma-health-server run test:coverage` | Generate test coverage report |
| `pnpm --filter hikma-health-server run format` | Format code (Biome) |
| `pnpm --filter hikma-health-server run recovery-permissions` | Fix user role and clinic permission issues |
| `pnpm --filter hikma-health-server run recovery-permissions-dry-run` | Preview permission fixes without applying |

> **Production deployment:** For production, fork the repository into your own GitHub organization first, then use the deploy buttons in your fork's README to deploy to Render or DigitalOcean with one click. The application automatically runs migrations and permission recovery on startup and is optimized for reliability in low-resource settings. See [Quick Start](/docs/deployment/quick-start).

### Mobile application

The mobile application is developed using Expo and React Native, in `apps/mobile/`. Please make sure you have the Expo / React Native toolchain properly set up on your computer as described [here](https://docs.expo.dev/get-started/installation/). If your set up is not correct, you will encounter errors when trying to run the application.

⭐️ **We recommend that you do not build your own mobile application.** Instead, you can use the pre-built mobile application available on the App Store and Google Play Store.

If you insist on building your own mobile application, you can follow the instructions below:

```
# Point the app at your server (edit based on which port the server is running)
echo "EXPO_PUBLIC_HIKMA_API_TESTING=http://localhost:3000" > apps/mobile/.env

# From the repository root, build, install and launch the app
pnpm run mobile:start-android   # or: pnpm run mobile:start-ios
```

See `apps/mobile/README.md` for EAS builds and the Maestro end-to-end tests.

## Getting help

The best place to learn more about the Hikma Health platform is to visit our website at [hikmahealth.org](https://hikmahealth.org) and our GitHub repository at [github.com/hikmahealth](https://github.com/hikmahealth).

### Submit an issue

If you have a question or need help with getting started, please either send an email to [tech@hikmahealth.org](mailto:tech@hikmahealth.org) or submit an issue on the appropriate repository - which you can find in our [GitHub organization](https://github.com/hikmahealth).

### Join the community

You can support the development of this project by writing code, fixing bugs, and improving documentation. We welcome pull requests, bug reports, and issue reports. Please see our contributing guidelines for more information.