---
title: Getting started
pageTitle: Hikma Health - Open source and offline first electronic health records
description: The first free mobile health data system for physicians serving refugees
---

Learn how to get Hikma Health set up in your project in under thirty minutes. {% .lead %}

{% quick-links %}

{% quick-link title="Quick Start" icon="installation" href="#quick-start" description="Follow the simple step-by-step instructions to set up the servers, admins and mobile applications." /%}

{% quick-link title="Architecture guide" icon="presets" href="/docs/architecture-guide" description="Dive into the structure of the platform to learn more about all the moving parts and how they relate to each other." /%}

{% quick-link title="Customization" icon="plugins" href="/docs/customizing-hh" description="Hikma Health is built to be extendable and customizable for your needs. Learn how here." /%}

{% quick-link title="Contributing" icon="theming" href="/docs/how-to-contribute" description="How your customization can help other users and create a much larger impact." /%}

{% /quick-links %}

We are committed to open source and making Hikma Health a digital public good. We believe that the best way to build a better future is to share our work with the world.

---

## Quick start

This documentation is continuously improving and expanding. If you have any questions, issues, or general feedback, please
[open an issue](https://github.com/hikmahealth/docs.hikmahealth/issues/new).

### Overview

For the rest of this documentation, it is important to keep in mind that the platform is a collection of 3 different core technologies/applications:

1. [Hikma Health Server](https://github.com/hikmahealth/hikma-health-server) - A full-stack application (combines server API and admin web interface)
2. [Hikma Health Mobile Application (Android only)](https://github.com/hikmahealth/hikma-health-app)
3. [Database](https://www.postgresql.org/)

Together they form the Hikma Health platform. The server is the core of the platform and includes both the API backend and the admin web interface in a single application. It's built with TypeScript and TanStack Start, designed for offline-first operation. The mobile application allows users to collect data in the field. The database is a relational database (PostgreSQL) that stores all the data.

{% callout title="Migrating from the old Python version?" %}
If you previously used the separate `hikma-health-backend` (Python/Flask) and `hikma-health-admin` (Next.js) repositories, they have now been combined into a single modern full-stack application. Migration is straightforward - the new system uses the same PostgreSQL database and automatically runs migrations on startup. See the [migration guide](https://github.com/hikmahealth/hikma-health-server#migrating-from-python-version) for details.
{% /callout %}

### Requirements

To get started with each of the applications, you will need to have the following installed on your machine:

**For the Server (API + Admin):**
- [Git](https://git-scm.com/): A version control system that allows you to download the code from GitHub.
- [Node.js](https://nodejs.org/en/) (v22.14 or higher): A JavaScript runtime that allows you to run JavaScript code outside of a browser.
- [pnpm](https://pnpm.io/): A fast, disk space efficient package manager (install with `npm install -g pnpm`).
- [PostgreSQL](https://www.postgresql.org/): A relational database that stores all the data.
- [PGAdmin](https://www.pgadmin.org/) (Recommended): A tool that allows you to manage PostgreSQL databases. Can save you a lot of time.

**For the Mobile Application:**
_ℹ️ It is recommended that you download the latest application from the Google Play Store or Apple App Store instead of building it from source._

- [Android Studio](https://developer.android.com/studio): An IDE for Android development.
- [React Native](https://reactnative.dev/docs/environment-setup): A framework for building native apps using JavaScript and React.
- [pnpm](https://pnpm.io/): A fast, disk space efficient package manager (install with `npm install -g pnpm`).
- [ngrok](https://ngrok.com/) (Optional): A tool that allows you to expose a local server to the internet. This makes it easier to test the mobile application.

### Clone Repositories

First, create a directory to store all the code for the platform. Then, clone the repositories for each of the applications:

```bash
# Make a directory to store all the code
mkdir hikma-health

# Change into the directory
cd hikma-health
```

This will help with organizing the code and make it easier to run the applications.

Next, clone the repositories:

```bash
# Clone the server repository (includes both API and admin interface)
git clone https://github.com/hikmahealth/hikma-health-server.git

# (Recommended) Download the HH mobile app from the App Store or Google Play Store.

# (Optional) Clone the mobile app repository
git clone git@github.com:hikmahealth/hikma-health-app.git

```

---

## Local set up

Make sure you have all the requirements installed on your machine. Then, follow the instructions below to set up the platform locally.

### PostgreSQL database

The database is a relational database (PostgreSQL) that stores all the data. You will need to install PostgreSQL on your machine and create a database for the platform.

```bash
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

The server is a full-stack application built with TypeScript and TanStack Start. It combines both the API backend and the admin web interface into a single application. Make sure you have Node.js (v22.14+) and pnpm installed on your computer. Also make sure you have a database set up and running - as shown above.

```bash
# Change into the server directory
cd hikma-health-server

# Install dependencies
pnpm install

# Create a .env file with your database connection string
# Replace with your actual PostgreSQL credentials
echo "DATABASE_URL=postgresql://hikma_health:hikma_health@localhost:5432/hikma_health" > .env

# Run database migrations
pnpm run migrate:latest

# Start the development server (with hot reload)
pnpm dev
```

The application will be available at `http://localhost:3000` and includes both:
- **API endpoints** for the mobile application
- **Admin web interface** for managing data through your browser

{% callout title="Production deployment" %}
For production, you can use the quick deploy buttons in the [repository README](https://github.com/hikmahealth/hikma-health-server) to deploy to Render or DigitalOcean with one click. The application automatically runs migrations on startup and is optimized for reliability in low-resource settings.
{% /callout %}

### Mobile application

The mobile application is developed using React Native, please make sure you have react-native properly set-up on your computer as described [here](https://reactnative.dev/docs/environment-setup). If your set up is not correct, you will encounter errors when trying to run the application.

⭐️ We recommend that you do not build your own mobile application. Instead, you can use the pre-built mobile application available on the App Store and Google Play Store.

If you insist on building your own mobile application, you can follow the instructions below:
```bash
# Change into the mobile app directory
cd hikma-health-app

# Install the dependencies
pnpm install

# Create a .env file with the correct API_URL with the following command - edit based on which port the application is running
echo "API_URL=http://localhost:3000" > .env

# Start the application
pnpm android && pnpm start
```

---

## Getting help

The best place to learn more about the Hikma Health platform is to visit our website at [hikmahealth.org](https://hikmahealth.org/) and our github repository at [github.com/hikmahealth](https://github.com/hikmahealth).

### Submit an issue

If you have a question or need help with getting started, please either send an email to [tech@hikmahealth.org](mailto:tech@hikmahealth.org) or submit an issue on the appropriate repository - which you can find here [GitHub repository](https://github.com/hikmahealth)

### Join the community

You can support the development of this project by writing code, fixing bugs, and improving documentation. We welcome pull requests, bug reports, and issue reports. Please see our [contributing guidelines](/docs/how-to-contribute) for more information.
