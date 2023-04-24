---
title: Offline & Sync
description: How Hikma Health manages offline data collection and its synchronization to allow collaboration between stakeholders.
---

The mobile application makes full use of the locally available SQLite database to keep track of local events and the application synchronizes any changes with the server.

---

## Offline Support vs Offline Native

In conditions where connectivity is the exception and not the rule, offline support is not enough. It is important to change the framing to "online support" but offline native. This is a type of application that is built almost entirely to be self-sufficient and self-capable with the addition of network connectivity.

This type of approach forces developers, engineers and designers to build highly performant applications in highly constrained environments - where the operating system is constantly trying to reclaim your memory and you do not have the luxury of simply scaling your servers.

---

## Local Storage with SQLite

SQLite is a relational database management system contained in a C programming library. In contrast to many other database management systems, SQLite is not a client–server database engine. Rather, it is embedded in the application and is the most ubiquitous database solution in the world being deployed to almost every device you interact with daily.

Working directly with SQLite is cumbersome, so the Hikma Health mobile application makes heavy us of [Watermelon DB](https://nozbe.github.io/WatermelonDB/), a performant, scalable, and extensible database for React and React Native applications.

WatermelonDB now has support for JSI, which enables extremely fast queries written in C++ that can easily scale to tens of thousands of records with minimal impact to performance.

It is highly recommended that you enable JSI support to get the best performance. Learn more about [JSI](https://reactnative.dev/docs/next/the-new-architecture/pillars-turbomodules).

---

## Data Synchronization

Synchronization is the event of sending all local changes to the server, which then updates the database and determines what changes you do not have and sends those back to your end device.

There are 3 types of changes to be considered for all records/data:

- **Created:** Any new data that is created on the users device since the last sync event
- **Changed/Updated:** Any data that was not created since the last sync event, but was updated locally
- **Deleted:** Any data/record that was deleted since the last sync event

Each table that is available locally is tracked in the same way. An example (not real) is shown below:

```js
{
  patients: {
    created: [
      {
        id: 'd2ioew',
        name: 'Jane Doe',
        diagnosis: 'Typhoid fever, unspecified (xxx)',
      },
      { id: '092iwo', name: 'Fred Doe', diagnosis: 'N/A' },
    ],
    updated: [
      { id: '83jnd', name: 'John Doe', diagnosis: 'Malaria, unspecified (xxx)' },
    ],
    deleted: ['recordId', 'anotherRecordId'],
  },
  medications: {
    created: [...],
    updated: [...],
    deleted: [...]
  },
  ...
}
```

This object, along with a timestamp for the last sync event is sent to the server.

#### Server Sync

The server sync api accepts a `GET` requests first to check for any changes since the last sync, followed by a POST request where the user pushes any data they may have locally that needs to be available to others.

// 🏁 TODO: Document the order of GETs and POSTs to illustrate the offline data synchronization

---

**Note:** The very first time an application attempts to sync, they will have to download the entire database and might take a while depending on network availability.
