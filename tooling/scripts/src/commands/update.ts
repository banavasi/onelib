import * as logger from "../utils/logger.js";
import { runSkillsUpdate } from "./skills-update.js";

export interface UpdateResult {
	success: boolean;
}

export async function runUpdate(cwd?: string): Promise<UpdateResult> {
	logger.log("Running updates...\n");

	const skillsResult = await runSkillsUpdate(cwd);

	const hasFailures = skillsResult.failed.length > 0;

	console.log("");
	if (hasFailures) {
		logger.log(
			`Update complete: skills ${skillsResult.installed.length}/${skillsResult.installed.length + skillsResult.failed.length}`,
		);
	} else {
		logger.log(
			`Update complete: skills ${skillsResult.installed.length}/${skillsResult.installed.length}`,
		);
	}

	return { success: !hasFailures };
}
