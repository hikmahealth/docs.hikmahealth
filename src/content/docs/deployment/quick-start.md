---
title: "Quick Start"
description: "Deploy Hikma Health to production in minutes."
order: 1
---

## Quick Start Deployment

Follow these steps to deploy Hikma Health to a production environment. You can use the one-click deploy buttons available in the [server repository](https://github.com/hikmahealth/hikma-health-server) to deploy to Render or DigitalOcean.

### One-click deploy

The fastest way to get Hikma Health running in production is to use one of the deploy buttons in the [hikma-health-server README](https://github.com/hikmahealth/hikma-health-server). These will automatically provision a server, set up the database, and run migrations.

### Manual deployment

If you prefer to deploy manually, you will need:

- A server or cloud instance running Node.js v22.14+
- A PostgreSQL database (v14 or higher recommended)
- pnpm installed globally

```
# Clone the repository
git clone https://github.com/hikmahealth/hikma-health-server.git
cd hikma-health-server

# Install dependencies
pnpm install

# Set environment variables
export DATABASE_URL="postgresql://user:password@host:5432/hikma_health"

# Run database migrations
pnpm run migrate:latest

# Build for production
pnpm build

# Start the production server
pnpm start
```

### Environment variables

At a minimum, you need to configure the following environment variable:

- **`DATABASE_URL`** — Your PostgreSQL connection string in the format `postgresql://user:password@host:5432/database_name`

Refer to the repository README for additional optional environment variables.

### Verifying the deployment

Once the server is running, visit your deployment URL in a browser. You should see the admin interface. The API endpoints will be available at the same URL for the mobile application to connect to.