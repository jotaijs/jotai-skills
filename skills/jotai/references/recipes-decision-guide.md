# Recipes Decision Guide

Use this reference when official recipes match a repeated pattern but are not built-in utilities. Recipes are starting points: adapt them to the project, keep atom identity stable, and prefer built-in utilities/extensions when a maintained package already solves the concern.

## Common Recipe Choices

| Need | Consider | Guidance |
|---|---|---|
| Debounced search or delayed derived work | `atomWithDebounce` recipe | Use when atom writes should settle before derived atoms or requests react. Do not confuse it with React 18 `useDeferredValue`/`useTransition`; those target rendering responsiveness rather than timer-based side effects. |
| React to atom writes without rerendering a listening component | `atomWithListeners` recipe | Useful for listeners that need `newVal` and `prevVal`. For broader reactive side effects, prefer `jotai-effect`. |
| Sync simple same-origin state across tabs/frames/workers | `atomWithBroadcast` recipe | Uses `BroadcastChannel`. It does not solve initialization replay by itself; combine with storage if initial cross-tab state matters. |
| Ignore semantically equal updates | `atomWithCompare` recipe | Use when custom equality should suppress updates. Remember Jotai still uses `Object.is`; if `Object.is(prev, next)` is true, no update is triggered regardless of custom compare. |
| Boolean toggle atom | `atomWithToggle` recipe | Good for local boolean UI state with optional forced true/false writes. For persisted toggles, see the toggle + storage recipe or `atomWithStorage`. |
| Temporary reducer behavior for a primitive atom | `useReducerAtom` recipe | Useful when reducer-style updates are local to a hook. If the reducer defines the atom's canonical update API, prefer `atomWithReducer` or named action atoms. |
| Custom hooks around select/split/focus/freeze | custom `useAtom` hook recipes | Keep selector/key/focus callbacks stable with module scope or `useCallback`. Do not hide unstable atom creation inside a hook. |
| Component-scoped atom effects | `useAtomEffect` recipe | Built on `jotai-effect`. Memoize effect functions carefully to avoid unnecessary effect atom recomputation. |

## Core-First Decision Rule

Before adapting a recipe, ask:

1. Can a primitive atom plus read-only/write-only derived atoms express this clearly?
2. Is there a maintained utility or extension for this exact concern?
3. Is the recipe small enough to own and test locally?

If the answer to the first question is yes, keep the core atom model. If the answer to the second is yes, prefer the maintained package. Use recipes when they encode project-specific behavior or glue that is too small for a dependency.

## Recipe Smells

- Copying a recipe without testing cleanup, subscription lifetime, or concurrent renders.
- Exporting private helper atoms from a recipe factory when the recipe expects them to stay internal.
- Using debounce to mask expensive render work instead of moving heavy computation out of render.
- Using listeners/effects where a write-only action atom would make the state transition explicit.
- Creating selector/focus/split atoms inside hooks without stable callbacks or memoization.
