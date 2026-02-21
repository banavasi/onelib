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
		expect(() => ComponentSchema.parse({ ...validComponent, source: "invalid" })).toThrow();
	});

	it("rejects invalid version", () => {
		expect(() => ComponentSchema.parse({ ...validComponent, version: "not-semver" })).toThrow();
	});

	it("rejects invalid category", () => {
		expect(() => ComponentSchema.parse({ ...validComponent, category: "invalid" })).toThrow();
	});

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
});
