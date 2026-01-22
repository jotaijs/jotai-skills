---
id: async-atoms
title: Working with Async Atoms
tags: [atoms, async, promises, suspense]
level: intermediate
updated: 2026-01-22
summary: Learn how to create and manage asynchronous atoms in Jotai for data fetching and async operations
links:
  - https://jotai.org/docs/guides/async
---

## Overview

Async atoms in Jotai allow you to handle asynchronous operations like data fetching, API calls, and other promise-based workflows. They integrate seamlessly with React Suspense and error boundaries, providing a clean way to manage loading and error states.

## Implementation

### Basic Async Atom

```typescript
import { atom } from 'jotai'

const userAtom = atom(async (get) => {
  const response = await fetch('/api/user')
  return response.json()
})
```

### With Dependencies

```typescript
const userIdAtom = atom(1)

const userAtom = atom(async (get) => {
  const userId = get(userIdAtom)
  const response = await fetch(`/api/users/${userId}`)
  return response.json()
})
```

### Write Async Atoms

```typescript
const updateUserAtom = atom(null, async (get, set, update) => {
  const response = await fetch('/api/user', {
    method: 'PUT',
    body: JSON.stringify(update),
  })
  const user = await response.json()
  set(userAtom, user)
})
```

## Use Cases

- **Data Fetching**: Load data from APIs when a component mounts
- **Form Submission**: Handle async form submissions with proper loading states
- **Computed Async Values**: Derive values that require async operations
- **Refetchable Data**: Update data based on dependency changes

## Best Practices

1. **Use Suspense Boundaries**: Wrap components using async atoms with Suspense to handle loading states
2. **Error Boundaries**: Catch async errors using error boundaries
3. **Avoid Circular Dependencies**: Be careful not to create circular dependencies between async atoms
4. **Consider Caching**: Use `atomWithStorage` or external caching for frequently accessed data
5. **Handle Race Conditions**: Be aware of potential race conditions when dependencies change rapidly

## Related Skills

- Atom Families - For creating dynamic async atoms
- Suspense Integration - Deep dive into Suspense usage
