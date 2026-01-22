---
id: derived-atoms
title: Creating Derived Atoms
tags: [atoms, derived, computed, selectors]
level: beginner
updated: 2026-01-22
summary: Compute values from other atoms using derived atoms for efficient state management
links:
  - https://jotai.org/docs/core/atom
---

## Overview

Derived atoms (also called computed atoms) allow you to create new atoms whose values are computed from other atoms. They automatically update when their dependencies change and only recompute when necessary.

## Implementation

### Basic Derived Atom

```typescript
import { atom } from 'jotai'

const countAtom = atom(0)
const doubleCountAtom = atom((get) => get(countAtom) * 2)
```

### Multiple Dependencies

```typescript
const firstNameAtom = atom('John')
const lastNameAtom = atom('Doe')

const fullNameAtom = atom((get) => {
  const first = get(firstNameAtom)
  const last = get(lastNameAtom)
  return `${first} ${last}`
})
```

### Complex Computations

```typescript
const itemsAtom = atom([
  { id: 1, price: 10, quantity: 2 },
  { id: 2, price: 20, quantity: 1 },
])

const totalPriceAtom = atom((get) => {
  const items = get(itemsAtom)
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
})
```

### Writable Derived Atom

```typescript
const celsiusAtom = atom(0)

const fahrenheitAtom = atom(
  (get) => (get(celsiusAtom) * 9) / 5 + 32,
  (get, set, newFahrenheit: number) => {
    set(celsiusAtom, ((newFahrenheit - 32) * 5) / 9)
  }
)
```

## Use Cases

- **Formatted Data**: Format or transform data for display
- **Filtered Lists**: Filter arrays based on search criteria
- **Aggregations**: Calculate totals, averages, or other aggregate values
- **Unit Conversions**: Convert between different units or formats
- **Validation**: Derive validation state from input values

## Best Practices

1. **Keep Computations Pure**: Derived atoms should not have side effects
2. **Avoid Heavy Computations**: For expensive operations, consider memoization
3. **Use Appropriate Dependencies**: Only depend on atoms that affect the result
4. **Leverage Caching**: Jotai caches derived values until dependencies change
5. **Consider Atom Splitting**: Split complex derived atoms into smaller pieces

## Related Skills

- [Async Atoms](./async-atoms.md) - Derive async values
- [Write-Only Atoms](./write-only-atoms.md) - Actions that modify state
