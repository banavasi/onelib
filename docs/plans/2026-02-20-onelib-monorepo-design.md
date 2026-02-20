# Onelib Monorepo Design (Turbo + pnpm)
**Date:** 2026-02-20
**Status:** Draft (validated in chat)
**Project:** Onelib – VibeCoder’s Paradise

## 1) Goals

- Build a **Turbo + pnpm** monorepo that houses the CLI, template, registries, layouts, and shared tooling.
- Generated projects must feel premium: onboarding flow, builders, and “one command update.”
- Enforce **Onelib’s registry-first standard** (no raw divs, no random Tailwind classes).
- Use **Biome** and **strict TypeScript** across monorepo and generated projects.
- Include **Okigu Ruler** + **Ultracite** in both the monorepo and generated projects.
- Ship **skills** in both `skills/` and `.opencode/skills/`, with hybrid snapshot + update.

## 2) Monorepo Architecture

### Tools
- **Workspace:** pnpm
- **Build orchestration:** Turbo
- **Formatting/Linting:** Biome
- **Type checking:** strict TS

### Top-level layout

```
apps/
  website/            # marketing + docs
  storybook/          # component showcase
packages/
  create-onelib/      # CLI + wizard
  onelib/             # public wrapper package (re-exports registries)
  registry/           # registry metadata + schemas
  layouts/            # layout/page templates
  templates/          # base Next.js template
  config/             # shared configs (biome/ts/other)
  skills/             # curated skills + generators
tooling/
  scripts/            # sync/registry/skills utilities
docs/
  plans/
```

## 3) Generated Project Architecture

```
skills/               # populated snapshot + updates
.opencode/skills/     # same as skills/ for tooling compatibility
project-focus.md      # project focus prompt for skill generation
onelib.config.ts      # config for registry, theme, skills
startup/              # onboarding flow (dev-only)
src/
  app/                # Next.js 15 app router
  components/         # registry components only
  layouts/            # generated layouts
  pages/              # generated pages
```

**Layout builder** is embedded in the template project and **only runs in development**.

## 4) CLI & Update Commands

### Scaffold (create-onelib)
- Copies template from `packages/templates`.
- Seeds `skills/` and `.opencode/skills/` with a **snapshot**.
- Creates `project-focus.md` and `onelib.config.ts`.
- Installs deps and **auto-runs** `pnpm onelib:update`.

### Update commands (inside generated project)
- `pnpm onelib:update`
  - Runs registry, skills, and templates updates in sequence.
- `pnpm onelib:skills:update`
  - Pulls **supabase/agent-skills**
  - Adds curated Claude/Codex skills
  - Generates project-focus-based skills
  - Writes to both `skills/` and `.opencode/skills/`
- `pnpm onelib:registry:update`
- `pnpm onelib:templates:update`

## 5) Scaffolding New Components/Layouts (Monorepo)

Command syntax:

```
pnpm scaffold component <name>
pnpm scaffold layout <name>
```

Behavior:
- Creates package files under `packages/components/<name>` or `packages/layouts/<name>`.
- Generates usage examples using registry components (Skiper/MagicUI/Aceternity/Onelib).
- Registers metadata in `packages/registry`.
- Updates `packages/onelib` exports.
- Adds Storybook entries.
- Bumps registry version.

## 6) Registry Data Flow

- **Registry** is source of truth for client updates.
- When `pnpm scaffold` adds a component/layout, registry version increments.
- Clients run `pnpm onelib:update` and receive new packages or template inserts.

## 7) Conflict Handling

If local changes conflict with updates:
- Prompt user to **merge now** or **duplicate with new name**.
- If duplicate: add with new suffix and retain both.

## 8) Error Handling & Safety

- Scaffold: confirm overwrite if directory exists (or `--force`).
- Update failures: keep snapshot and mark update pending in config.
- Skills update: fallback to snapshot on network failure.
- Layout builder: dev-only, schema-validated output.

## 9) Testing Strategy

- CLI scaffold tests (happy path, conflict path).
- Registry schema validation + version bump tests.
- `pnpm scaffold` tests (files created, registry updated, storybook entry exists).
- Generated project smoke tests (`pnpm dev` + update flow).
- Skills update tests (snapshot exists, update replaces/augments).

## 10) Decisions Summary

- **Turbo + pnpm** monorepo.
- **Biome + strict TS** in monorepo and templates.
- **Okigu Ruler + Ultracite** included in both monorepo and generated project.
- **Hybrid skills:** snapshot on scaffold + update command.
- **Layout builder** embedded in template, dev-only.
- **Conflict handling:** prompt to merge or duplicate.
- Default example project name: **vibe-starter**.

---

## Next Step

If approved, proceed to implementation planning (worktree + plan) and then build in stages.
