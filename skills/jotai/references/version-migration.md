# Version Migration

Use this reference when the task touches a Jotai upgrade, a removed API, a version-sensitive import, or a difference in behavior between Jotai v2 and v3.

## Establish The Target Version First

Before giving version-sensitive guidance, read the project's installed version from its lockfile or `node_modules/jotai/package.json`. Do not infer the version from documentation or from this skill. The guidance below only describes where v2 and v3 differ; everything else in this skill applies to both.

## What v3 Changes

Jotai v3 modernizes the package rather than redesigning the API. `atom`, `useAtom`, `useAtomValue`, `useSetAtom`, `Provider`, and the store API keep their signatures and behavior. Code that runs on v2 without deprecation warnings generally runs on v3 unchanged.

### Raised requirements

| | v2 | v3 |
|---|---|---|
| React | 17+ | 18+ |
| TypeScript | 3.8+ | 5.5+ |
| Node.js | 12.20+ | 22.12+ |

### Packaging

- v3 ships ESM only. The CJS, UMD, and SystemJS builds are gone. Modern bundlers and supported Node versions handle this, including `require()` from CJS code.
- Only the documented entry points are exported: `jotai`, `jotai/utils`, `jotai/vanilla`, `jotai/vanilla/utils`, `jotai/vanilla/internals`, `jotai/react`, `jotai/react/utils`. Deep imports into package internals no longer resolve.
- Published files read `process.env.NODE_ENV` directly. Bundlers define it already; a bundler-less browser setup (import maps) must define it:

```js
globalThis.process ??= { env: { NODE_ENV: 'production' } }
```

- Output targets ES2020. Transpile the dependency if the project supports older browsers.

### Removed APIs

| Removed in v3 | Replacement |
|---|---|
| `atomFamily` from `jotai/utils` | `atomFamily` from the `jotai-family` package |
| `loadable` from `jotai/utils` | `unwrap`, an explicit result atom, or `useAtomValueRaw` |
| `jotai/babel/*` (preset, `plugin-debug-label`, `plugin-react-refresh`) | the `jotai-babel` package |
| `setSelf` in the read function options | `onMount` or `jotai-effect`; there is no direct equivalent |
| `delay` option on `useAtom` / `useAtomValue` | a custom hook over `useStore` and `store.sub` |

All of these emitted deprecation warnings in late v2, so a v2 project with a clean console is already migration-ready.

### Userland `loadable`

When existing code depends on the three-state shape, keep it local instead of reintroducing a utility. Add types to match the project's atom value types:

```js
import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'

function loadable(anAtom) {
  const LOADING = { state: 'loading' }
  const unwrappedAtom = unwrap(anAtom, () => LOADING)
  return atom((get) => {
    try {
      const data = get(unwrappedAtom)
      return data === LOADING ? LOADING : { state: 'hasData', data }
    } catch (error) {
      return { state: 'hasError', error }
    }
  })
}
```

### Userland `delay`

```js
import { useEffect, useState } from 'react'
import { useStore } from 'jotai'

function useAtomValueWithDelay(anAtom, { delay }) {
  const store = useStore()
  const [value, setValue] = useState(() => store.get(anAtom))
  useEffect(() => {
    return store.sub(anAtom, () => {
      setTimeout(() => setValue(store.get(anAtom)), delay)
    })
  }, [store, anAtom, delay])
  return value
}
```

## Mount-Timing Change In `useAtomValue`

This is the one behavior change that ships without a deprecation warning.

In v2, `useAtomValue` always rerendered once right after mount, even when the value had not changed. That extra render happened to catch writes that landed between the initial render and the subscription, such as a value written by a child's `useEffect`, which runs before the parent's.

In v3 the unconditional rerender is gone; the hook compares the rendered value against the store at subscription time and rerenders only on an actual change. Reach for `useAtomValueRawSync` when a component must not miss that mount-window write.

When debugging an upgrade, suspect this change if a value appears one interaction late, or if a component that previously rendered twice on mount now renders once.

## Internals And Ecosystem Packages

`jotai/vanilla/internals` is not a stable API, and v3 reorganizes it:

- `BuildingBlocks` changed from an index-addressed tuple to an object with short string keys. Key constants are exported as `INTERNAL_KEY_*`.
- `INTERNAL_buildStoreRev3` became `INTERNAL_buildStoreRev4`.
- `Store` is now exported as a public type from `jotai` / `jotai/vanilla`: `Pick<INTERNAL_Store, 'get' | 'set' | 'sub'>`.

Any code or extension package that reads `buildingBlocks` positionally must be updated. When upgrading an app, check that its Jotai extension packages have v3-compatible releases before changing the core version.

## Upgrade Review Order

1. Confirm React, TypeScript, and Node meet the v3 minimums.
2. Run the app on the latest v2 and clear every Jotai deprecation warning first; that removes most of the v3 work.
3. Replace removed APIs with the table above, package by package.
4. Check that the build pipeline accepts an ESM-only, ES2020 dependency, and that nothing deep-imports package internals.
5. Verify extension packages and any `jotai/vanilla/internals` usage.
6. Look for mount-timing regressions in components that read atoms written during mount.
