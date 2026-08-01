# jotai-skills

Jotai-related skills for the open agent skills ecosystem.

[![skills.sh](https://skills.sh/b/jotaijs/jotai-skills)](https://skills.sh/jotaijs/jotai-skills)
[![License](https://img.shields.io/github/license/jotaijs/jotai-skills?style=flat&colorA=000000&colorB=000000)](./LICENSE)

This repository is a collection of skills for coding agents such as Codex and
Claude Code. Each skill lives in its own directory and contains a `SKILL.md`
file with the instructions and supporting references for that skill.

## Skills

| Skill                       | Description                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------- |
| [`jotai`](./jotai/SKILL.md) | Write, review, refactor, and debug idiomatic Jotai state code for React and TypeScript. |

## Install

List available skills:

```sh
npx skills add jotaijs/jotai-skills --list
```

Install the `jotai` skill:

```sh
npx skills add jotaijs/jotai-skills --skill jotai
```

Install it for a specific agent:

```sh
npx skills add jotaijs/jotai-skills --skill jotai --agent codex
npx skills add jotaijs/jotai-skills --skill jotai --agent claude-code
```

Install it globally:

```sh
npx skills add jotaijs/jotai-skills --skill jotai --global
```

## Repository Layout

```text
jotai-skills/
├── README.md
├── LICENSE
└── jotai/
    ├── SKILL.md
    ├── agents/
    └── references/
```

## Links

- [Jotai website](https://jotai.org)
- [Jotai documentation](https://jotai.org/docs)
- [Jotai repository](https://github.com/pmndrs/jotai)
