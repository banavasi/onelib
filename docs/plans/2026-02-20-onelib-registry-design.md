# @onelib/registry Design
**Date:** 2026-02-20
**Status:** Approved
**Package:** `packages/registry/`

## 1) Purpose

The registry is the **source of truth** for the Onelib ecosystem. It defines what components, layouts, and skills exist, their metadata, versions, and dependencies. Every other package depends on it:

- **create-onelib CLI** reads the registry to know what to scaffold
- **Update commands** compare local vs registry versions to determine what changed
- **pnpm scaffold** writes new entries to the registry when adding components/layouts
- **Generated projects** use registry data to resolve dependencies during updates

## 2) Validation Approach

**Zod schemas** — runtime validation + TypeScript type inference from a single source. Zod is lightweight (~13KB), has zero dependencies, and prevents types and validators from drifting apart.

## 3) Schema Design

### Common (shared enums)

```ts
Source = "shadcn" | "magicui" | "aceternity" | "onelib" | "custom"
ComponentCategory = "ui" | "layout" | "data-display" | "feedback" | "navigation" | "overlay" | "form"
LayoutCategory = "marketing" | "dashboard" | "auth" | "blog" | "e-commerce" | "portfolio" | "docs"
SkillCategory = "coding" | "testing" | "debugging" | "architecture" | "workflow" | "tooling"
SkillSource = "supabase" | "claude" | "codex" | "onelib" | "custom"
```

### Component

| Field | Type | Description |
|-------|------|-------------|
| name | string | Unique slug: `"hero-section"` |
| displayName | string | Human-readable: `"Hero Section"` |
| description | string | What this component does |
| version | string (semver) | Component version |
| source | Source | Origin registry |
| category | ComponentCategory | Grouping for discovery |
| dependencies | string[] | Other registry item names this depends on |
| files | string[] | Relative paths in the template/project |
| devOnly | boolean | Only available in development (default: false) |
| tags | string[] | For search/discovery |

### Layout

Same base fields as Component, plus:

| Field | Type | Description |
|-------|------|-------------|
| category | LayoutCategory | Layout-specific categories |
| slots | string[] | Named content slots: `["header", "sidebar", "main", "footer"]` |
| requiredComponents | string[] | Components this layout needs |

### Skill

| Field | Type | Description |
|-------|------|-------------|
| name | string | Unique slug |
| displayName | string | Human-readable name |
| description | string | What this skill does |
| version | string (semver) | Skill version |
| source | SkillSource | Where it comes from |
| category | SkillCategory | Grouping |
| files | string[] | Relative paths |
| projectFocusRequired | boolean | Needs `project-focus.md` to generate |

### RegistryManifest (top-level `registry.json`)

| Field | Type | Description |
|-------|------|-------------|
| version | string (semver) | Overall registry version |
| updatedAt | string (ISO date) | Last update timestamp |
| components | Component[] | All registered components |
| layouts | Layout[] | All registered layouts |
| skills | Skill[] | All registered skills |

## 4) File Structure

```
packages/registry/
  src/
    index.ts                    # barrel exports
    schemas/
      common.ts                 # shared enums and base fields
      component.ts              # ComponentSchema
      layout.ts                 # LayoutSchema
      skill.ts                  # SkillSchema
      registry.ts               # RegistryManifestSchema
    types.ts                    # re-exports inferred types
    utils/
      resolve.ts                # lookup + dependency resolution
      version.ts                # version comparison + bump
    data/
      registry.json             # seed manifest (starts with empty arrays)
    schemas/__tests__/
      component.test.ts
      layout.test.ts
      skill.test.ts
      registry.test.ts
    utils/__tests__/
      resolve.test.ts
      version.test.ts
```

## 5) Public API

```ts
// Types
export type { Component, Layout, Skill, RegistryManifest }

// Schemas (for runtime validation)
export { ComponentSchema, LayoutSchema, SkillSchema, RegistryManifestSchema }

// Enums/constants
export { REGISTRY_VERSION, SOURCES, COMPONENT_CATEGORIES, LAYOUT_CATEGORIES, SKILL_CATEGORIES, SKILL_SOURCES }

// Utilities
export { getComponent, getLayout, getSkill }
export { listByCategory, listBySource, searchRegistry }
export { resolveWithDependencies }
export { compareVersions, bumpVersion }
```

## 6) Utility Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| getComponent | `(manifest, name) => Component \| undefined` | Look up component by name |
| getLayout | `(manifest, name) => Layout \| undefined` | Look up layout by name |
| getSkill | `(manifest, name) => Skill \| undefined` | Look up skill by name |
| listByCategory | `(manifest, type, category) => Item[]` | Filter entities by category |
| listBySource | `(manifest, type, source) => Item[]` | Filter entities by source |
| searchRegistry | `(manifest, query) => Item[]` | Text search across names, descriptions, tags |
| resolveWithDependencies | `(manifest, name) => Item[]` | Recursively resolve item + all dependencies |
| compareVersions | `(a, b) => -1 \| 0 \| 1` | Semver comparison |
| bumpVersion | `(manifest, type) => RegistryManifest` | Increment version (patch/minor/major) |

## 7) Testing Strategy

- **Schema validation:** valid data passes, invalid data fails with correct Zod errors
- **Version logic:** patch/minor/major bumps increment correctly
- **Resolve functions:** dependency resolution works, circular dependencies detected and reported
- **Registry manifest:** seed `registry.json` validates against schema
- **Search:** text search finds items by name, description, and tags

All built with **TDD** — tests written before implementation.

## 8) Dependencies

- `zod` — runtime schema validation (added as a regular dependency)
- `typescript` — dev dependency (already present)

No other external dependencies needed. Version comparison is simple enough to implement without a library.
