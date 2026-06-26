---
title: "Overview"
description: "What the Local Sync Hub is, when to use it, and how it works."
order: 1
---

## Local Sync Hub

The **Local Sync Hub** is a desktop application that acts as an **offline, LAN-local sync server** for Hikma Health mobile clients. It runs on a clinic machine (macOS, Windows, or Linux) on the same local network as the mobile devices, buffering sync between those devices when there is no internet and later relaying the buffered changes to the cloud server (the master database) once a connection is available.

It is an **optional** component. A clinic that has reliable internet can sync mobile devices directly to the cloud server and never needs a hub. The hub exists for the harder case: clinics where connectivity is the exception, not the rule.

### When to use a hub

Consider deploying a Local Sync Hub when:

- **Multiple devices need to share data, but the clinic has little or no internet.** The hub lets paired devices sync with each other over the local network (Wi-Fi/LAN) without ever reaching the cloud.
- **Connectivity is intermittent.** Devices sync to the hub continuously throughout the day; the hub relays everything to the cloud whenever the machine happens to get online.
- **You want a local buffer.** Data collected in the field is consolidated on a single clinic machine, encrypted at rest, before it leaves the building.

If a clinic has a single device, or reliable internet for every device, a hub adds little — sync directly to the cloud instead. See [Offline & Sync](/docs/core-concepts/offline-and-sync) for how the mobile app chooses its sync target.

### How it fits the platform

The hub sits **between** the mobile devices and the cloud master database. It does not replace either:

```
┌─────────────┐   encrypted RPC    ┌────────────────────────┐   cloud sync    ┌──────────────┐
│   Mobile    │  (ECDH + AES-GCM   │     Local Sync Hub      │  (when online)  │ Cloud master │
│   clients   │◄──over LAN HTTP)──►│  (clinic desktop app)   │◄───────────────►│   database   │
└─────────────┘                    │  SQLCipher DB at rest   │                 └──────────────┘
                                   └────────────────────────┘
```

Mobile devices talk to the hub over the local network using an **encrypted RPC transport** (see below). The hub talks to the cloud using the platform's normal cloud sync. From the mobile app's perspective, a hub is just another **sync peer** — see [Data Synchronization](/docs/mobile-guides/data-sync) for how the app resolves and syncs to peers.

## Architecture

The hub is a single desktop application (built with Tauri) that contains two halves in one process:

- **Frontend** — a small user interface with three screens: **Login** (unlock the encrypted database), **Device Registration** (pair mobile clients via QR code), and **Server** (start/stop the sync server, view status, sync to the cloud).
- **Backend** — an HTTP server that binds `0.0.0.0:4001` for mobile clients and exposes encrypted RPC endpoints, backed by an encrypted SQLite database and a secrets vault.

```
                       Local Hub desktop app
        ┌──────────────────────────────────────────────┐
        │   UI  (Login / Pair / Server)                 │
        │     │                  │                       │
        │     ▼                  ▼                       │
        │   HTTP server :4001    Stronghold vault        │
        │   /rpc/heartbeat       (keys + cloud URL)      │
        │   /rpc/handshake          │                    │
        │   /rpc/command            │                    │
        │   /rpc/query              │                    │
        │     │                                          │
        │     ▼                                          │
        │   SQLCipher DB (encrypted at rest)             │
        └──────────────────────────────────────────────┘
   Mobile clients ──► port 4001        Cloud master DB ◄──► relay
```

### Mobile-facing routes

At runtime the hub exposes just four HTTP routes to mobile clients:

| Route | Method | Purpose |
|---|---|---|
| `/rpc/heartbeat` | GET | Liveness probe (unauthenticated) |
| `/rpc/handshake` | POST | ECDH key exchange to establish a shared secret |
| `/rpc/command` | POST | Encrypted writes (sync push, auth, mutations) |
| `/rpc/query` | POST | Encrypted reads (sync pull, queries) |

There is **no** unauthenticated or plaintext data endpoint. All clinical data flows through `/rpc/command` and `/rpc/query`, whose payloads are encrypted at the application layer.

### Where data lives

- **The local database** is an SQLCipher-encrypted SQLite database. The encryption key is held in memory only while the hub is unlocked; at rest the database is unreadable.
- **Secrets** — the signing/identity keys and the cloud master server URL — are kept in an encrypted **Stronghold** vault (`hikma-health.stronghold`, stored next to the executable), unlocked by the same passphrase.

## Security model

> **Read this before changing anything about how the hub is exposed on the network.**

- **Data at rest:** the local SQLite database is encrypted with **SQLCipher**. The key lives in memory only while unlocked, and the database returns to encrypted-at-rest the moment the hub is locked or closed.
- **Data in transit — no TLS, by design.** The hub serves **plain HTTP** on `0.0.0.0:4001`. It cannot use transport-layer TLS because it has no CA-issued certificate, and **self-signed certificates are rejected by iOS App Transport Security and the Android system trust store**, which would break the mobile clients. Instead, confidentiality and integrity of patient data in transit are provided at the **application layer**: every data payload on `/rpc/command` and `/rpc/query` is encrypted with **ECDH-derived AES-256-GCM**. This is treated as an *addressable* HIPAA transmission-security safeguard, with the application-layer encryption envelope as the documented equivalent measure.
- **Trusted-LAN assumption.** This model assumes the hub runs on a **trusted local network**. **Never expose port `4001` to the internet** — do not port-forward it, and do not place the hub on an untrusted network. Internet access is only ever needed for cloud sync and update checks, both of which the hub initiates outbound.
- **Authentication:** clients first complete an ECDH handshake, then log in (email + password) to obtain a JWT, which is required on every non-exempt RPC call.

For how this reconciles with the platform's general "always use HTTPS" guidance, see [Security Considerations](/docs/security-guides/security-considerations#transport-security-the-local-sync-hub).

## Next steps

- [Operating the Hub](/docs/local-sync-hub/operating-the-hub) — install, pair devices, run the server, and keep it updated.
- [Building from Source](/docs/local-sync-hub/building-from-source) — prerequisites and developer setup for technical teams who self-build.
