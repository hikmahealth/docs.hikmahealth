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

> **Migrating from the old Python version?** If you previously used the separate `hikma-health-backend` (Python/Flask) and `hikma-health-admin` (Next.js) repositories, they have now been combined into a single modern full-stack application. Migration is straightforward - the new system uses the same PostgreSQL database and automatically runs migrations on startup. The migration system is backwards-compatible with the legacy Alembic migrations from the Python era. See the migration guide for details.

### Requirements

To get started with each of the applications, you will need to have the following installed on your machine:

**For the Server (API + Admin):**

- **Git:** A version control system that allows you to download the code from GitHub.
- **Node.js (v24.14.0):** A JavaScript runtime that allows you to run JavaScript code outside of a browser.
- **pnpm:** A fast, disk space efficient package manager (install with `npm install -g pnpm`).
- **PostgreSQL:** A relational database that stores all the data.
- **PGAdmin (Recommended):** A tool that allows you to manage PostgreSQL databases. Can save you a lot of time.

**For the Mobile Application:** _ℹ️ It is recommended that you download the latest application from the Google Play Store or Apple App Store instead of building it from source._

- **Android Studio:** An IDE for Android development.
- **React Native:** A framework for building native apps using JavaScript and React.
- **pnpm:** A fast, disk space efficient package manager (install with `npm install -g pnpm`).
- **ngrok (Optional):** A tool that allows you to expose a local server to the internet. This makes it easier to test the mobile application.

### Clone Repositories

First, create a directory to store all the code for the platform. Then, clone the repositories for each of the applications:

```
# Make a directory to store all the code
mkdir hikma-health

# Change into the directory
cd hikma-health
```

This will help with organizing the code and make it easier to run the applications.

Next, clone the repositories:

```
# Clone the server repository (includes both API and admin interface)
git clone https://github.com/hikmahealth/hikma-health-server.git

# (Recommended) Download the HH mobile app from the App Store or Google Play Store.

# (Optional) Clone the mobile app repository
git clone git@github.com:hikmahealth/hikma-health-app.git
```

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

The server is a full-stack application built with TypeScript and TanStack Start. It combines both the API backend and the admin web interface into a single application. Make sure you have Node.js (v24.14.0) and pnpm installed on your computer. Also make sure you have a database set up and running - as shown above.

```
# Change into the server directory
cd hikma-health-server

# Install dependencies
pnpm install

# Create a .env file from the template
cp .env.example .env
```

Open the `.env` file and configure your database connection. The simplest approach is to set the `DATABASE_URL`:

```
DATABASE_URL=postgresql://hikma_health:hikma_health@localhost:5432/hikma_health
```

Alternatively, you can configure individual database variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`). See `.env.example` for all available options including SSL settings, storage buckets, and Sentry monitoring.

> **Getting default credentials:** The application does not yet have a WordPress-style admin setup flow. To get the default login credentials for the admin interface, email the maintainer at [ally@hikmahealth.org](mailto:ally@hikmahealth.org).

Once your `.env` is configured:

```
# Run database migrations
pnpm run migrate:latest

# Start the development server (with hot reload)
pnpm dev
```

The application will be available at `http://localhost:3000` and includes both:

- **API endpoints** for the mobile application
- **Admin web interface** for managing data through your browser

#### Available scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the dev server with hot reload on port 3000 |
| `pnpm build` | Build the application for production |
| `pnpm start` | Production start (runs migrations + permission recovery automatically) |
| `pnpm migrate:latest` | Run all pending database migrations |
| `pnpm test` | Run all tests (unit + integration) |
| `pnpm test:watch` | Run unit tests in watch mode |
| `pnpm test:e2e` | Run Playwright end-to-end tests |
| `pnpm test:coverage` | Generate test coverage report |
| `pnpm lint` | Run the linter (Biome) |
| `pnpm format` | Auto-format code (Biome) |
| `pnpm recovery:permissions` | Fix user role and clinic permission issues |
| `pnpm recovery:permissions:dry-run` | Preview permission fixes without applying |

> **Production deployment:** For production, fork the repository into your own GitHub organization first, then use the deploy buttons in your fork's README to deploy to Render or DigitalOcean with one click. The application automatically runs migrations and permission recovery on startup and is optimized for reliability in low-resource settings.

### Mobile application

The mobile application is developed using React Native, please make sure you have react-native properly set-up on your computer as described [here](https://reactnative.dev/docs/environment-setup). If your set up is not correct, you will encounter errors when trying to run the application.

⭐️ **We recommend that you do not build your own mobile application.** Instead, you can use the pre-built mobile application available on the App Store and Google Play Store.

If you insist on building your own mobile application, you can follow the instructions below:

```
# Change into the mobile app directory
cd hikma-health-app

# Install the dependencies
pnpm install

# Create a .env file with the correct API_URL with the following command
# Edit based on which port the application is running
echo "API_URL=http://localhost:3000" > .env

# Start the application
pnpm android && pnpm start
```

## Getting help

The best place to learn more about the Hikma Health platform is to visit our website at [hikmahealth.org](https://hikmahealth.org) and our GitHub repository at [github.com/hikmahealth](https://github.com/hikmahealth).

### Submit an issue

If you have a question or need help with getting started, please either send an email to [tech@hikmahealth.org](mailto:tech@hikmahealth.org) or submit an issue on the appropriate repository - which you can find in our [GitHub organization](https://github.com/hikmahealth).

### Join the community

You can support the development of this project by writing code, fixing bugs, and improving documentation. We welcome pull requests, bug reports, and issue reports. Please see our contributing guidelines for more information.