---
title: "FAQ"
description: "Frequently asked questions about the Hikma Health platform."
order: 4
---

## Frequently Asked Questions

### What does "offline-first" or "local-first" mean?

Offline-first apps are designed to work primarily offline, and online functionality is a secondary feature. Users can operate the mobile EHR system without internet, though data synchronization requires connectivity to share updates with other team members.

### Can I use Hikma Health without a cloud component?

Yes. This approach works well for single-user clinics prioritizing data collection. Cloud functionality can be added later when expanding to multiple clinicians or requiring admin features.

### Why do I need to scan a QR code before using the mobile app?

The app is publicly available, so scanning the QR code connects your specific instance to your backend server, enabling data synchronization. Without this step, the app functions offline-only.

### I'm having issues scanning the QR code. What should I do?

First, rescan the code clearly. Then verify your credentials and reset your password. Contact your technical lead if problems persist.

### Who has access to my data?

No one but you and your technical team have access to your data. Not even us. You control your own server deployment, so Hikma Health staff cannot access your information.

### What are the recommended device specifications?

**Minimum:** Android 13+ / iOS 16+.
**Recommended:** 6-8GB RAM and 64-128GB storage. Higher specs improve search speed, data entry, and synchronization performance.

### How does deletion work in an offline system?

Records receive a "tombstone" marker rather than permanent deletion, allowing offline devices to sync removal notifications upon reconnecting.

### How often is Hikma Health updated?

Monthly updates include performance improvements, features, security patches, and dependency updates.

### I'm getting an error. How do I get support?

Email ally[at]hikmahealth.org or file [GitHub issues](https://github.com/hikmahealth/hikma-health-server/issues) (preferred) with error details, screenshots, and server logs.

### What hosting provider do you recommend?

[Render.com](https://render.com) is suggested for affordability and ease. Use any server with a managed database service — avoid unmanaged database hosting.

### How is data stored on the mobile device?

SQLite databases store data in sandboxed environments that other applications cannot access.

### Why is synchronization slow?

Check internet connectivity or contact your technical lead regarding potential server issues.

### Why is the patient count different on my device vs. the admin portal?

Server misconfiguration requires technical lead intervention.

### Is my data deleted when I uninstall the app?

Operating systems control application data deletion timing. Manually clear app data and cache in settings to guarantee removal.
