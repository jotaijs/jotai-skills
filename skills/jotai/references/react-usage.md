# React Usage

Use this reference for components, hooks, Provider scope, hydration, and dynamic atoms.

## Hook Selection

Choose the narrowest hook for the component's job:

- `useAtomValue(atom)` when the component only reads.
- `useSetAtom(atom)` when the component only writes.
- `useAtom(atom)` when the component truly needs both value and setter/action.

This matters because `useAtom` subscribes to the atom value. A write-only component using `const [, setValue] = useAtom(valueAtom)` rerenders when `valueAtom` changes; `useSetAtom` avoids that subscription.

### Raw Read Hooks (v3)

Jotai v3 adds two lower-level read hooks. They are for advanced cases; `useAtomValue` stays the default.

- `useAtomValueRaw(atom)` returns a promise for an async value without consuming it through React's `use()`. The caller must handle fulfillment, rejection, and stale results; promise settlement alone does not convert the returned value into data. Prefer `unwrap` or a result atom for ordinary loading/data/error UI.
- `useAtomValueRawSync(atom)` has the same signature but is built on `useSyncExternalStore`. It avoids tearing and renders updates synchronously, at the cost of concurrent-rendering benefits.

`useAtomValue` is `useAtomValueRaw` plus React's `use()`, so suspending behavior is unchanged from v2. Both raw hooks only exist on v3, so confirm the installed version before suggesting them; a v2 project needs `unwrap` or a result atom instead.

## Stable Atom References

Define atoms at module scope by default. If an atom must be created from props or local state during render, memoize the atom config:

```tsx
function Item({ id }: { id: string }) {
  const itemAtom = useMemo(() => atom((get) => get(itemsAtom)[id]), [id])
  const item = useAtomValue(itemAtom)
  return <ItemView item={item} />
}
```

Without a stable atom reference, `useAtom` can loop because each render receives a new atom config.

## Dynamic Atoms

Jotai allows atoms to be created on demand and even stored in React state or in another atom. Use this for genuinely dynamic state, such as user-created rows or tabs. Name variables clearly when atom configs are values, for example `selectedAtom`, `itemAtom`, or `countAtomsAtom`, so readers can distinguish atom configs from atom values.

For arrays of item atoms, consider `splitAtom` before hand-building an array of atom configs.

## Provider and Store Scope

Use `Provider` when a subtree needs an isolated store, per-request state, tests with injected values, or multiple independent instances of the same atom graph. Without a Provider, Jotai uses the default store.

Every reader and writer in a state flow must target the same store. A module-level `createStore()` is not automatically the store used by a nearby Provider. Likewise, `getDefaultStore()` does not resolve a component's Provider context. Use `useStore()` for imperative callbacks in a component and pass that instance to external integrations.

For a vanilla integration, import from `jotai/vanilla` and pass its store to the UI:

```tsx
import { createStore } from 'jotai/vanilla'
import { Provider } from 'jotai/react'

const store = createStore() // client-only app instance
const unsubscribe = store.sub(countAtom, () => console.log(store.get(countAtom)))
store.set(countAtom, (count) => count + 1)
// Render <Provider store={store}><App /></Provider> with this same instance.
// Call unsubscribe() when the integration is disposed.
```

`store.get` reads without subscribing. `store.sub` mounts the atom and returns cleanup; async reads still return promises. Prefer hooks for rendered state and vanilla methods for imperative access.

## SSR And Request Isolation

Create request-owned stores per request, rather than sharing the default store or a module-level custom store across requests. A shared atom config is safe; sharing its mutable store values between users is not. In React SSR, place a Provider around the relevant tree; in frameworks with Server Components, put Jotai hooks and Provider wiring in client components and pass server data as initial props.

## Hydration

Use `useHydrateAtoms` for initial values in tests, SSR, or story-style setups. Put hydration under the `Provider` whose store should receive the values.

Hydration is once per atom per store, not a mechanism for continuously syncing props. Use a write/action for subsequent updates when that is the intended behavior. `dangerouslyForceHydrate` can behave incorrectly during concurrent rendering. An explicit `{ store }` option can target a store directly; otherwise context determines the destination.

## Component Boundaries

Keep components that observe frequently changing atoms small. Splitting a `Profile` component into `Name` and `Age` readers is often better than having one component subscribe to both atoms if they update independently.

Do not move every line of UI into a new component just for style. Split when it narrows subscriptions or makes ownership clearer.
