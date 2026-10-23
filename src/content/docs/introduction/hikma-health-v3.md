---
title: "Hikma Health version 3.0,(v2026.10)"
description: "What's new in Hikma Health v3: a TypeScript backend in one monorepo, self-onboarding, a new forms rules engine, the Local Sync Hub, and stronger security and auditing."
order: 3
---

## Hikma Health version 3.0 (v2026.10)

Hikma Health v3 is the culmination of many months of work and is one of the platform's largest releases so far.
The server, mobile app, admin portal, AI proxy and Local Sync Hub now live in one repository and are released together.
This release also adds self-service setup for new deployments, a new rules engine for our dynamic forms, and a large set of security, audit and sync improvements.

If you already run Hikma Health, read [Upgrading to v3](#upgrading-to-v3) before you update.
Your existing database is kept, and your data is unaffected, but some settings change and your users may have to sign in again.

### Highlights

- **One repository, one release.** The server, mobile app, AI proxy, Local Sync Hub and admin portal are now one monorepo. The default GitHub branch is now `v3`, and `main` is frozen.
We will not be updating `main` branch with any new features, some critical security patches may be applied for the rest of 2026.
- **New TypeScript backend.** The Python + Alembic backend has been rewritten in TypeScript/Node.js. Existing databases are migrated automatically on startup.
- **Self-onboarding.** New deployments create their organization, first clinic and administrator from a `/setup` page. You no longer need to request default credentials.
- **Smarter forms.** A new rules engine adds skip logic, conditional required fields, validation rules and computed values to event and registration forms.
- **Local Sync Hub (Beta).** A desktop app that lets clinics sync devices over the local network with no internet, then passes the data on to the cloud.
- **AI Powered Report Generation.** EHR Administrators can collaborate with an AI of their choice to safely and privately generate reports based on their data.
- **Security and auditing.** Hashed session tokens, rate limiting, 2-hour sessions, a much broader audit trail, and initial ISO 27799 control mapping.

## Clinical and admin features

### Self-onboarding for new deployments

Before this release, all new users of Hikma Health had to request the default email+password combination from our team to get set up. We now support "wordpress-style" set up (just a bit more secure ;)).

New servers start with a first-run **`/setup`** wizard. It registers your organization and first clinic and creates the administrator account.
The wizard is unlocked with a `SETUP_TOKEN`, which you get one of three ways:

- Render generates it for you.
- You enter it on the DigitalOcean deploy form.
- It is printed to the server logs.

No email delivery or verification is needed, and you don't have to use a seeded default account.
The setup page turns itself off once the first administrator exists. Servers deployed before this feature are
treated as already set up. While the seeded default admin password is still in use, the admin portal shows a warning banner.

### Reports and analytics

- **AI report generation.** Describe a report in plain language and get charts and tables. v3 adds report deletion and reworked edit and view pages.
- **Opt-in analytics sharing with Hikma Health.** Super admins can opt in or out on the Configuration page.
Only aggregate counts are shared: total patients, plus daily new patients and visits.
The page shows the connection status: opted in, pending verification, opted out, forbidden or unreachable.
See [Reporting Integration](/docs/server-guides/reporting-integration) for how this works.

### Patients, clinics and records

- **Patients.** Registration fields can be marked unique to prevent duplicates. The patient list and exports include timestamp columns.
Excel exports include every worksheet, patient basic info and problems, and links to attachments. You can view and export data from deleted forms.
Vitals have a patient chart, and vitals can be edited, with history, on mobile.
- **Patient search** by clinic, registration date and most recent encounter date, plus fuzzy search for diagnosis (ICD) codes.
- **Patient history and observations**, and a primary clinic on each patient.
- **Diagnoses and patient problems** can be recorded inside event forms.
- **Event data explorer.** Browse submitted event-form data with pagination and form filters, and export it to Excel.
- **Clinics** have city, country and address fields, and can be archived. Clinics can have departments, each with capabilities you can turn on or off, and departments can be set on appointments.
- **Appointments** are handled more reliably, and the appointment list loads faster (the latest 100 load first).
- **Education content.** The editor now supports image and file uploads.

### Files and attachments

- **Pluggable storage.** Store files in Tigris (preferred), S3, Google Cloud Storage, Azure, or local disk (not recommended). Storage is now configured from the admin **Configuration** page. Settings are kept when you switch backends, and stored files are checked for integrity.
- **Attachments on event forms**, including multi-file upload and camera capture on mobile.
- **Expiring links.** Exported event forms contain time-limited links to attachments instead of permanent URLs. Every attachment download is audited before the file is served.

### Users, permissions and devices

- **Capability-based permissions.** Permissions are set per clinic and per capability from a Manage Permissions page. New capabilities cover prescription editing. The "override mobile permissions" setting now also covers uploads to the server. See [Permissions & Access Control](/docs/security-guides/permissions-and-capabilities).
- **Customize the mobile patient view.** Admins choose which actions appear on the patient screen in the mobile app, and in what order, for each clinic.
- **Mobile app connect card.** The admin portal shows a QR card for connecting the mobile app.
- **Device management** for devices registered with the cloud server.
- **Super-admin password reset** for users, and confirmation before deleting users.
- **Sync Attempts page** (in the Audit section) shows sync attempts by device and user.
- **Operation-mode configuration** and new app-config settings.

## Pharmacy and inventory

Prescriptions, the drug catalogue, clinic inventory, batch tracking and dispensing are all included. v3 adds:

- Admins can edit drug catalogue entries and remove drugs from a clinic.
- A reworked clinic inventory screen.
- Prescription editing from the web patient page and on mobile.
- A mobile pharmacy view grouped by patient.
- A city picker on mobile prescriptions.
- The pickup clinic defaults to the provider's clinic.
- Prescriptions update on screen faster.

## Dynamic forms

Event forms and registration forms now share a new rules engine, built on JSONLogic. See [Dynamic Event Forms](/docs/core-concepts/dynamic-event-forms) for the basics of building forms.

**Rule types**

- **Visibility / skip logic** (`visibleIf`): show or hide a field based on other answers.
- **Conditional required** (`requiredIf`): make a field required only when it applies.
- **Validation rules**: check that answers are valid before the form is saved.
- **Computed values**: fill a field from other answers.

Rules can read patient and provider context. The engine detects rules that depend on each other in a loop.

**Conditions** include comparisons, true/false checks, multi-select includes / excludes / any / all, equals-any, and character-length checks. Several conditions can be combined with AND / OR.

**Form builder improvements**

- A field-logic panel with rule templates, and a live preview pane.
- A cleaner layout and a number input field.
- Duplicate an event form in one click.
- Forms can be assigned to specific clinics, and translated per field.
- Guards against reserved keywords and duplicate field names.
- Providers are recorded on events, and old or malformed forms are migrated automatically.

## Mobile app (1.3.3 → 1.7.6)

- **Sync overhaul.** Paged backfill, manual "Sync from…", force sync and force upload, sync locking and retry, switching between sync modes, local repair of schema drift, and better sync logging in production. Fixes a decimal-value sync bug.
- **Cloud and hub together.** The app chooses between the cloud server and a Local Sync Hub, recovers on its own if its active target goes away, and can re-pair by rescanning the hub's QR code.
- **Screen-capture blocking** on screens that show patient health information, managed by admins.
- **Usability.** Better appointment management, a clear button on single-select fields, fixes for screens that crossed midnight, and long dropdowns no longer cover navigation.
- **Stability.** Live data views handle errors without crashing, and crash reporting has been reworked.
- **Translations** updated for English, Arabic and Spanish.
- **Android.** A larger memory limit for very large syncs. The `READ_MEDIA_IMAGES` permission is no longer requested, to meet Play Store policy.
- Upgraded to Expo SDK 57, React Native 0.86 and React 19.2.

See [Data Synchronization](/docs/mobile-guides/data-sync) for how sync works on mobile.

## Local Sync Hub (Beta)

The [Local Sync Hub](/docs/local-sync-hub/overview) is a new desktop app for macOS, Windows and Linux.
It acts as a sync server on the clinic's local network, so devices can sync with each other without internet,
and it passes the data on to the cloud when internet returns.

- **Encrypted storage.** The hub's database is encrypted. Its keys and the cloud URL are kept in an encrypted vault
opened with the operator's passphrase. Keys can be rotated, and the hub can be wiped.
- **Secure pairing.** Devices pair by scanning a QR code. Messages between devices and the hub are
encrypted (X25519 key exchange and AES-256-GCM), and sessions last 2 hours.
- **Per-clinic sync controls** come from the cloud server and refresh without re-pairing.
- **Signed auto-updates.** Installers are published for every platform (.dmg, .msi, .exe, .deb, .rpm, .AppImage).
The installers are not yet code-signed by the operating system vendors,
so macOS and Windows may warn you the first time you open the app.

See [Operating the Hub](/docs/local-sync-hub/operating-the-hub) to set one up.

## Sync improvements (server)

- Large initial syncs are split into pages with row and size limits, so big clinics sync reliably.
- A stale-data guard keeps the most recently updated version of a record, and hubs can only sync the clinics they are authorized for.
- Related records are always saved in the right order.
- Deletions sync correctly. Deleting a patient now also removes their visits, events and problems, and a repair migration cleans up records that were left behind before.
- `MAX_HISTORY_DAYS_SYNC` limits how much history is synced to devices. Reference data and registration forms are always synced in full.
- App config is always sent to devices.
- Sync is rate-limited per account and per IP address. You can turn this off with a flag.

## Security

- **Sign-in.** Web and mobile use the same sign-in, and the same error is shown whether the user doesn't exist or the password is wrong.
- **Rate limiting** on sign-in (per IP address and email, and per IP address), and on RPC, sync, upload and download.
- **2-hour sessions** across the server and the hub. When a session expires, tokens and cookies are cleared and the user is sent back to sign-in.
Super-admin authentication is stronger.
- **Session tokens are stored hashed** (SHA-256) and are never written to logs. Sync requests no longer create a new token each time.
- **Cookies** are `SameSite=Lax`, `httpOnly` and `Secure`.
- **Password policy** for first-run setup: a minimum length, a 72-byte maximum, and a block list of common passwords.
Email addresses are normalised when saved.
- **Database TLS.** Set `sslmode` and an optional CA certificate explicitly. Implicit SSL configuration is deprecated (see [Upgrading to v3](#upgrading-to-v3)).
- **Connection pool and statement timeout** can be tuned, to avoid running out of database connections.
- **Dependencies.** Known-vulnerable dependency versions are pinned to fixed releases, and installation fails early if something is wrong.
- Attachment downloads send `nosniff`, so browsers don't guess file types.

See [Security Considerations](/docs/security-guides/security-considerations) for more.

## Compliance and auditing

- **ISO 27799:2025** (health information security): an initial control mapping and gap analysis.
- **A broader audit trail.** Record changes are logged, along with sign-ins, failed sign-ins (including rate-limited attempts) and sign-outs across web,
mobile and RPC. Admin changes are logged for users, permissions, clinics, devices, drugs, inventory, event and registration forms, patients and configuration,
including which fields changed. Secrets are kept out of the logs. Attachment access is audited. For now, the only audit page in the admin portal is **Sync Attempts**.
- **Dependency monitoring.** A weekly job checks dependencies for known vulnerabilities, and security updates are opened automatically.
- **Change risk.** Every pull request includes a risk assessment for patient health information.

## Upgrading to v3

> **Read these before you update an existing deployment.**

1. **Point your deploy at `v3`.** On Render (or any other host), change the deploy branch from `main` to `v3`.
Your existing database is kept, and migrations run on startup.
2. **Everyone signs in again.** Session tokens are now stored hashed, so existing sessions no longer work after the upgrade.
3. **Set database SSL explicitly.** `DATABASE_SSL_OPTIONS` is now ignored. Set `sslmode` in `DATABASE_URL` or with `DB_SSLMODE`,
and optionally `DATABASE_CA_CERT`. Without it, production falls back to `require` and logs a deprecation warning.
4. **Re-pair mobile devices with the hub.** Devices must rescan the hub's QR code.
5. **Update older tablets.** Hub sessions are now 2 hours instead of 24, so older mobile app builds may need updating.

**New deployments** open `/setup` with the `SETUP_TOKEN` to create the first administrator. Existing deployments skip setup automatically.

## Deployment

- **One-click deploys** with a Render Blueprint (the AI proxy is optional) or the DigitalOcean deploy button.
Fly.io is no longer supported. See [Quick Start](/docs/deployment/quick-start) and [Hosting Options](/docs/deployment/hosting-options).
- **AI proxy** is part of the repository and can be deployed as a separate service.
Record IDs are replaced before anything is sent to the language model.

## For developers

- The repository is a pnpm-workspace monorepo. Shared packages live under `@hikmahealth/*`: `hh-forms` (the forms
rules engine, written in ReScript), `ui` (shared components), `js-utils` (shared logger) and `data` (the ICD-11 dataset).
- The backend uses TypeScript, Node.js and Kysely, with an Alembic-to-Kysely migrator for existing databases.
The admin portal is built on TanStack Start and Vite.
- Major entities use a command/query RPC layer built on tRPC.
- New records use UUIDv7 identifiers, and appointments and events require UUIDs.
- Toolchain: Node 24, pnpm, TypeScript 6, Expo SDK 57, React Native 0.86, React 19.2.
- CI runs tests and Playwright end-to-end tests, then promotes passing changes from `next` to `v3`.
The mobile app has a Maestro end-to-end test suite with seeded offline data.

See [How to contribute](/docs/contributing/how-to-contribute) to get started.

