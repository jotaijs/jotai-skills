# TypeScript And Testing

Use this reference for typing atoms and validating Jotai behavior.

## TypeScript Defaults

Enable `strict` or at least `strictNullChecks`; Jotai's types rely heavily on inference.

Let primitive and derived atoms infer types when possible:

```ts
const countAtom = atom(0)
const doubledAtom = atom((get) => get(countAtom) * 2)
```

Explicitly type primitive atoms when the initial value is narrower than the intended domain:

```ts
const selectedIdAtom = atom<string | null>(null)
const maybeAsyncCountAtom = atom<number | Promise<number>>(0)
```

## Write Atom Types

Prefer annotating write function arguments before reaching for full atom generic parameters:

```ts
const setNameAtom = atom(null, (_get, set, name: string) => {
  set(nameAtom, name)
})
```

Use explicit generics when inference fails or when the atom's public type is part of an exported API:

```ts
const writeOnlyAtom = atom<null, [string, number], void>(
  null,
  (_get, set, label, count) => {
    set(summaryAtom, `${label}: ${count}`)
  },
)
```

## Extracting Atom Values

Use `ExtractAtomValue<typeof someAtom>` when another function or hook should stay coupled to an atom's value type without duplicating the type.

```ts
import type { ExtractAtomValue } from 'jotai'

function serializeUser(user: ExtractAtomValue<typeof userAtom>) {
  return JSON.stringify(user)
}
```

## Testing Strategy

Prefer tests that resemble how users interact with the UI. Treat Jotai as an implementation detail for component behavior unless the atom logic is complex enough to justify isolated tests.

Use `Provider` and `useHydrateAtoms` to inject initial atom values:

```tsx
import { createStore, Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useState, type ReactNode } from 'react'

function HydrateAtoms({ children }: { children: ReactNode }) {
  useHydrateAtoms(new Map([[countAtom, 100]]))
  return children
}

function TestProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createStore)
  return (
    <Provider store={store}>
      <HydrateAtoms>{children}</HydrateAtoms>
    </Provider>
  )
}
```

Create a fresh store for every test render or test case. Call `useHydrateAtoms` from a descendant of the matching `Provider`; calling it in the same component that returns the Provider hydrates the parent or default store instead.

For isolated atom logic, test through hooks or the vanilla store API if the project already uses that pattern. Unsubscribe every `store.sub` listener during cleanup. Keep assertions focused on behavior: rendered output, action result, reset behavior, async loading/error/success state, or Provider isolation.

## Review Checklist

- Types are inferred unless explicit annotation communicates a wider public contract.
- Async atoms expose `Promise` unions only where sync/async switching is intentional.
- Write-only atoms have precise argument types.
- Tests initialize atom state through the same Provider/store path production code uses.
- User-facing tests cover the important state transitions before atom-internal tests are added.
