---
id: suspense-integration
title: Integrating with React Suspense
tags: [suspense, async, loading, react]
level: intermediate
updated: 2026-01-22
summary: Leverage React Suspense with Jotai atoms for declarative loading states
links:
  - https://jotai.org/docs/guides/async
  - https://react.dev/reference/react/Suspense
---

## Overview

Jotai integrates seamlessly with React Suspense, allowing you to handle loading states declaratively. When an async atom is read, it automatically suspends the component until the promise resolves.

## Implementation

### Basic Suspense Usage

```typescript
import { Suspense } from 'react'
import { atom, useAtom } from 'jotai'

const userAtom = atom(async () => {
  const response = await fetch('/api/user')
  return response.json()
})

function UserProfile() {
  const [user] = useAtom(userAtom)
  return <div>{user.name}</div>
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile />
    </Suspense>
  )
}
```

### Multiple Suspense Boundaries

```typescript
function App() {
  return (
    <div>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <Suspense fallback={<ContentSkeleton />}>
        <Content />
      </Suspense>
    </div>
  )
}
```

### With Error Boundary

```typescript
import { ErrorBoundary } from 'react-error-boundary'

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<Loading />}>
        <Content />
      </Suspense>
    </ErrorBoundary>
  )
}
```

### Conditional Suspense

```typescript
const dataAtom = atom(null)
const loadDataAtom = atom(
  (get) => get(dataAtom),
  async (get, set) => {
    const data = await fetch('/api/data').then((r) => r.json())
    set(dataAtom, data)
  }
)

function Component() {
  const [data, loadData] = useAtom(loadDataAtom)

  if (!data) {
    return <button onClick={loadData}>Load Data</button>
  }

  return <div>{data.content}</div>
}
```

## Use Cases

- **Data Fetching**: Show loading states while fetching data
- **Code Splitting**: Load components lazily with suspense
- **Sequential Loading**: Load data in stages with nested Suspense
- **Parallel Loading**: Load multiple resources simultaneously
- **Streaming SSR**: Server-side rendering with streaming HTML

## Best Practices

1. **Strategic Boundaries**: Place Suspense boundaries where loading states make sense to users
2. **Fallback Quality**: Use skeleton screens or spinners that match content layout
3. **Combine with Error Boundaries**: Always wrap Suspense with error boundaries
4. **Avoid Over-Suspending**: Don't wrap the entire app in one Suspense boundary
5. **Consider UX**: Balance between showing loading states and waiting for content
6. **Test Loading States**: Test that loading states appear and disappear correctly

## Related Skills

- [Async Atoms](./async-atoms.md) - Create async atoms that work with Suspense
- [Error Handling](./error-handling.md) - Handle errors in async operations
- [Loadable Atoms](./loadable-atoms.md) - Alternative to Suspense for loading states
