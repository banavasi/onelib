# Onelib

A Turbo + pnpm monorepo for building, scaffolding, and maintaining AI-ready Next.js projects with curated skills, component registries, and layout templates.

## Quick Start

```bash
# Create a new project
npx create-onelib my-app

# Keep skills up to date (inside a generated project)
pnpm onelib:update
```

## Monorepo Structure

```
onelib/
├── apps/
│   ├── website/          # @onelib/website — docs site (coming soon)
│   └── storybook/        # @onelib/storybook — component showcase (coming soon)
├── packages/
│   ├── onelib/           # onelib — public API, defineConfig(), types
│   ├── registry/         # @onelib/registry — Zod schemas for components, layouts, skills
│   ├── skills/           # @onelib/skills — curated skills list and type exports
│   ├── layouts/          # @onelib/layouts — layout and page templates
│   ├── create-onelib/    # create-onelib — interactive CLI scaffolder
│   ├── templates/        # @onelib/templates — base Next.js project template
│   └── config/           # @onelib/config — shared TypeScript configs
├── tooling/
│   └── scripts/          # @onelib/scripts — update pipeline CLI (onelib-scripts)
└── docs/
    └── plans/            # Design and implementation documents
```

## Packages

### Core

| Package | Description |
|---------|-------------|
| `onelib` | Public wrapper — exports `defineConfig()` and `OnelibConfig` type |
| `@onelib/registry` | Zod schemas and utilities for components, layouts, and skills |
| `@onelib/skills` | Curated skills list (single source of truth) and type re-exports |
| `@onelib/layouts` | Layout and page templates |

### Tooling

| Package | Description |
|---------|-------------|
| `create-onelib` | Interactive CLI to scaffold new Onelib projects |
| `@onelib/scripts` | Update pipeline — keeps generated projects' skills current |
| `@onelib/config` | Shared TypeScript configs (base, library, Next.js) |
| `@onelib/templates` | Base Next.js + Tailwind project template |

### Apps

| Package | Description |
|---------|-------------|
| `@onelib/website` | Documentation site (coming soon) |
| `@onelib/storybook` | Component showcase (coming soon) |

## Development

### Prerequisites

- Node.js >= 20 (24 recommended)
- pnpm 10.x

### Setup

```bash
pnpm install
```

### Commands

```bash
pnpm build        # Build all packages
pnpm test         # Run all tests
pnpm check        # Biome lint + format check
pnpm check:fix    # Biome auto-fix
pnpm check-types  # TypeScript type checking
pnpm dev          # Start dev mode (watch)
pnpm clean        # Remove dist, node_modules, .turbo
```

### Running for a specific package

```bash
pnpm --filter @onelib/registry test
pnpm --filter create-onelib build
pnpm --filter @onelib/scripts test
```

## Architecture

### Dependency Graph

```
create-onelib
  ├── @onelib/skills
  │     └── @onelib/registry
  └── @onelib/templates

@onelib/scripts
  ├── @onelib/skills
  │     └── @onelib/registry
  └── onelib

onelib (standalone, zod)
@onelib/registry (standalone, zod)
```

### How It Works

1. **`create-onelib`** scaffolds a new Next.js project from `@onelib/templates`, installs curated skills, and writes `onelib.config.ts`
2. **`onelib.config.ts`** defines project settings — which skills to use (curated, custom, or both), registry components, and theme
3. **`@onelib/scripts`** (`onelib-scripts` CLI) reads the config and keeps skills up to date via `pnpm onelib:update` or `pnpm onelib:skills:update`
4. **`@onelib/skills`** is the single source of truth for the curated skills list, shared by both `create-onelib` and `@onelib/scripts`

### Generated Project

A scaffolded project includes:

```json
{
  "scripts": {
    "onelib:update": "onelib-scripts update",
    "onelib:skills:update": "onelib-scripts skills:update"
  }
}
```

The `onelib.config.ts` file controls behavior:

```ts
import { defineConfig } from "onelib";

export default defineConfig({
  name: "my-app",
  registry: { components: [], layouts: [] },
  skills: { curated: true, custom: [] },
  theme: { preset: "default" },
});
```

## Tech Stack

- **Monorepo**: [Turborepo](https://turbo.build/repo) + [pnpm](https://pnpm.io/) workspaces
- **Language**: TypeScript 5.9 (strict mode, `noUncheckedIndexedAccess`)
- **Linting/Formatting**: [Biome 2.x](https://biomejs.dev/) — tabs, double quotes, semicolons, 100 char width
- **Testing**: [Vitest 4.x](https://vitest.dev/)
- **Validation**: [Zod 4.x](https://zod.dev/)
- **Generated projects**: Next.js 15 + Tailwind CSS 4 + React 19

## License

Private
