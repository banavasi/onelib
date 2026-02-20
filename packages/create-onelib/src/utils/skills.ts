import { CURATED_SKILLS, SKILL_INSTALL_TIMEOUT_MS } from "../constants.js";
import { execCommand } from "./exec.js";

export interface SkillCommand {
	command: string;
	args: string[];
	label: string;
}

export function buildSkillInstallCommands(): SkillCommand[] {
	return CURATED_SKILLS.map((skill) => ({
		command: "npx",
		args: ["skills", "add", skill],
		label: skill,
	}));
}

export interface SkillInstallResult {
	installed: string[];
	failed: string[];
}

export async function installSkills(cwd: string): Promise<SkillInstallResult> {
	const commands = buildSkillInstallCommands();
	const installed: string[] = [];
	const failed: string[] = [];

	for (const cmd of commands) {
		const result = await execCommand(cmd.command, cmd.args, {
			cwd,
			timeoutMs: SKILL_INSTALL_TIMEOUT_MS,
		});

		if (result.ok) {
			installed.push(cmd.label);
		} else {
			failed.push(cmd.label);
		}
	}

	return { installed, failed };
}
