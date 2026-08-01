# jotai-skills

The Jotai skill for the open agent skills ecosystem.

[![License](https://img.shields.io/github/license/jotaijs/jotai-skills?style=flat&colorA=000000&colorB=000000)](./LICENSE)

Use this skill with Codex, Claude Code, and other skills-compatible coding
agents when you want help writing, reviewing, refactoring, or debugging
idiomatic Jotai state code.

## Install the Skill

```sh
npx skills add jotaijs/jotai-skills
```

Install it for a specific agent:

```sh
npx skills add jotaijs/jotai-skills --agent codex
npx skills add jotaijs/jotai-skills --agent claude-code
```

Install it globally if you want the Jotai skill available across projects:

```sh
npx skills add jotaijs/jotai-skills --global
```

## Use Without Installing

Generate a prompt for the Jotai skill, or start a supported coding agent
interactively:

```sh
npx skills use jotaijs/jotai-skills
npx skills use jotaijs/jotai-skills --agent codex
npx skills use jotaijs/jotai-skills --agent claude-code
```

## Use With Your Agent

After installing, ask your coding agent to use the Jotai skill:

```text
Use $jotai to review this atom design.
```

```text
Use $jotai to refactor this React Context state into Jotai atoms.
```

```text
Use $jotai to make this component stop rerendering on unrelated atom changes.
```

For Claude Code, use the same task language after installing the skill for
`claude-code`:

```text
Use the Jotai skill to move this async fetch/update flow into idiomatic atoms.
```

## What's Inside

This repository contains a single skill:

- [SKILL.md](./SKILL.md) - the main Jotai workflow and reference router
- [references](./references) - focused guidance for atom modeling, React usage,
  async flows, performance, TypeScript, testing, utilities, extensions, tools,
  debugging, and recipes
- [agents/openai.yaml](./agents/openai.yaml) - metadata for agent UIs

## What the Skill Helps With

- Model state with primitive, derived, writable, and write-only atoms
- Choose `useAtomValue`, `useSetAtom`, or `useAtom` based on subscription needs
- Keep atom configs stable across React renders
- Design async atoms, async actions, refresh flows, and non-Suspense states
- Choose Jotai utilities and ecosystem extensions without overfitting
- Review large object/list state for unnecessary rerenders
- Type and test Jotai state behavior in TypeScript projects

## Links

- [Jotai website](https://jotai.org)
- [Jotai documentation](https://jotai.org/docs)
- [Jotai repository](https://github.com/pmndrs/jotai)
