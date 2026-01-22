---
id: atom-with-storage
title: Persisting Atoms with Storage
tags: [atoms, storage, persistence, localStorage]
level: intermediate
updated: 2026-01-22
summary: Persist atom values to localStorage or other storage mechanisms for state that survives page refreshes
links:
  - https://jotai.org/docs/utilities/storage
---

## Overview

`atomWithStorage` is a utility that creates atoms whose values are automatically synchronized with a storage mechanism like localStorage or sessionStorage. This is perfect for persisting user preferences, form data, or other state that should survive page refreshes.

## Implementation

### Basic Local Storage

```typescript
import { atomWithStorage } from 'jotai/utils'

const themeAtom = atomWithStorage('theme', 'light')
```

### With TypeScript

```typescript
type Theme = 'light' | 'dark'

const themeAtom = atomWithStorage<Theme>('theme', 'light')
```

### Custom Storage

```typescript
import { createJSONStorage } from 'jotai/utils'

const storage = createJSONStorage(() => sessionStorage)

const tempDataAtom = atomWithStorage('temp-data', {}, storage)
```

### Async Storage

```typescript
const asyncStorage = {
  getItem: async (key: string) => {
    const value = await chrome.storage.local.get(key)
    return value[key]
  },
  setItem: async (key: string, value: string) => {
    await chrome.storage.local.set({ [key]: value })
  },
  removeItem: async (key: string) => {
    await chrome.storage.local.remove(key)
  },
}

const settingsAtom = atomWithStorage('settings', {}, asyncStorage)
```

## Use Cases

- **User Preferences**: Theme, language, display settings
- **Form Persistence**: Save draft form data
- **Authentication**: Store tokens (use secure storage for sensitive data)
- **Shopping Cart**: Persist cart items across sessions
- **App State**: Remember user's position in multi-step processes

## Best Practices

1. **Use Meaningful Keys**: Choose clear, unique storage keys to avoid conflicts
2. **Handle Errors**: Wrap storage operations in try-catch for robustness
3. **Consider Storage Limits**: localStorage has size limits (~5-10MB)
4. **Security**: Never store sensitive data in localStorage without encryption
5. **Version Your Data**: Include version numbers for easier migrations
6. **SSR Compatibility**: Check for browser environment before accessing storage

## Related Skills

- [Async Atoms](./async-atoms.md) - Combine with async patterns
- [Atom Families](./atom-families.md) - Persist family atoms
- [Atom Effects](./atom-effects.md) - Add custom persistence logic
