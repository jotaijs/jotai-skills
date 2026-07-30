# Utilities Decision Guide

Use this reference when deciding whether a Jotai utility should be used instead of plain atoms.

## Default Rule

Start with core atoms: primitive atoms, read-only derived atoms, read/write adapter atoms, and write-only action atoms. Reach for utilities when they encode a recurring state concern more clearly than hand-written atom composition.

## Core Utilities To Know

| Need | Prefer | Notes |
|---|---|---|
| Persist state to localStorage, sessionStorage, or React Native AsyncStorage | `atomWithStorage` | Use unique storage keys. For SSR, guard browser storage and consider client-only rendering for markup that depends on stored values. Validate parsed JSON for production data. |
| Hydrate initial values from SSR, tests, or stories | `useHydrateAtoms` | It is a client-side hook. Hydration happens once per store; avoid `dangerouslyForceHydrate` unless there is a narrow reason. |
| Reset state to an initial value | `atomWithReset`, `RESET`, `useResetAtom` | Good for forms, filters, temporary UI state, and reset buttons. |
| Default value derived from other atoms but later overwritable | `atomWithDefault` | After overwrite, dependencies no longer drive updates until reset. This behavior should be intentional. |
| Force refresh of derived/async data | `atomWithRefresh` or a named refresh action atom | Useful for pull-to-refresh and manual refetch flows. If the data is server state with cache needs, consider a Query extension first. |
| Expensive or unavailable initial value | `atomWithLazy` | Initializes on first use in each store, then behaves like a primitive atom. |
| Avoid Suspense for async atom state | `unwrap` or an explicit result atom | Use `unwrap` for a synchronous pending/previous-value fallback. Convert rejection into a result union when the component must render errors itself; otherwise errors still reach an error boundary. |
| Convert observable source to atom | async utilities / observable support | Use when the source already has observable semantics. Keep subscription lifetime clear. |
| Atom read/write from an imperative callback | `useAtomCallback` | Use for event/callback integration that needs `get`/`set`. Avoid replacing normal hooks or action atoms with callback plumbing. |
| Reducer mental model for one atom | `atomWithReducer` | Useful when a reducer already expresses the state transition well. For domain commands, write-only action atoms are often more Jotai-like and easier to code-split. |
| Parameterized atom cache | `jotai-family` | `atomFamily` from `jotai/utils` is deprecated in local docs. Manage cache lifetime with removal policies when params are unbounded. |

## Select And Split

Prefer plain derived atoms first. Use `selectAtom` only when equality control or previous-slice access is needed. Keep the base atom and selector stable.

Use `splitAtom` for arrays where each item should have its own atom, especially dynamic lists, rows, or cards. Provide a stable `keyExtractor` when item identity should survive index shifts.

## SSR And Persistence Pitfalls

- Browser storage is unavailable on the server. Guard custom storage getters with `typeof window !== 'undefined'`.
- Server markup based on stored values can mismatch if the stored value differs from the initial value. Prefer client-only rendering for those UI fragments.
- AsyncStorage makes the atom value async; updater functions may need to await the current value.

## Smells

- Using `selectAtom` as the default selector pattern instead of modeling derived atoms.
- Using `atomWithReducer` to recreate a Redux-style global dispatch for unrelated actions.
- Persisting sensitive or server-owned state with `atomWithStorage`.
- Hydrating the same atom repeatedly and expecting prop changes to keep updating it.
