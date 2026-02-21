# Port Real Components Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace 3 placeholder component stubs with real implementations and add 5 new components ported from Sera UI and ReactBits, plus add peerDependencies support to the registry schema and scaffold.

**Architecture:** Components are fetched from source library websites, adapted with minimal changes (Biome formatting, import paths), and placed in `packages/components/src/<category>/<name>/`. The `ComponentSchema` gains an optional `peerDependencies` field. The scaffold collects peer deps and the template's `package.json.template` is updated with common deps (`clsx`, `tailwind-merge`, `motion`). The base template already has `src/lib/utils.ts` with `cn()` and the `@/*` path alias configured.

**Tech Stack:** React 19, TypeScript 5.9, Tailwind CSS 4, Motion 11+, Biome 2.x, Vitest 4.x, Zod 4

---

### Task 1: Add peerDependencies to ComponentSchema

**Files:**
- Modify: `packages/registry/src/schemas/component.ts:4-16`
- Test: `packages/registry/src/schemas/__tests__/component.test.ts`

**Step 1: Write the failing test**

Add two tests to `packages/registry/src/schemas/__tests__/component.test.ts`:

```typescript
it("accepts peerDependencies when provided", () => {
	const result = ComponentSchema.parse({
		...validComponent,
		peerDependencies: { "motion": "^11.0.0", "clsx": "^2.0.0" },
	});
	expect(result.peerDependencies).toEqual({ "motion": "^11.0.0", "clsx": "^2.0.0" });
});

it("defaults peerDependencies to undefined when omitted", () => {
	const result = ComponentSchema.parse(validComponent);
	expect(result.peerDependencies).toBeUndefined();
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run packages/registry/src/schemas/__tests__/component.test.ts -v`
Expected: FAIL — `peerDependencies` is not a known key (Zod strips it)

**Step 3: Write minimal implementation**

In `packages/registry/src/schemas/component.ts`, add the `peerDependencies` field to the schema:

```typescript
export const ComponentSchema = z.object({
	name: z.string().min(1),
	displayName: z.string().min(1),
	description: z.string(),
	version: SemverSchema,
	source: SourceSchema,
	category: ComponentCategorySchema,
	sourceUrl: z.string().url().optional(),
	peerDependencies: z.record(z.string(), z.string()).optional(),
	dependencies: z.array(z.string()).default([]),
	files: z.array(z.string()).min(1),
	devOnly: z.boolean().default(false),
	tags: z.array(z.string()).default([]),
});
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run packages/registry/src/schemas/__tests__/component.test.ts -v`
Expected: ALL PASS

**Step 5: Run full test suite**

Run: `pnpm test`
Expected: All 152+ tests pass (no regressions)

**Step 6: Commit**

```
feat(registry): add optional peerDependencies field to ComponentSchema
```

---

### Task 2: Add common deps to base template

**Files:**
- Modify: `packages/templates/base/package.json.template:15-20`

**Step 1: Add clsx, tailwind-merge, and motion to the template's dependencies**

In `packages/templates/base/package.json.template`, add to the `"dependencies"` block:

```json
"dependencies": {
	"next": "^15.3.0",
	"react": "^19.1.0",
	"react-dom": "^19.1.0",
	"onelib": "^0.1.0",
	"clsx": "^2.1.0",
	"tailwind-merge": "^3.0.0",
	"motion": "^11.0.0"
},
```

**Step 2: Run test to verify no regressions**

Run: `pnpm vitest run packages/create-onelib/src/__tests__/integration/scaffold.test.ts -v`
Expected: ALL PASS — the scaffold test checks package.json content, but only validates the project name replacement, not dep list.

**Step 3: Commit**

```
chore(templates): add clsx, tailwind-merge, motion to base template deps
```

---

### Task 3: Update tsconfig.json to exclude new category directories

**Files:**
- Modify: `packages/components/tsconfig.json:9`

**Step 1: Add new category dirs to exclude list**

The tsconfig currently excludes `src/buttons`, `src/backgrounds`, `src/text-animations`. Add the new categories:

```json
"exclude": ["src/**/__tests__", "src/buttons", "src/backgrounds", "src/text-animations", "src/sections", "src/gallery", "src/lib"]
```

Note: `src/lib` is excluded because it contains the `cn()` utility that imports from `clsx`/`tailwind-merge` which are not installed in the monorepo (they're template deps).

**Step 2: Run build to verify**

Run: `pnpm turbo build --filter=@onelib/components`
Expected: Build succeeds (tsc skips the component source dirs)

**Step 3: Commit**

```
chore(components): exclude new category dirs from tsc compilation
```

---

### Task 4: Create lib/utils.ts in packages/components

**Files:**
- Create: `packages/components/src/lib/utils.ts`

**Step 1: Create the shared utility file**

This file exists in the component source tree so ported components can reference it consistently. It mirrors the template's `src/lib/utils.ts` exactly. When components are scaffolded into a project, this file is NOT copied (the template already provides it). It's here purely as a reference for source component imports.

```typescript
// This file mirrors the generated project's src/lib/utils.ts
// Components import from "@/lib/utils" which resolves in the generated project
// This copy exists only as a reference — it is NOT scaffolded (excluded from tsc)
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
```

**Step 2: Verify build still works**

Run: `pnpm turbo build --filter=@onelib/components`
Expected: Build succeeds (src/lib is excluded from tsc)

**Step 3: Commit**

```
chore(components): add reference lib/utils.ts with cn() utility
```

---

### Task 5: Port basic-button from Sera UI

**Files:**
- Modify: `packages/components/src/buttons/basic-button/basic-button.tsx`
- Modify: `packages/components/registry.json` (update entry with peerDependencies)

**Step 1: Fetch the component source**

Visit `https://seraui.com/docs/buttons/basic` and extract the component code.

**Step 2: Adapt and write the component**

Replace the stub in `packages/components/src/buttons/basic-button/basic-button.tsx` with the ported code. Apply minimal adaptations:
- Source comment at top: `// Source: Sera UI (seraui.com)`
- Tabs for indentation, double quotes, semicolons
- Import `cn` from `"@/lib/utils"` (if used)
- Change `framer-motion` imports to `motion` (if used)

**Step 3: Update registry.json entry**

Update the basic-button entry in `packages/components/registry.json` to include `peerDependencies` if the component requires any external deps beyond React.

**Step 4: Run Biome check**

Run: `pnpm biome check packages/components/src/buttons/basic-button/basic-button.tsx`
Expected: No errors

**Step 5: Run tests to verify no regressions**

Run: `pnpm test`
Expected: All tests pass

**Step 6: Commit**

```
feat(components): port basic-button from Sera UI
```

---

### Task 6: Port shimmer-button from Sera UI

**Files:**
- Create: `packages/components/src/buttons/shimmer-button/shimmer-button.tsx`
- Create: `packages/components/src/buttons/shimmer-button/index.ts`
- Modify: `packages/components/registry.json` (add entry)

**Step 1: Fetch the component source**

Visit `https://seraui.com/docs/buttons/shimmer` and extract the component code.

**Step 2: Adapt and write the component**

Create `packages/components/src/buttons/shimmer-button/shimmer-button.tsx` with the ported code. Same adaptation rules as Task 5.

**Step 3: Create barrel export**

Create `packages/components/src/buttons/shimmer-button/index.ts`:

```typescript
export { ShimmerButton } from "./shimmer-button";
```

(Adjust the export name to match the actual component name from the source.)

**Step 4: Add registry.json entry**

Add a new entry to `packages/components/registry.json`:

```json
{
	"name": "shimmer-button",
	"displayName": "Shimmer Button",
	"category": "buttons",
	"source": "seraui",
	"sourceUrl": "https://seraui.com/docs/buttons/shimmer",
	"version": "0.1.0",
	"description": "Button with animated shimmer effect",
	"files": ["buttons/shimmer-button/shimmer-button.tsx"],
	"peerDependencies": {},
	"dependencies": [],
	"tags": ["button", "animated", "shimmer"]
}
```

(Adjust `peerDependencies` based on actual imports found in the source.)

**Step 5: Run Biome check + tests**

Run: `pnpm biome check packages/components/src/buttons/shimmer-button/ && pnpm test`
Expected: Lint clean, all tests pass

**Step 6: Commit**

```
feat(components): port shimmer-button from Sera UI
```

---

### Task 7: Port aurora from ReactBits

**Files:**
- Modify: `packages/components/src/backgrounds/aurora/aurora.tsx`
- Modify: `packages/components/registry.json` (update entry)

**Step 1: Fetch the component source**

Visit `https://reactbits.dev/backgrounds/aurora` and extract the component code.

**Step 2: Adapt and write the component**

Replace the stub in `packages/components/src/backgrounds/aurora/aurora.tsx`. Same adaptation rules.

**Step 3: Update registry.json entry**

Update the aurora entry with `peerDependencies` if needed.

**Step 4: Run Biome check + tests**

Run: `pnpm biome check packages/components/src/backgrounds/aurora/aurora.tsx && pnpm test`
Expected: Lint clean, all tests pass

**Step 5: Commit**

```
feat(components): port aurora background from ReactBits
```

---

### Task 8: Port silk from ReactBits

**Files:**
- Create: `packages/components/src/backgrounds/silk/silk.tsx`
- Create: `packages/components/src/backgrounds/silk/index.ts`
- Modify: `packages/components/registry.json` (add entry)

**Step 1: Fetch the component source**

Visit `https://reactbits.dev/backgrounds/silk` and extract the component code.

**Step 2: Adapt, write, create barrel, add registry entry**

Same pattern as Task 6 (shimmer-button).

**Step 3: Run Biome check + tests**

Run: `pnpm biome check packages/components/src/backgrounds/silk/ && pnpm test`
Expected: Lint clean, all tests pass

**Step 4: Commit**

```
feat(components): port silk background from ReactBits
```

---

### Task 9: Port fuzzy-text from Sera UI

**Files:**
- Modify: `packages/components/src/text-animations/fuzzy-text/fuzzy-text.tsx`
- Modify: `packages/components/registry.json` (update entry)

**Step 1: Fetch the component source**

Visit `https://seraui.com/docs/text-animations/fuzzy` and extract the component code.

**Step 2: Adapt and write the component**

Replace the stub. Same adaptation rules.

**Step 3: Update registry.json entry**

**Step 4: Run Biome check + tests**

Run: `pnpm biome check packages/components/src/text-animations/fuzzy-text/fuzzy-text.tsx && pnpm test`
Expected: Lint clean, all tests pass

**Step 5: Commit**

```
feat(components): port fuzzy-text from Sera UI
```

---

### Task 10: Port decrypting-text from Sera UI

**Files:**
- Create: `packages/components/src/text-animations/decrypting-text/decrypting-text.tsx`
- Create: `packages/components/src/text-animations/decrypting-text/index.ts`
- Modify: `packages/components/registry.json` (add entry)

**Step 1: Fetch the component source**

Visit `https://seraui.com/docs/text-animations/decrypting` and extract the component code.

**Step 2: Adapt, write, create barrel, add registry entry**

Same pattern as Task 6.

**Step 3: Run Biome check + tests**

Run: `pnpm biome check packages/components/src/text-animations/decrypting-text/ && pnpm test`
Expected: Lint clean, all tests pass

**Step 4: Commit**

```
feat(components): port decrypting-text from Sera UI
```

---

### Task 11: Port marquee from Sera UI

**Files:**
- Create: `packages/components/src/sections/marquee/marquee.tsx`
- Create: `packages/components/src/sections/marquee/index.ts`
- Modify: `packages/components/registry.json` (add entry)

**Step 1: Fetch the component source**

Visit `https://seraui.com/docs/sections/marquee` (or equivalent URL) and extract the component code.

**Step 2: Adapt, write, create barrel, add registry entry**

Same pattern as Task 6.

**Step 3: Run Biome check + tests**

Run: `pnpm biome check packages/components/src/sections/marquee/ && pnpm test`
Expected: Lint clean, all tests pass

**Step 4: Commit**

```
feat(components): port marquee from Sera UI
```

---

### Task 12: Port dome-gallery from ReactBits

**Files:**
- Create: `packages/components/src/gallery/dome-gallery/dome-gallery.tsx`
- Create: `packages/components/src/gallery/dome-gallery/index.ts`
- Modify: `packages/components/registry.json` (add entry)

**Step 1: Fetch the component source**

Visit `https://reactbits.dev/components/dome-gallery` (or equivalent URL) and extract the component code.

**Step 2: Adapt, write, create barrel, add registry entry**

Same pattern as Task 6.

**Step 3: Run Biome check + tests**

Run: `pnpm biome check packages/components/src/gallery/dome-gallery/ && pnpm test`
Expected: Lint clean, all tests pass

**Step 4: Commit**

```
feat(components): port dome-gallery from ReactBits
```

---

### Task 13: Update scaffold test to verify new components

**Files:**
- Modify: `packages/components/src/__tests__/scaffold.test.ts`

**Step 1: Extend the scaffold test fixture**

Update `setupFixture()` to also create sample files for the new categories (sections, gallery). Add assertions that verify the new category directories are created during scaffolding.

Add test:

```typescript
it("copies components from all categories to target", () => {
	scaffoldComponents(COMPONENTS_SRC, TARGET_DIR);

	expect(existsSync(join(TARGET_DIR, "buttons/basic-button.tsx"))).toBe(true);
	expect(existsSync(join(TARGET_DIR, "backgrounds/aurora.tsx"))).toBe(true);
	// Add checks for new categories set up in fixture
});
```

**Step 2: Run test**

Run: `pnpm vitest run packages/components/src/__tests__/scaffold.test.ts -v`
Expected: ALL PASS

**Step 3: Commit**

```
test(components): extend scaffold tests for new component categories
```

---

### Task 14: Update registry test to validate peerDependencies in registry.json

**Files:**
- Modify: `packages/components/src/__tests__/registry.test.ts`

**Step 1: Add test for peerDependencies in loaded registry**

```typescript
it("loads registry with peerDependencies fields", () => {
	const result = loadComponentRegistry();
	expect(result.success).toBe(true);
	if (result.success) {
		// At least one component should have peerDependencies
		const hasAnyPeerDeps = result.data.components.some(
			(c) => c.peerDependencies !== undefined,
		);
		expect(hasAnyPeerDeps).toBe(true);
	}
});
```

**Step 2: Run test**

Run: `pnpm vitest run packages/components/src/__tests__/registry.test.ts -v`
Expected: ALL PASS

**Step 3: Commit**

```
test(components): add peerDependencies validation to registry test
```

---

### Task 15: Final validation — full build + test + lint

**Files:** None (validation only)

**Step 1: Run full lint**

Run: `pnpm turbo lint`
Expected: All packages pass lint

**Step 2: Run full build**

Run: `pnpm turbo build`
Expected: All packages build

**Step 3: Run full test suite**

Run: `pnpm test`
Expected: All tests pass (should be 155+ now)

**Step 4: Commit if any fixups needed**

```
chore: fix lint/build issues from component porting
```
