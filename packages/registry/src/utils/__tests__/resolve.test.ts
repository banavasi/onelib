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
		const result = resolveWithDependencies(manifest, "hero-section");
		const buttonCount = result.filter((r) => r.name === "button").length;
		expect(buttonCount).toBe(1);
	});

	it("throws on circular dependencies", () => {
		const circularManifest: RegistryManifest = {
			version: "0.1.0",
			updatedAt: "2026-02-20T00:00:00.000Z",
			components: [
				{
					name: "a",
					displayName: "A",
					description: "Component A",
					version: "1.0.0",
					source: "onelib",
					category: "ui",
					dependencies: ["b"],
					files: ["a.tsx"],
					devOnly: false,
					tags: [],
				},
				{
					name: "b",
					displayName: "B",
					description: "Component B",
					version: "1.0.0",
					source: "onelib",
					category: "ui",
					dependencies: ["a"],
					files: ["b.tsx"],
					devOnly: false,
					tags: [],
				},
			],
			layouts: [],
			skills: [],
		};
		expect(() => resolveWithDependencies(circularManifest, "a")).toThrow(
			"Circular dependency detected",
		);
	});
});
