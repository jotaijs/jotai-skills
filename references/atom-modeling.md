# Atom Modeling

Use this reference when deciding how to shape Jotai state.

## Principles

- Treat an atom config as an immutable definition, not a value container. The value lives in a store and the atom config is identified by object reference.
- Model independently changing state as independent atoms. Jotai gets much of its ergonomics from small state boundaries and automatic dependency tracking.
- Use read-only derived atoms for computed values. Keep computations close to the state graph when multiple consumers need the same result.
- Use write-only atoms as action atoms. This is often more Jotai-like than exporting one reducer-style dispatch API for everything.
- Use read/write derived atoms as adapters or lenses over private base atoms when callers should see a narrower public API.
- Hide base atoms when useful. Export a read atom plus named action atoms if that better expresses the module contract.

## Choosing an Atom Shape

Use a primitive atom when the value is directly writable:

```ts
const countAtom = atom(0)
```

Use a read-only derived atom when the value is computed:

```ts
const doubledCountAtom = atom((get) => get(countAtom) * 2)
```

Use a write-only action atom when the operation matters more than the raw setter:

```ts
const incrementCountAtom = atom(null, (_get, set) => {
  set(countAtom, (count) => count + 1)
})
```

Use a read/write atom when the exported atom should behave like a writable view:

```ts
const baseAtom = atom('hello')

export const upperTextAtom = atom(
  (get) => get(baseAtom).toUpperCase(),
  (_get, set, next: string) => set(baseAtom, next),
)
```

## Action Atoms

Prefer action atoms when:

- the update has a domain name such as `save`, `reset`, `toggle`, `move`, or `submit`;
- the update touches multiple atoms;
- the action may be imported only by some routes or components;
- the component should not read the state it writes.

Action atoms also make it easier to keep side effects and heavy work out of React render functions.

## Composing atomWith* Utilities

Use `atomWithStorage`, `atomWithReset`, `atomWithDefault`, `atomWithReducer`, and related helpers when one utility matches the whole behavior. If multiple helpers need to be combined, compose manually with a base atom and a derived atom instead of forcing incompatible helpers together.

```ts
const baseAtom = atomWithStorage('count', 0)

export const countActionAtom = atom(null, (get, set, action: 'inc' | 'dec') => {
  set(baseAtom, (count) => count + (action === 'inc' ? 1 : -1))
})
```

## Parameterized Atoms

`atomFamily` from `jotai/utils` is deprecated in the local docs and should be migrated to `jotai-family` for new or updated code. The API is intended to be drop-in, but imports change:

```ts
import { atomFamily } from 'jotai-family'
```

When reviewing existing family usage, check cache lifetime. Family caches can leak if params are unbounded; use `remove` or `setShouldRemove` when params are dynamic or user-generated.

## Smells

- One giant `appStateAtom` with many unrelated fields and broad component subscriptions.
- Derived atoms created only to mimic selector libraries when a plain derived atom would do.
- Components reaching for raw setters when named action atoms would encode business intent.
- Storing functions directly as atom definitions accidentally; wrap function values in an object.
- Exposing every implementation atom from a module when a smaller public atom API would be clearer.
