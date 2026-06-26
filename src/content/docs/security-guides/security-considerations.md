---
title: "Security Considerations"
description: "Security best practices for deploying and using Hikma Health."
order: 2
---

## Security Considerations

When deploying Hikma Health in production, especially with sensitive health data, it's important to follow security best practices. This guide covers the key areas to consider.

### SSL/TLS Encryption

Always use `https://` over `http://` for the **cloud server** and all of its endpoints. TLS encryption protects data transmission between devices and the server from interception. This is a hard requirement for any internet-facing deployment.

### Transport Security: the Local Sync Hub

The one deliberate exception to the HTTPS rule is the [Local Sync Hub](/docs/local-sync-hub/overview), which serves **plain HTTP** on port `4001` on the local network. This is **by design**, not an oversight: the hub has no CA-issued certificate, and self-signed certificates are rejected by iOS App Transport Security and the Android system trust store, which would break the mobile clients.

Instead of transport-layer TLS, the hub protects patient data in transit at the **application layer**: every data payload is encrypted with **ECDH-derived AES-256-GCM**. This is treated as an *addressable* HIPAA transmission-security safeguard, with the application-layer encryption envelope as the documented equivalent measure. The model assumes a **trusted local network** — so the hub must **never** be exposed to the internet, and port `4001` must never be port-forwarded. See the hub's [security model](/docs/local-sync-hub/overview#security-model) for details.

### Security vs. Convenience

Avoid enabling automatic patient data access without proper permission verification. Additionally, refrain from synchronizing clinician and user tables to mobile devices, as this expands vulnerability exposure if local databases are compromised.

### Dependency Management

Keep React Native updated regularly to address known vulnerabilities. Stay current with releases or, at minimum, remain only one minor version behind.

### Data Storage Protection

- Never commit `.env` files to version control.
- Avoid hardcoding sensitive credentials in source code.
- Do not use `AsyncStorage` for sensitive information — use encrypted alternatives like iOS Keychain or Android Shared Preferences instead.

### Third-Party Library Vetting

Carefully evaluate external libraries, prioritizing those with high GitHub engagement and frequent updates.

> **Note:** We recommend reviewing [React Native's official security best practices](https://reactnative.dev/docs/security) for comprehensive guidance.
