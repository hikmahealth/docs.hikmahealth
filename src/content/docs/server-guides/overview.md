---
title: "Overview"
description: "An overview of the Hikma Health server application."
order: 1
---

## Server Overview

The Hikma Health Server is a full-stack TypeScript application built with TanStack Start. It combines the API backend and admin web interface into a single deployable application.

### Key Features

- **Unified codebase** — API endpoints and admin dashboard live in one repository
- **Automatic migrations** — Database schema updates run on startup
- **Offline-aware** — Designed to handle sync from mobile clients operating in low-connectivity environments
- **One-click deploy** — Quick deploy buttons for Render and DigitalOcean in the repository README

### Tech Stack

- **Runtime:** Node.js (v22.14+)
- **Framework:** TanStack Start
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Package Manager:** pnpm

### Project Structure

![Hikma Health Server Folder Structure](/images/HH-folder-structure.svg)

### Repository

The server source code is available at [github.com/hikmahealth/hikma-health-server](https://github.com/hikmahealth/hikma-health-server).

For setup instructions, see the [Getting Started](/docs/introduction/getting-started) guide.