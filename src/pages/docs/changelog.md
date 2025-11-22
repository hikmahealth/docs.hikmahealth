---
title: Updates & Releases
pageTitle: HH Updates & Changes - Fixes, updates and changes made recently
description: A log of the changes, fixes and releases by the Hikma Health technical team
---

The Hikma Health platform uses the CalVer versioning system - we find that this works best with our trunk based development (trunk is the `dev` branch), where all changes are assumed ready for production as long as tests pass. This acts as a forcing function to always have "working software" at any point in time.


CalVer is a versioning system based on calendar dates, typically using the format YYYY.MM.DD or variations thereof to indicate when a release was made.

---

## Checking the verisions you currently have
(currenly migrating to calver)
#### Server
Open your repository (the fork you made form hikma-health-server repository), open the `package.json` file. There should be a "version" key with the value there.

#### Mobile
To check the currenly running versions of your app, open the app and go to the settings page. In the settings page, at the very top you will see the verion of your app next to the header.

Example: "Hikma Health(v0.4.4)" means you have version 0.4.4 installed.




## 🎉 2025.11.22

### Mobile
**Released: Version 0.4.4**

**New Features:**
- Pharmacy: A new pharmacy module to prescribe, track and manage patient medications
- Inventory: Automatically track inventory through the prescribed and dispensed medications
- A "Restart" button added to side menu to allow in-app restarts


**Bug Fixes:**
- Autorotations respecting the device
- Silenced inacurate errors from failed sync


### Server

**New Features:**
- Pharmacy: Keep track of prescriptions through the dashboard reports
- Inveotory: Record and keep track of inventory

**Bug Fixes:**
- Improved permissions re-initialization on new migration.
