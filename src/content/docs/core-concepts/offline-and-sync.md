---
title: "Offline & Sync"
description: "Understanding offline-first data collection and synchronization."
order: 3
---

## Offline & Sync

The mobile application makes full use of the locally available SQLite database to keep track of local events and synchronizes any changes with the server.

### Offline support vs offline native

In conditions where connectivity is the exception and not the rule, offline support is not enough. It is important to change the framing to "online support" but offline native. This requires building highly performant applications in highly constrained environments where memory management is critical.

### Local storage with SQLite

SQLite is a relational database management system contained in a C programming library. Unlike traditional client-server database engines, SQLite is embedded directly in the application.

Hikma Health uses [WatermelonDB](https://watermelondb.dev/), a performant, scalable, and extensible database for React and React Native applications. WatermelonDB supports JSI for extremely fast queries written in C++ that can easily scale to tens of thousands of records with minimal impact to performance.

### Data synchronization

Three change types are tracked during synchronization:

- **Created:** New data on user devices since the last sync.
- **Changed/Updated:** Previously existing data that has been modified locally.
- **Deleted:** Records removed since the last sync.

Changes are organized by table and sent with a synchronization timestamp.

### Server sync

The server sync API accepts a GET request first to check for any changes since the last sync, followed by a POST request where the user pushes any data they may have locally.

**Note:** Initial synchronization requires downloading the entire database, which may take time depending on network availability.