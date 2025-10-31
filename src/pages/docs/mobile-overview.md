---
title: Mobile app overview
description: Overview of the Hikma Health mobile application architecture, technology stack, and development setup.
---

The Hikma Health mobile application is a cross-platform electronic health record system built with React Native and Expo. The app is **Android tested with iOS support included** and designed for organizations working in low-resource settings.

---

## Key Features

- **Offline First:** Patient registration and visits work completely offline
- **Fast Sync:** Efficient data synchronization to backend when online
- **Multilingual:** Built-in support for English, Spanish, and Arabic (with RTL support)
- **Cross Platform:** Android tested, iOS supported
- **Scalable:** Handles thousands of patients efficiently
- **Customizable:** Easily extendable workflows and forms
- **Modern UI:** Light/dark mode toggle with smooth animations

You can see a user demo here: https://drive.google.com/file/d/1ssBdEPShWCu3ZXNCXnoodbwWgqlTncJb/view?usp=drive_link

---

## Technology Stack

The mobile app is built on modern open source technologies with permissive licensing:

### Core Framework
- **Expo SDK (v53):** Managed React Native development platform
- **React Native (v0.79):** Cross-platform mobile framework by Meta
- **React (v19):** Declarative UI framework
- **TypeScript (v5.8):** Type-safe JavaScript
- **Hermes:** Fast and efficient JavaScript engine

### State Management & Data Flow
- **Zustand (v3.8):** Lightweight state management with XState integration
- **XState (v5.20):** State machines for complex workflows
- **React Hook Form (v7.62):** Performant forms with validation

### Data & Storage
- **WatermelonDB (v0.28):** Fast, scalable local database built on SQLite
- **React Native MMKV (v3.2):** Fast & secure key-value storage
- **Expo Secure Store (v14.2):** Secure storage for sensitive data

### UI & Navigation
- **React Navigation (v7):** Navigation and routing
- **React Native Reanimated (v3.17):** Smooth 60fps animations
- **@legendapp/list (v1.1):** High-performance list rendering
- **Lucide React Native (v0.539):** Modern icon library

### Internationalization & Utilities
- **i18next (v23.14) + react-i18next (v15):** Internationalization with RTL support
- **date-fns (v4.1):** Modern date utility library
- **Effect (v3.17):** Functional programming utilities

### Development & Quality
- **Jest (v29):** Unit testing
- **Maestro:** End-to-end UI testing
- **Sentry (v6.14):** Error tracking and performance monitoring
- **EAS Build & Submit:** Expo Application Services for CI/CD

Take a look at the `package.json` file for a complete list of dependencies.

---

## Project Structure

The Hikma Health mobile app follows a clear architectural pattern:

```text
hikma-health-mobile
├── app/
│   ├── assets/          # Application-specific assets and resources
│   ├── components/      # Reusable UI components
│   ├── config/          # Environment configuration (dev/prod)
│   ├── data/            # Data layer and API calls
│   ├── db/              # WatermelonDB models and migrations
│   ├── devtools/        # Development tools and debugging utilities
│   ├── hooks/           # Custom React hooks
│   ├── i18n/            # Internationalization and translations
│   ├── models/          # Data models and business logic
│   ├── navigators/      # React Navigation configuration
│   ├── screens/         # Screen components (full pages)
│   ├── services/        # External services integration
│   ├── store/           # Global state management (XState + Zustand)
│   ├── theme/           # Colors, typography, spacing
│   ├── utils/           # Shared utility functions
│   └── app.tsx          # Main application entry point
├── assets/              # Global assets (icons, images)
├── lib/                 # Custom libraries
├── plugins/             # Custom Expo plugins
├── test/                # Test configuration and setup
├── types/               # TypeScript type definitions
├── vendor/              # Third-party libraries with modifications
├── .maestro/            # E2E test configurations
├── android/             # Android native code
├── ios/                 # iOS native code
├── app.config.ts        # Expo configuration
├── eas.json             # EAS Build configuration
└── package.json
```

### Key Directories Explained

#### `./app/components`
Reusable UI components that serve as building blocks for screens. These components are unit tested and composed together to build the application interface.

#### `./app/db`
Database layer using WatermelonDB:
- Schema definitions
- Model classes
- Migration scripts

**IMPORTANT:** When updating the database schema, YOU MUST increment the schema version number in the database index file. Failure to do so will result in application crashes and potential data loss.

#### `./app/i18n`
Internationalization files containing translations for all supported languages. The app natively supports RTL (right-to-left) layouts for languages like Arabic.

To add a new language:
1. Create a new translation file in `app/i18n/`
2. Update `app/i18n/index.ts` to register the new language

#### `./app/navigators`
React Navigation navigators that define the navigation structure and screen flows of the application.

#### `./app/screens`
Full-page screen components that represent distinct views in the app. Screens are composed of smaller components and connected to stores for state management.

#### `./app/store`
State management using Zustand and XState. The `sync` store is particularly important as it manages the synchronization process and displays sync progress to users.

#### `./app/utils`
Utility functions used throughout the app. These are heavily reused and should be well unit-tested.

---

## Quick Start

### Prerequisites

First, set up the React Native and Expo development environment by following the official guide: https://docs.expo.dev/get-started/installation/

### Installation

1. **Clone the repository:**
```bash
git clone git@github.com:hikmahealth/hikma-health-mobile.git
cd hikma-health-mobile
```

2. **Install pnpm** (if not already installed):
```bash
npm install -g pnpm
```

3. **Install dependencies:**
```bash
pnpm install
```

4. **Set up environment variables:**

Create a `.env` file and add:
```bash
EXPO_PUBLIC_HIKMA_API_TESTING=<your-backend-url>
```

🔥 **DO NOT COMMIT THIS FILE TO VERSION CONTROL** 🔥

5. **Set up the backend:**

Follow the instructions at https://github.com/hikmahealth/hikma-health-backend

### Running the App

**Android:**
```bash
pnpm android
```

**iOS:**
```bash
pnpm ios
```

---

## Testing

### Unit Tests
```bash
pnpm test
```

### End-to-End Tests with Maestro

Follow the [Maestro Setup guide](https://ignitecookbook.com/docs/recipes/MaestroSetup) from the Ignite Cookbook.

Run E2E tests:
```bash
pnpm test:maestro
```

---

## Building & Deployment

This project uses Expo Application Services (EAS) for building and deploying.

### Development Builds
```bash
# Android
pnpm build:android:dev

# iOS
pnpm build:ios:dev
```

### Production Builds
```bash
# Android
pnpm build:android:prod

# iOS
pnpm build:ios:prod
```

### Over-The-Air (OTA) Updates
```bash
pnpm eas:update:prod
```

---

## Package Manager

This project uses **pnpm** as the package manager. All commands should use pnpm:

```bash
pnpm install    # Install dependencies
pnpm android    # Run on Android
pnpm ios        # Run on iOS
pnpm test       # Run tests
```

---

## FAQ

### How do I delete local data during testing?

Clear the application data through your device settings:
- **Android:** Long press the app icon → App Info → Storage → Clear Data

⚠️ **Warning:** All unsynced data will be lost forever. Only do this with test data.

Note: If data has already been synced to the server, clearing local data won't help much since it will sync back on the next login.

### How do I add a new language?

1. Navigate to `app/i18n/` folder
2. Create a new translation file (e.g., `fr.ts` for French)
3. Add your translations following the existing structure
4. Update `app/i18n/index.ts` to register the new language

That's it! The app will automatically detect and use the new language.

### How do I get help?

If you're stuck for more than 10 minutes:
- Open an issue on GitHub
- Email our head of development: `ally[at]hikmahealth.org`

We're constantly looking for feedback to build the best portable EHR system!

---

## Roadmap

Features on the roadmap represent the vision for future versions. If there's a feature you'd like to see, open a feature request!

- [ ] Improve online-only support for areas with guaranteed internet
- [ ] Increase test coverage to 80%
- [ ] Faster boot time on lower-end devices
- [x] Official iOS support documentation
- [ ] Memory & performance profiling
- [ ] Automated CI pipeline with code coverage reporting
- [ ] Migration to React Native's New Architecture
- [ ] Enhanced offline capabilities with background sync

---

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](https://github.com/hikmahealth/hikma-health-mobile/blob/main/CONTRIBUTING.md) file for guidelines.

---

## Credits

This project relies heavily on the open source community. Built on the shoulders of:
- [Ignite](https://github.com/infinitered/ignite) boilerplate
- WatermelonDB
- Expo
- And many other amazing open source projects

## License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)