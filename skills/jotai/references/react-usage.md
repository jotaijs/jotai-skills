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

- `useAtomValueRaw(atom)` returns an async atom's promise as-is and never suspends. Use it when a component must stay mounted and branch on the promise itself instead of relying on a Suspense boundary.
- `useAtomValueRawSync(atom)` has the same signature but is built on `useSyncExternalStore`. It avoids tearing and picks up values written during mount, at the cost of always rendering updates synchronously without concurrent-rendering benefits.

`useAtomValue` is `useAtomValueRaw` plus React's `use()`, so suspending behavior is unchanged from v2. Both raw hooks only exist on v3, so confirm the installed version before suggesting them; a v2 project needs `unwrap` or a result atom instead.

## Mount-Window Writes

In v3, `useAtomValue` no longer forces an extra rerender right after mount; it rerenders only when the value actually changed. A write that lands between the initial render and the subscription, typically from a child's `useEffect`, can therefore be missed until the next change.

Prefer fixing the ownership: move that initialization into the atom itself (`atomWithDefault`, `atomWithLazy`, `onMount`) or into `useHydrateAtoms`, so no component depends on effect ordering. When the write genuinely has to happen on mount, read it with `useAtomValueRawSync`.

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

Use store APIs for code outside React only when the work truly lives outside the component tree. Keep UI code on hooks.

## Hydration

Use `useHydrateAtoms` for initial values in tests, SSR, or story-style setups. Put hydration under the `Provider` whose store should receive the values.

## Component Boundaries

Keep components that observe frequently changing atoms small. Splitting a `Profile` component into `Name` and `Age` readers is often better than having one component subscribe to both atoms if they update independently.

Do not move every line of UI into a new component just for style. Split when it narrows subscriptions or makes ownership clearer.
