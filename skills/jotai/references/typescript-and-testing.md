# TypeScript And Testing

Use this reference for typing atoms and validating Jotai behavior.

## TypeScript Defaults

Enable `strict` or at least `strictNullChecks`; Jotai's types rely heavily on inference.

Jotai v3 requires TypeScript 5.5 or newer and resolves its types through conditional `exports` and `typesVersions`. If type resolution breaks after an upgrade, check the TypeScript version and `moduleResolution` before suspecting the atom types; see `version-migration.md` for older-version requirements.

Use the public `Store` type from `jotai/vanilla` or `jotai` when a helper needs `get`, `set`, and `sub`. Prefer vanilla entry points for React-independent logic.

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

Use component tests for user interactions, hook subscriptions, and Provider behavior. Test atom logic directly with `createStore` when derived values, actions, async results, or store isolation are the behavior under test; no React harness is required.

```ts
const store = createStore()
store.set(countAtom, 2)
expect(store.get(doubledAtom)).toBe(4)
```

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

Jotai v3 publishes ESM only, which mostly surfaces in the test layer. Vitest and Jest in native ESM mode handle it. A Jest setup that transforms to CJS skips `node_modules` by default, so it may need Jotai included in the transform (for example `transformIgnorePatterns: ['/node_modules/(?!jotai)']`). If imports fail only under the test runner, check the runner's module configuration before suspecting the atoms.

Create a fresh store for independent test cases; retain it across rerenders that are testing the same state flow. Without an explicit `{ store }` option, call `useHydrateAtoms` from a descendant of the matching `Provider`; calling it in the component that returns the Provider targets the parent or default store instead.

Unsubscribe every `store.sub` listener during cleanup. Tests of `onMount` behavior need a real subscription, not only `store.get`. Keep assertions focused on behavior: rendered output, action result, reset behavior, async loading/error/success state, or Provider isolation.

## Review Checklist

- Types are inferred unless explicit annotation communicates a wider public contract.
- Async atoms expose `Promise` unions only where sync/async switching is intentional.
- Write-only atoms have precise argument types.
- Tests initialize atom state through the same Provider/store path production code uses.
- Test at the level that exposes the relevant behavior without coupling assertions to internal building blocks.
