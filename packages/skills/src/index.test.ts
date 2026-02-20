import { describe, expect, it } from "vitest";
import { CURATED_SKILLS, SKILLS_VERSION } from "./index.js";

describe("SKILLS_VERSION", () => {
	it("is a semver string", () => {
		expect(SKILLS_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
	});
});

describe("CURATED_SKILLS", () => {
	it("is a non-empty array", () => {
		expect(CURATED_SKILLS.length).toBeGreaterThan(0);
	});

	it("each skill matches owner/repo/skill format", () => {
		for (const skill of CURATED_SKILLS) {
			const parts = skill.split("/");
			expect(parts.length).toBeGreaterThanOrEqual(3);
		}
	});

	it("contains no duplicate entries", () => {
		const unique = new Set(CURATED_SKILLS);
		expect(unique.size).toBe(CURATED_SKILLS.length);
	});

	it("includes key curated skills", () => {
		expect(CURATED_SKILLS).toContain("anthropics/skills/frontend-design");
		expect(CURATED_SKILLS).toContain("obra/superpowers/brainstorming");
	});
});
