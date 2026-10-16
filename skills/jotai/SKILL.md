---
name: jotai
description: Build, review, and debug Jotai state in React or vanilla TypeScript. Use for atom modeling, async state, store isolation and hydration, subscription performance, Jotai utilities and extensions, or v2-to-v3 migration.
---

# Jotai

## Overview

Use Jotai v3 as the baseline for new code. For existing projects, inspect the installed Jotai and extension versions before giving version-sensitive advice. Preserve the requested behavior, architecture, and dependency choices; use refactoring guidance only where it serves the task.

## Workflow

- Identify state ownership, the store used by each reader and writer, atom identity, async behavior, and relevant tests before changing code.
- Choose the smallest change that satisfies the request. Derive computed values, separate independently updated state when useful, and use named action atoms when commands benefit from a shared update path.
- Verify the behavior at the appropriate level: vanilla store tests for state logic and isolation, component tests for subscriptions and user interactions. Match the existing test setup when practical.

## Core Invariants

- Atom configs identify state by reference; values belong to a store. Keep atom configs stable across renders and use the same store for all participants in a state flow.
- Replace object and array values immutably. Jotai uses `Object.is` to detect value changes; mutating a value and setting the same reference can suppress updates.
- Read-function `get` tracks dependencies; write-function `get` reads without establishing a reactive subscription. Keep reads free of unrelated side effects.
- Use `useAtomValue` for reads, `useSetAtom` for writes, and `useAtom` for both. Use vanilla `get`/`set`/`sub` for imperative integrations; a read alone does not mount an atom.
- Keep initialization and subscription lifetimes explicit. `onMount` follows atom subscriptions, not module loading or setter calls. Isolate request-owned state on the server.
- Prefer plain atom composition before utilities. Add utilities or extensions when they encode the required semantics more clearly, checking compatibility with the installed major version.

## Reference Routing

Read only the files that match the task:

- `references/atom-modeling.md` for deciding atom boundaries, derived atoms, action atoms, writable adapters, resets, storage, and family-style parameterized atoms.
- `references/react-usage.md` for hook selection, Provider/store scope, vanilla integrations, SSR, hydration, dynamic atom creation, and component architecture.
- `references/async-and-side-effects.md` for Suspense, async reads, async actions, abort signals, non-Suspense states, refresh flows, and external side effects.
- `references/performance-and-large-state.md` for render tuning, `selectAtom`, `focusAtom`, `splitAtom`, large objects, lists, and dependency graph depth.
- `references/typescript-and-testing.md` for TypeScript inference, writable atom argument types, `ExtractAtomValue`, and testing strategy.
- `references/utilities-decision-guide.md` for choosing built-in utilities such as storage, SSR hydration, resettable/default atoms, lazy atoms, callbacks, reducers, select, split, and family migration.
- `references/extensions-decision-guide.md` for choosing extension packages such as TanStack Query, optics, Immer, effects, location, scope, cache, XState, GraphQL/RPC, and external-store bridges.
- `references/tools-and-debugging.md` for choosing Devtools, Babel, SWC, and Rolldown support for debugging, labels, React Refresh, and bundler integration.
- `references/recipes-decision-guide.md` for deciding when to use or adapt official recipes such as debounce, listeners, broadcast, compare, toggle, custom hooks, reducer hooks, and atom effects.
- `references/version-migration.md` for migrating from v2 to v3: raised React/TypeScript/Node requirements, ESM-only packaging, removed APIs and their replacements, and changes to `jotai/vanilla/internals`.

## Compatibility And Source Verification

This revision was written against Jotai 3.0.1, and covers Jotai 2.20.x where the two differ. Before giving version-sensitive API guidance, determine the target project's installed Jotai and extension-package versions, then inspect their exported types, source, or matching documentation and tests. Do not assume current documentation matches the installed version.
