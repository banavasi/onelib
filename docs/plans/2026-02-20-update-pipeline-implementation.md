# Update Pipeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a skills update pipeline so generated projects can keep their curated skills current via `pnpm onelib:update` and `pnpm onelib:skills:update`.

**Architecture:** Two packages change — `@onelib/skills` becomes the single source of truth for the curated skills list (data layer), and `@onelib/scripts` becomes a CLI binary (`onelib-scripts`) with `update` and `skills:update` subcommands (action layer). The template and `create-onelib` are updated to wire everything together.

**Tech Stack:** TypeScript 5.9, Vitest 4.x, Biome 2.x (tabs, double quotes, semicolons, 100 line width), Node 24, pnpm workspaces.

**Design doc:** `docs/plans/2026-02-20-update-pipeline-design.md`

---

## Task 1: Add `@onelib/registry` dependency to `@onelib/skills`

The skills package needs to re-export types from the registry package.

**Files:**
- Modify: `packages/skills/package.json`

**Step 1: Add workspace dependency**

Run:
```bash
pnpm add @onelib/registry --workspace --filter @onelib/skills
```

This adds `"@onelib/registry": "workspace:*"` to `packages/skills/package.json` dependencies.

**Step 2: Verify the dependency was added**

Run:
```bash
cat packages/skills/package.json
```

Expected: `dependencies` section includes `"@onelib/registry": "workspace:*"`.

**Step 3: Commit**

```bash
git add packages/skills/package.json pnpm-lock.yaml
git commit -m "chore(skills): add @onelib/registry dependency"
```

---

## Task 2: Implement `@onelib/skills` — curated list and type exports

Replace the stub with the curated skills list constant and type re-exports from registry.

**Files:**
- Modify: `packages/skills/src/index.ts`
- Modify: `packages/skills/src/index.test.ts`
- Modify: `packages/skills/tsconfig.json` (exclude tests from build)

**Step 1: Update tsconfig to exclude tests**

In `packages/skills/tsconfig.json`, add `exclude` to prevent test files from being included in the build output:

```json
{
	"extends": "../../packages/config/tsconfig.library.json",
	"compilerOptions": {
		"outDir": "./dist",
		"rootDir": "./src"
	},
	"include": ["src"],
	"exclude": ["src/**/__tests__", "src/**/*.test.ts"]
}
```

**Step 2: Write the tests**

Replace `packages/skills/src/index.test.ts` with:

```ts
import { describe, expect, it } from "vitest";
import { CURATED_SKILLS, SKILLS_VERSION } from "./index.js";

describe("SKILLS_VERSION", () => {
	it("is a semver string", () => {
		expect(SKILLS_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
	});
});

describe("CURATED_SKILLS", () => {
	it("is a non-empty array", () => {
		expect(CURATED_SKILLS.length).toBeGreaterThan(0);
	});

	it("each skill matches owner/repo/skill format", () => {
		for (const skill of CURATED_SKILLS) {
			const parts = skill.split("/");
			expect(parts.length).toBeGreaterThanOrEqual(3);
		}
	});

	it("contains no duplicate entries", () => {
		const unique = new Set(CURATED_SKILLS);
		expect(unique.size).toBe(CURATED_SKILLS.length);
	});

	it("includes key curated skills", () => {
		expect(CURATED_SKILLS).toContain("anthropics/skills/frontend-design");
		expect(CURATED_SKILLS).toContain("obra/superpowers/brainstorming");
	});
});
```

**Step 3: Run tests to verify they fail**

Run: `pnpm --filter @onelib/skills test`

Expected: FAIL — `CURATED_SKILLS` is not exported from `index.ts`.

**Step 4: Write the implementation**

Replace `packages/skills/src/index.ts` with:

```ts
// @onelib/skills – curated skills & generators
export const SKILLS_VERSION = "0.1.0";

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

export type CuratedSkill = (typeof CURATED_SKILLS)[number];

// Re-export skill-related types from registry
export type { Skill } from "@onelib/registry";
```

**Step 5: Run tests to verify they pass**

Run: `pnpm --filter @onelib/skills test`

Expected: All 5 tests pass.

**Step 6: Commit**

```bash
git add packages/skills/
git commit -m "feat(skills): add curated skills list and type exports"
```

---

## Task 3: Refactor `create-onelib` to import `CURATED_SKILLS` from `@onelib/skills`

Deduplicate the curated skills list — `create-onelib` should use `@onelib/skills` as the single source of truth.

**Files:**
- Modify: `packages/create-onelib/package.json` (add `@onelib/skills` dependency)
- Modify: `packages/create-onelib/src/constants.ts` (re-export from `@onelib/skills`)
- Test: `packages/create-onelib/src/__tests__/constants.test.ts` (already exists, should still pass)

**Step 1: Add `@onelib/skills` as a dependency**

Run:
```bash
pnpm add @onelib/skills --workspace --filter create-onelib
```

**Step 2: Update `constants.ts` to re-export from `@onelib/skills`**

Replace the local `CURATED_SKILLS` definition in `packages/create-onelib/src/constants.ts` with a re-export:

```ts
export { CURATED_SKILLS } from "@onelib/skills";

export const TEMPLATE_FILES_WITH_PLACEHOLDERS = [
	"package.json.template",
	"onelib.config.ts",
	"project-focus.md",
	"src/app/layout.tsx",
	"src/app/page.tsx",
	".codex/config.yaml",
] as const;

export const TEMPLATE_RENAME_MAP: Record<string, string> = {
	"package.json.template": "package.json",
	".gitignore.template": ".gitignore",
};

export const MIN_NODE_VERSION = 20;
export const SKILL_INSTALL_TIMEOUT_MS = 30_000;
export const DEFAULT_PROJECT_NAME = "vibe-starter";
```

**Step 3: Run existing tests to verify nothing breaks**

Run: `pnpm --filter create-onelib test`

Expected: All 34 tests pass. The constants tests import `CURATED_SKILLS` from `../constants.js` which now re-exports from `@onelib/skills` — same shape, same values.

**Step 4: Commit**

```bash
git add packages/create-onelib/
git commit -m "refactor(create-onelib): import CURATED_SKILLS from @onelib/skills"
```

---

## Task 4: Add CLI dependencies to `@onelib/scripts`

The scripts package needs `@onelib/skills` and `picocolors`.

**Files:**
- Modify: `tooling/scripts/package.json`

**Step 1: Add dependencies**

Run:
```bash
pnpm add @onelib/skills picocolors --workspace --filter @onelib/scripts
```

Note: `--workspace` applies to the workspace filter, not necessarily to all packages. For `picocolors` (npm package), pnpm will fetch from registry. For `@onelib/skills` (workspace package), it uses `workspace:*`.

Actually, run separately to be precise:

```bash
pnpm add @onelib/skills --workspace --filter @onelib/scripts
pnpm add picocolors --filter @onelib/scripts
```

**Step 2: Remove `"private": true`** from `tooling/scripts/package.json`

The package needs to be publishable since generated projects install it as a devDependency. Also add `types` and `exports` fields, and a `bin` entry.

Update `tooling/scripts/package.json` to:

```json
{
	"name": "@onelib/scripts",
	"version": "0.1.0",
	"description": "Onelib update pipeline and project scripts",
	"type": "module",
	"main": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"bin": {
		"onelib-scripts": "./dist/cli.js"
	},
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"import": "./dist/index.js"
		}
	},
	"scripts": {
		"build": "tsc",
		"dev": "tsc --watch",
		"lint": "biome check .",
		"format": "biome check --write .",
		"check-types": "tsc --noEmit",
		"test": "vitest run",
		"clean": "rm -rf dist .turbo node_modules"
	},
	"dependencies": {
		"@onelib/skills": "workspace:*",
		"picocolors": "^1.1.1"
	},
	"devDependencies": {
		"typescript": "^5.8.0"
	}
}
```

**Step 3: Update tsconfig to exclude tests**

Update `tooling/scripts/tsconfig.json`:

```json
{
	"extends": "../../packages/config/tsconfig.library.json",
	"compilerOptions": {
		"outDir": "./dist",
		"rootDir": "./src"
	},
	"include": ["src"],
	"exclude": ["src/**/__tests__", "src/**/*.test.ts"]
}
```

**Step 4: Commit**

```bash
git add tooling/scripts/package.json tooling/scripts/tsconfig.json pnpm-lock.yaml
git commit -m "chore(scripts): add CLI dependencies and bin entry"
```

---

## Task 5: Implement logger utility

A simple colored logger with the `onelib` prefix.

**Files:**
- Create: `tooling/scripts/src/utils/logger.ts`
- Create: `tooling/scripts/src/__tests__/logger.test.ts`

**Step 1: Write the tests**

Create `tooling/scripts/src/__tests__/logger.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { formatError, formatLog, formatSuccess, formatWarn } from "../utils/logger.js";

describe("logger formatters", () => {
	it("formatLog includes the message", () => {
		const output = formatLog("hello world");
		expect(output).toContain("hello world");
		expect(output).toContain("onelib");
	});

	it("formatSuccess includes the message", () => {
		const output = formatSuccess("done");
		expect(output).toContain("done");
	});

	it("formatWarn includes the message", () => {
		const output = formatWarn("careful");
		expect(output).toContain("careful");
	});

	it("formatError includes the message", () => {
		const output = formatError("failed");
		expect(output).toContain("failed");
	});
});
```

**Step 2: Run tests to verify they fail**

Run: `pnpm --filter @onelib/scripts test`

Expected: FAIL — module not found.

**Step 3: Write the implementation**

Create `tooling/scripts/src/utils/logger.ts`:

```ts
import pc from "picocolors";

const PREFIX = pc.bold(pc.cyan("onelib"));

export function formatLog(message: string): string {
	return `${PREFIX}  ${message}`;
}

export function formatSuccess(message: string): string {
	return `  ${pc.green("✓")} ${message}`;
}

export function formatWarn(message: string): string {
	return `${PREFIX}  ${pc.yellow("⚠")} ${message}`;
}

export function formatError(message: string): string {
	return `  ${pc.red("✗")} ${message}`;
}

export function log(message: string): void {
	console.log(formatLog(message));
}

export function success(message: string): void {
	console.log(formatSuccess(message));
}

export function warn(message: string): void {
	console.log(formatWarn(message));
}

export function error(message: string): void {
	console.log(formatError(message));
}
```

**Step 4: Run tests to verify they pass**

Run: `pnpm --filter @onelib/scripts test`

Expected: All 4 logger tests pass.

**Step 5: Commit**

```bash
git add tooling/scripts/src/utils/logger.ts tooling/scripts/src/__tests__/logger.test.ts
git commit -m "feat(scripts): add logger utility with colored output"
```

---

## Task 6: Implement exec utility

Shell command runner — same pattern as `create-onelib/src/utils/exec.ts` but standalone.

**Files:**
- Create: `tooling/scripts/src/utils/exec.ts`
- Create: `tooling/scripts/src/__tests__/exec.test.ts`

**Step 1: Write the tests**

Create `tooling/scripts/src/__tests__/exec.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { execCommand } from "../utils/exec.js";

describe("execCommand", () => {
	it("runs a simple command and returns stdout", async () => {
		const result = await execCommand("echo", ["hello"]);
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.stdout.trim()).toBe("hello");
		}
	});

	it("returns error for nonexistent command", async () => {
		const result = await execCommand("nonexistent-cmd-xyz-123", []);
		expect(result.ok).toBe(false);
	});

	it("supports timeout", async () => {
		const result = await execCommand("sleep", ["10"], { timeoutMs: 100 });
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.message).toContain("timed out");
		}
	});

	it("runs in specified cwd", async () => {
		const result = await execCommand("pwd", [], { cwd: "/tmp" });
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.stdout.trim()).toMatch(/\/tmp$/);
		}
	});
});
```

**Step 2: Run tests to verify they fail**

Run: `pnpm --filter @onelib/scripts test`

Expected: FAIL — module not found.

**Step 3: Write the implementation**

Create `tooling/scripts/src/utils/exec.ts`:

```ts
import { execFile } from "node:child_process";

export type ExecResult =
	| { ok: true; stdout: string; stderr: string }
	| { ok: false; message: string };

interface ExecOptions {
	cwd?: string;
	timeoutMs?: number;
}

export function execCommand(
	command: string,
	args: string[],
	options: ExecOptions = {},
): Promise<ExecResult> {
	return new Promise((resolve) => {
		execFile(
			command,
			args,
			{
				cwd: options.cwd,
				timeout: options.timeoutMs,
			},
			(error, stdout, stderr) => {
				if (error) {
					if (error.killed) {
						resolve({ ok: false, message: `Command timed out: ${command}` });
					} else {
						resolve({ ok: false, message: error.message });
					}
				} else {
					resolve({ ok: true, stdout, stderr });
				}
			},
		);
	});
}
```

**Step 4: Run tests to verify they pass**

Run: `pnpm --filter @onelib/scripts test`

Expected: All 4 exec tests pass.

**Step 5: Commit**

```bash
git add tooling/scripts/src/utils/exec.ts tooling/scripts/src/__tests__/exec.test.ts
git commit -m "feat(scripts): add shell command executor utility"
```

---

## Task 7: Implement config loader

Loads `onelib.config.ts` from the project's working directory. Returns the parsed config or `null` if it can't be loaded.

**Files:**
- Create: `tooling/scripts/src/utils/config.ts`
- Create: `tooling/scripts/src/__tests__/config.test.ts`

**Step 1: Write the tests**

Create `tooling/scripts/src/__tests__/config.test.ts`:

```ts
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadConfig } from "../utils/config.js";

describe("loadConfig", () => {
	let tempDir: string;

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), "onelib-config-test-"));
	});

	afterEach(async () => {
		await rm(tempDir, { recursive: true, force: true });
	});

	it("returns null when onelib.config.ts does not exist", async () => {
		const result = await loadConfig(tempDir);
		expect(result).toBeNull();
	});

	it("loads a valid config file", async () => {
		const configContent = `
export default {
	name: "test-project",
	registry: { components: [], layouts: [] },
	skills: { curated: true, custom: ["my/custom/skill"] },
	theme: { preset: "default" },
};
`;
		await writeFile(join(tempDir, "onelib.config.ts"), configContent);

		const result = await loadConfig(tempDir);
		expect(result).not.toBeNull();
		expect(result?.name).toBe("test-project");
		expect(result?.skills.curated).toBe(true);
		expect(result?.skills.custom).toEqual(["my/custom/skill"]);
	});

	it("returns null for a config with syntax errors", async () => {
		await writeFile(join(tempDir, "onelib.config.ts"), "export default {{{BROKEN");
		const result = await loadConfig(tempDir);
		expect(result).toBeNull();
	});
});
```

**Step 2: Run tests to verify they fail**

Run: `pnpm --filter @onelib/scripts test`

Expected: FAIL — module not found.

**Step 3: Write the implementation**

Create `tooling/scripts/src/utils/config.ts`:

```ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { OnelibConfig } from "onelib";

const CONFIG_FILENAME = "onelib.config.ts";

export async function loadConfig(cwd: string): Promise<OnelibConfig | null> {
	const configPath = join(cwd, CONFIG_FILENAME);

	if (!existsSync(configPath)) {
		return null;
	}

	try {
		const configUrl = pathToFileURL(configPath).href;
		const mod = await import(configUrl);
		const config = mod.default as OnelibConfig;
		return config;
	} catch {
		return null;
	}
}
```

Note: This uses Node's native `import()` with `--experimental-strip-types` (Node 22+). The generated project runs Node 20+ but the config file is simple enough that it works with Node's TS support. If `import()` fails (e.g., Node 20 without TS support), it returns `null` and the caller falls back gracefully.

**Step 4: Add `onelib` as a dependency** (for the `OnelibConfig` type)

Run:
```bash
pnpm add onelib --workspace --filter @onelib/scripts
```

**Step 5: Run tests to verify they pass**

Run: `pnpm --filter @onelib/scripts test`

Expected: All 3 config tests pass. Note: The "loads a valid config file" test depends on Node 24's native TS import support (`--experimental-strip-types` is on by default). If this fails, the test needs adjustment (use a `.js` config file instead).

**Step 6: Commit**

```bash
git add tooling/scripts/src/utils/config.ts tooling/scripts/src/__tests__/config.test.ts tooling/scripts/package.json pnpm-lock.yaml
git commit -m "feat(scripts): add config loader for onelib.config.ts"
```

---

## Task 8: Implement skills update command

The core command that reads config and installs skills via `npx skills add`.

**Files:**
- Create: `tooling/scripts/src/commands/skills-update.ts`
- Create: `tooling/scripts/src/__tests__/skills-update.test.ts`

**Step 1: Write the tests**

Create `tooling/scripts/src/__tests__/skills-update.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { buildSkillList, type SkillsUpdateResult } from "../commands/skills-update.js";
import { CURATED_SKILLS } from "@onelib/skills";

describe("buildSkillList", () => {
	it("returns curated skills when config has curated=true and no custom", () => {
		const result = buildSkillList({
			curated: true,
			custom: [],
		});
		expect(result).toEqual([...CURATED_SKILLS]);
	});

	it("returns only custom skills when curated=false", () => {
		const result = buildSkillList({
			curated: false,
			custom: ["my/custom/skill"],
		});
		expect(result).toEqual(["my/custom/skill"]);
	});

	it("returns empty array when curated=false and no custom", () => {
		const result = buildSkillList({
			curated: false,
			custom: [],
		});
		expect(result).toEqual([]);
	});

	it("combines curated and custom skills", () => {
		const result = buildSkillList({
			curated: true,
			custom: ["my/custom/skill"],
		});
		expect(result).toContain("my/custom/skill");
		expect(result).toContain("anthropics/skills/frontend-design");
		expect(result.length).toBe(CURATED_SKILLS.length + 1);
	});

	it("deduplicates if custom skill overlaps with curated", () => {
		const result = buildSkillList({
			curated: true,
			custom: ["anthropics/skills/frontend-design"],
		});
		expect(result.length).toBe(CURATED_SKILLS.length);
	});
});
```

**Step 2: Run tests to verify they fail**

Run: `pnpm --filter @onelib/scripts test`

Expected: FAIL — module not found.

**Step 3: Write the implementation**

Create `tooling/scripts/src/commands/skills-update.ts`:

```ts
import { CURATED_SKILLS } from "@onelib/skills";
import { loadConfig } from "../utils/config.js";
import { execCommand } from "../utils/exec.js";
import * as logger from "../utils/logger.js";

const SKILL_INSTALL_TIMEOUT_MS = 30_000;

interface SkillsConfig {
	curated: boolean;
	custom: string[];
}

export interface SkillsUpdateResult {
	installed: string[];
	failed: string[];
}

export function buildSkillList(skills: SkillsConfig): string[] {
	const list: string[] = [];

	if (skills.curated) {
		list.push(...CURATED_SKILLS);
	}

	for (const skill of skills.custom) {
		if (!list.includes(skill)) {
			list.push(skill);
		}
	}

	return list;
}

export async function runSkillsUpdate(cwd?: string): Promise<SkillsUpdateResult> {
	const workDir = cwd ?? process.cwd();
	const config = await loadConfig(workDir);

	let skills: SkillsConfig;

	if (config) {
		skills = config.skills;
	} else {
		logger.warn("Could not load onelib.config.ts — using default curated skills");
		skills = { curated: true, custom: [] };
	}

	const skillList = buildSkillList(skills);

	if (skillList.length === 0) {
		logger.log("No skills to install");
		return { installed: [], failed: [] };
	}

	logger.log("Updating skills...");

	const installed: string[] = [];
	const failed: string[] = [];

	for (const skill of skillList) {
		const result = await execCommand("npx", ["skills", "add", skill], {
			cwd: workDir,
			timeoutMs: SKILL_INSTALL_TIMEOUT_MS,
		});

		if (result.ok) {
			logger.success(skill);
			installed.push(skill);
		} else {
			logger.error(`${skill} (${result.message})`);
			failed.push(skill);
		}
	}

	const summary = `Skills: ${installed.length} installed, ${failed.length} failed`;
	if (failed.length > 0) {
		logger.log(summary);
	} else {
		logger.log(summary);
	}

	return { installed, failed };
}
```

**Step 4: Run tests to verify they pass**

Run: `pnpm --filter @onelib/scripts test`

Expected: All 5 buildSkillList tests pass.

**Step 5: Commit**

```bash
git add tooling/scripts/src/commands/skills-update.ts tooling/scripts/src/__tests__/skills-update.test.ts
git commit -m "feat(scripts): add skills update command"
```

---

## Task 9: Implement update orchestrator

The top-level `update` command that calls `skills:update` (and future sub-updates).

**Files:**
- Create: `tooling/scripts/src/commands/update.ts`
- Create: `tooling/scripts/src/__tests__/update.test.ts`

**Step 1: Write the tests**

Create `tooling/scripts/src/__tests__/update.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";

vi.mock("../commands/skills-update.js", () => ({
	runSkillsUpdate: vi.fn(),
}));

import { runUpdate } from "../commands/update.js";
import { runSkillsUpdate } from "../commands/skills-update.js";

describe("runUpdate", () => {
	it("calls runSkillsUpdate", async () => {
		vi.mocked(runSkillsUpdate).mockResolvedValue({
			installed: ["skill/a"],
			failed: [],
		});

		const result = await runUpdate("/fake/dir");
		expect(runSkillsUpdate).toHaveBeenCalledWith("/fake/dir");
		expect(result.success).toBe(true);
	});

	it("returns success=false when skills update has failures", async () => {
		vi.mocked(runSkillsUpdate).mockResolvedValue({
			installed: [],
			failed: ["skill/a"],
		});

		const result = await runUpdate("/fake/dir");
		expect(result.success).toBe(false);
	});
});
```

**Step 2: Run tests to verify they fail**

Run: `pnpm --filter @onelib/scripts test`

Expected: FAIL — module not found.

**Step 3: Write the implementation**

Create `tooling/scripts/src/commands/update.ts`:

```ts
import * as logger from "../utils/logger.js";
import { runSkillsUpdate } from "./skills-update.js";

export interface UpdateResult {
	success: boolean;
}

export async function runUpdate(cwd?: string): Promise<UpdateResult> {
	logger.log("Running updates...\n");

	const skillsResult = await runSkillsUpdate(cwd);

	const hasFailures = skillsResult.failed.length > 0;

	console.log("");
	if (hasFailures) {
		logger.log(
			`Update complete: skills ${skillsResult.installed.length}/${skillsResult.installed.length + skillsResult.failed.length}`,
		);
	} else {
		logger.log(
			`Update complete: skills ${skillsResult.installed.length}/${skillsResult.installed.length}`,
		);
	}

	return { success: !hasFailures };
}
```

**Step 4: Run tests to verify they pass**

Run: `pnpm --filter @onelib/scripts test`

Expected: Both update tests pass.

**Step 5: Commit**

```bash
git add tooling/scripts/src/commands/update.ts tooling/scripts/src/__tests__/update.test.ts
git commit -m "feat(scripts): add update orchestrator command"
```

---

## Task 10: Implement CLI entry point

The `onelib-scripts` binary — routes `process.argv` to commands.

**Files:**
- Create: `tooling/scripts/src/cli.ts`
- Create: `tooling/scripts/src/__tests__/cli.test.ts`
- Modify: `tooling/scripts/src/index.ts` (update barrel exports)

**Step 1: Write the tests**

Create `tooling/scripts/src/__tests__/cli.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { parseCommand } from "../cli.js";

describe("parseCommand", () => {
	it('parses "update" command', () => {
		expect(parseCommand(["node", "cli.js", "update"])).toBe("update");
	});

	it('parses "skills:update" command', () => {
		expect(parseCommand(["node", "cli.js", "skills:update"])).toBe("skills:update");
	});

	it("returns null for unknown command", () => {
		expect(parseCommand(["node", "cli.js", "foobar"])).toBeNull();
	});

	it("returns null when no command given", () => {
		expect(parseCommand(["node", "cli.js"])).toBeNull();
	});
});
```

**Step 2: Run tests to verify they fail**

Run: `pnpm --filter @onelib/scripts test`

Expected: FAIL — module not found.

**Step 3: Write the implementation**

Create `tooling/scripts/src/cli.ts`:

```ts
#!/usr/bin/env node
import * as logger from "./utils/logger.js";
import { runUpdate } from "./commands/update.js";
import { runSkillsUpdate } from "./commands/skills-update.js";

const VALID_COMMANDS = ["update", "skills:update"] as const;
type Command = (typeof VALID_COMMANDS)[number];

export function parseCommand(argv: string[]): Command | null {
	const cmd = argv[2];
	if (cmd && (VALID_COMMANDS as readonly string[]).includes(cmd)) {
		return cmd as Command;
	}
	return null;
}

function printUsage(): void {
	console.log("Usage: onelib-scripts <command>\n");
	console.log("Commands:");
	console.log("  update          Run all updates (skills, registry, templates)");
	console.log("  skills:update   Update curated and custom skills");
}

async function main(): Promise<void> {
	const command = parseCommand(process.argv);

	if (!command) {
		printUsage();
		process.exit(1);
	}

	switch (command) {
		case "update": {
			const result = await runUpdate();
			process.exit(result.success ? 0 : 1);
			break;
		}
		case "skills:update": {
			const result = await runSkillsUpdate();
			process.exit(result.failed.length > 0 ? 1 : 0);
			break;
		}
	}
}

main().catch((err: unknown) => {
	logger.error(err instanceof Error ? err.message : String(err));
	process.exit(1);
});
```

**Step 4: Update barrel exports**

Replace `tooling/scripts/src/index.ts` with:

```ts
// @onelib/scripts – update pipeline and project scripts
export const SCRIPTS_VERSION = "0.1.0";

export { runUpdate } from "./commands/update.js";
export { runSkillsUpdate, buildSkillList } from "./commands/skills-update.js";
export type { SkillsUpdateResult } from "./commands/skills-update.js";
export type { UpdateResult } from "./commands/update.js";
export { loadConfig } from "./utils/config.js";
export { execCommand } from "./utils/exec.js";
export type { ExecResult } from "./utils/exec.js";
```

**Step 5: Run tests to verify they pass**

Run: `pnpm --filter @onelib/scripts test`

Expected: All CLI tests pass.

**Step 6: Commit**

```bash
git add tooling/scripts/src/cli.ts tooling/scripts/src/__tests__/cli.test.ts tooling/scripts/src/index.ts
git commit -m "feat(scripts): add CLI entry point with command routing"
```

---

## Task 11: Update template `package.json.template`

Add `@onelib/scripts` as a devDependency and the update scripts to the template.

**Files:**
- Modify: `packages/templates/base/package.json.template`

**Step 1: Update the template**

Update `packages/templates/base/package.json.template` to:

```json
{
	"name": "{{PROJECT_NAME}}",
	"version": "0.1.0",
	"private": true,
	"type": "module",
	"scripts": {
		"dev": "next dev --turbopack",
		"build": "next build",
		"start": "next start",
		"lint": "biome check .",
		"format": "biome check --write .",
		"onelib:update": "onelib-scripts update",
		"onelib:skills:update": "onelib-scripts skills:update"
	},
	"dependencies": {
		"next": "^15.3.0",
		"react": "^19.1.0",
		"react-dom": "^19.1.0",
		"onelib": "^0.1.0"
	},
	"devDependencies": {
		"@types/node": "^24.0.0",
		"@types/react": "^19.1.0",
		"@types/react-dom": "^19.1.0",
		"typescript": "^5.8.0",
		"@biomejs/biome": "^2.0.0",
		"tailwindcss": "^4.0.0",
		"@tailwindcss/postcss": "^4.0.0",
		"postcss": "^8.5.0",
		"eslint": "^9.0.0",
		"eslint-config-next": "^15.3.0",
		"prettier": "^3.5.0",
		"@onelib/scripts": "^0.1.0"
	}
}
```

Changes from current:
1. Added `"onelib:update"` and `"onelib:skills:update"` to scripts
2. Added `"@onelib/scripts": "^0.1.0"` to devDependencies

**Step 2: Run existing scaffold integration tests**

Run: `pnpm --filter create-onelib test`

Expected: All 34 tests pass. The scaffold test copies the template and checks file contents — it should still work since we only added fields, didn't remove any.

**Step 3: Commit**

```bash
git add packages/templates/base/package.json.template
git commit -m "feat(templates): add onelib:update scripts and @onelib/scripts devDependency"
```

---

## Task 12: Delete stub test file and add vitest config

The old `index.test.ts` stub test tested only `SCRIPTS_VERSION`. That's now covered by the barrel exports. Replace with a proper vitest config.

**Files:**
- Delete: `tooling/scripts/src/index.test.ts`
- Create: `tooling/scripts/vitest.config.ts`

**Step 1: Delete stub test**

Remove `tooling/scripts/src/index.test.ts`. The `SCRIPTS_VERSION` export is still present in `index.ts` — it just doesn't need a dedicated test since it's a trivial constant.

**Step 2: Create vitest config**

Create `tooling/scripts/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["src/**/*.test.ts"],
	},
});
```

**Step 3: Run all tests**

Run: `pnpm --filter @onelib/scripts test`

Expected: All tests pass (logger: 4, exec: 4, config: 3, skills-update: 5, update: 2, cli: 4 = 22 tests total).

**Step 4: Commit**

```bash
git add tooling/scripts/vitest.config.ts
git rm tooling/scripts/src/index.test.ts
git commit -m "chore(scripts): replace stub test with vitest config"
```

---

## Task 13: Final verification

Run all checks across the entire monorepo to confirm nothing is broken.

**Step 1: Run build**

Run: `pnpm build`

Expected: All packages build successfully (9/9 or 10/10 depending on count).

**Step 2: Run tests**

Run: `pnpm test`

Expected: All tests pass. Expected counts:
- `@onelib/skills`: ~5 tests
- `@onelib/scripts`: ~22 tests
- `create-onelib`: 34 tests
- `@onelib/registry`: 65 tests
- `onelib`: 4 tests
- Total: ~130 tests

**Step 3: Run Biome check**

Run: `pnpm check`

Expected: Clean, no issues.

**Step 4: Review git log**

Run: `git log --oneline` to verify all commits are clean and well-described.

---

## Task Summary

| Task | Description | Tests |
|------|-------------|-------|
| 1 | Add `@onelib/registry` dep to `@onelib/skills` | — |
| 2 | Implement `@onelib/skills` — curated list + types | 5 |
| 3 | Refactor `create-onelib` to use `@onelib/skills` | 34 (existing) |
| 4 | Add CLI deps to `@onelib/scripts` | — |
| 5 | Implement logger utility | 4 |
| 6 | Implement exec utility | 4 |
| 7 | Implement config loader | 3 |
| 8 | Implement skills update command | 5 |
| 9 | Implement update orchestrator | 2 |
| 10 | Implement CLI entry point | 4 |
| 11 | Update template `package.json.template` | — |
| 12 | Delete stub test, add vitest config | — |
| 13 | Final verification | — |
