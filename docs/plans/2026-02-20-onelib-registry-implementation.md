# @onelib/registry Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the registry package with Zod schemas for components, layouts, and skills, plus utility functions for lookup, search, dependency resolution, and versioning.

**Architecture:** Zod schemas define the shape of registry entities (components, layouts, skills) and the top-level manifest. Utility functions operate on a parsed `RegistryManifest` object. A seed `registry.json` ships with empty arrays. All code is strict TypeScript ESM.

**Tech Stack:** Zod 3.x, TypeScript 5.9, Vitest 4.x, Biome 2.x (tab indentation, double quotes, semicolons)

---

## Important Context

- **Working directory:** `.worktrees/onelib-monorepo/` (worktree on `feature/onelib-registry` branch)
- **Package location:** `packages/registry/`
- **Base tsconfig:** `packages/config/tsconfig.library.json` (extends `packages/config/tsconfig.json`)
- **TS settings:** `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`, `strict: true`, `noUncheckedIndexedAccess: true`, `resolveJsonModule: true`
- **Biome:** tabs, double quotes, semicolons, line width 100
- **Test runner:** `pnpm test --filter=@onelib/registry` (runs `vitest run`)
- **Type check:** `pnpm check-types --filter=@onelib/registry` (runs `tsc --noEmit`)
- **Lint:** `pnpm check` (runs `biome check .` at root)
- **Build:** `pnpm build --filter=@onelib/registry` (runs `tsc`)

---

## Task 1: Add Zod dependency

**Files:**
- Modify: `packages/registry/package.json`

**Step 1: Add zod as a regular dependency**

```bash
pnpm add zod --filter=@onelib/registry
```

**Step 2: Verify it installed**

```bash
pnpm ls zod --filter=@onelib/registry
```

Expected: Shows `zod` listed as a dependency.

**Step 3: Commit**

```bash
git add packages/registry/package.json pnpm-lock.yaml
git commit -m "chore(registry): add zod dependency"
```

---

## Task 2: Common schemas (enums and shared types)

**Files:**
- Create: `packages/registry/src/schemas/common.ts`
- Create: `packages/registry/src/schemas/__tests__/common.test.ts`

**Step 1: Write the failing test**

Create `packages/registry/src/schemas/__tests__/common.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
	ComponentCategorySchema,
	LayoutCategorySchema,
	SkillCategorySchema,
	SkillSourceSchema,
	SourceSchema,
} from "../common.js";

describe("SourceSchema", () => {
	it("accepts valid sources", () => {
		for (const source of ["shadcn", "magicui", "aceternity", "onelib", "custom"]) {
			expect(SourceSchema.parse(source)).toBe(source);
		}
	});

	it("rejects invalid source", () => {
		expect(() => SourceSchema.parse("invalid")).toThrow();
	});
});

describe("ComponentCategorySchema", () => {
	it("accepts valid categories", () => {
		for (const cat of [
			"ui",
			"layout",
			"data-display",
			"feedback",
			"navigation",
			"overlay",
			"form",
		]) {
			expect(ComponentCategorySchema.parse(cat)).toBe(cat);
		}
	});

	it("rejects invalid category", () => {
		expect(() => ComponentCategorySchema.parse("invalid")).toThrow();
	});
});

describe("LayoutCategorySchema", () => {
	it("accepts valid categories", () => {
		for (const cat of [
			"marketing",
			"dashboard",
			"auth",
			"blog",
			"e-commerce",
			"portfolio",
			"docs",
		]) {
			expect(LayoutCategorySchema.parse(cat)).toBe(cat);
		}
	});

	it("rejects invalid category", () => {
		expect(() => LayoutCategorySchema.parse("invalid")).toThrow();
	});
});

describe("SkillCategorySchema", () => {
	it("accepts valid categories", () => {
		for (const cat of [
			"coding",
			"testing",
			"debugging",
			"architecture",
			"workflow",
			"tooling",
		]) {
			expect(SkillCategorySchema.parse(cat)).toBe(cat);
		}
	});

	it("rejects invalid category", () => {
		expect(() => SkillCategorySchema.parse("invalid")).toThrow();
	});
});

describe("SkillSourceSchema", () => {
	it("accepts valid skill sources", () => {
		for (const source of ["supabase", "claude", "codex", "onelib", "custom"]) {
			expect(SkillSourceSchema.parse(source)).toBe(source);
		}
	});

	it("rejects invalid skill source", () => {
		expect(() => SkillSourceSchema.parse("invalid")).toThrow();
	});
});
```

**Step 2: Run test to verify it fails**

```bash
pnpm test --filter=@onelib/registry
```

Expected: FAIL — cannot find module `../common.js`

**Step 3: Write minimal implementation**

Create `packages/registry/src/schemas/common.ts`:

```ts
import { z } from "zod";

export const SourceSchema = z.enum(["shadcn", "magicui", "aceternity", "onelib", "custom"]);

export const ComponentCategorySchema = z.enum([
	"ui",
	"layout",
	"data-display",
	"feedback",
	"navigation",
	"overlay",
	"form",
]);

export const LayoutCategorySchema = z.enum([
	"marketing",
	"dashboard",
	"auth",
	"blog",
	"e-commerce",
	"portfolio",
	"docs",
]);

export const SkillCategorySchema = z.enum([
	"coding",
	"testing",
	"debugging",
	"architecture",
	"workflow",
	"tooling",
]);

export const SkillSourceSchema = z.enum(["supabase", "claude", "codex", "onelib", "custom"]);

export const SOURCES = SourceSchema.options;
export const COMPONENT_CATEGORIES = ComponentCategorySchema.options;
export const LAYOUT_CATEGORIES = LayoutCategorySchema.options;
export const SKILL_CATEGORIES = SkillCategorySchema.options;
export const SKILL_SOURCES = SkillSourceSchema.options;

export const SemverSchema = z.string().regex(/^\d+\.\d+\.\d+$/, "Must be a valid semver string");
```

**Step 4: Run test to verify it passes**

```bash
pnpm test --filter=@onelib/registry
```

Expected: PASS — all common schema tests green

**Step 5: Commit**

```bash
git add packages/registry/src/schemas/
git commit -m "feat(registry): add common schemas (source, category, semver enums)"
```

---

## Task 3: Component schema

**Files:**
- Create: `packages/registry/src/schemas/component.ts`
- Create: `packages/registry/src/schemas/__tests__/component.test.ts`

**Step 1: Write the failing test**

Create `packages/registry/src/schemas/__tests__/component.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ComponentSchema } from "../component.js";

const validComponent = {
	name: "hero-section",
	displayName: "Hero Section",
	description: "A full-width hero with headline and CTA",
	version: "1.0.0",
	source: "onelib",
	category: "ui",
	dependencies: [],
	files: ["src/components/hero-section.tsx"],
	devOnly: false,
	tags: ["hero", "landing"],
};

describe("ComponentSchema", () => {
	it("accepts a valid component", () => {
		const result = ComponentSchema.parse(validComponent);
		expect(result.name).toBe("hero-section");
		expect(result.source).toBe("onelib");
	});

	it("applies default devOnly=false", () => {
		const { devOnly, ...withoutDevOnly } = validComponent;
		const result = ComponentSchema.parse(withoutDevOnly);
		expect(result.devOnly).toBe(false);
	});

	it("applies default tags=[]", () => {
		const { tags, ...withoutTags } = validComponent;
		const result = ComponentSchema.parse(withoutTags);
		expect(result.tags).toEqual([]);
	});

	it("applies default dependencies=[]", () => {
		const { dependencies, ...withoutDeps } = validComponent;
		const result = ComponentSchema.parse(withoutDeps);
		expect(result.dependencies).toEqual([]);
	});

	it("rejects missing name", () => {
		const { name, ...withoutName } = validComponent;
		expect(() => ComponentSchema.parse(withoutName)).toThrow();
	});

	it("rejects invalid source", () => {
		expect(() =>
			ComponentSchema.parse({ ...validComponent, source: "invalid" }),
		).toThrow();
	});

	it("rejects invalid version", () => {
		expect(() =>
			ComponentSchema.parse({ ...validComponent, version: "not-semver" }),
		).toThrow();
	});

	it("rejects invalid category", () => {
		expect(() =>
			ComponentSchema.parse({ ...validComponent, category: "invalid" }),
		).toThrow();
	});
});
```

**Step 2: Run test to verify it fails**

```bash
pnpm test --filter=@onelib/registry
```

Expected: FAIL — cannot find module `../component.js`

**Step 3: Write minimal implementation**

Create `packages/registry/src/schemas/component.ts`:

```ts
import { z } from "zod";
import { ComponentCategorySchema, SemverSchema, SourceSchema } from "./common.js";

export const ComponentSchema = z.object({
	name: z.string().min(1),
	displayName: z.string().min(1),
	description: z.string(),
	version: SemverSchema,
	source: SourceSchema,
	category: ComponentCategorySchema,
	dependencies: z.array(z.string()).default([]),
	files: z.array(z.string()).min(1),
	devOnly: z.boolean().default(false),
	tags: z.array(z.string()).default([]),
});
```

**Step 4: Run test to verify it passes**

```bash
pnpm test --filter=@onelib/registry
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/registry/src/schemas/component.ts packages/registry/src/schemas/__tests__/component.test.ts
git commit -m "feat(registry): add Component schema with validation"
```

---

## Task 4: Layout schema

**Files:**
- Create: `packages/registry/src/schemas/layout.ts`
- Create: `packages/registry/src/schemas/__tests__/layout.test.ts`

**Step 1: Write the failing test**

Create `packages/registry/src/schemas/__tests__/layout.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { LayoutSchema } from "../layout.js";

const validLayout = {
	name: "dashboard-layout",
	displayName: "Dashboard Layout",
	description: "A sidebar + main content dashboard layout",
	version: "1.0.0",
	source: "onelib",
	category: "dashboard",
	dependencies: [],
	files: ["src/layouts/dashboard-layout.tsx"],
	devOnly: false,
	tags: ["dashboard", "admin"],
	slots: ["header", "sidebar", "main", "footer"],
	requiredComponents: ["sidebar-nav", "top-bar"],
};

describe("LayoutSchema", () => {
	it("accepts a valid layout", () => {
		const result = LayoutSchema.parse(validLayout);
		expect(result.name).toBe("dashboard-layout");
		expect(result.slots).toEqual(["header", "sidebar", "main", "footer"]);
		expect(result.requiredComponents).toEqual(["sidebar-nav", "top-bar"]);
	});

	it("applies default slots=[]", () => {
		const { slots, ...withoutSlots } = validLayout;
		const result = LayoutSchema.parse(withoutSlots);
		expect(result.slots).toEqual([]);
	});

	it("applies default requiredComponents=[]", () => {
		const { requiredComponents, ...withoutReq } = validLayout;
		const result = LayoutSchema.parse(withoutReq);
		expect(result.requiredComponents).toEqual([]);
	});

	it("rejects invalid layout category", () => {
		expect(() =>
			LayoutSchema.parse({ ...validLayout, category: "ui" }),
		).toThrow();
	});

	it("rejects invalid version", () => {
		expect(() =>
			LayoutSchema.parse({ ...validLayout, version: "bad" }),
		).toThrow();
	});
});
```

**Step 2: Run test to verify it fails**

```bash
pnpm test --filter=@onelib/registry
```

Expected: FAIL — cannot find module `../layout.js`

**Step 3: Write minimal implementation**

Create `packages/registry/src/schemas/layout.ts`:

```ts
import { z } from "zod";
import { LayoutCategorySchema, SemverSchema, SourceSchema } from "./common.js";

export const LayoutSchema = z.object({
	name: z.string().min(1),
	displayName: z.string().min(1),
	description: z.string(),
	version: SemverSchema,
	source: SourceSchema,
	category: LayoutCategorySchema,
	dependencies: z.array(z.string()).default([]),
	files: z.array(z.string()).min(1),
	devOnly: z.boolean().default(false),
	tags: z.array(z.string()).default([]),
	slots: z.array(z.string()).default([]),
	requiredComponents: z.array(z.string()).default([]),
});
```

**Step 4: Run test to verify it passes**

```bash
pnpm test --filter=@onelib/registry
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/registry/src/schemas/layout.ts packages/registry/src/schemas/__tests__/layout.test.ts
git commit -m "feat(registry): add Layout schema with slots and requiredComponents"
```

---

## Task 5: Skill schema

**Files:**
- Create: `packages/registry/src/schemas/skill.ts`
- Create: `packages/registry/src/schemas/__tests__/skill.test.ts`

**Step 1: Write the failing test**

Create `packages/registry/src/schemas/__tests__/skill.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { SkillSchema } from "../skill.js";

const validSkill = {
	name: "tdd-workflow",
	displayName: "TDD Workflow",
	description: "Test-driven development skill for AI coding assistants",
	version: "1.0.0",
	source: "onelib",
	category: "testing",
	files: ["skills/tdd-workflow.md"],
	projectFocusRequired: false,
};

describe("SkillSchema", () => {
	it("accepts a valid skill", () => {
		const result = SkillSchema.parse(validSkill);
		expect(result.name).toBe("tdd-workflow");
		expect(result.source).toBe("onelib");
		expect(result.projectFocusRequired).toBe(false);
	});

	it("applies default projectFocusRequired=false", () => {
		const { projectFocusRequired, ...withoutPFR } = validSkill;
		const result = SkillSchema.parse(withoutPFR);
		expect(result.projectFocusRequired).toBe(false);
	});

	it("rejects invalid skill source", () => {
		expect(() =>
			SkillSchema.parse({ ...validSkill, source: "shadcn" }),
		).toThrow();
	});

	it("rejects invalid skill category", () => {
		expect(() =>
			SkillSchema.parse({ ...validSkill, category: "ui" }),
		).toThrow();
	});

	it("rejects invalid version", () => {
		expect(() =>
			SkillSchema.parse({ ...validSkill, version: "abc" }),
		).toThrow();
	});
});
```

**Step 2: Run test to verify it fails**

```bash
pnpm test --filter=@onelib/registry
```

Expected: FAIL — cannot find module `../skill.js`

**Step 3: Write minimal implementation**

Create `packages/registry/src/schemas/skill.ts`:

```ts
import { z } from "zod";
import { SemverSchema, SkillCategorySchema, SkillSourceSchema } from "./common.js";

export const SkillSchema = z.object({
	name: z.string().min(1),
	displayName: z.string().min(1),
	description: z.string(),
	version: SemverSchema,
	source: SkillSourceSchema,
	category: SkillCategorySchema,
	files: z.array(z.string()).min(1),
	projectFocusRequired: z.boolean().default(false),
});
```

**Step 4: Run test to verify it passes**

```bash
pnpm test --filter=@onelib/registry
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/registry/src/schemas/skill.ts packages/registry/src/schemas/__tests__/skill.test.ts
git commit -m "feat(registry): add Skill schema with projectFocusRequired"
```

---

## Task 6: RegistryManifest schema + seed data

**Files:**
- Create: `packages/registry/src/schemas/registry.ts`
- Create: `packages/registry/src/schemas/__tests__/registry.test.ts`
- Create: `packages/registry/src/data/registry.json`

**Step 1: Write the failing test**

Create `packages/registry/src/schemas/__tests__/registry.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import seedData from "../../data/registry.json" with { type: "json" };
import { RegistryManifestSchema } from "../registry.js";

const validManifest = {
	version: "0.1.0",
	updatedAt: "2026-02-20T00:00:00.000Z",
	components: [
		{
			name: "button",
			displayName: "Button",
			description: "A clickable button",
			version: "1.0.0",
			source: "shadcn",
			category: "ui",
			files: ["src/components/ui/button.tsx"],
		},
	],
	layouts: [],
	skills: [],
};

describe("RegistryManifestSchema", () => {
	it("accepts a valid manifest", () => {
		const result = RegistryManifestSchema.parse(validManifest);
		expect(result.version).toBe("0.1.0");
		expect(result.components).toHaveLength(1);
		expect(result.layouts).toHaveLength(0);
		expect(result.skills).toHaveLength(0);
	});

	it("rejects missing version", () => {
		const { version, ...withoutVersion } = validManifest;
		expect(() => RegistryManifestSchema.parse(withoutVersion)).toThrow();
	});

	it("rejects missing updatedAt", () => {
		const { updatedAt, ...withoutDate } = validManifest;
		expect(() => RegistryManifestSchema.parse(withoutDate)).toThrow();
	});

	it("rejects invalid component in manifest", () => {
		expect(() =>
			RegistryManifestSchema.parse({
				...validManifest,
				components: [{ name: "bad" }],
			}),
		).toThrow();
	});

	it("validates the seed registry.json", () => {
		const result = RegistryManifestSchema.parse(seedData);
		expect(result.version).toBe("0.1.0");
	});
});
```

**Step 2: Run test to verify it fails**

```bash
pnpm test --filter=@onelib/registry
```

Expected: FAIL — cannot find modules

**Step 3: Create seed data**

Create `packages/registry/src/data/registry.json`:

```json
{
	"version": "0.1.0",
	"updatedAt": "2026-02-20T00:00:00.000Z",
	"components": [],
	"layouts": [],
	"skills": []
}
```

**Step 4: Write minimal implementation**

Create `packages/registry/src/schemas/registry.ts`:

```ts
import { z } from "zod";
import { SemverSchema } from "./common.js";
import { ComponentSchema } from "./component.js";
import { LayoutSchema } from "./layout.js";
import { SkillSchema } from "./skill.js";

export const RegistryManifestSchema = z.object({
	version: SemverSchema,
	updatedAt: z.string().datetime(),
	components: z.array(ComponentSchema),
	layouts: z.array(LayoutSchema),
	skills: z.array(SkillSchema),
});
```

**Step 5: Run test to verify it passes**

```bash
pnpm test --filter=@onelib/registry
```

Expected: PASS

**Step 6: Commit**

```bash
git add packages/registry/src/schemas/registry.ts packages/registry/src/schemas/__tests__/registry.test.ts packages/registry/src/data/registry.json
git commit -m "feat(registry): add RegistryManifest schema and seed data"
```

---

## Task 7: Types re-export module

**Files:**
- Create: `packages/registry/src/types.ts`

**Step 1: Create types.ts**

Create `packages/registry/src/types.ts`:

```ts
import type { z } from "zod";
import type { ComponentSchema } from "./schemas/component.js";
import type { LayoutSchema } from "./schemas/layout.js";
import type { RegistryManifestSchema } from "./schemas/registry.js";
import type { SkillSchema } from "./schemas/skill.js";

export type Component = z.infer<typeof ComponentSchema>;
export type Layout = z.infer<typeof LayoutSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type RegistryManifest = z.infer<typeof RegistryManifestSchema>;
```

**Step 2: Type check**

```bash
pnpm check-types --filter=@onelib/registry
```

Expected: PASS — no type errors

**Step 3: Commit**

```bash
git add packages/registry/src/types.ts
git commit -m "feat(registry): add inferred type exports"
```

---

## Task 8: Version utilities

**Files:**
- Create: `packages/registry/src/utils/version.ts`
- Create: `packages/registry/src/utils/__tests__/version.test.ts`

**Step 1: Write the failing test**

Create `packages/registry/src/utils/__tests__/version.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { bumpVersion, compareVersions } from "../version.js";

describe("compareVersions", () => {
	it("returns 0 for equal versions", () => {
		expect(compareVersions("1.0.0", "1.0.0")).toBe(0);
	});

	it("returns 1 when a > b (major)", () => {
		expect(compareVersions("2.0.0", "1.0.0")).toBe(1);
	});

	it("returns -1 when a < b (major)", () => {
		expect(compareVersions("1.0.0", "2.0.0")).toBe(-1);
	});

	it("compares minor versions", () => {
		expect(compareVersions("1.2.0", "1.1.0")).toBe(1);
		expect(compareVersions("1.1.0", "1.2.0")).toBe(-1);
	});

	it("compares patch versions", () => {
		expect(compareVersions("1.0.2", "1.0.1")).toBe(1);
		expect(compareVersions("1.0.1", "1.0.2")).toBe(-1);
	});

	it("handles multi-digit versions", () => {
		expect(compareVersions("1.10.0", "1.9.0")).toBe(1);
	});
});

describe("bumpVersion", () => {
	it("bumps patch version", () => {
		expect(bumpVersion("1.0.0", "patch")).toBe("1.0.1");
	});

	it("bumps minor version and resets patch", () => {
		expect(bumpVersion("1.2.3", "minor")).toBe("1.3.0");
	});

	it("bumps major version and resets minor+patch", () => {
		expect(bumpVersion("1.2.3", "major")).toBe("2.0.0");
	});
});
```

**Step 2: Run test to verify it fails**

```bash
pnpm test --filter=@onelib/registry
```

Expected: FAIL — cannot find module `../version.js`

**Step 3: Write minimal implementation**

Create `packages/registry/src/utils/version.ts`:

```ts
type BumpType = "patch" | "minor" | "major";

function parseSemver(version: string): [number, number, number] {
	const parts = version.split(".").map(Number);
	if (parts.length !== 3 || parts.some((p) => Number.isNaN(p))) {
		throw new Error(`Invalid semver: ${version}`);
	}
	return parts as [number, number, number];
}

export function compareVersions(a: string, b: string): -1 | 0 | 1 {
	const [aMajor, aMinor, aPatch] = parseSemver(a);
	const [bMajor, bMinor, bPatch] = parseSemver(b);

	if (aMajor !== bMajor) return aMajor > bMajor ? 1 : -1;
	if (aMinor !== bMinor) return aMinor > bMinor ? 1 : -1;
	if (aPatch !== bPatch) return aPatch > bPatch ? 1 : -1;
	return 0;
}

export function bumpVersion(version: string, type: BumpType): string {
	const [major, minor, patch] = parseSemver(version);

	switch (type) {
		case "major":
			return `${major + 1}.0.0`;
		case "minor":
			return `${major}.${minor + 1}.0`;
		case "patch":
			return `${major}.${minor}.${patch + 1}`;
	}
}
```

**Step 4: Run test to verify it passes**

```bash
pnpm test --filter=@onelib/registry
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/registry/src/utils/version.ts packages/registry/src/utils/__tests__/version.test.ts
git commit -m "feat(registry): add version comparison and bump utilities"
```

---

## Task 9: Resolve utilities (lookup, search, dependencies)

**Files:**
- Create: `packages/registry/src/utils/resolve.ts`
- Create: `packages/registry/src/utils/__tests__/resolve.test.ts`

**Step 1: Write the failing test**

Create `packages/registry/src/utils/__tests__/resolve.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { RegistryManifest } from "../../types.js";
import {
	getComponent,
	getLayout,
	getSkill,
	listByCategory,
	listBySource,
	resolveWithDependencies,
	searchRegistry,
} from "../resolve.js";

const manifest: RegistryManifest = {
	version: "0.1.0",
	updatedAt: "2026-02-20T00:00:00.000Z",
	components: [
		{
			name: "button",
			displayName: "Button",
			description: "A clickable button component",
			version: "1.0.0",
			source: "shadcn",
			category: "ui",
			dependencies: [],
			files: ["src/components/ui/button.tsx"],
			devOnly: false,
			tags: ["interactive", "form"],
		},
		{
			name: "hero-section",
			displayName: "Hero Section",
			description: "Full-width hero with CTA",
			version: "1.0.0",
			source: "onelib",
			category: "ui",
			dependencies: ["button"],
			files: ["src/components/hero-section.tsx"],
			devOnly: false,
			tags: ["hero", "landing"],
		},
		{
			name: "data-table",
			displayName: "Data Table",
			description: "Sortable data table",
			version: "1.0.0",
			source: "shadcn",
			category: "data-display",
			dependencies: ["button"],
			files: ["src/components/data-table.tsx"],
			devOnly: false,
			tags: ["table", "data"],
		},
	],
	layouts: [
		{
			name: "dashboard-layout",
			displayName: "Dashboard Layout",
			description: "Admin dashboard layout",
			version: "1.0.0",
			source: "onelib",
			category: "dashboard",
			dependencies: [],
			files: ["src/layouts/dashboard-layout.tsx"],
			devOnly: false,
			tags: ["admin"],
			slots: ["header", "sidebar", "main"],
			requiredComponents: ["button"],
		},
	],
	skills: [
		{
			name: "tdd-workflow",
			displayName: "TDD Workflow",
			description: "Test-driven development skill",
			version: "1.0.0",
			source: "onelib",
			category: "testing",
			files: ["skills/tdd-workflow.md"],
			projectFocusRequired: false,
		},
	],
};

describe("getComponent", () => {
	it("finds a component by name", () => {
		const result = getComponent(manifest, "button");
		expect(result?.name).toBe("button");
	});

	it("returns undefined for missing component", () => {
		expect(getComponent(manifest, "nonexistent")).toBeUndefined();
	});
});

describe("getLayout", () => {
	it("finds a layout by name", () => {
		const result = getLayout(manifest, "dashboard-layout");
		expect(result?.name).toBe("dashboard-layout");
	});

	it("returns undefined for missing layout", () => {
		expect(getLayout(manifest, "nonexistent")).toBeUndefined();
	});
});

describe("getSkill", () => {
	it("finds a skill by name", () => {
		const result = getSkill(manifest, "tdd-workflow");
		expect(result?.name).toBe("tdd-workflow");
	});

	it("returns undefined for missing skill", () => {
		expect(getSkill(manifest, "nonexistent")).toBeUndefined();
	});
});

describe("listByCategory", () => {
	it("lists components by category", () => {
		const result = listByCategory(manifest, "components", "ui");
		expect(result).toHaveLength(2);
		expect(result.map((c) => c.name)).toContain("button");
		expect(result.map((c) => c.name)).toContain("hero-section");
	});

	it("returns empty array for no matches", () => {
		const result = listByCategory(manifest, "components", "overlay");
		expect(result).toHaveLength(0);
	});

	it("lists layouts by category", () => {
		const result = listByCategory(manifest, "layouts", "dashboard");
		expect(result).toHaveLength(1);
	});

	it("lists skills by category", () => {
		const result = listByCategory(manifest, "skills", "testing");
		expect(result).toHaveLength(1);
	});
});

describe("listBySource", () => {
	it("lists components by source", () => {
		const result = listBySource(manifest, "components", "shadcn");
		expect(result).toHaveLength(2);
	});

	it("returns empty for no matches", () => {
		const result = listBySource(manifest, "components", "aceternity");
		expect(result).toHaveLength(0);
	});
});

describe("searchRegistry", () => {
	it("finds items by name", () => {
		const result = searchRegistry(manifest, "button");
		expect(result.length).toBeGreaterThanOrEqual(1);
		expect(result.some((r) => r.name === "button")).toBe(true);
	});

	it("finds items by description", () => {
		const result = searchRegistry(manifest, "clickable");
		expect(result.some((r) => r.name === "button")).toBe(true);
	});

	it("finds items by tag", () => {
		const result = searchRegistry(manifest, "landing");
		expect(result.some((r) => r.name === "hero-section")).toBe(true);
	});

	it("is case-insensitive", () => {
		const result = searchRegistry(manifest, "BUTTON");
		expect(result.some((r) => r.name === "button")).toBe(true);
	});

	it("returns empty for no matches", () => {
		const result = searchRegistry(manifest, "zzzznonexistent");
		expect(result).toHaveLength(0);
	});
});

describe("resolveWithDependencies", () => {
	it("returns item with no dependencies", () => {
		const result = resolveWithDependencies(manifest, "button");
		expect(result.map((r) => r.name)).toEqual(["button"]);
	});

	it("resolves single dependency", () => {
		const result = resolveWithDependencies(manifest, "hero-section");
		const names = result.map((r) => r.name);
		expect(names).toContain("hero-section");
		expect(names).toContain("button");
	});

	it("returns dependencies before the item (topological order)", () => {
		const result = resolveWithDependencies(manifest, "hero-section");
		const names = result.map((r) => r.name);
		expect(names.indexOf("button")).toBeLessThan(names.indexOf("hero-section"));
	});

	it("throws for nonexistent item", () => {
		expect(() => resolveWithDependencies(manifest, "nonexistent")).toThrow();
	});

	it("deduplicates shared dependencies", () => {
		// Both hero-section and data-table depend on button
		// If we had an item depending on both, button should appear once
		const result = resolveWithDependencies(manifest, "hero-section");
		const buttonCount = result.filter((r) => r.name === "button").length;
		expect(buttonCount).toBe(1);
	});
});
```

**Step 2: Run test to verify it fails**

```bash
pnpm test --filter=@onelib/registry
```

Expected: FAIL — cannot find module `../resolve.js`

**Step 3: Write minimal implementation**

Create `packages/registry/src/utils/resolve.ts`:

```ts
import type { Component, Layout, RegistryManifest, Skill } from "../types.js";

type EntityType = "components" | "layouts" | "skills";
type RegistryItem = Component | Layout | Skill;

export function getComponent(
	manifest: RegistryManifest,
	name: string,
): Component | undefined {
	return manifest.components.find((c) => c.name === name);
}

export function getLayout(
	manifest: RegistryManifest,
	name: string,
): Layout | undefined {
	return manifest.layouts.find((l) => l.name === name);
}

export function getSkill(
	manifest: RegistryManifest,
	name: string,
): Skill | undefined {
	return manifest.skills.find((s) => s.name === name);
}

export function listByCategory(
	manifest: RegistryManifest,
	type: EntityType,
	category: string,
): RegistryItem[] {
	return manifest[type].filter((item) => item.category === category);
}

export function listBySource(
	manifest: RegistryManifest,
	type: EntityType,
	source: string,
): RegistryItem[] {
	return manifest[type].filter((item) => item.source === source);
}

export function searchRegistry(
	manifest: RegistryManifest,
	query: string,
): RegistryItem[] {
	const lowerQuery = query.toLowerCase();
	const results: RegistryItem[] = [];

	for (const type of ["components", "layouts", "skills"] as const) {
		for (const item of manifest[type]) {
			const searchable = [
				item.name,
				item.displayName,
				item.description,
				...("tags" in item ? (item as Component).tags : []),
			]
				.join(" ")
				.toLowerCase();

			if (searchable.includes(lowerQuery)) {
				results.push(item);
			}
		}
	}

	return results;
}

export function resolveWithDependencies(
	manifest: RegistryManifest,
	name: string,
): RegistryItem[] {
	const allItems = new Map<string, RegistryItem>();
	for (const type of ["components", "layouts", "skills"] as const) {
		for (const item of manifest[type]) {
			allItems.set(item.name, item);
		}
	}

	const item = allItems.get(name);
	if (!item) {
		throw new Error(`Registry item not found: ${name}`);
	}

	const resolved: RegistryItem[] = [];
	const visited = new Set<string>();

	function resolve(itemName: string): void {
		if (visited.has(itemName)) return;
		visited.add(itemName);

		const current = allItems.get(itemName);
		if (!current) {
			throw new Error(`Dependency not found: ${itemName}`);
		}

		const deps = "dependencies" in current ? (current as Component).dependencies : [];
		for (const dep of deps) {
			resolve(dep);
		}

		resolved.push(current);
	}

	resolve(name);
	return resolved;
}
```

**Step 4: Run test to verify it passes**

```bash
pnpm test --filter=@onelib/registry
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/registry/src/utils/resolve.ts packages/registry/src/utils/__tests__/resolve.test.ts
git commit -m "feat(registry): add lookup, search, and dependency resolution utilities"
```

---

## Task 10: Barrel exports and cleanup

**Files:**
- Modify: `packages/registry/src/index.ts` (replace stub)
- Delete: `packages/registry/src/index.test.ts` (old stub test)

**Step 1: Replace the barrel export**

Replace `packages/registry/src/index.ts` with:

```ts
// Schemas
export { ComponentSchema } from "./schemas/component.js";
export {
	COMPONENT_CATEGORIES,
	ComponentCategorySchema,
	LAYOUT_CATEGORIES,
	LayoutCategorySchema,
	SemverSchema,
	SKILL_CATEGORIES,
	SKILL_SOURCES,
	SkillCategorySchema,
	SkillSourceSchema,
	SOURCES,
	SourceSchema,
} from "./schemas/common.js";
export { LayoutSchema } from "./schemas/layout.js";
export { RegistryManifestSchema } from "./schemas/registry.js";
export { SkillSchema } from "./schemas/skill.js";

// Types
export type { Component, Layout, RegistryManifest, Skill } from "./types.js";

// Utils
export {
	getComponent,
	getLayout,
	getSkill,
	listByCategory,
	listBySource,
	resolveWithDependencies,
	searchRegistry,
} from "./utils/resolve.js";
export { bumpVersion, compareVersions } from "./utils/version.js";

// Constants
export const REGISTRY_VERSION = "0.1.0";
```

**Step 2: Delete old stub test**

```bash
rm packages/registry/src/index.test.ts
```

**Step 3: Run all checks**

```bash
pnpm check-types --filter=@onelib/registry
pnpm test --filter=@onelib/registry
pnpm check
```

Expected: All pass — type check clean, all tests green, biome clean

**Step 4: Run build**

```bash
pnpm build --filter=@onelib/registry
```

Expected: PASS — compiles to `dist/`

**Step 5: Commit**

```bash
git add packages/registry/src/
git commit -m "feat(registry): add barrel exports and remove stub"
```

---

## Task 11: Final verification

**Step 1: Run full monorepo checks**

```bash
pnpm build
pnpm test
pnpm check
```

Expected: All tasks pass across the entire monorepo. The registry package builds, all tests pass, biome is clean.

**Step 2: Review git log**

```bash
git log --oneline -10
```

Expected: Clean commit history with one commit per task.
