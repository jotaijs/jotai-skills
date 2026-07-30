# Performance And Large State

Use this reference for rerender reduction, large objects, lists, and dependency graph shape.

## Keep Renders Cheap

React may call component functions multiple times during render. Keep heavy computation outside React render paths. Prefer doing expensive work in action atoms, async fetch actions, or one derived atom shared by consumers.

Avoid:

```tsx
const selector = (state: User[]) => state.filter(expensivePredicate)

function Profile() {
  const users = useAtomValue(selectAtom(usersAtom, selector))
  return <UserList users={users} />
}
```

Prefer computing once when data is fetched or updated if the result is state:

```ts
const filteredUsersAtom = atom<User[]>([])

const fetchUsersAtom = atom(null, async (_get, set) => {
  const users = await fetchUsers()
  set(filteredUsersAtom, users.filter(expensivePredicate))
})
```

## Split By Independent Updates

Jotai encourages atomic state. If `name`, `age`, and `settings` change independently and are observed by different components, separate atoms or narrower derived atoms usually beat one large object atom.

If a large object is already the right source of truth, choose the narrowest tool:

- Plain derived atom for pure computed values.
- `focusAtom` from `jotai-optics` for writable focus into nested data.
- `selectAtom` when equality control or access to the previous slice is unavoidable.
- `splitAtom` for lists that need item-level atoms.

## selectAtom Is An Escape Hatch

Prefer plain derived atoms first:

```ts
const firstNameAtom = atom((get) => get(personAtom).name.first)
```

Use `selectAtom` when you need a custom `equalityFn`, previous slice, or a subscription to a part of a large object that would otherwise rerender too often. Keep both the base atom and selector stable, especially inside React render.

## splitAtom For Lists

Use `splitAtom` when a list atom should produce one atom per item, especially for dynamic lists rendered as rows/cards. Provide a stable `keyExtractor` when item identity should survive insert, remove, or move operations.

Only use a `keyExtractor` when the key is guaranteed unique for each item.

When writing TypeScript examples for split atoms, type item components with `PrimitiveAtom<Item>` or the project's existing atom type. Do not invent conditional placeholder types.

```tsx
import type { PrimitiveAtom } from 'jotai'

type Todo = { id: string; title: string; done: boolean }

function TodoItem({ todoAtom }: { todoAtom: PrimitiveAtom<Todo> }) {
  const [todo, setTodo] = useAtom(todoAtom)
  // ...
}
```

## Dependency Graph Shape

Prefer wide graphs over deep chains. A derived atom reading a few atoms is normal. A long chain where each atom derives from the previous one can hit JavaScript call stack limits.

Avoid building list computations as a chain of atoms. Keep the list in one atom and reduce/map/filter inside one read or action. If items need independent rendering and updates, use `splitAtom` so each item derives directly from the source list.

## Performance Smells

- `useAtom` in a button component that only dispatches.
- Filtering, sorting, or deep equality work repeated inside component render.
- `selectAtom` created inline with an unstable selector.
- One object atom causing broad updates for fields that change independently.
- A chain of generated derived atoms for a collection.
