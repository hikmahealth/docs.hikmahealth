---
title: "Quick Start"
description: "Deploy Hikma Health to production in minutes."
order: 1
---

## Quick Start Deployment

Follow these steps to deploy Hikma Health to a production environment. You can use the one-click deploy buttons available in the [server repository](https://github.com/hikmahealth/hikma-health-server) to deploy to Render or DigitalOcean.

### One-click deploy

The fastest way to get Hikma Health running in production is to first [fork the hikma-health-server repository](https://github.com/hikmahealth/hikma-health-server/fork) into your own GitHub organization, then use the deploy buttons in your fork's README. This ensures you have full control over your deployment and can pull in future updates on your own schedule. The deploy buttons will automatically provision a server, set up the database, and run migrations.

### Manual deployment

If you prefer to deploy manually, you will need:

- A server or cloud instance running Node.js v24.14.0
- A PostgreSQL database (v14 or higher recommended)
- pnpm installed globally

```
# Clone the repository
git clone https://github.com/hikmahealth/hikma-health-server.git
cd hikma-health-server

# Install dependencies
pnpm install

# Set up environment variables from the template
cp .env.example .env
# Edit .env and set DATABASE_URL and any other required variables

# Build for production
pnpm build

# Start the production server
# This automatically runs migrations and permission recovery on startup
pnpm start
```

### Environment variables

At a minimum, you need to configure your database connection. You can do this in one of two ways:

- **`DATABASE_URL`** — A PostgreSQL connection string: `postgresql://user:password@host:5432/database_name`
- **Individual variables** — `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (used when `DATABASE_URL` is not set)

If your database requires SSL (common with cloud providers like Render), also set:

- **`DB_SSL`** — Set to `true` to enable SSL
- **`DB_SSL_REJECT_UNAUTHORIZED`** — Set to `false` for self-signed certificates

See `.env.example` in the repository for all available options including storage, monitoring, and application settings.

### Getting admin credentials

The application does not yet have a self-service admin setup flow. To get the default login credentials, email [ally@hikmahealth.org](mailto:ally@hikmahealth.org).

### Verifying the deployment

Once the server is running, visit your deployment URL in a browser. You should see the admin interface login page. The API endpoints are served from the same URL for the mobile application to connect to.

To connect the mobile app, set the server URL in the app's settings to your deployment URL (e.g., `https://your-deployment.onrender.com`).
