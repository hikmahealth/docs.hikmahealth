---
title: Performance
description: Performance
---

JavaScript is single-threaded and generally is not very performant to deliver as close to 60fps as possible. It is important to leverage native code/apis as much as possible (within reason).

---

## TODO

#### Notes:

- We use watermelondb with JSI enable (running on SQLITE)
- Prefer LegendList for long lists over react-native's Flatlist
- Always add a `key` to any item that is rendered in a loop
- Prefer smaller pure functional (dumb) components that render the same output given the same inputs
- Do not sacrifice developer and organization productivity for the same of micro-optimizations
  - When in doubt, add a loading indiator to show the user some computation is working. This is better than making things harder to change in the future (almost always)
