---
title: "Hosting Options"
description: "Compare hosting options for the Hikma Health platform."
order: 2
---

## Hosting Options

Hikma Health can be hosted on a variety of platforms. This guide compares the most popular options and helps you choose the right one for your needs.

### Render

[Render](https://render.com) is a modern cloud platform that makes it easy to deploy web applications. The Hikma Health server repository includes a one-click deploy button for Render.

- Free tier available for getting started
- Automatic deployments from GitHub
- Managed PostgreSQL databases
- Built-in SSL certificates

### DigitalOcean

[DigitalOcean](https://www.digitalocean.com) provides scalable cloud infrastructure. You can use the one-click deploy button in the server repository to deploy to DigitalOcean App Platform.

- Predictable pricing starting at $5/month
- Managed databases available
- Global data center locations
- Simple scaling options

### Self-hosted

You can also host Hikma Health on your own infrastructure or any VPS provider. The server is a standard Node.js application that can run anywhere Node.js is supported.

**Requirements:**

- Node.js v22.14 or higher
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