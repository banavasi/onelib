import { describe, expect, it } from "vitest";
import { CURATED_SKILLS, TEMPLATE_FILES_WITH_PLACEHOLDERS } from "../constants.js";

describe("CURATED_SKILLS", () => {
	it("contains 6 skill repos", () => {
		expect(CURATED_SKILLS).toHaveLength(6);
	});

	it("each skill has owner/repo format", () => {
		for (const skill of CURATED_SKILLS) {
			const parts = skill.split("/");
			expect(parts.length).toBe(2);
		}
	});

	it("includes expected skills", () => {
		expect(CURATED_SKILLS).toContain("anthropics/skills");
		expect(CURATED_SKILLS).toContain("obra/superpowers");
		expect(CURATED_SKILLS).toContain("vercel-labs/next-skills");
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
