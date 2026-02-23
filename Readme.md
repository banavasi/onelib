# Onelib

A Turbo + pnpm monorepo for building, scaffolding, and maintaining AI-ready Next.js projects with curated skills, component registries, and layout templates.

## Quick Start

```bash
# Create a new project
npx @banavasi/create-onelib my-app

# Keep skills up to date (inside a generated project)
pnpm onelib:update
```

## Monorepo Structure

```
onelib/
├── apps/
│   ├── website/          # @banavasi/website — docs site
│   └── storybook/        # @banavasi/storybook — component showcase
├── packages/
│   ├── onelib/           # @banavasi/onelib — public API, defineConfig(), types
│   ├── registry/         # @banavasi/registry — Zod schemas for components, layouts, skills
│   ├── skills/           # @banavasi/skills — curated skills list and type exports
│   ├── layouts/          # @banavasi/layouts — layout and page templates
│   ├── create-onelib/    # create-onelib — interactive CLI scaffolder
│   ├── templates/        # @banavasi/templates — base Next.js project template
│   └── config/           # @banavasi/config — shared TypeScript configs
├── tooling/
│   └── scripts/          # @banavasi/scripts — update pipeline CLI (onelib-scripts)
└── docs/
    └── plans/            # Design and implementation documents
```

## Packages

### Core

| Package | Description |
|---------|-------------|
| `@banavasi/onelib` | Public wrapper — exports `defineConfig()` and `OnelibConfig` type |
| `@banavasi/registry` | Zod schemas and utilities for components, layouts, and skills |
| `@banavasi/skills` | Curated skills list (single source of truth) and type re-exports |
| `@banavasi/layouts` | Layout and page templates |

### Tooling

| Package | Description |
|---------|-------------|
| `create-onelib` | Interactive CLI to scaffold new Onelib projects |
| `@banavasi/scripts` | Update pipeline — keeps generated projects' skills current |
| `@banavasi/config` | Shared TypeScript configs (base, library, Next.js) |
| `@banavasi/templates` | Base Next.js + Tailwind project template |

### Apps

| Package | Description |
|---------|-------------|
| `@banavasi/website` | Documentation site |
| `@banavasi/storybook` | Component showcase |

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

Generated projects also include:

```bash
pnpm onelib:update
pnpm onelib:skills:update
pnpm onelib:blueprint:apply -- --file onelib.blueprint.json
```

## Blueprint Workflow (CEO Demo)

1. Open the starter builder at `/starter` in the website app.
2. Pick theme, root layout, pages, and component IDs.
3. Copy the generated JSON to `onelib.blueprint.json` in your generated project.
4. Apply it with one command:

```bash
pnpm onelib:blueprint:apply -- --file onelib.blueprint.json
```

You can also apply during scaffold:

```bash
npx @banavasi/create-onelib my-app --blueprint ./onelib.blueprint.json
```

Full schema and examples:
- `docs/blueprint-schema.md`

### Running for a specific package

```bash
pnpm --filter @banavasi/registry test
pnpm --filter create-onelib build
pnpm --filter @banavasi/scripts test
```

## Architecture

### Dependency Graph

```
create-onelib
  ├── @banavasi/skills
  │     └── @banavasi/registry
  └── @banavasi/templates

@banavasi/scripts
  ├── @banavasi/skills
  │     └── @banavasi/registry
  └── @banavasi/onelib

@banavasi/onelib (standalone, zod)
@banavasi/registry (standalone, zod)
```

### How It Works

1. **`create-onelib`** scaffolds a new Next.js project from `@banavasi/templates`, installs curated skills, and writes `onelib.config.ts`
2. **`onelib.config.ts`** defines project settings — which skills to use (curated, custom, or both), registry components, and theme
3. **`@banavasi/scripts`** (`onelib-scripts` CLI) reads the config and keeps skills up to date via `pnpm onelib:update` or `pnpm onelib:skills:update`
4. **`@banavasi/skills`** is the single source of truth for the curated skills list, shared by both `create-onelib` and `@banavasi/scripts`

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
import { defineConfig } from "@banavasi/onelib";

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
