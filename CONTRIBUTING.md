# Contributing to jotai-skills

Thank you for your interest in contributing to jotai-skills! This document provides guidelines for contributing to this repository.

## Adding a New Skill

Each skill is a Markdown file in the `skills/` directory with specific structure and frontmatter.

### Skill File Structure

1. **YAML Frontmatter** - Required metadata at the top of the file:

   ```yaml
   ---
   id: unique-skill-id
   title: Skill Title
   tags: [tag1, tag2, tag3]
   level: beginner|intermediate|advanced
   updated: YYYY-MM-DD
   summary: A brief one-sentence summary of the skill
   links:
     - https://example.com/related-resource
   ---
   ```

2. **Required Sections**:
   - `## Overview` - Brief introduction to the skill
   - `## Implementation` - Detailed explanation with code examples
   - `## Use Cases` - When and why to use this pattern
   - `## Best Practices` - Tips and recommendations
   - `## Related Skills` - Links to other related skills

### Frontmatter Fields

- **id**: Unique identifier (kebab-case, e.g., `async-atoms`)
- **title**: Human-readable title
- **tags**: Array of relevant tags (e.g., `atoms`, `async`, `patterns`)
- **level**: One of `beginner`, `intermediate`, or `advanced`
- **updated**: Date in YYYY-MM-DD format
- **summary**: One-line description (under 150 characters)
- **links**: Optional array of related resource URLs

### Validation

Before submitting, run the validation script:

```bash
pnpm validate
```

This will:

- Validate YAML frontmatter schema
- Check for required sections
- Ensure unique IDs across all skills
- Generate the `skills/index.json` file

## Development Workflow

1. Fork the repository
2. Create a new branch for your skill/changes
3. Add or modify skill files in `skills/`
4. Run `pnpm validate` to check your changes
5. Run `pnpm format` to format your code
6. Run `pnpm lint` to check for issues
7. Commit your changes with a clear message
8. Submit a pull request

## Code Style

- Follow the existing code style
- Use Prettier for formatting (automatic via `pnpm format`)
- Follow ESLint rules (check with `pnpm lint`)
- Use TypeScript for scripts

## Pull Request Guidelines

- Keep PRs focused on a single skill or improvement
- Provide a clear description of what the skill covers
- Ensure all validation checks pass
- Update documentation if needed

## Questions?

If you have questions or need help, feel free to open an issue for discussion.

Thank you for contributing!
