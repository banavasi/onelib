import { CURATED_SKILLS } from "@banavasi/skills";
import { describe, expect, it } from "vitest";
import { buildSkillList } from "../commands/skills-update.js";

describe("buildSkillList", () => {
	it("returns curated skills when config has curated=true and no custom", () => {
		const result = buildSkillList({
			curated: true,
			custom: [],
		});
		expect(result).toEqual([...CURATED_SKILLS]);
	});

	it("returns only custom skills when curated=false", () => {
		const result = buildSkillList({
			curated: false,
			custom: ["my/custom/skill"],
		});
		expect(result).toEqual(["my/custom/skill"]);
	});

	it("returns empty array when curated=false and no custom", () => {
		const result = buildSkillList({
			curated: false,
			custom: [],
		});
		expect(result).toEqual([]);
	});

	it("combines curated and custom skills", () => {
		const result = buildSkillList({
			curated: true,
			custom: ["my/custom/skill"],
		});
		expect(result).toContain("my/custom/skill");
		expect(result).toContain("anthropics/skills");
		expect(result.length).toBe(CURATED_SKILLS.length + 1);
	});

	it("deduplicates if custom skill overlaps with curated", () => {
		const result = buildSkillList({
			curated: true,
			custom: ["anthropics/skills"],
		});
		expect(result.length).toBe(CURATED_SKILLS.length);
	});
});
