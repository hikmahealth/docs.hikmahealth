---
title: "Security Considerations"
description: "Security best practices for deploying and using Hikma Health."
order: 2
---

## Security Considerations

When deploying Hikma Health in production, especially with sensitive health data, it's important to follow security best practices. This guide covers the key areas to consider.

### SSL/TLS Encryption

Always use `https://` over `http://` for all domains and endpoints. TLS encryption protects data transmission between devices and servers from interception.

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
