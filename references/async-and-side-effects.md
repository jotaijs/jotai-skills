# Async And Side Effects

Use this reference for fetches, Suspense, async writes, refresh flows, and external systems.

## Async Reads

An async read atom starts work when its value is read. Treat it like a smart getter in the atom graph.

```ts
const userIdAtom = atom(1)

const userAtom = atom(async (get, { signal }) => {
  const id = get(userIdAtom)
  const response = await fetch(`/api/users/${id}`, { signal })
  return response.json()
})
```

Async read atoms suspend by default. Ensure the reading subtree is inside `Suspense`. If a `Provider` is present, place at least one `Suspense` inside that Provider.

Use the `signal` argument for abortable work so stale async reads can be canceled before the next calculation starts.

## Async Writes

An async write atom starts work when the setter/action is called. Treat it like a command.

```ts
const saveUserAtom = atom(null, async (get, set) => {
  const user = get(draftUserAtom)
  const saved = await saveUser(user)
  set(userAtom, saved)
})
```

Use async writes for submits, saves, imports, and other event-driven work. This keeps React render functions cheap and keeps state transitions named.

## Reading Async Values From Other Atoms

If a derived atom reads an async atom, make the derived read async and `await get(...)`.

```ts
const upperNameAtom = atom(async (get) => {
  const user = await get(userAtom)
  return user.name.toUpperCase()
})
```

The same rule applies inside async write functions if they need async atom values.

## Avoiding Suspense

Use `loadable` from `jotai/utils` when the UI should render explicit loading/error/value states instead of suspending.

Choose Suspense when boundary-level loading is natural. Choose `loadable` when the component must stay mounted and branch on state.

## Refresh and Reset

Use refresh-style atoms or action atoms when a user event should re-run async reads. Use reset utilities when the state has a meaningful default and consumers should be able to return to it.

## External Side Effects

Keep external synchronization explicit. `atomWithStorage` is appropriate for localStorage-style persistence, but remember that external singleton values can be inconsistent across multiple Providers unless the external source has a subscription mechanism.

Prefer write atoms, `onMount`, or dedicated effect utilities for side effects. Avoid hidden side effects in read atoms unless the read is explicitly modeling async data fetching.
