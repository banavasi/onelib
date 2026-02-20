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
		for (const cat of ["coding", "testing", "debugging", "architecture", "workflow", "tooling"]) {
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
