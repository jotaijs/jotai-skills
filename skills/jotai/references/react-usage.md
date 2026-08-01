# React Usage

Use this reference for components, hooks, Provider scope, hydration, and dynamic atoms.

## Hook Selection

Choose the narrowest hook for the component's job:

- `useAtomValue(atom)` when the component only reads.
- `useSetAtom(atom)` when the component only writes.
- `useAtom(atom)` when the component truly needs both value and setter/action.

This matters because `useAtom` subscribes to the atom value. A write-only component using `const [, setValue] = useAtom(valueAtom)` rerenders when `valueAtom` changes; `useSetAtom` avoids that subscription.

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
