---
title: Security Considerations
description: How Hikma Health manages offline data collection and its synchronization to allow collaboration between stakeholders.
---

The Hikma Health mobile application comes with baseline security features to ensure compatibility with all users. It is up to you the developer, to apply more advanced security measures outlined below and to follow best practices.

---

## Key Considerations

### Use SSL encryption for all network traffic. 
A simple rule of thumb is to always use `https://` over `http://` domains and endpoints. Your Hikma Health backend API should have a SSL certificate and have a `https://` domain.

The TLS security encrypts data between your device and the server to make sure its not intercepted by anyone else along the way, if they do the are unable to read the data.

### Prioritize security over convenience. 
Don't sacrifice security for the sake of making your app easier to use. For example, do not make it possible for users to sign up through the application and automatically have access to patient data without 
proper permissions being assigned to their accounts.

Additionally, do not sychronize the clinicians and users tables from the server down to the mobile application as that increases the surface area of attack if the local database ever ended up in the wrong hands.


### Keep your app up to date. 
React Native releases security updates on a regular basis. Make sure you're using the latest version of React Native to protect your users from known vulnerabilities.

This can feel like a never ending experience but is one of the easiest things you can do improve application performance, stability and security. If being on the latest releases is too cutting 
edge for your organization then focus on being behind by one minor update only.


### Use a secure storage solution. 
In general, it is best to avoid storing any sensitive data directly on the device. However, that is not possible for offline first applications - meaning special care must be taken to prevent unathorized access.

##### Remember to:
1. NEVER commit your `.env` files to git (or any other version control software you are using.). If you do, like we all have once upon a time, remove it from being tracked and update all credentials that were stored in there.
2. Do not type out any sensitive information directly into any parts of the code. This includes, but is not limited to, passwords, email addresses, API keys, secret keys, and ids.
3. DO NOT store any sensitive information in `AsyncStorage`. AsyncStorage does not encrypt data at rest. Consider alternatives such as using the keychain (iOS) and/or Shared Preferences (Android) - you can use [Encrypted Storage](https://github.com/emeraldsanto/react-native-encrypted-storage).


### Be aware of the risks of third-party libraries. 
Third-party libraries can introduce security vulnerabilities into your app. Be careful about which third-party libraries you use and make sure they are up to date.

Prefer libraries with a lot of github stars and frequent updates and activity on github/bitbucket/gitlab.

### Learn more
It is recommended that every React Native developer review the RN security best practices at least once: [https://reactnative.dev/docs/security](https://reactnative.dev/docs/security)


