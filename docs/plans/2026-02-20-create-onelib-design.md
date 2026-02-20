# create-onelib CLI Design
**Date:** 2026-02-20
**Status:** Approved
**Packages:** `packages/create-onelib/`, `packages/templates/`, `packages/onelib/`

## 1) Purpose

`create-onelib` is the user-facing CLI that scaffolds new Onelib projects. It produces a standalone Next.js 15 project pre-configured with Tailwind CSS v4, shadcn/ui, Biome, ESLint+Prettier, AI agent configs (OpenCode, Claude Code, Codex), and curated skills from skills.sh.

Invocation: `pnpm create onelib` (or `npx create-onelib`).

## 2) User Flow

```
pnpm create onelib
  -> Prompt: Project name (default: "vibe-starter")
  -> Scaffold project directory from template
  -> Replace placeholders ({{PROJECT_NAME}}, etc.)
  -> Run pnpm install
  -> Install 9 curated skills via npx skills add
  -> Run git init + initial commit
  -> Print success message with next steps
```

The entire flow uses **clack** for interactive prompts and **picocolors** for styled terminal output. No flags or non-interactive mode in v1 -- interactive only.

## 3) Generated Project Structure

```
<project-name>/
  .claude/
    settings.json           # Claude Code config (tool permissions, etc.)
  .codex/
    config.yaml             # Codex config
  .opencode/
    config.json             # OpenCode config
  skills/                   # Skills installed by skills.sh
  src/
    app/                    # Next.js 15 App Router
      layout.tsx
      page.tsx
      globals.css
    components/
      ui/                   # shadcn/ui components
    lib/
      utils.ts
  public/
  onelib.config.ts          # Onelib configuration (defineConfig)
  project-focus.md          # AI context document
  package.json
  tsconfig.json
  next.config.ts
  tailwind.config.ts
  biome.json
  .eslintrc.json
  .prettierrc
  .gitignore
```

## 4) Package Architecture

Three packages are involved:

### `packages/templates/base/` (template files)

Contains the full Next.js 15 starter as raw files with placeholder tokens. This is a real, runnable Next.js project -- not a skeleton.

Placeholders use double-brace syntax: `{{PROJECT_NAME}}`, `{{PROJECT_DESCRIPTION}}`.

The template includes:
- Next.js 15 with App Router
- Tailwind CSS v4
- shadcn/ui base components
- Biome config
- ESLint + Prettier config
- TypeScript strict mode
- Agent config stubs (`.claude/`, `.codex/`, `.opencode/`)

### `packages/create-onelib/` (CLI)

The CLI wizard. Responsibilities:
1. Pre-flight checks (Node >= 20, pnpm available, target directory)
2. Interactive prompts (project name)
3. Copy template files to target directory
4. Replace placeholders with user inputs
5. Run `pnpm install`
6. Install skills via `npx skills add`
7. Run `git init` and create initial commit
8. Print success message

Dependencies: `clack`, `picocolors`, `fs-extra`.

### `packages/onelib/` (config package)

Exports `defineConfig()` for `onelib.config.ts`. This is what the generated project imports.

```ts
// packages/onelib/src/index.ts
import type { OnelibConfig } from "./types.js";
export function defineConfig(config: OnelibConfig): OnelibConfig {
  return config;
}
export type { OnelibConfig };
```

The config shape:

```ts
interface OnelibConfig {
  name: string;
  registry: {
    components: string[];
    layouts: string[];
  };
  skills: {
    curated: boolean;
    custom: string[];
  };
  theme: {
    preset: "default" | "custom";
  };
}
```

## 5) Skills Installation

Nine curated skills from six repos, installed via `npx skills add`:

| Skill | Repo |
|-------|------|
| Frontend Design | `anthropics/skills/frontend-design` |
| Next.js Best Practices | `vercel-labs/next-skills/next-best-practices` |
| Next.js Cache & Components | `vercel-labs/next-skills/next-cache-components` |
| shadcn/ui | `giuseppe-trisciuoglio/developer-kit/shadcn-ui` |
| Turborepo | `vercel/turborepo/turborepo` |
| Brainstorming | `obra/superpowers/brainstorming` |
| Test-Driven Development | `obra/superpowers/test-driven-development` |
| Systematic Debugging | `obra/superpowers/systematic-debugging` |
| Tailwind Design System | `wshobson/agents/tailwind-design-system` |

Installation strategy:
- Install sequentially (skills.sh doesn't support parallel)
- 30-second timeout per skill
- Warn-and-continue on failure -- log which skills failed at the end
- Each call: `npx skills add <owner/repo/skill>`

## 6) Config Generation & Agent Setup

### `onelib.config.ts`

Generated with `defineConfig()` from the `onelib` package:

```ts
import { defineConfig } from "onelib";

export default defineConfig({
  name: "{{PROJECT_NAME}}",
  registry: {
    components: [],
    layouts: [],
  },
  skills: {
    curated: true,
    custom: [],
  },
  theme: {
    preset: "default",
  },
});
```

### `project-focus.md`

A markdown file that describes the project for AI agents. Generated with project name and a starter template:

```markdown
# Project Focus: {{PROJECT_NAME}}

## Overview
A Next.js 15 application built with Onelib.

## Tech Stack
- Next.js 15 (App Router)
- Tailwind CSS v4
- shadcn/ui
- TypeScript (strict mode)
- Biome (formatting/linting)

## Architecture
[Describe your application architecture here]

## Key Decisions
[Document important technical decisions here]
```

### Agent config files

- `.opencode/config.json` -- OpenCode settings
- `.claude/settings.json` -- Claude Code tool permissions and settings
- `.codex/config.yaml` -- Codex configuration

These are static files copied from the template with no placeholder replacement needed.

## 7) Error Handling & Edge Cases

### Pre-flight checks (before any work)
- Verify Node.js >= 20. If too old, exit with clear message and required version.
- Verify `pnpm` is available. If missing, suggest `corepack enable` or `npm i -g pnpm`.
- Check if target directory exists and is non-empty. Prompt to overwrite, merge, or abort.

### During scaffolding
- Template copy failures are fatal -- abort and clean up the partial directory.
- Placeholder replacement failures are fatal -- corrupted output is worse than no output.

### Dependency installation (`pnpm install`)
- Run with a spinner. On failure, warn but don't abort. Print "run `pnpm install` manually" and continue.
- Network errors get a specific message about checking connectivity.

### Skills installation (`npx skills add`)
- Warn-and-continue on each failure. Log which skills failed at the end.
- Timeout each call at 30 seconds to avoid hanging on network issues.

### Git init
- If `git` isn't installed, skip silently.
- If `git init` fails for any reason, warn and continue.

### Cleanup on fatal errors
- If we created the project directory and hit a fatal error, remove it entirely.
- Use a try/finally pattern wrapping the entire scaffold flow.

## 8) Testing Strategy

### Unit tests (`create-onelib/src/__tests__/`)
- Placeholder replacement logic (project name, description injected correctly).
- Pre-flight check functions (Node version parsing, command existence detection).
- Skills list builder (correct repo paths, correct count).
- Pure functions, no I/O.

### Integration tests (`create-onelib/src/__tests__/integration/`)
- Full scaffold flow against a temp directory (`fs.mkdtemp`). Verify:
  - All expected files exist after scaffolding.
  - No `{{PROJECT_NAME}}` literals remain in output files.
  - `package.json` has correct name and dependencies.
  - `onelib.config.ts` is valid (no placeholder tokens).
  - Agent config files exist with correct structure.
- Mock `pnpm install` and `npx skills add` calls (no real network in tests).
- Clean up temp directories in `afterEach`.

### What we skip
- No E2E tests that actually run `pnpm install` or `npx skills add`.
- No snapshot tests for file contents.
- No testing of clack prompts.

### Test commands
- `pnpm test --filter=create-onelib` -- run unit + integration tests.
- Tests run in CI via the existing Turbo `test` pipeline.

## 9) Dependencies

### `create-onelib`
- `@clack/prompts` -- interactive CLI prompts
- `picocolors` -- terminal colors (tiny, fast)
- `fs-extra` -- recursive copy, ensureDir, remove
- `@onelib/templates` -- workspace dependency (template files)

### `onelib`
- No external dependencies (just TypeScript types and `defineConfig`)

### `@onelib/templates`
- No dependencies (raw template files, no build step)

## 10) Decisions Summary

- **CLI framework:** clack + picocolors (not inquirer, not commander)
- **Template approach:** Copy + placeholder replacement (not code generation)
- **Output:** Standalone project (not monorepo app)
- **Skills:** Install from skills.sh at scaffold time (not bundled)
- **Config:** `onelib.config.ts` with `defineConfig()` from `onelib` package
- **Interactive only:** No flags or non-interactive mode in v1
- **Default project name:** `vibe-starter`
