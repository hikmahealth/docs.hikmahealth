---
title: "Hosting Options"
description: "Compare hosting options for the Hikma Health platform."
order: 2
---

## Hosting Options

Hikma Health can be hosted on a variety of platforms. This guide compares the most popular options and helps you choose the right one for your needs.

### Render

[Render](https://render.com) is a modern cloud platform that makes it easy to deploy web applications. Fork the [hikma-health-server repository](https://github.com/hikmahealth/hikma-health-server) into your own organization first, then use the deploy button in your fork's README to deploy to Render.

- Free tier available for getting started
- Automatic deployments from GitHub
- Managed PostgreSQL databases
- Built-in SSL certificates

### DigitalOcean

[DigitalOcean](https://www.digitalocean.com) provides scalable cloud infrastructure. As with Render, fork the [server repository](https://github.com/hikmahealth/hikma-health-server) first, then use the deploy button in your fork to deploy to DigitalOcean App Platform.

- Predictable pricing starting at $5/month
- Managed databases available
- Global data center locations
- Simple scaling options

### Self-hosted

You can also host Hikma Health on your own infrastructure or any VPS provider. The server is a standard Node.js application that can run anywhere Node.js is supported.

**Requirements:**

- Node.js v24.14.0
- PostgreSQL database
- A reverse proxy (e.g., Nginx or Caddy) for SSL termination

### Choosing the right option

| Feature | Render | DigitalOcean | Self-hosted |
|---|---|---|---|
| Ease of setup | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Cost | Free tier available | From $5/mo | Varies |
| Control | Medium | Medium | Full |
| Maintenance | Low | Low | High |
| Data residency | Limited regions | Multiple regions | Your choice |

For most organizations getting started, we recommend **Render** for its simplicity and free tier. For production workloads with specific data residency requirements, consider **DigitalOcean** or **self-hosting**.

> **Note:** These options are about hosting the **cloud server** (the master database) that the whole platform syncs to. They are separate from — and complementary to — the [Local Sync Hub](/docs/local-sync-hub/overview), a desktop app that runs inside a clinic to give devices LAN-local sync when internet is unreliable. A clinic with poor connectivity typically uses both: a hosted cloud server *and* a local hub that relays to it. The hub is not a hosting provider and does not replace the cloud server.