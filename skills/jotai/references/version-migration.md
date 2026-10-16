# Version Migration

Use this reference when the task touches a Jotai upgrade, a removed API, a version-sensitive import, or a difference in behavior between Jotai v2 and v3.

## Establish The Target Version First

Before giving version-sensitive guidance, read the project's installed version from its lockfile or `node_modules/jotai/package.json`. Do not infer the version from documentation or from this skill. The guidance below only describes where v2 and v3 differ; everything else in this skill applies to both.

## What v3 Changes

Jotai v3 modernizes the package rather than redesigning the API. `atom`, `useAtom`, `useAtomValue`, `useSetAtom`, `Provider`, and the store API keep their signatures and behavior for the vast majority of use cases. Code that runs on v2 without deprecation warnings often runs on v3 unchanged, but warnings are not an exhaustive migration check.

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
| `loadable` from `jotai/utils` | `unwrap` or an explicit result atom; v3 raw hooks only when the caller manages promises |
| `jotai/babel/*` (preset, `plugin-debug-label`, `plugin-react-refresh`) | the `jotai-babel` package |
| `setSelf` in the read function options | `onMount` or `jotai-effect`; there is no direct equivalent |
| `delay` option on `useAtom` / `useAtomValue` | a custom delayed-subscription hook when timing is required; otherwise ordinary async handling |

These APIs emitted deprecation warnings in late v2 when the relevant path executed. Accessing the read function's `setSelf` option warns even before calling it. A clean console does not prove that a project is migration-ready: warnings may be disabled in production, and unexecuted paths or build configuration can still reference removed APIs. Search source, imports, and build configuration for every removed surface in the table.

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

First determine whether the old option was used to delay UI updates or avoid brief Suspense fallbacks. For ordinary loading state, prefer Suspense or `unwrap`; debouncing requests is a separate concern.

If delayed subscription notifications are required, implement a project-local hook using the matching `useStore` instance and `store.sub`. Handle the initial render-to-subscription gap, refresh the snapshot when the atom or store changes, and cancel pending timers on cleanup so an old subscription cannot overwrite the current value. Decide whether notifications should be delayed individually or debounced. Reading a promise through `store.get` does not preserve `useAtomValue`'s Suspense/error handling automatically; consume it explicitly or restrict the helper to synchronous values. Test atom/store switches and disposal as well as the delay itself.

## Post-Mount Rendering And The v3.0.0 Gap

Jotai v3 removes the unconditional rerender that v2 scheduled immediately after mount, even when the atom value had not changed.

In v3.0.0, removing that extra render introduced a gap: a write that landed between the initial render and the effect subscription, such as a value written by a child's `useEffect`, could remain unobserved until the next change.

Jotai v3.0.1 fixes the gap. `useAtomValue` subscribes first, compares the value captured during render with the current store value, and rerenders when they differ. It therefore observes mount-window writes without restoring v2's unconditional rerender.

When a project on exactly v3.0.0 shows a value one interaction late, upgrade to v3.0.1 or newer. Do not switch to `useAtomValueRawSync` only to work around this fixed regression; use that hook when synchronous `useSyncExternalStore` semantics and no tearing are actual requirements.

## Internals And Ecosystem Packages

`jotai/vanilla/internals` is not a stable API, and v3 reorganizes it:

- `BuildingBlocks` changed from an index-addressed tuple to an object with short string keys. Key constants are exported as `INTERNAL_KEY_*`.
- `INTERNAL_buildStoreRev3` became `INTERNAL_buildStoreRev4`.
- `Store` is now exported as a public type from `jotai` / `jotai/vanilla`: `Pick<INTERNAL_Store, 'get' | 'set' | 'sub'>`.

Any code or extension package that reads `buildingBlocks` positionally must be updated. When upgrading an app, check that its Jotai extension packages have v3-compatible releases before changing the core version.

## Upgrade Review Order

1. Confirm React, TypeScript, and Node meet the v3 minimums.
2. Run the app on the latest v2 and clear every Jotai deprecation warning first; that removes most of the v3 work but is not exhaustive.
3. Search source, imports, and build configuration for every removed API in the table, then replace each occurrence package by package.
4. Check that the build pipeline accepts an ESM-only, ES2020 dependency, and that nothing deep-imports package internals.
5. Verify extension packages and any `jotai/vanilla/internals` usage.
6. If the target is exactly v3.0.0, look for mount-timing regressions in components that read atoms written during mount and upgrade to v3.0.1 or newer.
