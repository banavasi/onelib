import { CURATED_SKILLS } from "@onelib/skills";
import { loadConfig } from "../utils/config.js";
import { execCommand } from "../utils/exec.js";
import * as logger from "../utils/logger.js";

const SKILL_INSTALL_TIMEOUT_MS = 30_000;

interface SkillsConfig {
	curated: boolean;
	custom: string[];
}

export interface SkillsUpdateResult {
	installed: string[];
	failed: string[];
}

export function buildSkillList(skills: SkillsConfig): string[] {
	const list: string[] = [];

	if (skills.curated) {
		list.push(...CURATED_SKILLS);
	}

	for (const skill of skills.custom) {
		if (!list.includes(skill)) {
			list.push(skill);
		}
	}

	return list;
}

export async function runSkillsUpdate(cwd?: string): Promise<SkillsUpdateResult> {
	const workDir = cwd ?? process.cwd();
	const config = await loadConfig(workDir);

	let skills: SkillsConfig;

	if (config) {
		skills = config.skills;
	} else {
		logger.warn("Could not load onelib.config.ts — using default curated skills");
		skills = { curated: true, custom: [] };
	}

	const skillList = buildSkillList(skills);

	if (skillList.length === 0) {
		logger.log("No skills to install");
		return { installed: [], failed: [] };
	}

	logger.log("Updating skills...");

	const installed: string[] = [];
	const failed: string[] = [];

	for (const skill of skillList) {
		const result = await execCommand("npx", ["skills", "add", skill], {
			cwd: workDir,
			timeoutMs: SKILL_INSTALL_TIMEOUT_MS,
		});

		if (result.ok) {
			logger.success(skill);
			installed.push(skill);
		} else {
			logger.error(`${skill} (${result.message})`);
			failed.push(skill);
		}
	}

	const summary = `Skills: ${installed.length} installed, ${failed.length} failed`;
	logger.log(summary);

	return { installed, failed };
}
