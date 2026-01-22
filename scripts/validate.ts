#!/usr/bin/env tsx

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'
import * as yaml from 'js-yaml'

interface SkillFrontmatter {
  id: string
  title: string
  tags: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  updated: string
  summary: string
  links?: string[]
}

interface SkillIndex {
  id: string
  title: string
  tags: string[]
  level: string
  updated: string
  summary: string
  links?: string[]
  filename: string
}

const REQUIRED_SECTIONS = [
  '## Overview',
  '## Implementation',
  '## Use Cases',
  '## Best Practices',
  '## Related Skills',
]

const SKILLS_DIR = join(process.cwd(), 'skills')
const INDEX_FILE = join(SKILLS_DIR, 'index.json')

function extractFrontmatter(content: string): {
  frontmatter: SkillFrontmatter
  body: string
} {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    throw new Error('No frontmatter found')
  }

  const frontmatter = yaml.load(match[1]) as SkillFrontmatter
  const body = match[2]

  return { frontmatter, body }
}

function validateFrontmatter(frontmatter: SkillFrontmatter, filename: string) {
  const errors: string[] = []

  // Check required fields
  if (!frontmatter.id) errors.push('Missing required field: id')
  if (!frontmatter.title) errors.push('Missing required field: title')
  if (!frontmatter.tags || !Array.isArray(frontmatter.tags)) {
    errors.push('Missing or invalid field: tags (must be an array)')
  }
  if (!['beginner', 'intermediate', 'advanced'].includes(frontmatter.level)) {
    errors.push(
      'Invalid level: must be one of beginner, intermediate, or advanced'
    )
  }
  if (!frontmatter.updated) {
    errors.push('Missing required field: updated')
  } else {
    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(frontmatter.updated)) {
      errors.push('Invalid date format: updated must be YYYY-MM-DD')
    }
  }
  if (!frontmatter.summary) errors.push('Missing required field: summary')
  if (frontmatter.summary && frontmatter.summary.length > 150) {
    errors.push('Summary must be 150 characters or less')
  }

  // Check links format if present
  if (frontmatter.links && !Array.isArray(frontmatter.links)) {
    errors.push('Invalid field: links (must be an array)')
  }

  if (errors.length > 0) {
    throw new Error(
      `Validation errors in ${filename}:\n${errors.map((e) => `  - ${e}`).join('\n')}`
    )
  }
}

function validateSections(body: string, filename: string) {
  const errors: string[] = []

  for (const section of REQUIRED_SECTIONS) {
    if (!body.includes(section)) {
      errors.push(`Missing required section: ${section}`)
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Section errors in ${filename}:\n${errors.map((e) => `  - ${e}`).join('\n')}`
    )
  }
}

function main() {
  console.log('🔍 Validating skills...\n')

  // Get all markdown files in skills directory
  let files: string[]
  try {
    files = readdirSync(SKILLS_DIR).filter(
      (f) => f.endsWith('.md') && f !== 'README.md'
    )
  } catch (error) {
    console.error(`❌ Error reading skills directory: ${error}`)
    process.exit(1)
  }

  if (files.length === 0) {
    console.warn('⚠️  No skill files found in skills/ directory')
    process.exit(0)
  }

  const skills: SkillIndex[] = []
  const ids = new Set<string>()
  let hasErrors = false

  for (const file of files) {
    const filepath = join(SKILLS_DIR, file)
    console.log(`Validating ${file}...`)

    try {
      const content = readFileSync(filepath, 'utf-8')
      const { frontmatter, body } = extractFrontmatter(content)

      // Validate frontmatter
      validateFrontmatter(frontmatter, file)

      // Check for duplicate IDs
      if (ids.has(frontmatter.id)) {
        throw new Error(`Duplicate ID found: ${frontmatter.id}`)
      }
      ids.add(frontmatter.id)

      // Validate required sections
      validateSections(body, file)

      // Add to index
      skills.push({
        ...frontmatter,
        filename: file,
      })

      console.log(`  ✅ Valid\n`)
    } catch (error) {
      console.error(`  ❌ Error: ${error}\n`)
      hasErrors = true
    }
  }

  if (hasErrors) {
    console.error('❌ Validation failed with errors')
    process.exit(1)
  }

  // Sort skills by updated date (newest first)
  skills.sort((a, b) => b.updated.localeCompare(a.updated))

  // Write index file
  writeFileSync(INDEX_FILE, JSON.stringify(skills, null, 2))
  console.log(`✅ Generated ${INDEX_FILE}`)
  console.log(`✅ Validated ${skills.length} skill(s) successfully!`)
}

main()
