# Update Pipeline Design

> Status: **Approved**
> Date: 2026-02-20
> Depends on: create-onelib (complete), @onelib/registry (complete)

## 1. Problem

Scaffolded projects are static snapshots. Once `create-onelib` runs, there's no way to pull updated skills, registry entries, or template improvements. Projects need a mechanism to stay current with the Onelib ecosystem.

## 2. Scope

This phase builds the **skills update pipeline** — the first update command that keeps generated projects current. Registry and template updates are deferred until remote sources exist.

### In Scope

- `@onelib/skills` package — curated skills list, types (data layer)
- `@onelib/scripts` package — CLI binary with `update` and `skills:update` commands
- Template changes — add `@onelib/scripts` as devDependency + update scripts
- `create-onelib` refactor — deduplicate `CURATED_SKILLS` by importing from `@onelib/skills`

### Out of Scope

- `onelib:registry:update` — no remote registry exists yet
- `onelib:templates:update` — no remote template source exists yet
- Project-focus-based skill generation — YAGNI for now
- Skill snapshot tracking / drift detection — YAGNI for now
- Interactive skill selection — full re-install is simpler

## 3. Architecture

### Package Responsibilities

| Package | Role | Description |
|---------|------|-------------|
| `@onelib/skills` | Data layer | Curated skills list, skill types, category re-exports from registry |
| `@onelib/scripts` | Action layer | CLI binary (`onelib-scripts`), command execution, config reading |
| `create-onelib` | Scaffold-time | Uses `@onelib/skills` for curated list (deduplication) |

### Dependency Graph

```
Generated project
  └── @onelib/scripts (devDependency)
        └── @onelib/skills
              └── @onelib/registry (types only)

Monorepo (create-onelib)
  └── @onelib/skills (for CURATED_SKILLS)
```

## 4. `@onelib/skills` Package

### Exports

```ts
// Single source of truth for curated skills
export const CURATED_SKILLS = [
  "anthropics/skills/frontend-design",
  "vercel-labs/next-skills/next-best-practices",
  "vercel-labs/next-skills/next-cache-components",
  "giuseppe-trisciuoglio/developer-kit/shadcn-ui",
  "vercel/turborepo/turborepo",
  "obra/superpowers/brainstorming",
  "obra/superpowers/test-driven-development",
  "obra/superpowers/systematic-debugging",
  "wshobson/agents/tailwind-design-system",
] as const;

export type CuratedSkill = typeof CURATED_SKILLS[number];

// Re-export registry types
export type { Skill, SkillCategory, SkillSource } from "@onelib/registry";
```

### What It Doesn't Do

- No execution logic (no `npx skills add` calls)
- No file system operations
- No generators or project-focus handling

## 5. `@onelib/scripts` Package

### Directory Structure

```
tooling/scripts/
├── package.json          # bin: { "onelib-scripts": "./dist/cli.js" }
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── cli.ts            # #!/usr/bin/env node — arg parser, routes to commands
    ├── commands/
    │   ├── update.ts     # orchestrator — calls skills:update
    │   └── skills-update.ts  # reads config, installs skills
    ├── utils/
    │   ├── config.ts     # loadConfig() — reads onelib.config.ts from cwd
    │   ├── exec.ts       # execCommand() — shell runner
    │   └── logger.ts     # log/warn/error with picocolors
    └── __tests__/
        ├── config.test.ts
        ├── skills-update.test.ts
        ├── update.test.ts
        └── cli.test.ts
```

### CLI Entry Point (`cli.ts`)

```ts
#!/usr/bin/env node

const command = process.argv[2];

switch (command) {
  case "update":
    await runUpdate();
    break;
  case "skills:update":
    await runSkillsUpdate();
    break;
  default:
    printUsage();
    process.exit(1);
}
```

No CLI framework — simple `process.argv` routing. Extensible by adding cases.

### Config Loading (`utils/config.ts`)

```ts
interface OnelibConfig {
  skills: {
    curated: boolean;
    custom: string[];
  };
  // other fields exist but skills:update only reads skills.*
}

async function loadConfig(cwd: string): Promise<OnelibConfig | null>
```

Uses dynamic `import()` to load `onelib.config.ts` from the working directory. Returns `null` if the file doesn't exist or can't be parsed. Callers handle the fallback.

**Node TS support:** Generated projects use Node 20+ which supports `--experimental-strip-types` (Node 22+) or can use `tsx`. The generated project's package.json will invoke via `node --import tsx` if needed.

### Skills Update Command (`commands/skills-update.ts`)

```ts
interface SkillsUpdateResult {
  installed: string[];
  failed: string[];
}

async function runSkillsUpdate(cwd?: string): Promise<SkillsUpdateResult>
```

**Algorithm:**

1. Load `onelib.config.ts` from `cwd` (default: `process.cwd()`)
2. Build skill list:
   - If config loaded and `skills.curated === true` → include `CURATED_SKILLS`
   - If config loaded → include `skills.custom` entries
   - If config failed to load → fall back to full `CURATED_SKILLS` with warning
   - Deduplicate the combined list
3. For each skill, run `npx skills add <skill>` with 30s timeout
4. Log each result (✓ or ✗)
5. Return `{ installed, failed }`
6. Exit 0 if all succeeded, exit 1 if any failed

### Update Orchestrator (`commands/update.ts`)

```ts
async function runUpdate(cwd?: string): Promise<void>
```

Currently just calls `runSkillsUpdate()`. Future phases add `runRegistryUpdate()` and `runTemplatesUpdate()` calls here. The orchestrator handles sequencing and prints an aggregated summary.

### Logger (`utils/logger.ts`)

```ts
function log(message: string): void     // "onelib  <message>"
function warn(message: string): void    // "onelib  ⚠ <message>"  (yellow)
function error(message: string): void   // "onelib  ✗ <message>"  (red)
function success(message: string): void // "onelib  ✓ <message>"  (green)
```

Uses `picocolors`. Compact format, no spinners. Prefix all output with `onelib` for branding.

### Shell Executor (`utils/exec.ts`)

Same pattern as `create-onelib/src/utils/exec.ts`:

```ts
interface ExecResult {
  success: boolean;
  stdout: string;
  stderr: string;
}

async function execCommand(
  command: string,
  args: string[],
  options?: { cwd?: string; timeoutMs?: number }
): Promise<ExecResult>
```

Duplicated from create-onelib intentionally — the two implementations have different UX concerns (spinners vs plain output) and will likely diverge.

## 6. Template Changes

### `packages/templates/base/package.json.template`

Add to `devDependencies`:
```json
"@onelib/scripts": "^0.1.0"
```

Add to `scripts`:
```json
"onelib:update": "onelib-scripts update",
"onelib:skills:update": "onelib-scripts skills:update"
```

## 7. `create-onelib` Refactor

### Deduplicate CURATED_SKILLS

- Add `@onelib/skills` as a dependency in `packages/create-onelib/package.json`
- Update `src/constants.ts` to import from `@onelib/skills`:
  ```ts
  export { CURATED_SKILLS } from "@onelib/skills";
  ```
- Remove the local `CURATED_SKILLS` array definition

This ensures one source of truth for the curated list across the monorepo.

## 8. Output Examples

### `pnpm onelib:skills:update`

```
onelib  Updating skills...
  ✓ anthropics/skills/frontend-design
  ✓ vercel-labs/next-skills/next-best-practices
  ✓ vercel-labs/next-skills/next-cache-components
  ✗ giuseppe-trisciuoglio/developer-kit/shadcn-ui (timeout)
  ✓ vercel/turborepo/turborepo
  ✓ obra/superpowers/brainstorming
  ✓ obra/superpowers/test-driven-development
  ✓ obra/superpowers/systematic-debugging
  ✓ wshobson/agents/tailwind-design-system

onelib  Skills: 8 installed, 1 failed
```

### `pnpm onelib:update`

```
onelib  Running updates...

onelib  Updating skills...
  ✓ anthropics/skills/frontend-design
  ...

onelib  Update complete: skills 9/9
```

### Config missing fallback

```
onelib  ⚠ Could not load onelib.config.ts — using default curated skills
onelib  Updating skills...
  ...
```

## 9. Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All operations succeeded |
| 1 | One or more operations failed |

## 10. Testing Strategy

### `@onelib/skills` Tests

- `CURATED_SKILLS` is non-empty array
- Each entry matches `owner/repo/skill` pattern (at least two `/` separators)
- No duplicate entries
- Type `CuratedSkill` is correctly constrained

### `@onelib/scripts` Tests

| Test file | Coverage |
|-----------|----------|
| `config.test.ts` | Load valid config, handle missing file (returns null), handle malformed config |
| `skills-update.test.ts` | Build skill list with curated=true, curated=false, custom skills, deduplication, exec failures, config fallback |
| `update.test.ts` | Calls skills update, returns aggregated results, exit code on failure |
| `cli.test.ts` | Routes `"update"` correctly, routes `"skills:update"` correctly, unknown command prints usage |

All unit tests mock `execCommand` and `loadConfig` — no real shell execution. One integration test for config loading uses a temp directory with an actual `onelib.config.ts`.

## 11. Dependencies

### `@onelib/skills`

```json
{
  "dependencies": {
    "@onelib/registry": "workspace:*"
  }
}
```

### `@onelib/scripts`

```json
{
  "dependencies": {
    "@onelib/skills": "workspace:*",
    "picocolors": "^1.1.1"
  }
}
```

### `create-onelib` (update)

```json
{
  "dependencies": {
    "@onelib/skills": "workspace:*"
  }
}
```

## 12. Future Extensions

When remote sources exist, this design extends naturally:

- Add `commands/registry-update.ts` and `commands/templates-update.ts`
- Add cases in `cli.ts` for `"registry:update"` and `"templates:update"`
- `update.ts` orchestrator calls all three sequentially
- Config gains `registry` and `templates` sections

No architectural changes needed — just new files and switch cases.
