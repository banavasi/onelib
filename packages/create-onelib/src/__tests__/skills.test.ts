import { describe, expect, it } from "vitest";
import { CURATED_SKILLS } from "../constants.js";
import { buildSkillInstallCommands } from "../utils/skills.js";

describe("buildSkillInstallCommands", () => {
	it("generates one command per curated skill", () => {
		const commands = buildSkillInstallCommands();
		expect(commands).toHaveLength(CURATED_SKILLS.length);
	});

	it("each command is npx skills add <skill>", () => {
		const commands = buildSkillInstallCommands();
		for (const cmd of commands) {
			expect(cmd.command).toBe("npx");
			expect(cmd.args[0]).toBe("skills");
			expect(cmd.args[1]).toBe("add");
			expect(cmd.args[2]).toBeDefined();
		}
	});

	it("includes the correct skill repos", () => {
		const commands = buildSkillInstallCommands();
		const skillPaths = commands.map((c) => c.args[2]);
		expect(skillPaths).toContain("anthropics/skills");
		expect(skillPaths).toContain("obra/superpowers");
	});
});
