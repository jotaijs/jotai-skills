# Extensions Decision Guide

Use this reference when a task touches server state, nested state, side effects, external stores, URLs, or a framework-specific data layer.

## Default Rule

Keep the core atom model first. Use extensions when they match an existing domain abstraction or avoid fragile custom code. Do not add an extension only to make simple atom composition look fancier.

## High-Value Extensions

| Need | Consider | Why |
|---|---|---|
| Server-state fetching, caching, invalidation, mutations, infinite queries | `jotai-tanstack-query` | Prefer this over hand-rolled async atoms when cache/sync/invalidation semantics matter. It can be adopted incrementally with an existing QueryClient. |
| Writable focus into nested objects | `jotai-optics` / `focusAtom` | Use when a nested part needs a readable and writable atom. For read-only slices, plain derived atoms or `selectAtom` may be enough. |
| Complex immutable updates | `jotai-immer` | Use when spread updates obscure intent. Keep simple updates as plain functional setters. |
| Reactive side effects tied to atom changes | `jotai-effect` | Use `observe` for store-level effects, `atomEffect` for mounted effects, and `withAtomEffect` to bind an effect to an atom clone. Keep dependencies explicit. |
| URL, hash, query parameter, or browser location sync | `jotai-location` | Prefer this over ad hoc `window.location` reads/writes. Consider SSR/browser boundaries. |
| Reusing the same atoms in isolated subtrees while reading parent store atoms | `jotai-scope` | Use when `Provider` isolation alone is not enough. For libraries, consider context isolation to avoid collisions with app Jotai usage. |
| Async response caching beyond current atom values | `jotai-cache` | Jotai stores current atom values, not historical responses. Use cache only when older async results must be retained. |
| Finite state machine semantics | `jotai-xstate` | Use when states/transitions are explicit and safety matters. Avoid for ordinary local state where atoms/actions are clearer. |

## Stack-Specific Extensions

Use these only when the project already uses or intentionally adopts the underlying stack:

- `jotai-trpc` for tRPC routers and T3-style type-safe RPC.
- `jotai-urql` for URQL GraphQL clients.
- `jotai-relay` for Relay applications.

## External Store Bridges

Use these for interoperability or migration, not as the default Jotai architecture:

- `jotai-redux` when existing Redux store state must be synchronized with atoms.
- `jotai-valtio` when Valtio proxy state must be exposed as atoms.
- `jotai-zustand` when vanilla Zustand store state must be exposed as atoms.

When designing new state from scratch, prefer native Jotai atoms unless the external store is already a project constraint.

## Choosing Server State Strategy

- Simple one-off async value with Suspense: async read atom can be enough.
- User-triggered command that writes local state after a request: async write atom can be enough.
- Cached server state, stale times, invalidation, mutations, pagination, or shared QueryClient: prefer `jotai-tanstack-query`.
- GraphQL/RPC project standard: choose the matching extension if the stack is already in use.

## Smells

- Reimplementing TanStack Query cache and invalidation with many ad hoc async atoms.
- Adding Immer for a single shallow property update.
- Using external-store bridges for greenfield state that could be plain Jotai.
- Running effects from atom reads when a write atom, `onMount`, or effect extension would make lifecycle clearer.
