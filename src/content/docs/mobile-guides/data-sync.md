---
title: "Data Synchronization"
description: "How the offline-first data synchronization process works in the Hikma Health mobile application."
order: 3
---

## Data Synchronization

Hikma Health mobile uses an offline-first architecture. All clinical data is stored locally on the device using WatermelonDB (backed by SQLite), and synchronization happens explicitly — either triggered by the user or automatically on login. The app supports three operational modes: offline with cloud sync, offline with hub sync, and fully online.

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                    UI Layer                           │
│          (Sync Button, Settings, etc.)               │
└────────────────────────┬─────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│               useSync() Hook                         │
│        (Subscribes to XState sync store)             │
└────────────────────────┬─────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│            syncService.ts (startSync)                │
│     - Detects operation mode (offline/online)        │
│     - Resolves active peer (hub or cloud)            │
│     - Delegates to peerSync.ts                       │
└────────────────────────┬─────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│             peerSync.ts (syncDB)                     │
│       Dispatches to the correct sync strategy        │
└───────────┬──────────────────────────┬───────────────┘
            │                          │
     ┌──────▼──────┐           ┌──────▼──────┐
     │ Cloud Sync  │           │  Hub Sync   │
     │ (HTTPS)     │           │ (Encrypted  │
     │             │           │    RPC)     │
     └──────┬──────┘           └──────┬──────┘
            │                         │
            └────────────┬────────────┘
                         ▼
              ┌─────────────────────┐
              │  WatermelonDB       │
              │  (Local SQLite)     │
              └─────────────────────┘
```

## Operation Modes

### Offline Mode (Default)

In offline mode, all reads and writes go through WatermelonDB. The local database is the source of truth, and changes are tracked automatically via WatermelonDB's `_status` and `_changed` fields on each record.

- `_status` can be `created`, `updated`, or `synced`
- `_changed` is a comma-separated list of column names that have been modified locally since the last sync

Data is synchronized with a remote peer (cloud server or local hub) only when sync is explicitly triggered.

### Online Mode

In online mode, all reads and writes bypass WatermelonDB entirely and go directly to the server via RPC calls. This provides real-time data access but requires a constant network connection.

**Switching between modes:**

| Direction | Allowed? | Condition |
|---|---|---|
| Offline → Online | Conditional | Blocked if there are unsynced local changes. This prevents orphaning edits that haven't been pushed yet. |
| Online → Offline | Always | Online mode never writes to WatermelonDB, so there is no local data at risk. |

## Sync Strategies

The app selects a sync strategy based on the peer type of the active sync target.

### Cloud Server Sync

Used when the active peer is a cloud server. This leverages WatermelonDB's built-in `synchronize()` function.

**Flow:**

1. **Authenticate** — Refresh user credentials with the server.
2. **Pull** — Fetch remote changes from `/api/v2/sync?last_pulled_at=<timestamp>`. The server returns a changeset (created, updated, deleted records) and a new timestamp.
3. **Apply** — WatermelonDB merges pulled changes into the local database.
4. **Push** — Send local changes (records where `_status` is `created`, `updated`, or `deleted`) to the server via POST.
5. **Persist** — Update the peer's `lastSyncedAt` timestamp.

### Hub Sync

Used when the active peer is a [Local Sync Hub](/docs/local-sync-hub/overview) (a desktop app on the same network). This uses an encrypted RPC transport with AES-GCM encryption. For how the hub is set up and operated on the clinic machine, see [Operating the Hub](/docs/local-sync-hub/operating-the-hub).

**Flow:**

1. **Establish transport** — Retrieve the encrypted AES-GCM session with the hub.
2. **Pull** — Send an RPC query (`sync_pull`) with the last sync timestamp. The hub returns an encrypted changeset.
3. **Apply** — `applyRemoteChanges()` processes pulled records with per-column conflict resolution (see below).
4. **Push** — Fetch all local changes by querying records with a non-synced `_status`. Send them to the hub via an encrypted RPC command (`sync_push`).
5. **Mark synced** — Set `_status = "synced"` on all pushed records and permanently delete soft-deleted records.
6. **Persist** — Update the peer's `lastSyncedAt` timestamp.

## Conflict Resolution

When the same record has been modified both locally and remotely, the app uses a per-column conflict resolution strategy:

1. If the local record is deleted, keep it deleted (don't resurrect).
2. Start with the remote record's data (remote wins by default).
3. For any column listed in the local record's `_changed` field, restore the local value (local wins for those columns).
4. Preserve the local `id`, `_status`, and `_changed` metadata.

**Example:**

| Field | Local Value | Remote Value | Result |
|---|---|---|---|
| name | Alice | Bob | Bob (remote wins — name not in `_changed`) |
| phone | 111 | 222 | 111 (local wins — phone is in `_changed`) |

This approach minimizes data loss by preserving the user's in-progress edits while still accepting updates from other devices.

## What Triggers Sync

| Trigger | Description |
|---|---|
| Login | Sync runs automatically after successful authentication. |
| Manual | User taps the "Sync" button in the app. |
| Force sync | User explicitly initiates an upload or download for a specific time range via `forceUpload()` / `forceDownload()`. |

## Peer Resolution

When sync starts, the app determines which peer to sync with:

1. If the user has explicitly selected a peer (`activeSyncPeerId`), use that peer.
2. Otherwise, prefer the first active hub peer.
3. If no active hub exists, fall back to the first active cloud server.

Peers are stored in the local database with the following key fields:

| Field | Description |
|---|---|
| `peerId` | Stable identifier (survives IP changes) |
| `peerType` | `cloud_server`, `sync_hub`, or `mobile_app` |
| `status` | `active`, `revoked`, or `untrusted` |
| `publicKey` | Used for encryption and identity verification |
| `lastSyncedAt` | Timestamp of the last successful sync |

## Synced Data Models

The following tables are included in synchronization:

- `patients`
- `visits`
- `events`
- `appointments`
- `clinics`
- `clinic_departments`
- `users`
- `event_forms`
- `registration_forms`
- `patient_additional_attributes`
- `patient_vitals`
- `patient_problems`
- `prescriptions`
- `prescription_items`
- `drug_catalogue`
- `clinic_inventory`
- `dispensing_records`

**Not synced (device-local only):** `event_logs`, `peers`, `app_config`.

## Date and Field Handling

During sync, the app normalizes data between the server format and WatermelonDB's expectations:

- **Timestamps** — All date fields (`created_at`, `updated_at`, `prescribed_at`, etc.) are converted from server formats (ISO strings, Unix seconds) to millisecond timestamps. Missing or invalid dates fall back to the current time.
- **JSON fields** — Fields like `metadata`, `form_fields`, `translations`, and `form_data` are stringified before storage, since WatermelonDB stores them as text.
- **`date_of_birth`** — Stored as a `YYYY-MM-DD` string rather than a timestamp.

## Sync State Machine

The sync process is managed by an XState store with the following states:

```
idle → fetching → resolving → pushing → idle
                      ↓
                    error
```

| State | Description |
|---|---|
| `idle` | No sync in progress. |
| `fetching` | Downloading changes from the remote peer. |
| `resolving` | Processing and applying fetched data locally. |
| `pushing` | Uploading local changes to the remote peer. |
| `error` | Sync failed. Can be cleared to return to idle. |

## Error Handling

- **Concurrent sync** — If a sync is already in progress, additional sync requests are silently skipped.
- **Network errors** — The user is shown a context-aware message:
  - Hub: "Please make sure you are on the same network and Wi-Fi is enabled."
  - Cloud: "Please make sure you have internet or contact your administrator."
- **General errors** — Logged to Sentry for monitoring. The user is notified via a toast message.
- **Force reset** — Available via `useSync().forceReset()` as an emergency escape hatch to return the sync state machine to idle.

## Force Sync

For recovery or backfill scenarios, users can trigger a force sync that operates on timestamps rather than WatermelonDB's change tracking:

- **Force Upload** — Queries all records where `updated_at` or `created_at` is after a given timestamp and sends them to the specified peer.
- **Force Download** — Pulls all records changed since a given timestamp from the specified peer and applies them locally with conflict resolution.
