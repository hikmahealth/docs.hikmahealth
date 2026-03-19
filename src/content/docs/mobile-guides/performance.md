---
title: "Performance"
description: "Performance optimization tips for the mobile application."
order: 2
---

## Performance

Tips and best practices for ensuring the Hikma Health mobile application runs smoothly on low-end devices and in areas with limited connectivity.

### Lists and large datasets

- Use `FlatList` or `FlashList` instead of `ScrollView` for any list that could grow. These only render items on screen.
- Always provide a `keyExtractor` that returns a stable, unique value.
- Keep list item components lightweight — avoid deep nesting and inline styles.

### WatermelonDB queries

- Use `observe()` to subscribe to query results reactively instead of re-fetching manually.
- Scope queries as tightly as possible — filter by patient, date range, or status rather than loading entire tables.
- Avoid calling `.fetch()` in a loop. Batch your reads when you need data from multiple records.

### Rendering

- Wrap expensive components in `React.memo` to skip re-renders when props haven't changed.
- Move heavy work (formatting, filtering, sorting) into `useMemo` so it only recalculates when inputs change.
- Stabilize callback props with `useCallback` to prevent child components from re-rendering unnecessarily.

### Images and assets

- Resize and compress images before storing them. Large unoptimized photos are the fastest way to consume storage on low-end devices.
- Use cached image libraries (e.g., `expo-image` or `react-native-fast-image`) to avoid redundant downloads.

### Sync

- Keep sync payloads small. Only pull records that have changed since the last sync — the sync system already supports this via timestamps.
- Avoid triggering a sync while the user is actively navigating. Sync in the background or at natural pause points (e.g., after saving a form).

### General

- Test on the lowest-spec device your users are likely to have. Performance issues that are invisible on a modern phone become obvious on a budget Android device.
- Monitor JS thread and UI thread frame rates using React Native's built-in performance monitor during development (`Dev Menu > Perf Monitor`).
- Minimize the number of bridge calls by batching operations where possible.