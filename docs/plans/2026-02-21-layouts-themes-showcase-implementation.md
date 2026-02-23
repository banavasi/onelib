# Layouts, Themes & Showcase Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a theme system (3 presets), 8 layout presets with starter pages, a dev-only /showcase route, and update the CLI to prompt for layout/theme selection.

**Architecture:** Three orthogonal systems compose at scaffold time: themes (CSS variables), layouts (structural components + routes), and the showcase (dev-only gallery). The base template is always used; layouts and themes overlay on top. Any layout works with any theme.

**Tech Stack:** TypeScript, Next.js 15 (App Router), Tailwind CSS 4, @clack/prompts, Zod, vitest

---

## Task 1: Create @banavasi/themes package

**Files:**
- Create: `packages/themes/package.json`
- Create: `packages/themes/tsconfig.json`
- Create: `packages/themes/vitest.config.ts`
- Create: `packages/themes/src/index.ts`
- Create: `packages/themes/src/types.ts`

**Step 1: Create package.json**

```json
{
	"name": "@banavasi/themes",
	"version": "0.1.2",
	"description": "Theme presets with CSS variables and Tailwind integration",
	"type": "module",
	"main": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"import": "./dist/index.js"
		}
	},
	"publishConfig": {
		"registry": "https://npm.pkg.github.com"
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
	"devDependencies": {
		"typescript": "^5.8.0"
	}
}
```

**Step 2: Create tsconfig.json**

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

**Step 3: Create vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
	},
});
```

**Step 4: Create src/types.ts**

```ts
export interface ThemePreset {
	name: string;
	displayName: string;
	description: string;
	css: string;
}

export type ThemePresetName = "neutral" | "vibrant" | "corporate";
```

**Step 5: Create src/index.ts with the 3 theme presets as inline CSS strings**

Each preset follows the shadcn/ui CSS variable convention (HSL values without `hsl()` wrapper). Include `:root` (light) and `.dark` (dark mode) blocks. Include sidebar variables for dashboard layouts.

The `neutral` preset: clean grays/slate, minimal.
The `vibrant` preset: bold blue primary, saturated accents.
The `corporate` preset: navy/indigo primary, conservative.

Export: `THEME_PRESETS` array, `getThemePreset(name)` function, `THEME_PRESET_NAMES` array, `ThemePreset` type.

**Step 6: Write the failing test**

Create: `packages/themes/src/__tests__/index.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { THEME_PRESETS, THEME_PRESET_NAMES, getThemePreset } from "../index.js";

describe("THEME_PRESETS", () => {
	it("has 3 presets", () => {
		expect(THEME_PRESETS).toHaveLength(3);
	});

	it("has neutral, vibrant, and corporate", () => {
		expect(THEME_PRESET_NAMES).toEqual(["neutral", "vibrant", "corporate"]);
	});

	it("each preset has required fields", () => {
		for (const preset of THEME_PRESETS) {
			expect(preset.name).toBeTruthy();
			expect(preset.displayName).toBeTruthy();
			expect(preset.description).toBeTruthy();
			expect(preset.css).toContain("--background:");
			expect(preset.css).toContain("--primary:");
			expect(preset.css).toContain("--foreground:");
			expect(preset.css).toContain(".dark");
		}
	});
});

describe("getThemePreset", () => {
	it("returns preset by name", () => {
		const neutral = getThemePreset("neutral");
		expect(neutral).toBeDefined();
		expect(neutral!.name).toBe("neutral");
	});

	it("returns undefined for unknown name", () => {
		expect(getThemePreset("nonexistent" as any)).toBeUndefined();
	});
});
```

**Step 7: Run test to verify it fails**

Run: `pnpm --filter @banavasi/themes test`
Expected: FAIL (module not found or functions not exported)

**Step 8: Implement src/index.ts with full CSS for all 3 presets**

The CSS must include all variables that shadcn components expect:
`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`, `--radius`, `--chart-1` through `--chart-5`, `--sidebar-background`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring`.

**Step 9: Run test to verify it passes**

Run: `pnpm --filter @banavasi/themes test`
Expected: PASS

**Step 10: Install dependencies and verify build**

Run: `pnpm install && pnpm --filter @banavasi/themes build`
Expected: exit 0

**Step 11: Commit**

```bash
git add packages/themes/
git commit -m "feat(themes): add @banavasi/themes package with 3 presets (neutral, vibrant, corporate)"
```

---

## Task 2: Update OnelibConfig type to support layout and theme names

**Files:**
- Modify: `packages/onelib/src/types.ts`
- Modify: `packages/onelib/src/__tests__/define-config.test.ts`

**Step 1: Write failing test additions**

Add tests to `packages/onelib/src/__tests__/define-config.test.ts`:

```ts
it("accepts layout field", () => {
	const config = defineConfig({
		name: "test",
		registry: { components: [], layouts: [] },
		skills: { curated: true, custom: [] },
		theme: { preset: "neutral" },
		layout: "dashboard",
	});
	expect(config.layout).toBe("dashboard");
});

it("layout defaults to blank when omitted", () => {
	const config = defineConfig({
		name: "test",
		registry: { components: [], layouts: [] },
		skills: { curated: true, custom: [] },
		theme: { preset: "neutral" },
	});
	expect(config.layout).toBe("blank");
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @banavasi/onelib test`
Expected: FAIL (layout property doesn't exist)

**Step 3: Update types.ts**

```ts
export type ThemePresetName = "neutral" | "vibrant" | "corporate";
export type LayoutName = "dashboard" | "marketing" | "ecommerce" | "blog" | "auth" | "docs" | "portfolio" | "blank";

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
		preset: ThemePresetName | "custom";
	};
	layout?: LayoutName;
}
```

**Step 4: Update defineConfig in index.ts to default layout**

```ts
export function defineConfig(config: OnelibConfig): Required<OnelibConfig> {
	return {
		...config,
		layout: config.layout ?? "blank",
	};
}
```

**Step 5: Update existing tests that may break with Required<OnelibConfig> return type**

**Step 6: Run test to verify it passes**

Run: `pnpm --filter @banavasi/onelib test`
Expected: PASS

**Step 7: Commit**

```bash
git add packages/onelib/
git commit -m "feat(onelib): add layout and theme preset names to OnelibConfig"
```

---

## Task 3: Populate the layouts package with metadata and scaffold utilities

**Files:**
- Modify: `packages/layouts/src/index.ts`
- Create: `packages/layouts/src/types.ts`
- Create: `packages/layouts/src/presets.ts`
- Create: `packages/layouts/src/__tests__/presets.test.ts`
- Modify: `packages/layouts/package.json` (add dependency on `@banavasi/themes`)

**Step 1: Create src/types.ts**

```ts
export interface LayoutPage {
	path: string;
	name: string;
}

export interface LayoutPreset {
	name: string;
	displayName: string;
	description: string;
	category: string;
	slots: string[];
	requiredComponents: string[];
	pages: LayoutPage[];
}

export type LayoutName = "dashboard" | "marketing" | "ecommerce" | "blog" | "auth" | "docs" | "portfolio" | "blank";
```

**Step 2: Write failing test**

Create: `packages/layouts/src/__tests__/presets.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { LAYOUT_PRESETS, LAYOUT_NAMES, getLayoutPreset } from "../presets.js";

describe("LAYOUT_PRESETS", () => {
	it("has 8 presets", () => {
		expect(LAYOUT_PRESETS).toHaveLength(8);
	});

	it("has all expected layout names", () => {
		expect(LAYOUT_NAMES).toEqual([
			"dashboard", "marketing", "ecommerce", "blog",
			"auth", "docs", "portfolio", "blank",
		]);
	});

	it("each preset has required fields", () => {
		for (const preset of LAYOUT_PRESETS) {
			expect(preset.name).toBeTruthy();
			expect(preset.displayName).toBeTruthy();
			expect(preset.description).toBeTruthy();
			expect(preset.category).toBeTruthy();
			expect(Array.isArray(preset.slots)).toBe(true);
			expect(Array.isArray(preset.requiredComponents)).toBe(true);
			expect(Array.isArray(preset.pages)).toBe(true);
		}
	});

	it("blank preset has no required components except button", () => {
		const blank = getLayoutPreset("blank");
		expect(blank).toBeDefined();
		expect(blank!.requiredComponents).toEqual(["button"]);
	});

	it("dashboard preset requires sidebar-related components", () => {
		const dashboard = getLayoutPreset("dashboard");
		expect(dashboard).toBeDefined();
		expect(dashboard!.requiredComponents).toContain("button");
		expect(dashboard!.requiredComponents).toContain("card");
		expect(dashboard!.slots).toContain("sidebar");
	});
});

describe("getLayoutPreset", () => {
	it("returns preset by name", () => {
		const marketing = getLayoutPreset("marketing");
		expect(marketing).toBeDefined();
		expect(marketing!.name).toBe("marketing");
	});

	it("returns undefined for unknown name", () => {
		expect(getLayoutPreset("nonexistent" as any)).toBeUndefined();
	});
});
```

**Step 3: Run test to verify it fails**

Run: `pnpm --filter @banavasi/layouts test`
Expected: FAIL

**Step 4: Implement src/presets.ts with all 8 layout metadata definitions**

Each preset is a `LayoutPreset` object with name, displayName, description, category, slots, requiredComponents, and pages. This is metadata only — the actual component/route files come in Tasks 4-11.

**Step 5: Update src/index.ts**

```ts
export { LAYOUT_PRESETS, LAYOUT_NAMES, getLayoutPreset } from "./presets.js";
export type { LayoutPreset, LayoutPage, LayoutName } from "./types.js";
export const LAYOUTS_VERSION = "0.1.0";
```

**Step 6: Run test to verify it passes**

Run: `pnpm --filter @banavasi/layouts test`
Expected: PASS

**Step 7: Commit**

```bash
git add packages/layouts/
git commit -m "feat(layouts): add layout preset metadata for all 8 layouts"
```

---

## Task 4: Create layout template files — Dashboard

**Files:**
- Create: `packages/layouts/src/templates/dashboard/components/sidebar.tsx`
- Create: `packages/layouts/src/templates/dashboard/components/header.tsx`
- Create: `packages/layouts/src/templates/dashboard/components/nav.tsx`
- Create: `packages/layouts/src/templates/dashboard/components/mobile-nav.tsx`
- Create: `packages/layouts/src/templates/dashboard/routes/(dashboard)/layout.tsx`
- Create: `packages/layouts/src/templates/dashboard/routes/(dashboard)/page.tsx`
- Create: `packages/layouts/src/templates/dashboard/routes/(dashboard)/settings/page.tsx`
- Create: `packages/layouts/src/templates/dashboard/routes/(dashboard)/analytics/page.tsx`
- Create: `packages/layouts/src/templates/dashboard/routes/(auth)/layout.tsx`
- Create: `packages/layouts/src/templates/dashboard/routes/(auth)/login/page.tsx`
- Create: `packages/layouts/src/templates/dashboard/routes/(auth)/signup/page.tsx`
- Create: `packages/layouts/src/templates/dashboard/root-layout.tsx`

**Step 1: Create dashboard layout components**

These are React components using Tailwind CSS and CSS variables from the theme. They should use the `cn()` utility from `@/lib/utils`. All components are functional, not stubs.

- `sidebar.tsx` — Collapsible sidebar with nav items, logo area, user section at bottom
- `header.tsx` — Top bar with breadcrumbs, search, user avatar dropdown
- `nav.tsx` — Navigation config (array of nav items with icons, labels, hrefs)
- `mobile-nav.tsx` — Sheet/drawer for mobile responsive nav

**Step 2: Create dashboard route files**

- `(dashboard)/layout.tsx` — Wraps children in sidebar + header layout
- `(dashboard)/page.tsx` — Dashboard home with stat cards, recent activity
- `(dashboard)/settings/page.tsx` — Settings page with form sections
- `(dashboard)/analytics/page.tsx` — Analytics page with chart placeholders
- `(auth)/layout.tsx` — Centered card layout for auth pages
- `(auth)/login/page.tsx` — Login form
- `(auth)/signup/page.tsx` — Signup form

**Step 3: Create root-layout.tsx**

Modified root layout that includes theme CSS import, font loading (Inter from next/font), dark mode class on html element.

**Step 4: Verify files exist and are valid TSX**

Run: `find packages/layouts/src/templates/dashboard -name "*.tsx" | wc -l`
Expected: 12 files

**Step 5: Commit**

```bash
git add packages/layouts/src/templates/dashboard/
git commit -m "feat(layouts): add dashboard layout with sidebar, header, and 5 starter pages"
```

---

## Task 5: Create layout template files — Marketing

**Files:**
- Create: `packages/layouts/src/templates/marketing/components/navbar.tsx`
- Create: `packages/layouts/src/templates/marketing/components/footer.tsx`
- Create: `packages/layouts/src/templates/marketing/components/mobile-menu.tsx`
- Create: `packages/layouts/src/templates/marketing/routes/layout.tsx`
- Create: `packages/layouts/src/templates/marketing/routes/page.tsx`
- Create: `packages/layouts/src/templates/marketing/routes/about/page.tsx`
- Create: `packages/layouts/src/templates/marketing/routes/pricing/page.tsx`
- Create: `packages/layouts/src/templates/marketing/routes/contact/page.tsx`
- Create: `packages/layouts/src/templates/marketing/root-layout.tsx`

**Step 1: Create marketing components**

- `navbar.tsx` — Sticky top nav with logo, links, CTA button, mobile toggle
- `footer.tsx` — Footer with link columns, copyright, social links
- `mobile-menu.tsx` — Full-screen mobile menu overlay

**Step 2: Create marketing route files**

- `layout.tsx` — Wraps in navbar + footer
- `page.tsx` — Hero section + features grid + CTA section
- `about/page.tsx` — About page with team section
- `pricing/page.tsx` — Pricing cards (3 tiers)
- `contact/page.tsx` — Contact form + info

**Step 3: Commit**

```bash
git add packages/layouts/src/templates/marketing/
git commit -m "feat(layouts): add marketing layout with navbar, footer, and 4 starter pages"
```

---

## Task 6: Create layout template files — E-commerce

**Files:**
- Create: `packages/layouts/src/templates/ecommerce/components/top-nav.tsx`
- Create: `packages/layouts/src/templates/ecommerce/components/cart-sheet.tsx`
- Create: `packages/layouts/src/templates/ecommerce/components/category-sidebar.tsx`
- Create: `packages/layouts/src/templates/ecommerce/components/product-card.tsx`
- Create: `packages/layouts/src/templates/ecommerce/routes/layout.tsx`
- Create: `packages/layouts/src/templates/ecommerce/routes/page.tsx`
- Create: `packages/layouts/src/templates/ecommerce/routes/product/[id]/page.tsx`
- Create: `packages/layouts/src/templates/ecommerce/routes/cart/page.tsx`
- Create: `packages/layouts/src/templates/ecommerce/routes/checkout/page.tsx`
- Create: `packages/layouts/src/templates/ecommerce/root-layout.tsx`

**Step 1: Create e-commerce components and routes**

**Step 2: Commit**

```bash
git add packages/layouts/src/templates/ecommerce/
git commit -m "feat(layouts): add e-commerce layout with storefront and 4 starter pages"
```

---

## Task 7: Create layout template files — Blog

**Files:**
- Create: `packages/layouts/src/templates/blog/components/blog-header.tsx`
- Create: `packages/layouts/src/templates/blog/components/blog-sidebar.tsx`
- Create: `packages/layouts/src/templates/blog/components/article-layout.tsx`
- Create: `packages/layouts/src/templates/blog/routes/layout.tsx`
- Create: `packages/layouts/src/templates/blog/routes/page.tsx`
- Create: `packages/layouts/src/templates/blog/routes/[slug]/page.tsx`
- Create: `packages/layouts/src/templates/blog/routes/category/[category]/page.tsx`
- Create: `packages/layouts/src/templates/blog/root-layout.tsx`

**Step 1: Create blog components and routes**

**Step 2: Commit**

```bash
git add packages/layouts/src/templates/blog/
git commit -m "feat(layouts): add blog layout with header, sidebar, and 3 starter pages"
```

---

## Task 8: Create layout template files — Auth

**Files:**
- Create: `packages/layouts/src/templates/auth/components/auth-card.tsx`
- Create: `packages/layouts/src/templates/auth/components/social-buttons.tsx`
- Create: `packages/layouts/src/templates/auth/components/auth-header.tsx`
- Create: `packages/layouts/src/templates/auth/routes/layout.tsx`
- Create: `packages/layouts/src/templates/auth/routes/login/page.tsx`
- Create: `packages/layouts/src/templates/auth/routes/signup/page.tsx`
- Create: `packages/layouts/src/templates/auth/routes/forgot-password/page.tsx`
- Create: `packages/layouts/src/templates/auth/routes/reset-password/page.tsx`
- Create: `packages/layouts/src/templates/auth/root-layout.tsx`

**Step 1: Create auth components and routes**

**Step 2: Commit**

```bash
git add packages/layouts/src/templates/auth/
git commit -m "feat(layouts): add auth layout with card, social buttons, and 4 starter pages"
```

---

## Task 9: Create layout template files — Docs

**Files:**
- Create: `packages/layouts/src/templates/docs/components/docs-sidebar.tsx`
- Create: `packages/layouts/src/templates/docs/components/docs-header.tsx`
- Create: `packages/layouts/src/templates/docs/components/table-of-contents.tsx`
- Create: `packages/layouts/src/templates/docs/components/page-outline.tsx`
- Create: `packages/layouts/src/templates/docs/routes/layout.tsx`
- Create: `packages/layouts/src/templates/docs/routes/page.tsx`
- Create: `packages/layouts/src/templates/docs/routes/getting-started/page.tsx`
- Create: `packages/layouts/src/templates/docs/routes/api-reference/page.tsx`
- Create: `packages/layouts/src/templates/docs/root-layout.tsx`

**Step 1: Create docs components and routes**

**Step 2: Commit**

```bash
git add packages/layouts/src/templates/docs/
git commit -m "feat(layouts): add docs layout with sidebar TOC, page outline, and 3 starter pages"
```

---

## Task 10: Create layout template files — Portfolio

**Files:**
- Create: `packages/layouts/src/templates/portfolio/components/portfolio-nav.tsx`
- Create: `packages/layouts/src/templates/portfolio/components/project-card.tsx`
- Create: `packages/layouts/src/templates/portfolio/components/team-grid.tsx`
- Create: `packages/layouts/src/templates/portfolio/components/contact-section.tsx`
- Create: `packages/layouts/src/templates/portfolio/routes/layout.tsx`
- Create: `packages/layouts/src/templates/portfolio/routes/page.tsx`
- Create: `packages/layouts/src/templates/portfolio/routes/projects/page.tsx`
- Create: `packages/layouts/src/templates/portfolio/routes/team/page.tsx`
- Create: `packages/layouts/src/templates/portfolio/routes/contact/page.tsx`
- Create: `packages/layouts/src/templates/portfolio/root-layout.tsx`

**Step 1: Create portfolio components and routes**

**Step 2: Commit**

```bash
git add packages/layouts/src/templates/portfolio/
git commit -m "feat(layouts): add portfolio layout with nav, project cards, and 4 starter pages"
```

---

## Task 11: Create layout template files — Blank

**Files:**
- Create: `packages/layouts/src/templates/blank/routes/layout.tsx`
- Create: `packages/layouts/src/templates/blank/routes/page.tsx`
- Create: `packages/layouts/src/templates/blank/root-layout.tsx`

**Step 1: Create blank layout**

The blank layout is the simplest — just a root layout with theme CSS import and an empty page. This is essentially what the current base template provides.

**Step 2: Commit**

```bash
git add packages/layouts/src/templates/blank/
git commit -m "feat(layouts): add blank layout (minimal starter)"
```

---

## Task 12: Add layout scaffolding utility to layouts package

**Files:**
- Create: `packages/layouts/src/scaffold.ts`
- Create: `packages/layouts/src/__tests__/scaffold.test.ts`

**Step 1: Write failing test**

```ts
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { scaffoldLayout } from "../scaffold.js";
import { tmpdir } from "node:os";

describe("scaffoldLayout", () => {
	let tempDir: string;

	beforeEach(() => {
		tempDir = join(tmpdir(), `test-layout-${Date.now()}`);
		mkdirSync(tempDir, { recursive: true });
		// Create minimal project structure
		mkdirSync(join(tempDir, "src/app"), { recursive: true });
		mkdirSync(join(tempDir, "src/components"), { recursive: true });
	});

	afterEach(() => {
		rmSync(tempDir, { recursive: true, force: true });
	});

	it("copies layout components to src/components/layout/", () => {
		scaffoldLayout("blank", tempDir);
		// blank has no components, but the directory should exist
		expect(existsSync(join(tempDir, "src/app/page.tsx"))).toBe(true);
	});

	it("copies layout routes to src/app/", () => {
		scaffoldLayout("blank", tempDir);
		expect(existsSync(join(tempDir, "src/app/layout.tsx"))).toBe(true);
		expect(existsSync(join(tempDir, "src/app/page.tsx"))).toBe(true);
	});

	it("returns list of required components", () => {
		const result = scaffoldLayout("dashboard", tempDir);
		expect(result.requiredComponents).toContain("button");
		expect(result.requiredComponents).toContain("card");
	});
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @banavasi/layouts test`
Expected: FAIL

**Step 3: Implement scaffold.ts**

The `scaffoldLayout` function:
1. Looks up the layout preset by name
2. Copies `templates/<name>/components/*` → `projectDir/src/components/layout/`
3. Copies `templates/<name>/routes/*` → `projectDir/src/app/` (recursive, preserving route group dirs)
4. Copies `templates/<name>/root-layout.tsx` → `projectDir/src/app/layout.tsx` (overwrite)
5. Returns `{ requiredComponents: string[] }` from the preset metadata

Must use `fileURLToPath(import.meta.url)` to resolve template paths relative to the package.

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @banavasi/layouts test`
Expected: PASS

**Step 5: Update src/index.ts to export scaffoldLayout**

**Step 6: Commit**

```bash
git add packages/layouts/src/scaffold.ts packages/layouts/src/__tests__/scaffold.test.ts packages/layouts/src/index.ts
git commit -m "feat(layouts): add scaffoldLayout utility for copying layout files into projects"
```

---

## Task 13: Add theme scaffolding utility to themes package

**Files:**
- Create: `packages/themes/src/scaffold.ts`
- Create: `packages/themes/src/__tests__/scaffold.test.ts`

**Step 1: Write failing test**

```ts
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { scaffoldTheme } from "../scaffold.js";
import { tmpdir } from "node:os";

describe("scaffoldTheme", () => {
	let tempDir: string;

	beforeEach(() => {
		tempDir = join(tmpdir(), `test-theme-${Date.now()}`);
		mkdirSync(join(tempDir, "src/styles"), { recursive: true });
		mkdirSync(join(tempDir, "src/app"), { recursive: true });
	});

	afterEach(() => {
		rmSync(tempDir, { recursive: true, force: true });
	});

	it("writes theme.css to src/styles/", () => {
		scaffoldTheme("neutral", tempDir);
		const themePath = join(tempDir, "src/styles/theme.css");
		expect(existsSync(themePath)).toBe(true);
		const content = readFileSync(themePath, "utf-8");
		expect(content).toContain("--background:");
		expect(content).toContain("--primary:");
	});

	it("updates globals.css to import theme.css", () => {
		// Create a globals.css
		const globalsPath = join(tempDir, "src/app/globals.css");
		writeFileSync(globalsPath, '@import "tailwindcss";\n');

		scaffoldTheme("neutral", tempDir);

		const content = readFileSync(globalsPath, "utf-8");
		expect(content).toContain('@import "../styles/theme.css"');
		expect(content).toContain('@import "tailwindcss"');
	});

	it("throws for unknown theme name", () => {
		expect(() => scaffoldTheme("nonexistent" as any, tempDir)).toThrow();
	});
});
```

**Step 2: Run test to verify it fails**

**Step 3: Implement scaffold.ts**

The `scaffoldTheme` function:
1. Looks up theme preset by name
2. Writes the CSS string to `projectDir/src/styles/theme.css`
3. Updates `projectDir/src/app/globals.css` to import `../styles/theme.css` before the tailwindcss import

**Step 4: Run test to verify it passes**

**Step 5: Update src/index.ts to export scaffoldTheme**

**Step 6: Commit**

```bash
git add packages/themes/src/scaffold.ts packages/themes/src/__tests__/ packages/themes/src/index.ts
git commit -m "feat(themes): add scaffoldTheme utility for writing theme CSS into projects"
```

---

## Task 14: Create showcase route template files

**Files:**
- Create: `packages/layouts/src/templates/_showcase/layout.tsx`
- Create: `packages/layouts/src/templates/_showcase/page.tsx`
- Create: `packages/layouts/src/templates/_showcase/components/page.tsx`
- Create: `packages/layouts/src/templates/_showcase/pages/page.tsx`
- Create: `packages/layouts/src/templates/_showcase/theme/page.tsx`
- Create: `packages/layouts/src/templates/_showcase/layout-info/page.tsx`
- Create: `packages/layouts/src/templates/_showcase/skills/page.tsx`

The showcase is stored in layouts package under `_showcase/` (prefixed with underscore to distinguish from layout presets). It gets copied into `src/app/showcase/` during scaffolding for every layout.

**Step 1: Create showcase layout**

Clean minimal layout with left sidebar nav linking to each sub-page. No interference from the project's main layout.

**Step 2: Create showcase overview page**

Shows project name (from `{{PROJECT_NAME}}`), layout name, theme name, quick stats.

**Step 3: Create component gallery page**

Reads `.onelib/components.lock` at runtime (server component). Lists all installed components grouped by category. Each component gets a card showing name, source, category.

Note: Live rendering of every component is a stretch goal. For v1, show metadata + import path. Can add live previews later.

**Step 4: Create pages directory page**

Uses `fs.readdirSync` to scan `src/app/` for all `page.tsx` files. Lists each with its route path and a link. Server component.

**Step 5: Create theme preview page**

Renders all CSS variable values as swatches. Reads `src/styles/theme.css` and parses the variables. Shows both light and dark mode.

**Step 6: Create layout info page**

Shows current layout metadata (slots, required components). Static content based on `{{LAYOUT_NAME}}` placeholder.

**Step 7: Create skills page**

Scans `.agents/` and `.agent/` directories. Lists each skill found.

**Step 8: Commit**

```bash
git add packages/layouts/src/templates/_showcase/
git commit -m "feat(layouts): add showcase route template with gallery, theme preview, and skills list"
```

---

## Task 15: Update scaffoldLayout to include showcase

**Files:**
- Modify: `packages/layouts/src/scaffold.ts`
- Modify: `packages/layouts/src/__tests__/scaffold.test.ts`

**Step 1: Add test for showcase scaffolding**

```ts
it("copies showcase route to src/app/showcase/", () => {
	scaffoldLayout("dashboard", tempDir);
	expect(existsSync(join(tempDir, "src/app/showcase/page.tsx"))).toBe(true);
	expect(existsSync(join(tempDir, "src/app/showcase/components/page.tsx"))).toBe(true);
	expect(existsSync(join(tempDir, "src/app/showcase/theme/page.tsx"))).toBe(true);
});
```

**Step 2: Run test to verify it fails**

**Step 3: Update scaffold.ts to also copy `_showcase/` → `src/app/showcase/`**

**Step 4: Run test to verify it passes**

**Step 5: Commit**

```bash
git add packages/layouts/
git commit -m "feat(layouts): include showcase route in layout scaffolding"
```

---

## Task 16: Update create-onelib CLI with layout and theme prompts

**Files:**
- Modify: `packages/create-onelib/src/index.ts`
- Modify: `packages/create-onelib/src/utils/scaffold.ts`
- Modify: `packages/create-onelib/src/constants.ts`
- Modify: `packages/create-onelib/package.json` (add `@banavasi/themes`, `@banavasi/layouts` deps)
- Modify: `packages/create-onelib/src/utils/placeholders.ts`

**Step 1: Add @banavasi/themes and @banavasi/layouts as dependencies**

In `packages/create-onelib/package.json`, add:
```json
"@banavasi/themes": "workspace:*",
"@banavasi/layouts": "workspace:*"
```

**Step 2: Update constants.ts**

Add `{{LAYOUT_NAME}}` and `{{THEME_NAME}}` to placeholder handling. Add these template files to `TEMPLATE_FILES_WITH_PLACEHOLDERS` if the showcase uses them.

**Step 3: Update placeholders.ts**

```ts
export interface PlaceholderValues {
	projectName: string;
	layoutName?: string;
	themeName?: string;
}

export function replacePlaceholders(content: string, values: PlaceholderValues): string {
	let result = content.replaceAll("{{PROJECT_NAME}}", values.projectName);
	if (values.layoutName) {
		result = result.replaceAll("{{LAYOUT_NAME}}", values.layoutName);
	}
	if (values.themeName) {
		result = result.replaceAll("{{THEME_NAME}}", values.themeName);
	}
	return result;
}
```

**Step 4: Update scaffold.ts**

After copying the base template:
1. Call `scaffoldTheme(themeName, projectDir)` from `@banavasi/themes`
2. Call `scaffoldLayout(layoutName, projectDir)` from `@banavasi/layouts`
3. Only install `requiredComponents` + base components from `@banavasi/components` (not all 51)

Update `scaffoldProject` signature:
```ts
export async function scaffoldProject(
	projectDir: string,
	projectName: string,
	layoutName: string,
	themeName: string,
): Promise<ScaffoldProjectResult>
```

**Step 5: Update index.ts (main CLI) with prompts**

After the project name prompt, add:

```ts
// Prompt: layout
const layoutChoice = await p.select({
	message: "Choose a layout:",
	options: LAYOUT_PRESETS.map((l) => ({
		value: l.name,
		label: l.displayName,
		hint: l.description,
	})),
});

// Prompt: theme
const themeChoice = await p.select({
	message: "Choose a theme:",
	options: THEME_PRESETS.map((t) => ({
		value: t.name,
		label: t.displayName,
		hint: t.description,
	})),
});
```

Pass choices through to `scaffoldProject()`.

**Step 6: Add CLI flags support**

Parse `--layout <name>` and `--theme <name>` from `process.argv`. If provided, skip the respective prompts.

Parse `--no-skills` flag to skip skills installation.

**Step 7: Update the outro message**

```ts
p.outro(
	`${pc.green("Done!")} Your project is ready at ${pc.bold(projectName)}\n\n` +
		`  ${pc.cyan("cd")} ${projectName}\n` +
		`  ${pc.cyan("pnpm dev")}\n` +
		`  ${pc.dim("Visit /showcase for component gallery")}\n`,
);
```

**Step 8: Commit**

```bash
git add packages/create-onelib/
git commit -m "feat(create-onelib): add layout and theme selection prompts with CLI flags"
```

---

## Task 17: Update create-onelib tests

**Files:**
- Modify: `packages/create-onelib/src/__tests__/constants.test.ts`
- Modify: `packages/create-onelib/src/__tests__/skills.test.ts`
- Create or modify: `packages/create-onelib/src/__tests__/integration/scaffold.test.ts`

**Step 1: Update scaffold integration test**

Update the existing scaffold test to pass layout and theme arguments. Verify:
- Theme CSS file exists at `src/styles/theme.css`
- Layout routes exist in `src/app/`
- Showcase route exists at `src/app/showcase/`
- Only required components are installed (not all 51)
- `onelib.config.ts` has correct layout and theme values

**Step 2: Update placeholder tests if needed**

**Step 3: Run all create-onelib tests**

Run: `pnpm --filter @banavasi/create-onelib test`
Expected: PASS

**Step 4: Commit**

```bash
git add packages/create-onelib/src/__tests__/
git commit -m "test(create-onelib): update tests for layout and theme scaffolding"
```

---

## Task 18: Update base template files

**Files:**
- Modify: `packages/templates/base/onelib.config.ts`
- Modify: `packages/templates/base/src/app/globals.css`
- Modify: `packages/templates/base/package.json.template`

**Step 1: Update onelib.config.ts to include layout field**

```ts
import { defineConfig } from "@banavasi/onelib";

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
		preset: "{{THEME_NAME}}",
	},
	layout: "{{LAYOUT_NAME}}",
});
```

**Step 2: Update globals.css**

The theme scaffold utility will handle inserting the import, but we should ensure the base file has a comment placeholder:

```css
@import "tailwindcss";
```

(The scaffoldTheme function will prepend the theme import.)

**Step 3: Add next-themes to package.json.template for dark mode support**

```json
"next-themes": "^0.4.0"
```

Also add `@banavasi/layouts` and `@banavasi/themes`:

```json
"@banavasi/layouts": "^0.1.0",
"@banavasi/themes": "^0.1.0"
```

**Step 4: Commit**

```bash
git add packages/templates/base/
git commit -m "feat(templates): update base template with layout/theme placeholders and next-themes"
```

---

## Task 19: Update next.config for showcase protection

**Files:**
- Modify: `packages/templates/base/next.config.ts`

**Step 1: Add production redirect for /showcase**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		if (process.env.NODE_ENV === "production") {
			return [
				{
					source: "/showcase/:path*",
					destination: "/",
					permanent: false,
				},
			];
		}
		return [];
	},
};

export default nextConfig;
```

**Step 2: Commit**

```bash
git add packages/templates/base/next.config.ts
git commit -m "feat(templates): add production redirect for /showcase route"
```

---

## Task 20: Add add-later commands to @banavasi/scripts

**Files:**
- Create: `tooling/scripts/src/commands/add-layout.ts`
- Create: `tooling/scripts/src/commands/add-theme.ts`
- Create: `tooling/scripts/src/__tests__/add-layout.test.ts`
- Create: `tooling/scripts/src/__tests__/add-theme.test.ts`
- Modify: `tooling/scripts/src/index.ts`
- Modify: `tooling/scripts/package.json` (add `@banavasi/layouts`, `@banavasi/themes` deps)

**Step 1: Write failing test for add-layout**

```ts
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// Mock @banavasi/layouts
vi.mock("@banavasi/layouts", () => ({
	scaffoldLayout: vi.fn().mockReturnValue({ requiredComponents: ["button"] }),
	getLayoutPreset: vi.fn().mockReturnValue({ name: "dashboard", displayName: "Dashboard" }),
}));

import { runAddLayout } from "../commands/add-layout.js";

describe("runAddLayout", () => {
	it("calls scaffoldLayout with the layout name", async () => {
		const { scaffoldLayout } = await import("@banavasi/layouts");
		await runAddLayout("dashboard", "/tmp/test-project");
		expect(scaffoldLayout).toHaveBeenCalledWith("dashboard", "/tmp/test-project");
	});
});
```

**Step 2: Run test to verify it fails**

**Step 3: Implement add-layout.ts and add-theme.ts**

**Step 4: Run test to verify it passes**

**Step 5: Update index.ts exports**

**Step 6: Commit**

```bash
git add tooling/scripts/
git commit -m "feat(scripts): add 'add layout' and 'add theme' commands"
```

---

## Task 21: Update publish workflow for @banavasi/themes

**Files:**
- Modify: `.github/workflows/publish.yml`

**Step 1: Add publish step for @banavasi/themes**

Add before the `@banavasi/layouts` publish step:

```yaml
      - name: Publish @banavasi/themes
        run: pnpm --filter @banavasi/themes publish --no-git-checks --access restricted
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Step 2: Commit**

```bash
git add .github/workflows/publish.yml
git commit -m "ci: add @banavasi/themes to publish workflow"
```

---

## Task 22: Update layouts package.json for template file inclusion

**Files:**
- Modify: `packages/layouts/package.json`
- Create: `packages/layouts/.npmignore`

**Step 1: Ensure template files are included in npm publish**

The layouts package needs to include `src/templates/` in the published package (these are copied at scaffold time, not compiled). Update package.json:

```json
"files": ["dist", "src/templates"]
```

**Step 2: Create .npmignore**

```
.turbo/
node_modules/
```

**Step 3: Commit**

```bash
git add packages/layouts/
git commit -m "fix(layouts): include template files in published package"
```

---

## Task 23: Full integration test

**Files:**
- No new files — run existing tests

**Step 1: Run all tests across the monorepo**

Run: `pnpm test`
Expected: All test suites pass

**Step 2: Run build across the monorepo**

Run: `pnpm build`
Expected: All packages build successfully

**Step 3: Verify package sizes are reasonable**

Run: `du -sh packages/*/dist/ packages/layouts/src/templates/`
Expected: Templates dir is the largest, individual layouts under 50KB each

**Step 4: Commit any fixes needed**

---

## Task 24: Bump versions and publish v0.2.0

**Files:**
- Modify: All package.json files — bump version to `0.2.0`

**Step 1: Bump all package versions to 0.2.0**

Update `version` in every publishable package.json:
- `packages/onelib/package.json`
- `packages/registry/package.json`
- `packages/components/package.json`
- `packages/skills/package.json`
- `packages/layouts/package.json`
- `packages/themes/package.json` (new)
- `packages/templates/package.json`
- `packages/create-onelib/package.json`
- `tooling/scripts/package.json`

**Step 2: Commit version bump**

```bash
git add -A
git commit -m "chore: bump all packages to v0.2.0"
```

**Step 3: Push to main**

```bash
git push origin main
```

**Step 4: Create release**

```bash
GITHUB_TOKEN="" gh release create v0.2.0 \
  --title "v0.2.0 - Layouts, Themes & Showcase" \
  --notes "..." \
  --target main
```

**Step 5: Verify publish workflow completes**

Run: `GITHUB_TOKEN="" gh run list --limit 1`
Expected: Workflow in_progress or completed successfully

---

## Execution Order & Dependencies

```
Task 1  (themes pkg)     ─┐
Task 2  (config types)   ─┤
Task 3  (layout metadata)─┤── Foundation (no deps between these)
                           │
Task 4  (dashboard)       ─┤
Task 5  (marketing)       ─┤
Task 6  (ecommerce)       ─┤
Task 7  (blog)            ─┤── Layout templates (depend on Task 3)
Task 8  (auth)            ─┤   (independent of each other — parallelizable)
Task 9  (docs)            ─┤
Task 10 (portfolio)       ─┤
Task 11 (blank)           ─┘
                           │
Task 12 (layout scaffold) ─┤── Scaffold utilities (depend on templates)
Task 13 (theme scaffold)  ─┤
Task 14 (showcase files)  ─┘
                           │
Task 15 (showcase in scaffold)─── Depends on 12, 14
                           │
Task 16 (CLI prompts)     ─┤── CLI updates (depend on 12, 13)
Task 17 (CLI tests)       ─┤
Task 18 (base template)   ─┤
Task 19 (next.config)     ─┘
                           │
Task 20 (add commands)    ─── Scripts (depends on 12, 13)
Task 21 (publish workflow)─── CI (independent)
Task 22 (layout pkg files)─── Packaging (independent)
                           │
Task 23 (integration test)─── Depends on all above
Task 24 (publish v0.2.0) ─── Final step
```

**Parallelizable groups:**
- Tasks 1, 2, 3 can run in parallel
- Tasks 4-11 can ALL run in parallel
- Tasks 12, 13, 14 can run in parallel
- Tasks 16-19 can mostly run in parallel
- Tasks 20, 21, 22 can run in parallel
