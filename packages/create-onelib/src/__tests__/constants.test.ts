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
