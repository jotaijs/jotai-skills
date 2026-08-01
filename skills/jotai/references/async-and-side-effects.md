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
const savedUserAtom = atom<User | null>(null)

const saveUserAtom = atom(null, async (get, set) => {
  const user = get(draftUserAtom)
  const saved = await saveUser(user)
  set(savedUserAtom, saved)
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

Use `unwrap` from `jotai/utils` when an async atom needs a synchronous pending or previous-value fallback. `unwrap` still throws rejected errors, so let an error boundary handle them or convert success and failure into an explicit result union before unwrapping.

```ts
import { unwrap } from 'jotai/utils'

const userResultAtom = atom(async (get) => {
  try {
    return { state: 'hasData' as const, data: await get(userAtom) }
  } catch (error) {
    return { state: 'hasError' as const, error }
  }
})

const userStateAtom = unwrap(userResultAtom, (previous) =>
  previous?.state === 'hasData'
    ? { state: 'loading' as const, previous: previous.data }
    : { state: 'loading' as const },
)
```

Choose Suspense when boundary-level loading is natural. Choose `unwrap` or an explicit result atom when the component must stay mounted and branch on pending, previous-data, error, and value states. Do not introduce the deprecated `loadable` utility in new or updated code.

## Refresh and Reset

Use refresh-style atoms or action atoms when a user event should re-run async reads. Use reset utilities when the state has a meaningful default and consumers should be able to return to it.

## External Side Effects

Keep external synchronization explicit. `atomWithStorage` is appropriate for localStorage-style persistence, but remember that external singleton values can be inconsistent across multiple Providers unless the external source has a subscription mechanism.

Prefer write atoms, `onMount`, or dedicated effect utilities for side effects. Avoid hidden side effects in read atoms unless the read is explicitly modeling async data fetching.
