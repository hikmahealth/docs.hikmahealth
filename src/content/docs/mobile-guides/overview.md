---
title: "Overview"
description: "An overview of the Hikma Health mobile application."
order: 1
---

## Mobile Application Overview

The Hikma Health mobile application is built with React Native and is available on both Android and iOS. It enables healthcare workers to collect patient data in the field, even without internet connectivity.

### Key Features

- **Offline-first data collection** — Collect patient data without an internet connection. Data is stored locally and synced when connectivity is available.
- **Dynamic event forms** — Forms are fully configurable through the admin interface, allowing organizations to customize data collection without code changes.
- **Patient management** — Register new patients, search existing records, and manage patient histories.
- **Multi-language support** — The application supports multiple languages to serve diverse communities.

### Getting the App

⭐️ **We recommend downloading the pre-built application** from the [Google Play Store](https://play.google.com/store) or [Apple App Store](https://apps.apple.com) rather than building from source.

If you need to build from source, see the [Getting Started](/docs/introduction/getting-started#mobile-application) guide for setup instructions.

### Technical Stack

- **React Native** — Cross-platform mobile framework
- **TypeScript** — Type-safe JavaScript
- **WatermelonDB** — Local database for offline-first storage
- **pnpm** — Package manager

### Next Steps

- [Performance](/docs/mobile-guides/performance) — Tips for optimizing the mobile application on low-end devices.
- [Offline & Sync](/docs/core-concepts/offline-and-sync) — Learn how data synchronization works under the hood.