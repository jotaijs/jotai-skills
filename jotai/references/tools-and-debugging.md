# Tools And Debugging

Use this reference when a task involves Jotai debug visibility, React Refresh behavior, labels, snapshots, or bundler integration.

## Devtools

Use `jotai-devtools` when developers need to inspect atom values, snapshots, or atom graph behavior during development. Treat it as a non-production debugging aid.

Prefer Devtools when:

- state changes are correct in code but hard to trace in the UI;
- atom graphs are growing and ownership is unclear;
- debugging would benefit from snapshots or visible atom labels.

Add useful `debugLabel`s for important atoms. Labels do not need to be globally unique, but they should be distinguishable.

## React Refresh And Labels

Use toolchain plugins when development refresh behavior or debug labels matter.

| Toolchain | Consider | Notes |
|---|---|---|
| Babel | `jotai-babel` | The old `jotai/babel` bundle is deprecated and should be replaced with `jotai-babel`. |
| SWC / Next.js-style SWC pipeline | `@swc-jotai/react-refresh` and related SWC plugins | Local docs mark SWC plugins experimental. Mention that issues belong to the separate plugin repo. |
| Rolldown / compatible Vite-like setup | `jotai-rolldown` | Experimental. Useful for React Refresh and devtools support in that toolchain. |

## When Not To Add Tools

- Do not add build plugins just to fix state architecture. First check atom boundaries, hook selection, and stable atom references.
- Do not require Devtools for production behavior.
- Do not add multiple toolchain integrations; choose the one matching the existing project compiler/bundler.

## Debugging Checklist

1. Check atom identity: atoms created in render must be stable.
2. Check subscriptions: use `useAtomValue` and `useSetAtom` where possible.
3. Check dependency graph: prefer wide graphs and avoid long derived chains.
4. Check async behavior: Suspense boundary, `unwrap` or an explicit result atom, abort signal, or Query extension as appropriate.
5. Add `debugLabel`s or Devtools when visual inspection would shorten diagnosis.
