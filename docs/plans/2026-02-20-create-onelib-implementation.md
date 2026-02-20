# create-onelib CLI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the `create-onelib` CLI that scaffolds standalone Next.js 15 projects with AI agent configs and curated skills.

**Architecture:** Three packages work together: `packages/onelib/` exports `defineConfig()`, `packages/templates/base/` contains the raw Next.js 15 template with placeholder tokens, and `packages/create-onelib/` is the CLI that copies the template, replaces placeholders, installs dependencies, and installs skills. All code is strict TypeScript ESM.

**Tech Stack:** clack (prompts), picocolors (colors), fs-extra (file ops), Zod 4.x (config validation), TypeScript 5.9, Vitest 4.x, Biome 2.x (tab indentation, double quotes, semicolons)

---

## Important Context

- **Working directory:** `.worktrees/create-onelib/` (worktree on `feature/create-onelib` branch)
- **Biome:** tabs, double quotes, semicolons, line width 100
- **Test runner:** `pnpm test --filter=<package>` (runs `vitest run`)
- **Type check:** `pnpm check-types --filter=<package>` (runs `tsc --noEmit`)
- **Lint:** `pnpm check` (runs `biome check .` at root)
- **Build:** `pnpm build --filter=<package>` (runs `tsc`)
- **Existing stubs:** All three packages have stub `index.ts` files that will be replaced.
- **tsconfig extends:** Cannot use Node package exports — must use relative paths like `../../packages/config/tsconfig.library.json`.
- **Zod version:** 4.3.6 (not 3.x). API is mostly compatible.
- **Node:** v24.12.0, pnpm 10.18.1

---

## Task 1: Add dependencies to `packages/onelib/`

**Files:**
- Modify: `packages/onelib/package.json`

**Step 1: Add zod as a dependency**

```bash
pnpm add zod --filter=onelib
```

**Step 2: Verify it installed**

```bash
pnpm ls zod --filter=onelib
```

Expected: Shows `zod` listed as a dependency.

**Step 3: Commit**

```bash
git add packages/onelib/package.json pnpm-lock.yaml
git commit -m "chore(onelib): add zod dependency"
```

---

## Task 2: `defineConfig()` and `OnelibConfig` type

**Files:**
- Create: `packages/onelib/src/types.ts`
- Create: `packages/onelib/src/__tests__/define-config.test.ts`
- Modify: `packages/onelib/src/index.ts` (replace stub)
- Delete: `packages/onelib/src/index.test.ts` (old stub test)
- Modify: `packages/onelib/tsconfig.json` (exclude tests from dist)

**Step 1: Update tsconfig to exclude tests**

Modify `packages/onelib/tsconfig.json`:

```json
{
	"extends": "../../packages/config/tsconfig.library.json",
	"compilerOptions": {
		"outDir": "./dist",
		"rootDir": "./src"
	},
	"include": ["src"],
	"exclude": ["src/**/__tests__"]
}
```

**Step 2: Write the failing test**

Create `packages/onelib/src/__tests__/define-config.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { defineConfig } from "../index.js";
import type { OnelibConfig } from "../types.js";

describe("defineConfig", () => {
	it("returns the config object unchanged", () => {
		const config: OnelibConfig = {
			name: "my-project",
			registry: {
				components: ["button", "card"],
				layouts: [],
			},
			skills: {
				curated: true,
				custom: [],
			},
			theme: {
				preset: "default",
			},
		};

		const result = defineConfig(config);
		expect(result).toEqual(config);
	});

	it("accepts minimal config", () => {
		const config: OnelibConfig = {
			name: "test",
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
		};

		const result = defineConfig(config);
		expect(result.name).toBe("test");
	});

	it("preserves custom theme preset", () => {
		const config: OnelibConfig = {
			name: "test",
			registry: {
				components: [],
				layouts: [],
			},
			skills: {
				curated: false,
				custom: ["my-org/my-skill/cool-skill"],
			},
			theme: {
				preset: "custom",
			},
		};

		const result = defineConfig(config);
		expect(result.theme.preset).toBe("custom");
		expect(result.skills.curated).toBe(false);
	});
});
```

**Step 3: Run test to verify it fails**

```bash
pnpm test --filter=onelib
```

Expected: FAIL — module resolution errors

**Step 4: Create types.ts**

Create `packages/onelib/src/types.ts`:

```ts
export interface OnelibConfig {
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

**Step 5: Replace index.ts**

Replace `packages/onelib/src/index.ts` with:

```ts
import type { OnelibConfig } from "./types.js";

export function defineConfig(config: OnelibConfig): OnelibConfig {
	return config;
}

export type { OnelibConfig };
export const VERSION = "0.1.0";
```

**Step 6: Delete old stub test**

```bash
rm packages/onelib/src/index.test.ts
```

**Step 7: Run test to verify it passes**

```bash
pnpm test --filter=onelib
```

Expected: PASS

**Step 8: Run type check and lint**

```bash
pnpm check-types --filter=onelib && pnpm check
```

Expected: PASS

**Step 9: Commit**

```bash
git add packages/onelib/
git commit -m "feat(onelib): add defineConfig and OnelibConfig type"
```

---

## Task 3: Create the base template — package.json and core configs

**Files:**
- Create: `packages/templates/base/package.json.template`
- Create: `packages/templates/base/tsconfig.json`
- Create: `packages/templates/base/next.config.ts`
- Create: `packages/templates/base/biome.json`
- Create: `packages/templates/base/tailwind.config.ts`
- Create: `packages/templates/base/.eslintrc.json`
- Create: `packages/templates/base/.prettierrc`
- Create: `packages/templates/base/.gitignore.template`

Note: Files that would conflict with monorepo tooling use `.template` suffix. The CLI renames them during copy.

**Step 1: Create the template directory**

```bash
mkdir -p packages/templates/base
```

**Step 2: Create package.json.template**

Create `packages/templates/base/package.json.template`:

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
		"format": "biome check --write ."
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
		"prettier": "^3.5.0"
	}
}
```

**Step 3: Create tsconfig.json**

Create `packages/templates/base/tsconfig.json`:

```json
{
	"compilerOptions": {
		"target": "ES2022",
		"lib": ["dom", "dom.iterable", "ES2022"],
		"allowJs": true,
		"skipLibCheck": true,
		"strict": true,
		"noUncheckedIndexedAccess": true,
		"noEmit": true,
		"esModuleInterop": true,
		"module": "ESNext",
		"moduleResolution": "bundler",
		"resolveJsonModule": true,
		"isolatedModules": true,
		"jsx": "preserve",
		"incremental": true,
		"plugins": [
			{
				"name": "next"
			}
		],
		"paths": {
			"@/*": ["./src/*"]
		}
	},
	"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
	"exclude": ["node_modules"]
}
```

**Step 4: Create next.config.ts**

Create `packages/templates/base/next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

**Step 5: Create biome.json**

Create `packages/templates/base/biome.json`:

```json
{
	"$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
	"formatter": {
		"indentStyle": "tab",
		"lineWidth": 100
	},
	"linter": {
		"rules": {
			"recommended": true
		}
	},
	"javascript": {
		"formatter": {
			"quoteStyle": "double",
			"semicolons": "always"
		}
	},
	"files": {
		"includes": ["src/**/*.ts", "src/**/*.tsx", "*.ts", "*.json"]
	}
}
```

**Step 6: Create tailwind.config.ts**

Create `packages/templates/base/tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [],
};

export default config;
```

**Step 7: Create .eslintrc.json**

Create `packages/templates/base/.eslintrc.json`:

```json
{
	"extends": "next/core-web-vitals"
}
```

**Step 8: Create .prettierrc**

Create `packages/templates/base/.prettierrc`:

```json
{
	"useTabs": true,
	"semi": true,
	"singleQuote": false,
	"trailingComma": "all",
	"printWidth": 100
}
```

**Step 9: Create .gitignore.template**

Create `packages/templates/base/.gitignore.template`:

```
# dependencies
node_modules/
.pnpm-store/

# next.js
.next/
out/

# build
dist/

# env
.env
.env*.local

# debug
npm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

**Step 10: Commit**

```bash
git add packages/templates/base/
git commit -m "feat(templates): add base template config files"
```

---

## Task 4: Create the base template — source files

**Files:**
- Create: `packages/templates/base/src/app/layout.tsx`
- Create: `packages/templates/base/src/app/page.tsx`
- Create: `packages/templates/base/src/app/globals.css`
- Create: `packages/templates/base/src/lib/utils.ts`
- Create: `packages/templates/base/public/.gitkeep`

**Step 1: Create directories**

```bash
mkdir -p packages/templates/base/src/app
mkdir -p packages/templates/base/src/components/ui
mkdir -p packages/templates/base/src/lib
mkdir -p packages/templates/base/public
```

**Step 2: Create layout.tsx**

Create `packages/templates/base/src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "{{PROJECT_NAME}}",
	description: "Built with Onelib",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
```

**Step 3: Create page.tsx**

Create `packages/templates/base/src/app/page.tsx`:

```tsx
export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<h1 className="text-4xl font-bold">{{PROJECT_NAME}}</h1>
			<p className="mt-4 text-lg text-gray-600">Built with Onelib</p>
		</main>
	);
}
```

**Step 4: Create globals.css**

Create `packages/templates/base/src/app/globals.css`:

```css
@import "tailwindcss";
```

**Step 5: Create utils.ts**

Create `packages/templates/base/src/lib/utils.ts`:

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
```

**Step 6: Create public/.gitkeep**

```bash
touch packages/templates/base/public/.gitkeep
```

**Step 7: Commit**

```bash
git add packages/templates/base/src/ packages/templates/base/public/
git commit -m "feat(templates): add base template source files"
```

---

## Task 5: Create the base template — agent configs and project focus

**Files:**
- Create: `packages/templates/base/.opencode/config.json`
- Create: `packages/templates/base/.claude/settings.json`
- Create: `packages/templates/base/.codex/config.yaml`
- Create: `packages/templates/base/onelib.config.ts`
- Create: `packages/templates/base/project-focus.md`

**Step 1: Create agent config directories**

```bash
mkdir -p packages/templates/base/.opencode
mkdir -p packages/templates/base/.claude
mkdir -p packages/templates/base/.codex
```

**Step 2: Create .opencode/config.json**

Create `packages/templates/base/.opencode/config.json`:

```json
{
	"$schema": "https://opencode.ai/config.json",
	"provider": "anthropic",
	"model": "claude-sonnet-4-20250514"
}
```

**Step 3: Create .claude/settings.json**

Create `packages/templates/base/.claude/settings.json`:

```json
{
	"permissions": {
		"allow": [
			"Bash(npm:*)",
			"Bash(pnpm:*)",
			"Bash(npx:*)",
			"Bash(git:*)",
			"Bash(biome:*)"
		],
		"deny": []
	}
}
```

**Step 4: Create .codex/config.yaml**

Create `packages/templates/base/.codex/config.yaml`:

```yaml
# Codex configuration for {{PROJECT_NAME}}
model: o4-mini
approval_policy: suggest
```

**Step 5: Create onelib.config.ts**

Create `packages/templates/base/onelib.config.ts`:

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

**Step 6: Create project-focus.md**

Create `packages/templates/base/project-focus.md`:

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

**Step 7: Commit**

```bash
git add packages/templates/base/.opencode/ packages/templates/base/.claude/ packages/templates/base/.codex/ packages/templates/base/onelib.config.ts packages/templates/base/project-focus.md
git commit -m "feat(templates): add agent configs, onelib config, and project focus"
```

---

## Task 6: Add CLI dependencies to `packages/create-onelib/`

**Files:**
- Modify: `packages/create-onelib/package.json`

**Step 1: Add runtime dependencies**

```bash
pnpm add @clack/prompts picocolors fs-extra --filter=create-onelib
```

**Step 2: Add type definitions for fs-extra**

```bash
pnpm add -D @types/fs-extra --filter=create-onelib
```

**Step 3: Add workspace dependency on templates**

```bash
pnpm add @onelib/templates --filter=create-onelib --workspace
```

**Step 4: Verify**

```bash
pnpm ls --filter=create-onelib
```

Expected: Shows `@clack/prompts`, `picocolors`, `fs-extra`, `@onelib/templates` listed.

**Step 5: Commit**

```bash
git add packages/create-onelib/package.json pnpm-lock.yaml
git commit -m "chore(create-onelib): add CLI dependencies"
```

---

## Task 7: Pre-flight check utilities

**Files:**
- Create: `packages/create-onelib/src/utils/preflight.ts`
- Create: `packages/create-onelib/src/__tests__/preflight.test.ts`

**Step 1: Write the failing test**

Create `packages/create-onelib/src/__tests__/preflight.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { checkNodeVersion, parseNodeVersion } from "../utils/preflight.js";

describe("parseNodeVersion", () => {
	it("parses 'v20.0.0' to 20", () => {
		expect(parseNodeVersion("v20.0.0")).toBe(20);
	});

	it("parses 'v24.12.0' to 24", () => {
		expect(parseNodeVersion("v24.12.0")).toBe(24);
	});

	it("parses '18.17.1' without v prefix to 18", () => {
		expect(parseNodeVersion("18.17.1")).toBe(18);
	});

	it("returns NaN for garbage input", () => {
		expect(parseNodeVersion("not-a-version")).toBeNaN();
	});
});

describe("checkNodeVersion", () => {
	it("returns ok for Node >= 20", () => {
		const result = checkNodeVersion(20);
		expect(result.ok).toBe(true);
	});

	it("returns ok for Node 24", () => {
		const result = checkNodeVersion(24);
		expect(result.ok).toBe(true);
	});

	it("returns error for Node 18", () => {
		const result = checkNodeVersion(18);
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.message).toContain("20");
		}
	});

	it("returns error for Node 16", () => {
		const result = checkNodeVersion(16);
		expect(result.ok).toBe(false);
	});
});
```

**Step 2: Run test to verify it fails**

```bash
pnpm test --filter=create-onelib
```

Expected: FAIL — cannot find module `../utils/preflight.js`

**Step 3: Write minimal implementation**

Create `packages/create-onelib/src/utils/preflight.ts`:

```ts
const MIN_NODE_VERSION = 20;

export function parseNodeVersion(versionString: string): number {
	const cleaned = versionString.replace(/^v/, "");
	const major = Number.parseInt(cleaned.split(".")[0] ?? "", 10);
	return major;
}

type PreflightResult = { ok: true } | { ok: false; message: string };

export function checkNodeVersion(majorVersion: number): PreflightResult {
	if (majorVersion >= MIN_NODE_VERSION) {
		return { ok: true };
	}
	return {
		ok: false,
		message: `Node.js >= ${MIN_NODE_VERSION} is required. You are running Node ${majorVersion}.`,
	};
}
```

**Step 4: Run test to verify it passes**

```bash
pnpm test --filter=create-onelib
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/create-onelib/src/utils/ packages/create-onelib/src/__tests__/
git commit -m "feat(create-onelib): add pre-flight check utilities"
```

---

## Task 8: Placeholder replacement utility

**Files:**
- Create: `packages/create-onelib/src/utils/placeholders.ts`
- Create: `packages/create-onelib/src/__tests__/placeholders.test.ts`

**Step 1: Write the failing test**

Create `packages/create-onelib/src/__tests__/placeholders.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { replacePlaceholders } from "../utils/placeholders.js";

describe("replacePlaceholders", () => {
	it("replaces {{PROJECT_NAME}} with project name", () => {
		const input = "Hello {{PROJECT_NAME}}!";
		const result = replacePlaceholders(input, { projectName: "my-app" });
		expect(result).toBe("Hello my-app!");
	});

	it("replaces multiple occurrences", () => {
		const input = "{{PROJECT_NAME}} is {{PROJECT_NAME}}";
		const result = replacePlaceholders(input, { projectName: "cool" });
		expect(result).toBe("cool is cool");
	});

	it("leaves unknown placeholders untouched", () => {
		const input = "{{UNKNOWN}} stays";
		const result = replacePlaceholders(input, { projectName: "my-app" });
		expect(result).toBe("{{UNKNOWN}} stays");
	});

	it("handles empty string", () => {
		const result = replacePlaceholders("", { projectName: "test" });
		expect(result).toBe("");
	});

	it("handles content with no placeholders", () => {
		const input = "No placeholders here";
		const result = replacePlaceholders(input, { projectName: "test" });
		expect(result).toBe("No placeholders here");
	});
});
```

**Step 2: Run test to verify it fails**

```bash
pnpm test --filter=create-onelib
```

Expected: FAIL — cannot find module `../utils/placeholders.js`

**Step 3: Write minimal implementation**

Create `packages/create-onelib/src/utils/placeholders.ts`:

```ts
export interface PlaceholderValues {
	projectName: string;
}

export function replacePlaceholders(content: string, values: PlaceholderValues): string {
	return content.replaceAll("{{PROJECT_NAME}}", values.projectName);
}
```

**Step 4: Run test to verify it passes**

```bash
pnpm test --filter=create-onelib
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/create-onelib/src/utils/placeholders.ts packages/create-onelib/src/__tests__/placeholders.test.ts
git commit -m "feat(create-onelib): add placeholder replacement utility"
```

---

## Task 9: Skills list constant

**Files:**
- Create: `packages/create-onelib/src/constants.ts`
- Create: `packages/create-onelib/src/__tests__/constants.test.ts`

**Step 1: Write the failing test**

Create `packages/create-onelib/src/__tests__/constants.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { CURATED_SKILLS, TEMPLATE_FILES_WITH_PLACEHOLDERS } from "../constants.js";

describe("CURATED_SKILLS", () => {
	it("contains 9 skills", () => {
		expect(CURATED_SKILLS).toHaveLength(9);
	});

	it("each skill has owner/repo/skill format", () => {
		for (const skill of CURATED_SKILLS) {
			const parts = skill.split("/");
			expect(parts.length).toBeGreaterThanOrEqual(3);
		}
	});

	it("includes expected skills", () => {
		expect(CURATED_SKILLS).toContain("anthropics/skills/frontend-design");
		expect(CURATED_SKILLS).toContain("obra/superpowers/brainstorming");
		expect(CURATED_SKILLS).toContain("obra/superpowers/test-driven-development");
	});
});

describe("TEMPLATE_FILES_WITH_PLACEHOLDERS", () => {
	it("lists files that need placeholder replacement", () => {
		expect(TEMPLATE_FILES_WITH_PLACEHOLDERS.length).toBeGreaterThan(0);
	});

	it("includes package.json.template", () => {
		expect(TEMPLATE_FILES_WITH_PLACEHOLDERS).toContain("package.json.template");
	});
});
```

**Step 2: Run test to verify it fails**

```bash
pnpm test --filter=create-onelib
```

Expected: FAIL — cannot find module `../constants.js`

**Step 3: Write minimal implementation**

Create `packages/create-onelib/src/constants.ts`:

```ts
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

**Step 4: Run test to verify it passes**

```bash
pnpm test --filter=create-onelib
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/create-onelib/src/constants.ts packages/create-onelib/src/__tests__/constants.test.ts
git commit -m "feat(create-onelib): add curated skills list and template constants"
```

---

## Task 10: Scaffold utility — copy template and replace placeholders

**Files:**
- Create: `packages/create-onelib/src/utils/scaffold.ts`
- Create: `packages/create-onelib/src/__tests__/integration/scaffold.test.ts`

**Step 1: Write the failing integration test**

Create `packages/create-onelib/src/__tests__/integration/scaffold.test.ts`:

```ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { scaffoldProject } from "../../utils/scaffold.js";

describe("scaffoldProject", () => {
	let tmpDir: string;

	beforeEach(() => {
		tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "onelib-test-"));
	});

	afterEach(() => {
		fs.rmSync(tmpDir, { recursive: true, force: true });
	});

	it("creates the project directory", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		expect(fs.existsSync(projectDir)).toBe(true);
	});

	it("copies package.json with replaced project name", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		const pkgPath = path.join(projectDir, "package.json");
		expect(fs.existsSync(pkgPath)).toBe(true);
		const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
		expect(pkg.name).toBe("my-project");
	});

	it("copies tsconfig.json", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		expect(fs.existsSync(path.join(projectDir, "tsconfig.json"))).toBe(true);
	});

	it("copies src/app/layout.tsx with replaced project name", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		const layoutPath = path.join(projectDir, "src/app/layout.tsx");
		expect(fs.existsSync(layoutPath)).toBe(true);
		const content = fs.readFileSync(layoutPath, "utf-8");
		expect(content).toContain("my-project");
		expect(content).not.toContain("{{PROJECT_NAME}}");
	});

	it("creates onelib.config.ts with replaced project name", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		const configPath = path.join(projectDir, "onelib.config.ts");
		expect(fs.existsSync(configPath)).toBe(true);
		const content = fs.readFileSync(configPath, "utf-8");
		expect(content).toContain("my-project");
		expect(content).not.toContain("{{PROJECT_NAME}}");
	});

	it("creates project-focus.md with replaced project name", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		const focusPath = path.join(projectDir, "project-focus.md");
		expect(fs.existsSync(focusPath)).toBe(true);
		const content = fs.readFileSync(focusPath, "utf-8");
		expect(content).toContain("my-project");
		expect(content).not.toContain("{{PROJECT_NAME}}");
	});

	it("renames .gitignore.template to .gitignore", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		expect(fs.existsSync(path.join(projectDir, ".gitignore"))).toBe(true);
		expect(fs.existsSync(path.join(projectDir, ".gitignore.template"))).toBe(false);
	});

	it("creates agent config directories", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		expect(fs.existsSync(path.join(projectDir, ".opencode/config.json"))).toBe(true);
		expect(fs.existsSync(path.join(projectDir, ".claude/settings.json"))).toBe(true);
		expect(fs.existsSync(path.join(projectDir, ".codex/config.yaml"))).toBe(true);
	});

	it("does not leave any {{PROJECT_NAME}} placeholders", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");

		function checkDir(dir: string): void {
			const entries = fs.readdirSync(dir, { withFileTypes: true });
			for (const entry of entries) {
				const fullPath = path.join(dir, entry.name);
				if (entry.isDirectory()) {
					if (entry.name !== "node_modules") {
						checkDir(fullPath);
					}
				} else {
					const content = fs.readFileSync(fullPath, "utf-8");
					expect(content, `Placeholder found in ${fullPath}`).not.toContain(
						"{{PROJECT_NAME}}",
					);
				}
			}
		}

		checkDir(projectDir);
	});
});
```

**Step 2: Run test to verify it fails**

```bash
pnpm test --filter=create-onelib
```

Expected: FAIL — cannot find module `../../utils/scaffold.js`

**Step 3: Write minimal implementation**

Create `packages/create-onelib/src/utils/scaffold.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fse from "fs-extra";
import { TEMPLATE_FILES_WITH_PLACEHOLDERS, TEMPLATE_RENAME_MAP } from "../constants.js";
import { type PlaceholderValues, replacePlaceholders } from "./placeholders.js";

function getTemplatePath(): string {
	const currentDir = path.dirname(fileURLToPath(import.meta.url));
	// Navigate from src/utils/ or dist/utils/ to packages/templates/base/
	return path.resolve(currentDir, "../../../templates/base");
}

export async function scaffoldProject(projectDir: string, projectName: string): Promise<void> {
	const templateDir = getTemplatePath();

	// Copy the entire template directory
	await fse.copy(templateDir, projectDir);

	const values: PlaceholderValues = { projectName };

	// Replace placeholders in files that need them
	for (const file of TEMPLATE_FILES_WITH_PLACEHOLDERS) {
		const filePath = path.join(projectDir, file);
		if (fs.existsSync(filePath)) {
			const content = fs.readFileSync(filePath, "utf-8");
			const replaced = replacePlaceholders(content, values);
			fs.writeFileSync(filePath, replaced, "utf-8");
		}
	}

	// Rename .template files
	for (const [from, to] of Object.entries(TEMPLATE_RENAME_MAP)) {
		const fromPath = path.join(projectDir, from);
		const toPath = path.join(projectDir, to);
		if (fs.existsSync(fromPath)) {
			const content = fs.readFileSync(fromPath, "utf-8");
			const replaced = replacePlaceholders(content, values);
			fs.writeFileSync(toPath, replaced, "utf-8");
			fs.unlinkSync(fromPath);
		}
	}
}
```

**Step 4: Run test to verify it passes**

```bash
pnpm test --filter=create-onelib
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/create-onelib/src/utils/scaffold.ts packages/create-onelib/src/__tests__/integration/
git commit -m "feat(create-onelib): add scaffold utility with template copy and placeholder replacement"
```

---

## Task 11: Shell command runner utility

**Files:**
- Create: `packages/create-onelib/src/utils/exec.ts`
- Create: `packages/create-onelib/src/__tests__/exec.test.ts`

**Step 1: Write the failing test**

Create `packages/create-onelib/src/__tests__/exec.test.ts`:

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
			// /tmp may resolve to /private/tmp on macOS
			expect(result.stdout.trim()).toMatch(/\/tmp$/);
		}
	});
});
```

**Step 2: Run test to verify it fails**

```bash
pnpm test --filter=create-onelib
```

Expected: FAIL — cannot find module `../utils/exec.js`

**Step 3: Write minimal implementation**

Create `packages/create-onelib/src/utils/exec.ts`:

```ts
import { execFile } from "node:child_process";

type ExecResult =
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
		const child = execFile(
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

export function isCommandAvailable(command: string): Promise<boolean> {
	return new Promise((resolve) => {
		execFile("which", [command], (error) => {
			resolve(!error);
		});
	});
}
```

**Step 4: Run test to verify it passes**

```bash
pnpm test --filter=create-onelib
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/create-onelib/src/utils/exec.ts packages/create-onelib/src/__tests__/exec.test.ts
git commit -m "feat(create-onelib): add shell command runner utility"
```

---

## Task 12: Skills installer

**Files:**
- Create: `packages/create-onelib/src/utils/skills.ts`
- Create: `packages/create-onelib/src/__tests__/skills.test.ts`

**Step 1: Write the failing test**

Create `packages/create-onelib/src/__tests__/skills.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { buildSkillInstallCommands } from "../utils/skills.js";
import { CURATED_SKILLS } from "../constants.js";

describe("buildSkillInstallCommands", () => {
	it("generates one command per curated skill", () => {
		const commands = buildSkillInstallCommands();
		expect(commands).toHaveLength(CURATED_SKILLS.length);
	});

	it("each command is npx skills add <skill>", () => {
		const commands = buildSkillInstallCommands();
		for (const cmd of commands) {
			expect(cmd.command).toBe("npx");
			expect(cmd.args[0]).toBe("skills");
			expect(cmd.args[1]).toBe("add");
			expect(cmd.args[2]).toBeDefined();
		}
	});

	it("includes the correct skill paths", () => {
		const commands = buildSkillInstallCommands();
		const skillPaths = commands.map((c) => c.args[2]);
		expect(skillPaths).toContain("anthropics/skills/frontend-design");
		expect(skillPaths).toContain("obra/superpowers/brainstorming");
	});
});
```

**Step 2: Run test to verify it fails**

```bash
pnpm test --filter=create-onelib
```

Expected: FAIL — cannot find module `../utils/skills.js`

**Step 3: Write minimal implementation**

Create `packages/create-onelib/src/utils/skills.ts`:

```ts
import { CURATED_SKILLS, SKILL_INSTALL_TIMEOUT_MS } from "../constants.js";
import { execCommand } from "./exec.js";

export interface SkillCommand {
	command: string;
	args: string[];
	label: string;
}

export function buildSkillInstallCommands(): SkillCommand[] {
	return CURATED_SKILLS.map((skill) => ({
		command: "npx",
		args: ["skills", "add", skill],
		label: skill,
	}));
}

export interface SkillInstallResult {
	installed: string[];
	failed: string[];
}

export async function installSkills(cwd: string): Promise<SkillInstallResult> {
	const commands = buildSkillInstallCommands();
	const installed: string[] = [];
	const failed: string[] = [];

	for (const cmd of commands) {
		const result = await execCommand(cmd.command, cmd.args, {
			cwd,
			timeoutMs: SKILL_INSTALL_TIMEOUT_MS,
		});

		if (result.ok) {
			installed.push(cmd.label);
		} else {
			failed.push(cmd.label);
		}
	}

	return { installed, failed };
}
```

**Step 4: Run test to verify it passes**

```bash
pnpm test --filter=create-onelib
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/create-onelib/src/utils/skills.ts packages/create-onelib/src/__tests__/skills.test.ts
git commit -m "feat(create-onelib): add skills installer utility"
```

---

## Task 13: Main CLI entry point

**Files:**
- Modify: `packages/create-onelib/src/index.ts` (replace stub)
- Delete: `packages/create-onelib/src/index.test.ts` (old stub test)
- Modify: `packages/create-onelib/tsconfig.json` (exclude tests)

**Step 1: Update tsconfig to exclude tests**

Modify `packages/create-onelib/tsconfig.json`:

```json
{
	"extends": "../../packages/config/tsconfig.library.json",
	"compilerOptions": {
		"outDir": "./dist",
		"rootDir": "./src"
	},
	"include": ["src"],
	"exclude": ["src/**/__tests__"]
}
```

**Step 2: Delete old stub test**

```bash
rm packages/create-onelib/src/index.test.ts
```

**Step 3: Write the CLI entry point**

Replace `packages/create-onelib/src/index.ts` with:

```ts
#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_PROJECT_NAME } from "./constants.js";
import { execCommand, isCommandAvailable } from "./utils/exec.js";
import { parseNodeVersion, checkNodeVersion } from "./utils/preflight.js";
import { scaffoldProject } from "./utils/scaffold.js";
import { installSkills } from "./utils/skills.js";

export async function main(): Promise<void> {
	p.intro(pc.cyan("create-onelib") + " — scaffold an Onelib project");

	// Pre-flight: Node version
	const nodeVersion = parseNodeVersion(process.version);
	const nodeCheck = checkNodeVersion(nodeVersion);
	if (!nodeCheck.ok) {
		p.cancel(pc.red(nodeCheck.message));
		process.exit(1);
	}

	// Pre-flight: pnpm
	const hasPnpm = await isCommandAvailable("pnpm");
	if (!hasPnpm) {
		p.cancel(
			pc.red("pnpm is required but not found. Install it with: corepack enable"),
		);
		process.exit(1);
	}

	// Prompt: project name
	const projectName = await p.text({
		message: "What is your project name?",
		placeholder: DEFAULT_PROJECT_NAME,
		defaultValue: DEFAULT_PROJECT_NAME,
		validate(value) {
			if (!value.trim()) return "Project name is required";
			if (!/^[a-z0-9-]+$/.test(value)) {
				return "Project name must be lowercase alphanumeric with hyphens only";
			}
		},
	});

	if (p.isCancel(projectName)) {
		p.cancel("Cancelled.");
		process.exit(0);
	}

	const projectDir = path.resolve(process.cwd(), projectName);

	// Check if directory exists
	if (fs.existsSync(projectDir)) {
		const entries = fs.readdirSync(projectDir);
		if (entries.length > 0) {
			const overwrite = await p.confirm({
				message: `Directory ${pc.bold(projectName)} already exists and is not empty. Overwrite?`,
				initialValue: false,
			});

			if (p.isCancel(overwrite) || !overwrite) {
				p.cancel("Cancelled.");
				process.exit(0);
			}

			fs.rmSync(projectDir, { recursive: true, force: true });
		}
	}

	// Scaffold
	const scaffoldSpinner = p.spinner();
	scaffoldSpinner.start("Scaffolding project...");
	try {
		await scaffoldProject(projectDir, projectName);
		scaffoldSpinner.stop("Project scaffolded");
	} catch (error) {
		scaffoldSpinner.stop("Scaffold failed");
		// Clean up on fatal error
		if (fs.existsSync(projectDir)) {
			fs.rmSync(projectDir, { recursive: true, force: true });
		}
		p.cancel(
			pc.red(
				`Failed to scaffold project: ${error instanceof Error ? error.message : String(error)}`,
			),
		);
		process.exit(1);
	}

	// Install dependencies
	const installSpinner = p.spinner();
	installSpinner.start("Installing dependencies...");
	const installResult = await execCommand("pnpm", ["install"], { cwd: projectDir });
	if (installResult.ok) {
		installSpinner.stop("Dependencies installed");
	} else {
		installSpinner.stop(pc.yellow("Dependency install failed — run `pnpm install` manually"));
	}

	// Install skills
	const skillsSpinner = p.spinner();
	skillsSpinner.start("Installing curated skills...");
	const skillsResult = await installSkills(projectDir);
	if (skillsResult.failed.length === 0) {
		skillsSpinner.stop(`Installed ${skillsResult.installed.length} skills`);
	} else {
		skillsSpinner.stop(
			pc.yellow(
				`Installed ${skillsResult.installed.length} skills, ${skillsResult.failed.length} failed`,
			),
		);
		if (skillsResult.failed.length > 0) {
			p.note(
				skillsResult.failed.map((s) => `  - ${s}`).join("\n"),
				"Failed skills (install manually with npx skills add <skill>)",
			);
		}
	}

	// Git init
	const hasGit = await isCommandAvailable("git");
	if (hasGit) {
		const gitSpinner = p.spinner();
		gitSpinner.start("Initializing git...");
		const gitInit = await execCommand("git", ["init"], { cwd: projectDir });
		if (gitInit.ok) {
			await execCommand("git", ["add", "."], { cwd: projectDir });
			await execCommand("git", ["commit", "-m", "Initial commit from create-onelib"], {
				cwd: projectDir,
			});
			gitSpinner.stop("Git initialized with initial commit");
		} else {
			gitSpinner.stop(pc.yellow("Git init failed — skipping"));
		}
	}

	// Done
	p.outro(
		`${pc.green("Done!")} Your project is ready at ${pc.bold(projectName)}\n\n` +
			`  ${pc.cyan("cd")} ${projectName}\n` +
			`  ${pc.cyan("pnpm dev")}\n`,
	);
}

main();
```

**Step 4: Run type check**

```bash
pnpm check-types --filter=create-onelib
```

Expected: PASS

**Step 5: Run lint**

```bash
pnpm check
```

Expected: PASS

**Step 6: Commit**

```bash
git add packages/create-onelib/
git commit -m "feat(create-onelib): add main CLI entry point with full scaffold flow"
```

---

## Task 14: Final verification

**Step 1: Run full monorepo checks**

```bash
pnpm build
pnpm test
pnpm check
```

Expected: All tasks pass across the entire monorepo. All packages build, all tests pass, Biome is clean.

**Step 2: Run create-onelib tests specifically**

```bash
pnpm test --filter=create-onelib
```

Expected: All unit and integration tests pass.

**Step 3: Run onelib tests specifically**

```bash
pnpm test --filter=onelib
```

Expected: All defineConfig tests pass.

**Step 4: Review git log**

```bash
git log --oneline -15
```

Expected: Clean commit history with one commit per task.

**Step 5: Verify test counts**

Expected test counts:
- `create-onelib`: ~25-30 tests (preflight, placeholders, constants, exec, skills, integration)
- `onelib`: ~3 tests (defineConfig)
- `@onelib/registry`: 65 tests (existing, unchanged)

---

## Summary

| Task | Package | What |
|------|---------|------|
| 1 | onelib | Add zod dependency |
| 2 | onelib | `defineConfig()` + `OnelibConfig` type |
| 3 | templates | Base template config files |
| 4 | templates | Base template source files |
| 5 | templates | Agent configs + project focus |
| 6 | create-onelib | Add CLI dependencies |
| 7 | create-onelib | Pre-flight check utilities |
| 8 | create-onelib | Placeholder replacement |
| 9 | create-onelib | Skills list constants |
| 10 | create-onelib | Scaffold utility (copy + replace) |
| 11 | create-onelib | Shell command runner |
| 12 | create-onelib | Skills installer |
| 13 | create-onelib | Main CLI entry point |
| 14 | all | Final verification |
