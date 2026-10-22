---
title: "Quick Start"
description: "Deploy Hikma Health to production in minutes."
order: 1
---

## Quick Start Deployment

Follow these steps to deploy the Hikma Health server to a production environment. You can use the one-click deploy buttons in the [hikma-health-server repository](https://github.com/hikmahealth/hikma-health-server) to deploy to Render or DigitalOcean.

> **Upgrading from v2?** The default branch is now `v3`, and `main` no longer receives updates. Point your deployment at `v3`; your database is kept and migrations run on startup. See [Upgrading to v3](/docs/introduction/hikma-health-v3#upgrading-to-v3).

### One-click deploy

The fastest way to get Hikma Health running in production is to first [fork the hikma-health-server repository](https://github.com/hikmahealth/hikma-health-server/fork) into your own GitHub organization, then use the deploy buttons in your fork's README. This ensures you have full control over your deployment and can pull in future updates on your own schedule. The deploy buttons will automatically provision a server, set up the database, and run migrations.

The AI proxy is optional and deploys as a separate service. On Render, apply `aiproxy.render.yaml` as a second Blueprint once the server is healthy.

### Manual deployment

If you prefer to deploy manually, you will need:

- A server or cloud instance running Node.js v24.14.0
- A PostgreSQL database (v14 or higher recommended)
- pnpm 12 (`npm install -g pnpm@12`)

The repository is a monorepo. The server lives in `apps/server/`, and you run it from the repository root:

```
# Clone the repository (the default branch is v3)
git clone https://github.com/hikmahealth/hikma-health-server.git
cd hikma-health-server

# Create apps/server/.env and set DATABASE_URL (see below)

# Install the server's dependencies and build it
pnpm run server:install-build

# Start the production server
# This runs migrations, permission recovery and setup-token generation, then starts the server
pnpm run server:start
```

On a platform that runs its own `pnpm install` first, use `pnpm run server:build` instead of `server:install-build`.

### Environment variables

The server reads `apps/server/.env`. At a minimum, you need to configure your database connection. You can do this in one of two ways:

- **`DATABASE_URL`** — A PostgreSQL connection string: `postgresql://user:password@host:5432/database_name`
- **Individual variables** — `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (used when `DATABASE_URL` is not set)

**Database TLS is required in production.** Set the mode explicitly:

- Append **`?sslmode=…`** to `DATABASE_URL` (preferred), or set **`DB_SSLMODE`**. Valid modes are `disable`, `require`, `verify-ca` and `verify-full`. Use `verify-full` for any database that isn't on the same machine.
- If your provider's certificate chain isn't publicly trusted (for example Render's internal Postgres, or a self-hosted database with a private CA), paste the PEM certificate into **`DATABASE_CA_CERT`**.
- Localhost connections default to `disable`, so local development works without extra settings.

Without an explicit `sslmode`, production falls back to `require` and logs a deprecation warning. A future release will refuse to start instead. `DATABASE_SSL_OPTIONS` is no longer used.

Optional settings:

- **`SETUP_TOKEN`** — The passphrase for the first-run setup page (at least 24 characters). If you leave it unset, the server generates one and prints it to the logs.
- **`DB_POOL_MAX`** (default `20`) and **`DB_STATEMENT_TIMEOUT_MS`** (default `60000`) — Database connection pool tuning.

See `apps/server/README.md` in the repository for all available options, including storage, monitoring, and application settings.

### Creating the first administrator

A new deployment has no administrator account. Once the server is running, open `https://<your-server>/setup`, enter the **setup token**, then register your organization and first clinic and create your administrator account.

Where to find the setup token:

- **Render:** the service's **Environment** tab, `SETUP_TOKEN`.
- **DigitalOcean:** the deploy form asks for `SETUP_TOKEN`. Type your own passphrase (at least 24 characters), or keep the suggested value and copy the generated token from the app's **Runtime Logs**.
- **Anywhere else:** set `SETUP_TOKEN` yourself, or leave it unset and copy the generated token from the server logs. Run `pnpm exec just setup-token-reset` to replace a generated token.

The setup page is only available until the first administrator is created, and `SETUP_TOKEN` is ignored after that. Servers that were already running before the setup page existed are treated as set up.

### Verifying the deployment

Once the server is running, visit your deployment URL in a browser. You should see the setup page on a new deployment, or the admin sign-in page once setup is done. The API endpoints are served from the same URL for the mobile application to connect to.

To connect the mobile app, set the server URL in the app's settings to your deployment URL (e.g., `https://your-deployment.onrender.com`), or scan the QR code on the mobile app connect card in the admin portal.
