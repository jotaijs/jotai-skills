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

## TanStack Query Setup Details

When a project already uses TanStack Query hooks and `atomWithQuery`/`atomWithMutation`, make sure Jotai and React Query reference the same `QueryClient`.

Use one of these approaches:

- Wrap the app with both `QueryClientProvider` and Jotai `Provider`, then hydrate `queryClientAtom` with the same `queryClient` passed to `QueryClientProvider`.
- Pass a `getQueryClient` function to the query atom if that better matches the local architecture.

Without this, invalidation or cache updates through `useQueryClient()` can miss query atoms and leave stale data. In TypeScript examples, prefer passing hydration values as a `Map` when it avoids tuple inference issues.

For Next.js and SSR, keep request isolation in mind: use an explicit Jotai `Provider` for the client subtree and follow TanStack Query's SSR hydration or `initialData` patterns for server data. Treat `unwrap` as a core async-atom helper, not the primary tool for Query atoms that already expose loading/error/fetching states.

## Location Setup Details

Use `jotai-location` when URL state is part of the atom graph.

- Use `atomWithLocation` for pathname/search/location-shaped synchronization. Instantiate it once per app; multiple instances can drift.
- Use `atomWithHash` for hash-based `URLSearchParams` state. It is DOM-only and supports custom serialize/deserialize.
- Use `replace` / `replaceState` style options when typing or filter changes should not push a new history entry for every keystroke.
- Derive query-parameter-specific atoms from one location atom instead of scattering many independent location atoms.
- Guard browser-only assumptions in SSR frameworks.

## Smells

- Reimplementing TanStack Query cache and invalidation with many ad hoc async atoms.
- Adding Immer for a single shallow property update.
- Using external-store bridges for greenfield state that could be plain Jotai.
- Running effects from atom reads when a write atom, `onMount`, or effect extension would make lifecycle clearer.
