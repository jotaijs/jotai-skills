---
id: atom-families
title: Using Atom Families
tags: [atoms, families, dynamic, parameters]
level: intermediate
updated: 2026-01-22
summary: Create parameterized atoms dynamically using atom families for scalable state management
links:
  - https://jotai.org/docs/utilities/family
---

## Overview

Atom families allow you to create atoms dynamically based on parameters. This is useful when you need multiple similar atoms that differ only in their input parameters, such as managing a collection of items by ID.

## Implementation

### Basic Atom Family

```typescript
import { atomFamily } from 'jotai/utils'

const todoAtomFamily = atomFamily((id: number) =>
  atom({
    id,
    title: '',
    completed: false,
  })
)

// Usage
const todo1 = todoAtomFamily(1)
const todo2 = todoAtomFamily(2)
```

### Async Atom Family

```typescript
const userAtomFamily = atomFamily((userId: number) =>
  atom(async () => {
    const response = await fetch(`/api/users/${userId}`)
    return response.json()
  })
)
```

### With Custom Equality

```typescript
const itemAtomFamily = atomFamily(
  (params: { id: number; type: string }) =>
    atom({
      id: params.id,
      type: params.type,
      data: null,
    }),
  (a, b) => a.id === b.id && a.type === b.type
)
```

## Use Cases

- **Collection Management**: Manage items in a list where each item needs its own atom
- **Dynamic Forms**: Create form field atoms dynamically based on configuration
- **Router Parameters**: Create atoms based on route parameters
- **Caching**: Cache API responses by ID or other parameters
- **Multi-Instance Components**: Manage state for multiple instances of the same component

## Best Practices

1. **Use Stable Parameters**: Ensure parameter objects are stable to avoid unnecessary atom recreation
2. **Custom Equality**: Provide custom equality functions for complex parameter objects
3. **Cleanup**: Use `atomFamily.remove()` to cleanup unused atoms and prevent memory leaks
4. **Memoize Calls**: Memoize atom family calls when used in render functions
5. **Consider Alternatives**: For simple cases, a single atom with a map might be simpler

## Related Skills

- [Async Atoms](./async-atoms.md) - Combine with async patterns
- [Atom with Storage](./atom-with-storage.md) - Persist family atoms
- [Derived Atoms](./derived-atoms.md) - Derive values from family atoms
