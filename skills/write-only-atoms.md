---
id: write-only-atoms
title: Creating Write-Only Atoms
tags: [atoms, actions, mutations, updates]
level: beginner
updated: 2026-01-22
summary: Build action-like atoms that modify state without holding values themselves
links:
  - https://jotai.org/docs/core/atom
---

## Overview

Write-only atoms (also called action atoms) are atoms that don't hold a value themselves but instead provide a way to update other atoms. They're perfect for encapsulating complex update logic or side effects.

## Implementation

### Basic Write-Only Atom

```typescript
import { atom } from 'jotai'

const countAtom = atom(0)

const incrementAtom = atom(
  null, // read function returns null
  (get, set) => {
    set(countAtom, get(countAtom) + 1)
  }
)
```

### With Parameters

```typescript
const addToCartAtom = atom(null, (get, set, product: Product) => {
  const cart = get(cartAtom)
  set(cartAtom, [...cart, product])
})

// Usage
const addToCart = useSetAtom(addToCartAtom)
addToCart(product)
```

### Async Write-Only Atom

```typescript
const submitFormAtom = atom(null, async (get, set, formData: FormData) => {
  set(loadingAtom, true)
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
    const result = await response.json()
    set(resultAtom, result)
  } catch (error) {
    set(errorAtom, error)
  } finally {
    set(loadingAtom, false)
  }
})
```

### Complex Update Logic

```typescript
const toggleTodoAtom = atom(null, (get, set, todoId: number) => {
  const todos = get(todosAtom)
  set(
    todosAtom,
    todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    )
  )
})
```

## Use Cases

- **Form Submission**: Encapsulate form submission logic
- **Complex Updates**: Update multiple atoms in a single action
- **Side Effects**: Trigger API calls, logging, or analytics
- **State Machines**: Implement state transitions
- **Undo/Redo**: Build undo/redo functionality

## Best Practices

1. **Use `useSetAtom`**: Only subscribe to updates with `useSetAtom` to avoid unnecessary rerenders
2. **Encapsulate Logic**: Keep update logic in write-only atoms rather than components
3. **Error Handling**: Include proper error handling for async operations
4. **Type Safety**: Use TypeScript to define parameter types
5. **Keep Focused**: Each write-only atom should have a single, clear purpose

## Related Skills

- [Async Atoms](./async-atoms.md) - Handle async operations
- [Derived Atoms](./derived-atoms.md) - Read-only computed values
