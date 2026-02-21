# Component Registry & Scaffold Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create the `packages/components/` package with registry metadata, scaffold integration, and update flow so every generated project ships with all curated components pre-installed.

**Architecture:** Components live as flat modules inside `packages/components/src/` grouped by category. A `registry.json` holds metadata. During scaffold, `.tsx` files are copied to the generated project's `src/components/`. The update command uses checksum-based diffing to safely update components without overwriting user edits.

**Tech Stack:** TypeScript 5.9, Zod 4.x, Vitest 4.x, Node 24, pnpm workspaces

---

## Task 1: Expand Registry Source & Category Enums

Update `@onelib/registry` schemas to support the 5 source libraries and the new component categories used by our curated list.

**Files:**
- Modify: `packages/registry/src/schemas/common.ts`
- Modify: `packages/registry/src/schemas/__tests__/common.test.ts`

**Step 1: Write the failing tests**

Add tests in `packages/registry/src/schemas/__tests__/common.test.ts` for the new source values and category values:

```typescript
// In the SourceSchema describe block, update the "accepts valid sources" test:
it("accepts valid sources", () => {
	for (const source of [
		"shadcn", "magicui", "aceternity", "onelib", "custom",
		"seraui", "reactbits", "skiperui", "buouui",
	]) {
		expect(SourceSchema.parse(source)).toBe(source);
	}
});

// In the ComponentCategorySchema describe block, update the "accepts valid categories" test:
it("accepts valid categories", () => {
	for (const cat of [
		"ui", "layout", "data-display", "feedback", "navigation", "overlay", "form",
		"buttons", "effects", "accordions", "cards", "sections", "pages",
		"backgrounds", "text-animations", "gallery",
	]) {
		expect(ComponentCategorySchema.parse(cat)).toBe(cat);
	}
});
```

**Step 2: Run tests to verify they fail**

Run: `pnpm --filter @onelib/registry test`
Expected: FAIL — new source/category values not in enum

**Step 3: Update the schemas**

In `packages/registry/src/schemas/common.ts`:

```typescript
export const SourceSchema = z.enum([
	"shadcn", "magicui", "aceternity", "onelib", "custom",
	"seraui", "reactbits", "skiperui", "buouui",
]);

export const ComponentCategorySchema = z.enum([
	"ui", "layout", "data-display", "feedback", "navigation", "overlay", "form",
	"buttons", "effects", "accordions", "cards", "sections", "pages",
	"backgrounds", "text-animations", "gallery",
]);
```

**Step 4: Run tests to verify they pass**

Run: `pnpm --filter @onelib/registry test`
Expected: ALL PASS

**Step 5: Commit**

```bash
git add packages/registry/src/schemas/common.ts packages/registry/src/schemas/__tests__/common.test.ts
git commit -m "feat(registry): expand source and category enums for curated component libraries"
```

---

## Task 2: Add `sourceUrl` Field to ComponentSchema

Add the optional `sourceUrl` field to the component schema for linking to upstream documentation.

**Files:**
- Modify: `packages/registry/src/schemas/component.ts`
- Modify: `packages/registry/src/schemas/__tests__/component.test.ts`

**Step 1: Write the failing tests**

Add tests in `packages/registry/src/schemas/__tests__/component.test.ts`:

```typescript
it("accepts sourceUrl when provided", () => {
	const result = ComponentSchema.parse({
		...validComponent,
		sourceUrl: "https://seraui.com/docs/buttons/basic",
	});
	expect(result.sourceUrl).toBe("https://seraui.com/docs/buttons/basic");
});

it("defaults sourceUrl to undefined when omitted", () => {
	const result = ComponentSchema.parse(validComponent);
	expect(result.sourceUrl).toBeUndefined();
});
```

**Step 2: Run tests to verify they fail**

Run: `pnpm --filter @onelib/registry test`
Expected: FAIL — `sourceUrl` not in schema (Zod strips unknown keys, but the assertion on the parsed value will fail)

**Step 3: Update the schema**

In `packages/registry/src/schemas/component.ts`, add to the z.object:

```typescript
sourceUrl: z.string().url().optional(),
```

**Step 4: Run tests to verify they pass**

Run: `pnpm --filter @onelib/registry test`
Expected: ALL PASS

**Step 5: Commit**

```bash
git add packages/registry/src/schemas/component.ts packages/registry/src/schemas/__tests__/component.test.ts
git commit -m "feat(registry): add optional sourceUrl field to ComponentSchema"
```

---

## Task 3: Create `packages/components/` Package Scaffold

Set up the new package with package.json, tsconfig, and initial directory structure.

**Files:**
- Create: `packages/components/package.json`
- Create: `packages/components/tsconfig.json`
- Create: `packages/components/src/index.ts`
- Modify: `vitest.workspace.ts` (add `"packages/components"`)

**Step 1: Create package.json**

```json
{
	"name": "@onelib/components",
	"version": "0.1.0",
	"description": "Curated component library for Onelib projects",
	"type": "module",
	"main": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"import": "./dist/index.js"
		},
		"./registry.json": "./registry.json"
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
		"@onelib/registry": "workspace:*"
	},
	"devDependencies": {
		"typescript": "^5.8.0"
	}
}
```

**Step 2: Create tsconfig.json**

```json
{
	"extends": "../../tsconfig.json",
	"compilerOptions": {
		"outDir": "dist",
		"rootDir": "src"
	},
	"include": ["src"]
}
```

**Step 3: Create src/index.ts**

```typescript
export const COMPONENTS_VERSION = "0.1.0";
```

**Step 4: Add to vitest.workspace.ts**

Add `"packages/components"` to the workspace array.

**Step 5: Run pnpm install**

Run: `pnpm install`
Expected: Workspace links resolved

**Step 6: Run build and test**

Run: `pnpm --filter @onelib/components build && pnpm --filter @onelib/components test`
Expected: Build succeeds, no tests yet (or empty test run)

**Step 7: Commit**

```bash
git add packages/components/ vitest.workspace.ts pnpm-lock.yaml
git commit -m "feat(components): scaffold packages/components package"
```

---

## Task 4: Create Component Registry Schema & Validation

Create the `registry.json` file and a validation utility that reads and validates it against the registry schemas.

**Files:**
- Create: `packages/components/registry.json`
- Create: `packages/components/src/registry.ts`
- Create: `packages/components/src/__tests__/registry.test.ts`

**Step 1: Write the failing test**

Create `packages/components/src/__tests__/registry.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { loadComponentRegistry, validateComponentRegistry } from "../registry.js";

describe("validateComponentRegistry", () => {
	it("validates a valid registry", () => {
		const registry = {
			version: "0.1.0",
			components: [
				{
					name: "basic-button",
					displayName: "Basic Button",
					category: "buttons",
					source: "seraui",
					sourceUrl: "https://seraui.com/docs/buttons/basic",
					version: "0.1.0",
					description: "Clean, accessible button with variants",
					files: ["buttons/basic-button/basic-button.tsx"],
					dependencies: [],
					tags: ["button", "interactive"],
				},
			],
		};
		const result = validateComponentRegistry(registry);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.components).toHaveLength(1);
			expect(result.data.components[0]?.name).toBe("basic-button");
		}
	});

	it("rejects invalid registry", () => {
		const result = validateComponentRegistry({ version: "bad", components: [] });
		expect(result.success).toBe(false);
	});
});

describe("loadComponentRegistry", () => {
	it("loads and validates the registry.json file", () => {
		const result = loadComponentRegistry();
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.version).toBe("0.1.0");
			expect(Array.isArray(result.data.components)).toBe(true);
		}
	});
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @onelib/components test`
Expected: FAIL — `registry.ts` doesn't exist

**Step 3: Create the registry.json seed**

Create `packages/components/registry.json`:

```json
{
	"version": "0.1.0",
	"components": []
}
```

**Step 4: Implement registry.ts**

Create `packages/components/src/registry.ts`:

```typescript
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { ComponentSchema } from "@onelib/registry";
import { SemverSchema } from "@onelib/registry";

const ComponentRegistrySchema = z.object({
	version: SemverSchema,
	components: z.array(ComponentSchema),
});

export type ComponentRegistry = z.infer<typeof ComponentRegistrySchema>;

export type ValidationResult =
	| { success: true; data: ComponentRegistry }
	| { success: false; error: z.ZodError };

export function validateComponentRegistry(data: unknown): ValidationResult {
	const result = ComponentRegistrySchema.safeParse(data);
	if (result.success) {
		return { success: true, data: result.data };
	}
	return { success: false, error: result.error };
}

export function loadComponentRegistry(): ValidationResult {
	const currentDir = dirname(fileURLToPath(import.meta.url));
	const registryPath = resolve(currentDir, "../registry.json");
	const raw = readFileSync(registryPath, "utf-8");
	const data: unknown = JSON.parse(raw);
	return validateComponentRegistry(data);
}
```

**Step 5: Export from index.ts**

Update `packages/components/src/index.ts`:

```typescript
export const COMPONENTS_VERSION = "0.1.0";
export { loadComponentRegistry, validateComponentRegistry } from "./registry.js";
export type { ComponentRegistry, ValidationResult } from "./registry.js";
```

**Step 6: Run tests to verify they pass**

Run: `pnpm --filter @onelib/components test`
Expected: ALL PASS

**Step 7: Commit**

```bash
git add packages/components/
git commit -m "feat(components): add registry.json and validation utility"
```

---

## Task 5: Create Component Scaffold Utility

Build the utility that copies component `.tsx` files from `packages/components/src/` into a target project directory, generates barrel exports, and creates the lockfile.

**Files:**
- Create: `packages/components/src/scaffold.ts`
- Create: `packages/components/src/checksum.ts`
- Create: `packages/components/src/__tests__/checksum.test.ts`
- Create: `packages/components/src/__tests__/scaffold.test.ts`

**Step 1: Write the checksum test**

Create `packages/components/src/__tests__/checksum.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { computeChecksum } from "../checksum.js";

describe("computeChecksum", () => {
	it("returns a sha256 hex digest for a string", () => {
		const result = computeChecksum("hello world");
		expect(result).toMatch(/^[a-f0-9]{64}$/);
	});

	it("returns the same hash for the same content", () => {
		const a = computeChecksum("test content");
		const b = computeChecksum("test content");
		expect(a).toBe(b);
	});

	it("returns different hashes for different content", () => {
		const a = computeChecksum("content a");
		const b = computeChecksum("content b");
		expect(a).not.toBe(b);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @onelib/components test`
Expected: FAIL — `checksum.ts` doesn't exist

**Step 3: Implement checksum.ts**

Create `packages/components/src/checksum.ts`:

```typescript
import { createHash } from "node:crypto";

export function computeChecksum(content: string): string {
	return createHash("sha256").update(content, "utf-8").digest("hex");
}
```

**Step 4: Run checksum test to verify it passes**

Run: `pnpm --filter @onelib/components test`
Expected: checksum tests PASS

**Step 5: Write the scaffold test**

Create `packages/components/src/__tests__/scaffold.test.ts`:

```typescript
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { scaffoldComponents } from "../scaffold.js";

const TEST_DIR = join(import.meta.dirname, "__fixtures__/scaffold-test");
const COMPONENTS_SRC = join(TEST_DIR, "components-src");
const TARGET_DIR = join(TEST_DIR, "target");

function setupFixture(): void {
	mkdirSync(join(COMPONENTS_SRC, "buttons/basic-button"), { recursive: true });
	writeFileSync(
		join(COMPONENTS_SRC, "buttons/basic-button/basic-button.tsx"),
		'export function BasicButton() { return <button>Click</button>; }',
	);
	writeFileSync(
		join(COMPONENTS_SRC, "buttons/basic-button/basic-button.stories.tsx"),
		"// stories file - should not be copied",
	);
	writeFileSync(
		join(COMPONENTS_SRC, "buttons/basic-button/index.ts"),
		'export { BasicButton } from "./basic-button";',
	);

	mkdirSync(join(COMPONENTS_SRC, "backgrounds/aurora"), { recursive: true });
	writeFileSync(
		join(COMPONENTS_SRC, "backgrounds/aurora/aurora.tsx"),
		'export function Aurora() { return <div>Aurora</div>; }',
	);
	writeFileSync(
		join(COMPONENTS_SRC, "backgrounds/aurora/aurora.stories.tsx"),
		"// stories",
	);
	writeFileSync(
		join(COMPONENTS_SRC, "backgrounds/aurora/index.ts"),
		'export { Aurora } from "./aurora";',
	);

	mkdirSync(TARGET_DIR, { recursive: true });
}

function cleanFixture(): void {
	if (existsSync(TEST_DIR)) {
		rmSync(TEST_DIR, { recursive: true, force: true });
	}
}

describe("scaffoldComponents", () => {
	beforeEach(() => {
		cleanFixture();
		setupFixture();
	});

	afterEach(() => {
		cleanFixture();
	});

	it("copies .tsx files (not stories) to target grouped by category", () => {
		scaffoldComponents(COMPONENTS_SRC, TARGET_DIR);

		expect(existsSync(join(TARGET_DIR, "buttons/basic-button.tsx"))).toBe(true);
		expect(existsSync(join(TARGET_DIR, "backgrounds/aurora.tsx"))).toBe(true);
	});

	it("does not copy .stories.tsx files", () => {
		scaffoldComponents(COMPONENTS_SRC, TARGET_DIR);

		expect(existsSync(join(TARGET_DIR, "buttons/basic-button.stories.tsx"))).toBe(false);
		expect(existsSync(join(TARGET_DIR, "backgrounds/aurora.stories.tsx"))).toBe(false);
	});

	it("does not copy index.ts barrel files", () => {
		scaffoldComponents(COMPONENTS_SRC, TARGET_DIR);

		expect(existsSync(join(TARGET_DIR, "buttons/index.ts"))).toBe(false);
	});

	it("creates a lockfile at .onelib/components.lock", () => {
		scaffoldComponents(COMPONENTS_SRC, TARGET_DIR);

		const lockPath = join(TARGET_DIR, "../.onelib/components.lock");
		expect(existsSync(lockPath)).toBe(true);

		const lock = JSON.parse(readFileSync(lockPath, "utf-8"));
		expect(lock.components["basic-button"]).toBeDefined();
		expect(lock.components["basic-button"].checksum).toMatch(/^[a-f0-9]{64}$/);
		expect(lock.components["aurora"]).toBeDefined();
	});
});
```

**Step 6: Run test to verify it fails**

Run: `pnpm --filter @onelib/components test`
Expected: FAIL — `scaffold.ts` doesn't exist

**Step 7: Implement scaffold.ts**

Create `packages/components/src/scaffold.ts`:

```typescript
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { computeChecksum } from "./checksum.js";

export interface LockEntry {
	version: string;
	checksum: string;
	installedAt: string;
}

export interface ComponentsLock {
	version: string;
	components: Record<string, LockEntry>;
}

/**
 * Copies component .tsx files (excluding stories and index barrels) from
 * a source directory into a target directory, organized by category.
 * Creates a lockfile for update tracking.
 */
export function scaffoldComponents(
	sourceDir: string,
	targetDir: string,
	componentVersion = "0.1.0",
): void {
	const lock: ComponentsLock = { version: "0.1.0", components: {} };

	// Read category directories
	const categories = readdirSync(sourceDir).filter((entry) =>
		statSync(join(sourceDir, entry)).isDirectory(),
	);

	for (const category of categories) {
		const categoryPath = join(sourceDir, category);
		const componentDirs = readdirSync(categoryPath).filter((entry) =>
			statSync(join(categoryPath, entry)).isDirectory(),
		);

		for (const componentDir of componentDirs) {
			const componentPath = join(categoryPath, componentDir);
			const files = readdirSync(componentPath);

			// Find .tsx files that are NOT stories and NOT index files
			const sourceFiles = files.filter(
				(f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"),
			);

			for (const file of sourceFiles) {
				const content = readFileSync(join(componentPath, file), "utf-8");
				const targetCategoryDir = join(targetDir, category);
				mkdirSync(targetCategoryDir, { recursive: true });
				writeFileSync(join(targetCategoryDir, file), content, "utf-8");

				// Add to lockfile
				const componentName = basename(file, ".tsx");
				lock.components[componentName] = {
					version: componentVersion,
					checksum: computeChecksum(content),
					installedAt: new Date().toISOString(),
				};
			}
		}
	}

	// Write lockfile
	const lockDir = join(dirname(targetDir), ".onelib");
	mkdirSync(lockDir, { recursive: true });
	writeFileSync(
		join(lockDir, "components.lock"),
		JSON.stringify(lock, null, "\t"),
		"utf-8",
	);
}
```

**Step 8: Export from index.ts**

Update `packages/components/src/index.ts` to add:

```typescript
export { scaffoldComponents } from "./scaffold.js";
export type { ComponentsLock, LockEntry } from "./scaffold.js";
export { computeChecksum } from "./checksum.js";
```

**Step 9: Run tests to verify they pass**

Run: `pnpm --filter @onelib/components test`
Expected: ALL PASS

**Step 10: Commit**

```bash
git add packages/components/
git commit -m "feat(components): add scaffold utility with checksum-based lockfile"
```

---

## Task 6: Create Component Update Utility

Build the utility that compares the lockfile to current component source, detects user modifications, and updates components safely.

**Files:**
- Create: `packages/components/src/updater.ts`
- Create: `packages/components/src/__tests__/updater.test.ts`

**Step 1: Write the failing test**

Create `packages/components/src/__tests__/updater.test.ts`:

```typescript
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { computeChecksum } from "../checksum.js";
import type { ComponentsLock } from "../scaffold.js";
import { type UpdateReport, updateComponents } from "../updater.js";

const TEST_DIR = join(import.meta.dirname, "__fixtures__/updater-test");
const SOURCE_DIR = join(TEST_DIR, "source");
const PROJECT_DIR = join(TEST_DIR, "project");
const COMPONENTS_DIR = join(PROJECT_DIR, "src/components");
const LOCK_PATH = join(PROJECT_DIR, ".onelib/components.lock");

const ORIGINAL_CONTENT = 'export function Btn() { return <button>v1</button>; }';
const UPDATED_CONTENT = 'export function Btn() { return <button>v2</button>; }';
const USER_MODIFIED_CONTENT = 'export function Btn() { return <button>custom</button>; }';

function setupFixture(opts: {
	sourceContent: string;
	localContent: string;
	lockChecksum: string;
	lockVersion: string;
}): void {
	// Source (upstream) component
	mkdirSync(join(SOURCE_DIR, "buttons/btn"), { recursive: true });
	writeFileSync(join(SOURCE_DIR, "buttons/btn/btn.tsx"), opts.sourceContent);

	// Local installed component
	mkdirSync(join(COMPONENTS_DIR, "buttons"), { recursive: true });
	writeFileSync(join(COMPONENTS_DIR, "buttons/btn.tsx"), opts.localContent);

	// Lockfile
	const lock: ComponentsLock = {
		version: "0.1.0",
		components: {
			btn: {
				version: opts.lockVersion,
				checksum: opts.lockChecksum,
				installedAt: new Date().toISOString(),
			},
		},
	};
	mkdirSync(join(PROJECT_DIR, ".onelib"), { recursive: true });
	writeFileSync(LOCK_PATH, JSON.stringify(lock, null, "\t"), "utf-8");
}

function cleanFixture(): void {
	if (existsSync(TEST_DIR)) {
		rmSync(TEST_DIR, { recursive: true, force: true });
	}
}

describe("updateComponents", () => {
	beforeEach(cleanFixture);
	afterEach(cleanFixture);

	it("updates unmodified components with new upstream version", () => {
		setupFixture({
			sourceContent: UPDATED_CONTENT,
			localContent: ORIGINAL_CONTENT,
			lockChecksum: computeChecksum(ORIGINAL_CONTENT),
			lockVersion: "0.1.0",
		});

		const report = updateComponents(SOURCE_DIR, PROJECT_DIR);

		expect(report.updated).toContain("btn");
		expect(report.skipped).toHaveLength(0);
		const localContent = readFileSync(join(COMPONENTS_DIR, "buttons/btn.tsx"), "utf-8");
		expect(localContent).toBe(UPDATED_CONTENT);
	});

	it("skips user-modified components", () => {
		setupFixture({
			sourceContent: UPDATED_CONTENT,
			localContent: USER_MODIFIED_CONTENT,
			lockChecksum: computeChecksum(ORIGINAL_CONTENT),
			lockVersion: "0.1.0",
		});

		const report = updateComponents(SOURCE_DIR, PROJECT_DIR);

		expect(report.skipped).toContain("btn");
		expect(report.updated).toHaveLength(0);
		const localContent = readFileSync(join(COMPONENTS_DIR, "buttons/btn.tsx"), "utf-8");
		expect(localContent).toBe(USER_MODIFIED_CONTENT);
	});

	it("force-overwrites modified components when force=true", () => {
		setupFixture({
			sourceContent: UPDATED_CONTENT,
			localContent: USER_MODIFIED_CONTENT,
			lockChecksum: computeChecksum(ORIGINAL_CONTENT),
			lockVersion: "0.1.0",
		});

		const report = updateComponents(SOURCE_DIR, PROJECT_DIR, { force: true });

		expect(report.updated).toContain("btn");
		expect(report.skipped).toHaveLength(0);
		const localContent = readFileSync(join(COMPONENTS_DIR, "buttons/btn.tsx"), "utf-8");
		expect(localContent).toBe(UPDATED_CONTENT);
	});

	it("installs new components not in lockfile", () => {
		// Setup with no existing component or lock entry
		mkdirSync(join(SOURCE_DIR, "effects/glow"), { recursive: true });
		writeFileSync(
			join(SOURCE_DIR, "effects/glow/glow.tsx"),
			'export function Glow() { return <div />; }',
		);
		mkdirSync(join(COMPONENTS_DIR), { recursive: true });
		const lock: ComponentsLock = { version: "0.1.0", components: {} };
		mkdirSync(join(PROJECT_DIR, ".onelib"), { recursive: true });
		writeFileSync(LOCK_PATH, JSON.stringify(lock), "utf-8");

		const report = updateComponents(SOURCE_DIR, PROJECT_DIR);

		expect(report.added).toContain("glow");
		expect(existsSync(join(COMPONENTS_DIR, "effects/glow.tsx"))).toBe(true);
	});

	it("skips components that are already up-to-date", () => {
		setupFixture({
			sourceContent: ORIGINAL_CONTENT,
			localContent: ORIGINAL_CONTENT,
			lockChecksum: computeChecksum(ORIGINAL_CONTENT),
			lockVersion: "0.1.0",
		});

		const report = updateComponents(SOURCE_DIR, PROJECT_DIR);

		expect(report.upToDate).toContain("btn");
		expect(report.updated).toHaveLength(0);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @onelib/components test`
Expected: FAIL — `updater.ts` doesn't exist

**Step 3: Implement updater.ts**

Create `packages/components/src/updater.ts`:

```typescript
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { computeChecksum } from "./checksum.js";
import type { ComponentsLock, LockEntry } from "./scaffold.js";

export interface UpdateOptions {
	force?: boolean;
}

export interface UpdateReport {
	updated: string[];
	skipped: string[];
	added: string[];
	upToDate: string[];
}

/**
 * Scans source components and updates the target project.
 * Uses checksum comparison to detect user modifications.
 */
export function updateComponents(
	sourceDir: string,
	projectDir: string,
	options: UpdateOptions = {},
): UpdateReport {
	const componentsDir = join(projectDir, "src/components");
	const lockPath = join(projectDir, ".onelib/components.lock");

	// Load existing lockfile
	let lock: ComponentsLock = { version: "0.1.0", components: {} };
	if (existsSync(lockPath)) {
		lock = JSON.parse(readFileSync(lockPath, "utf-8")) as ComponentsLock;
	}

	const report: UpdateReport = {
		updated: [],
		skipped: [],
		added: [],
		upToDate: [],
	};

	// Scan source components
	const categories = readdirSync(sourceDir).filter((entry) =>
		statSync(join(sourceDir, entry)).isDirectory(),
	);

	for (const category of categories) {
		const categoryPath = join(sourceDir, category);
		const componentDirs = readdirSync(categoryPath).filter((entry) =>
			statSync(join(categoryPath, entry)).isDirectory(),
		);

		for (const componentDir of componentDirs) {
			const componentPath = join(categoryPath, componentDir);
			const files = readdirSync(componentPath);
			const sourceFiles = files.filter(
				(f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"),
			);

			for (const file of sourceFiles) {
				const componentName = basename(file, ".tsx");
				const sourceContent = readFileSync(join(componentPath, file), "utf-8");
				const sourceChecksum = computeChecksum(sourceContent);
				const targetPath = join(componentsDir, category, file);
				const lockEntry = lock.components[componentName];

				if (!lockEntry) {
					// New component — install it
					mkdirSync(join(componentsDir, category), { recursive: true });
					writeFileSync(targetPath, sourceContent, "utf-8");
					lock.components[componentName] = {
						version: "0.1.0",
						checksum: sourceChecksum,
						installedAt: new Date().toISOString(),
					};
					report.added.push(componentName);
					continue;
				}

				// Check if source has changed
				if (lockEntry.checksum === sourceChecksum) {
					report.upToDate.push(componentName);
					continue;
				}

				// Source has changed — check if user modified the local file
				if (existsSync(targetPath)) {
					const localContent = readFileSync(targetPath, "utf-8");
					const localChecksum = computeChecksum(localContent);
					const userModified = localChecksum !== lockEntry.checksum;

					if (userModified && !options.force) {
						report.skipped.push(componentName);
						continue;
					}
				}

				// Update the component
				mkdirSync(join(componentsDir, category), { recursive: true });
				writeFileSync(targetPath, sourceContent, "utf-8");
				lock.components[componentName] = {
					version: "0.1.0",
					checksum: sourceChecksum,
					installedAt: new Date().toISOString(),
				};
				report.updated.push(componentName);
			}
		}
	}

	// Write updated lockfile
	mkdirSync(join(projectDir, ".onelib"), { recursive: true });
	writeFileSync(lockPath, JSON.stringify(lock, null, "\t"), "utf-8");

	return report;
}
```

**Step 4: Export from index.ts**

Update `packages/components/src/index.ts` to add:

```typescript
export { updateComponents } from "./updater.js";
export type { UpdateOptions, UpdateReport } from "./updater.js";
```

**Step 5: Run tests to verify they pass**

Run: `pnpm --filter @onelib/components test`
Expected: ALL PASS

**Step 6: Commit**

```bash
git add packages/components/
git commit -m "feat(components): add update utility with checksum-based modification detection"
```

---

## Task 7: Add Sample Components (Placeholder .tsx Files)

Add 3 placeholder components (one per category) to validate the full scaffold and update flow end-to-end. These are minimal stubs — real components will be ported from source libraries in a follow-up task.

**Files:**
- Create: `packages/components/src/buttons/basic-button/basic-button.tsx`
- Create: `packages/components/src/buttons/basic-button/index.ts`
- Create: `packages/components/src/backgrounds/aurora/aurora.tsx`
- Create: `packages/components/src/backgrounds/aurora/index.ts`
- Create: `packages/components/src/text-animations/fuzzy-text/fuzzy-text.tsx`
- Create: `packages/components/src/text-animations/fuzzy-text/index.ts`
- Modify: `packages/components/registry.json` (add 3 entries)

**Step 1: Create the component files**

`packages/components/src/buttons/basic-button/basic-button.tsx`:
```tsx
// Source: Sera UI (seraui.com)
// TODO: Port actual component from Sera UI
export function BasicButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return <button {...props}>{children}</button>;
}
```

`packages/components/src/buttons/basic-button/index.ts`:
```typescript
export { BasicButton } from "./basic-button.js";
```

`packages/components/src/backgrounds/aurora/aurora.tsx`:
```tsx
// Source: ReactBits (reactbits.dev)
// TODO: Port actual component from ReactBits
export function Aurora({ className }: { className?: string }) {
	return <div className={className}>Aurora Background</div>;
}
```

`packages/components/src/backgrounds/aurora/index.ts`:
```typescript
export { Aurora } from "./aurora.js";
```

`packages/components/src/text-animations/fuzzy-text/fuzzy-text.tsx`:
```tsx
// Source: Sera UI (seraui.com)
// TODO: Port actual component from Sera UI
export function FuzzyText({ text, className }: { text: string; className?: string }) {
	return <span className={className}>{text}</span>;
}
```

`packages/components/src/text-animations/fuzzy-text/index.ts`:
```typescript
export { FuzzyText } from "./fuzzy-text.js";
```

**Step 2: Update registry.json**

```json
{
	"version": "0.1.0",
	"components": [
		{
			"name": "basic-button",
			"displayName": "Basic Button",
			"category": "buttons",
			"source": "seraui",
			"sourceUrl": "https://seraui.com/docs/buttons/basic",
			"version": "0.1.0",
			"description": "Clean, accessible button with variants",
			"files": ["buttons/basic-button/basic-button.tsx"],
			"dependencies": [],
			"tags": ["button", "interactive", "form"]
		},
		{
			"name": "aurora",
			"displayName": "Aurora Background",
			"category": "backgrounds",
			"source": "reactbits",
			"sourceUrl": "https://reactbits.dev/backgrounds/aurora",
			"version": "0.1.0",
			"description": "Animated aurora borealis background effect",
			"files": ["backgrounds/aurora/aurora.tsx"],
			"dependencies": [],
			"tags": ["background", "animated", "decorative"]
		},
		{
			"name": "fuzzy-text",
			"displayName": "Fuzzy Text",
			"category": "text-animations",
			"source": "seraui",
			"sourceUrl": "https://seraui.com/docs/text-animations/fuzzy",
			"version": "0.1.0",
			"description": "Text with fuzzy hover animation effect",
			"files": ["text-animations/fuzzy-text/fuzzy-text.tsx"],
			"dependencies": [],
			"tags": ["text", "animation", "hover"]
		}
	]
}
```

**Step 3: Run tests to verify registry validates**

Run: `pnpm --filter @onelib/components test`
Expected: ALL PASS (loadComponentRegistry now loads 3 components)

**Step 4: Commit**

```bash
git add packages/components/
git commit -m "feat(components): add 3 sample placeholder components and registry entries"
```

---

## Task 8: Integrate Scaffold into create-onelib

Wire the component scaffold utility into the `create-onelib` CLI so components are copied during project generation.

**Files:**
- Modify: `packages/create-onelib/package.json` (add `@onelib/components` dependency)
- Modify: `packages/create-onelib/src/utils/scaffold.ts` (add component scaffolding step)
- Modify: `packages/create-onelib/src/__tests__/integration/scaffold.test.ts` (add assertions)

**Step 1: Add dependency**

Add to `packages/create-onelib/package.json` dependencies:

```json
"@onelib/components": "workspace:*"
```

Run: `pnpm install`

**Step 2: Write the failing test**

Add to `packages/create-onelib/src/__tests__/integration/scaffold.test.ts`:

```typescript
it("copies component .tsx files into src/components/", async () => {
	await scaffoldProject(testProjectDir, "test-project");

	// Check that at least the sample components exist
	const buttonsDir = join(testProjectDir, "src/components/buttons");
	const backgroundsDir = join(testProjectDir, "src/components/backgrounds");

	expect(existsSync(buttonsDir)).toBe(true);
	expect(existsSync(backgroundsDir)).toBe(true);
});

it("creates .onelib/components.lock", async () => {
	await scaffoldProject(testProjectDir, "test-project");

	const lockPath = join(testProjectDir, ".onelib/components.lock");
	expect(existsSync(lockPath)).toBe(true);
});
```

**Step 3: Run test to verify it fails**

Run: `pnpm --filter create-onelib test`
Expected: FAIL — components not being copied yet

**Step 4: Update scaffold.ts**

Add to `packages/create-onelib/src/utils/scaffold.ts` at the end of `scaffoldProject`:

```typescript
import { scaffoldComponents } from "@onelib/components";

// After the existing template copy and placeholder replacement...

// Scaffold components
const componentsSourceDir = path.resolve(currentDir, "../../../components/src");
const targetComponentsDir = path.join(projectDir, "src/components");
scaffoldComponents(componentsSourceDir, targetComponentsDir);
```

Note: The function needs to find the components source directory. The path `../../../components/src` navigates from `create-onelib/src/utils/` (or `dist/utils/`) up to `packages/` and then into `components/src/`.

**Step 5: Run tests to verify they pass**

Run: `pnpm --filter create-onelib test`
Expected: ALL PASS

**Step 6: Run full test suite**

Run: `pnpm test`
Expected: ALL PASS

**Step 7: Commit**

```bash
git add packages/create-onelib/ pnpm-lock.yaml
git commit -m "feat(create-onelib): integrate component scaffolding into project generation"
```

---

## Task 9: Add `.onelib/` to Template .gitignore

Ensure the `.onelib/` directory (containing `components.lock`) is gitignored in generated projects.

**Files:**
- Modify: `packages/templates/base/.gitignore.template`

**Step 1: Read current .gitignore.template**

Check existing contents of `.gitignore.template`.

**Step 2: Add `.onelib/` entry**

Add the following to `packages/templates/base/.gitignore.template`:

```
# Onelib
.onelib/
```

**Step 3: Verify scaffold test still passes**

Run: `pnpm --filter create-onelib test`
Expected: ALL PASS

**Step 4: Commit**

```bash
git add packages/templates/base/.gitignore.template
git commit -m "chore(templates): add .onelib/ to gitignore template"
```

---

## Task 10: Wire Update Command to Component Updates

Connect the component update utility to the `onelib-scripts update` command so `pnpm onelib:update` also updates components.

**Files:**
- Modify: `tooling/scripts/package.json` (add `@onelib/components` dependency)
- Create: `tooling/scripts/src/commands/components-update.ts`
- Create: `tooling/scripts/src/__tests__/components-update.test.ts`
- Modify: `tooling/scripts/src/commands/update.ts` (add component update step)
- Modify: `tooling/scripts/src/__tests__/update.test.ts` (add assertions)
- Modify: `tooling/scripts/src/index.ts` (add exports)

**Step 1: Add dependency**

Add to `tooling/scripts/package.json` dependencies:

```json
"@onelib/components": "workspace:*"
```

Run: `pnpm install`

**Step 2: Write the failing test for components-update**

Create `tooling/scripts/src/__tests__/components-update.test.ts`:

```typescript
import { describe, expect, it, vi } from "vitest";
import { runComponentsUpdate } from "../commands/components-update.js";

// Mock @onelib/components
vi.mock("@onelib/components", () => ({
	updateComponents: vi.fn(() => ({
		updated: ["basic-button"],
		skipped: [],
		added: ["aurora"],
		upToDate: ["fuzzy-text"],
	})),
}));

describe("runComponentsUpdate", () => {
	it("returns an update report", async () => {
		const result = await runComponentsUpdate("/fake/project");
		expect(result.updated).toContain("basic-button");
		expect(result.added).toContain("aurora");
		expect(result.upToDate).toContain("fuzzy-text");
	});
});
```

**Step 3: Run test to verify it fails**

Run: `pnpm --filter @onelib/scripts test`
Expected: FAIL — module doesn't exist

**Step 4: Implement components-update.ts**

Create `tooling/scripts/src/commands/components-update.ts`:

```typescript
import { type UpdateReport, updateComponents } from "@onelib/components";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as logger from "../utils/logger.js";

export async function runComponentsUpdate(cwd?: string): Promise<UpdateReport> {
	const projectDir = cwd ?? process.cwd();

	// Source components directory — from the installed @onelib/components package
	const currentDir = dirname(fileURLToPath(import.meta.url));
	const sourceDir = resolve(currentDir, "../../node_modules/@onelib/components/src");

	logger.log("Updating components...");

	const report = updateComponents(sourceDir, projectDir);

	if (report.added.length > 0) {
		logger.success(`Added: ${report.added.join(", ")}`);
	}
	if (report.updated.length > 0) {
		logger.success(`Updated: ${report.updated.join(", ")}`);
	}
	if (report.skipped.length > 0) {
		logger.warn(`Skipped (locally modified): ${report.skipped.join(", ")}`);
	}
	if (report.upToDate.length > 0) {
		logger.log(`Up to date: ${report.upToDate.length} components`);
	}

	return report;
}
```

**Step 5: Update the main update command**

Modify `tooling/scripts/src/commands/update.ts` to call `runComponentsUpdate`:

```typescript
import * as logger from "../utils/logger.js";
import { runComponentsUpdate } from "./components-update.js";
import { runSkillsUpdate } from "./skills-update.js";

export interface UpdateResult {
	success: boolean;
}

export async function runUpdate(cwd?: string): Promise<UpdateResult> {
	logger.log("Running updates...\n");

	const skillsResult = await runSkillsUpdate(cwd);
	const componentsReport = await runComponentsUpdate(cwd);

	const hasSkillFailures = skillsResult.failed.length > 0;
	const hasComponentSkips = componentsReport.skipped.length > 0;

	console.log("");
	logger.log(
		`Update complete: skills ${skillsResult.installed.length}/${skillsResult.installed.length + skillsResult.failed.length}, components ${componentsReport.updated.length + componentsReport.added.length} updated`,
	);

	return { success: !hasSkillFailures };
}
```

**Step 6: Update index.ts exports**

Add to `tooling/scripts/src/index.ts`:

```typescript
export type { UpdateReport as ComponentsUpdateReport } from "@onelib/components";
export { runComponentsUpdate } from "./commands/components-update.js";
```

**Step 7: Update update.test.ts**

Update `tooling/scripts/src/__tests__/update.test.ts` to mock the new components-update module.

**Step 8: Run tests to verify they pass**

Run: `pnpm --filter @onelib/scripts test`
Expected: ALL PASS

**Step 9: Run full test suite**

Run: `pnpm test`
Expected: ALL PASS

**Step 10: Commit**

```bash
git add tooling/scripts/ pnpm-lock.yaml
git commit -m "feat(scripts): wire component updates into onelib:update command"
```

---

## Task 11: Full Integration Test

Run the complete test suite, verify build passes, and ensure the end-to-end flow works.

**Files:**
- No new files — verification only

**Step 1: Run full test suite**

Run: `pnpm test`
Expected: ALL PASS

**Step 2: Run build**

Run: `pnpm build`
Expected: ALL packages build successfully

**Step 3: Run linting**

Run: `pnpm lint`
Expected: No errors

**Step 4: Verify test count**

Confirm total test count is higher than the baseline of 131. Expected: ~150+ tests.

**Step 5: Commit any fixes**

If any fixes were needed, commit them:

```bash
git commit -m "fix: address integration test issues"
```

---

## Task Summary

| Task | Description | Est. Time |
|------|-------------|-----------|
| 1 | Expand registry source & category enums | 5 min |
| 2 | Add sourceUrl field to ComponentSchema | 5 min |
| 3 | Scaffold packages/components/ package | 5 min |
| 4 | Component registry schema & validation | 10 min |
| 5 | Component scaffold utility | 15 min |
| 6 | Component update utility | 15 min |
| 7 | Sample placeholder components | 5 min |
| 8 | Integrate scaffold into create-onelib | 10 min |
| 9 | Add .onelib/ to template gitignore | 2 min |
| 10 | Wire update command to component updates | 15 min |
| 11 | Full integration test | 5 min |

**Total: 11 tasks, ~92 minutes estimated**
