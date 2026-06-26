---
title: "Building from Source"
description: "Prerequisites, developer setup, and release process for building the Local Sync Hub."
order: 3
---

## Building from Source

Most clinics should install a published release — see [Operating the Hub](/docs/local-sync-hub/operating-the-hub). This page is for **technical teams who build the hub themselves**.

The hub lives in the `hikma-health-server` monorepo under `apps/local-hub` and is built with Tauri 2 (a React frontend plus a Rust backend). Install dependencies from the **repo root**, not the app directory.

## Prerequisites

- **Node** `24.14.0` and **pnpm** `10.33.0` (the versions CI pins; newer patch releases are fine).
- **Rust** (stable toolchain, edition 2021) with Cargo.
- **A C toolchain.** The backend bundles SQLCipher with **vendored OpenSSL** (compiled from source), so a working C compiler — plus `perl` and `make` — must be on your `PATH`.
- **Tauri 2 system dependencies**, per operating system:
  - **macOS:** Xcode Command Line Tools (`xcode-select --install`).
  - **Windows:** the WebView2 runtime and the MSVC C++ build tools.
  - **Linux (Debian/Ubuntu):** the GTK/WebKit dev libraries:
    ```bash
    sudo apt-get install -y \
      libwebkit2gtk-4.1-dev libxdo-dev libssl-dev \
      libayatana-appindicator3-dev librsvg2-dev libglib2.0-dev libgtk-3-dev
    ```

See the [Tauri 2 prerequisites guide](https://v2.tauri.app/start/prerequisites/) for the authoritative per-OS list.

## Developer setup

```bash
# from the repo root — installs the whole workspace
pnpm install

# run the desktop app in dev mode (hot-reloading frontend + Rust)
cd apps/local-hub
pnpm tauri dev
```

`pnpm tauri dev` builds the Rust backend, starts Vite, and opens the desktop window.

> **The first Rust build is slow** — SQLCipher and OpenSSL are compiled from source. The cargo cache makes subsequent builds fast.

Frontend-only scripts:

| Command | What it does |
|---|---|
| `pnpm dev` | Vite dev server only (no Tauri shell) |
| `pnpm build` | `tsc && vite build` — type-check and build the frontend bundle |
| `pnpm tauri build` | Full native bundle (see [Building & releasing](#building-and-releasing)) |

## Project layout

```
apps/local-hub/
├── src/                      # React frontend
│   ├── pages/                # Login, DeviceRegistration, Server
│   ├── components/           # UpdateBanner, ThemeToggle, ui/
│   └── lib/                  # updater.ts, server-state.ts, validation.ts (+ tests)
├── src-tauri/                # Rust backend
│   ├── src/
│   │   ├── lib.rs            # Tauri commands, HTTP server, route table
│   │   ├── rpc/              # handshake + command/query handlers
│   │   ├── crypto/           # ECDH, AES-GCM, JWT, password hashing
│   │   ├── migrations/       # refinery SQL migrations
│   │   ├── cloud_sync/       # relay to the cloud master server
│   │   └── sync_utils.rs     # change-set helpers
│   ├── tauri.conf.json       # app + bundle + updater config
│   └── Cargo.toml
└── scripts/
    ├── set-version.mjs       # stamps the CalVer (+ MSI version) at release time
    └── coverage.sh
```

## Testing

```bash
# from the repo root
just test-local-hub         # frontend (vitest) + backend (cargo nextest)
just ci-local               # lockfile check + tests + unsigned bundle smoke-build (mirrors CI)
```

Or directly with `pnpm --filter hh-local-hub run test:frontend` / `test:backend`. `pnpm coverage` produces a coverage report. CI runs the frontend tests on every PR and gates the backend tests plus a bundle build on changes under `src-tauri/**`.

## Building and releasing

Releases are produced by the **Local Hub Release** GitHub Actions workflow. Run it from the Actions tab and supply a **CalVer** version such as `2026.5.4` (or `2026.5.4-2` for a second release on the same day). The workflow runs the test suite, builds the macOS, Windows, and Linux bundles, signs the updater artifacts with **minisign**, and uploads everything to a **draft** GitHub Release.

- `scripts/set-version.mjs` stamps the version across `package.json`, `tauri.conf.json`, and `Cargo.toml`. It also derives an MSI-legal version for Windows: Windows Installer caps the major version field at 255, so the CalVer is mapped to `(YYYY-2000).M.D[.N]` for the Windows installer only. The auto-updater still compares the real CalVer, so update detection keeps full resolution.
- The draft stays hidden until you **publish** it. Only published releases are picked up by the in-app updater and shown on the public Releases page.

### Code signing

Bundles are **not yet OS-code-signed**, so first launch trips the platform gatekeepers (macOS Gatekeeper, Windows SmartScreen) — see [Operating the Hub](/docs/local-sync-hub/operating-the-hub#quick-start-first-deployment). Apple notarization and Windows Authenticode signing are a planned follow-up.

## Configuration and secrets

- **`src-tauri/tauri.conf.json`** — app identity, bundle targets, and the `updater` block (the public key used to verify updates, and the manifest endpoint).
- **Release signing (CI secrets)** — `TAURI_SIGNING_PRIVATE_KEY` and `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` are the minisign key and password used to sign updater artifacts. Their public counterpart is the `pubkey` embedded in `tauri.conf.json`. If the key is lost it can be regenerated, but the new public key must replace the old one — which is only safe **before any release is published**, since installed clients trust the embedded key.
- **Runtime secrets** — the SQLCipher key and the cloud master server URL live in the encrypted Stronghold vault (`hikma-health.stronghold`), unlocked by the operator's passphrase. None of these are environment variables.

## Troubleshooting the build

| Symptom | Cause and fix |
|---|---|
| **`No podspec found` / stale Tauri build** | A JS↔Rust Tauri plugin version mismatch (e.g. `tauri-plugin-fs` JS vs crate on different minors) aborts `tauri build`. Align the Rust crate to the JS version: `cargo update -p <crate> --precise <version>`. |
| **Random pod/crate failures that differ each build (errno 28 / ENOSPC)** | The build disk is full. Check `df -h` before debugging individual dependencies. |
| **First Rust build is very slow** | Expected — SQLCipher and OpenSSL are compiled from source. Subsequent builds use the cargo cache. |
