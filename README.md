# jotai-skills

A curated set of Jotai best practices, techniques, and "skills" for LLM tooling (skills.sh / MCP) and humans.

## Overview

This repository contains a collection of Jotai skills - practical guides, patterns, and best practices for working with Jotai state management. Each skill is a focused tutorial on a specific concept or technique.

## Structure

- `skills/` - Markdown files for each skill with YAML frontmatter
- `skills/index.json` - Auto-generated index of all skills
- `scripts/validate.ts` - Validation and index generation script

## Usage

Browse the skills in the `skills/` directory or use the generated `skills/index.json` for programmatic access.

## Development

This repository uses pnpm for package management.

### Prerequisites

- Node.js 18+
- pnpm 9+

### Setup

```bash
pnpm install
```

### Scripts

- `pnpm validate` - Validate skill files and generate index.json
- `pnpm lint` - Lint TypeScript files
- `pnpm lint:fix` - Lint and fix issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm typecheck` - Type check TypeScript files

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on adding new skills or improving existing ones.

## Code of Conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

MIT © Jotai Universe
