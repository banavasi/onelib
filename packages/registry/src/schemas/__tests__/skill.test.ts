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
