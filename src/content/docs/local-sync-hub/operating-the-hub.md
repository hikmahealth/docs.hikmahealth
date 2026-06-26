---
title: "Operating the Hub"
description: "Install, pair devices, run, and maintain the Local Sync Hub on a clinic machine."
order: 2
---

## Operating the Hub

This guide covers running a Local Sync Hub in a clinic — no build or source checkout required. For what the hub is and how it works, start with the [Overview](/docs/local-sync-hub/overview).

## Quick start (first deployment)

1. **Download** the installer for the machine's operating system from the [Releases page](https://github.com/hikmahealth/hikma-health-server/releases):
   - **macOS:** `.dmg` / `.app`
   - **Windows:** `.msi` / `.exe`
   - **Linux:** `.deb` / `.rpm` / `.AppImage`
2. **Install and launch.** On first launch you may need to get past the operating system's gatekeeper, because the bundles are not yet OS-code-signed:
   - **macOS:** right-click the app → **Open**, then confirm.
   - **Windows:** on the SmartScreen prompt, click **More info → Run anyway**.
3. **Set an encryption passphrase** when prompted. This creates the encrypted database.

   > **Store the passphrase safely — it cannot be recovered.** Without it, the data is unreadable. There is no reset or backdoor.

4. **Pair each mobile device** by scanning the QR code on the pairing screen.
5. **Start the server.** The hub now serves paired devices on the LAN at port `4001`.
6. **Keep the machine on the same LAN** as the devices and awake while in use.

   > **Never expose port `4001` to the internet.** Internet is only needed for cloud sync and update checks — both initiated outbound by the hub.

## The setup flow in detail

Once installed and launched, the hub walks through the following, in order:

### 1. Initialize / unlock encryption (Login screen)

On first run, set a passphrase — this creates the SQLCipher database and the Stronghold key vault. On later runs, enter the passphrase to unlock. The database and all secrets stay encrypted at rest until unlocked.

### 2. Pair mobile devices (Device Registration screen)

The hub shows its pairing information as a QR code. Each mobile client scans it to register with this hub and exchange encryption keys. After pairing, the hub appears as a sync peer on the device — see [Data Synchronization](/docs/mobile-guides/data-sync#peer-resolution) for how the app chooses between a hub and the cloud.

### 3. Start the server (Server screen)

Starting the server binds `0.0.0.0:4001` so paired devices on the LAN can sync. This screen shows server status, database statistics, and the authorized clinics.

### 4. Sync to the cloud

When the machine has internet, the hub relays buffered changes to the cloud master server. (The cloud URL is held in the encrypted Stronghold vault, not in an environment variable.) When offline, the hub keeps buffering changes locally and relays them on the next connection.

### 5. Lock when unattended

Locking the hub clears the in-memory encryption key, returning the database to encrypted-at-rest. Lock it whenever the machine is left unattended.

## Maintenance

The application exposes maintenance actions including:

- **Rotating the encryption key** — re-key the encrypted database.
- **Clearing all local data** — wipe the local buffer.

> Keep the machine on the trusted clinic LAN. **Never port-forward `4001` to the internet.**

## Auto-updates

The hub checks for new versions automatically using Tauri's updater:

- On the **Server** screen, an update banner checks for updates on launch and **every 30 minutes**.
- The check fetches the updater manifest from the project's GitHub Releases and compares it to the running app's version.
- If a newer version exists, the banner offers **Install & Restart**: the platform artifact is downloaded, its **minisign signature is verified** against the public key embedded in the app, installed, and the app relaunches.

Notes:

- Only **published** releases are visible — a draft release will never appear in the banner.
- The check requires internet. Offline, the banner shows a retryable error.
- There is **no silent auto-install**. An operator must click to apply an update.

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| **Update check fails** | The hub needs internet to reach github.com, and only **published** releases are visible. A draft release will never appear. |
| **`Address already in use` on start** | Another process is holding port `4001`. Stop that process, or stop and restart the server from the **Server** screen. |
| **First launch is blocked** | The bundles are not yet OS-code-signed. On macOS, right-click → **Open**; on Windows, **More info → Run anyway**. |
| **Forgotten passphrase** | The passphrase cannot be recovered and the data cannot be decrypted without it. A new passphrase means starting from a fresh, empty database. |

## Next steps

- [Overview](/docs/local-sync-hub/overview) — architecture and security model.
- [Building from Source](/docs/local-sync-hub/building-from-source) — for teams who build the hub themselves.
