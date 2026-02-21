import * as logger from "../utils/logger.js";
import { runComponentsUpdate } from "./components-update.js";
import { runSkillsUpdate } from "./skills-update.js";

export interface UpdateResult {
	success: boolean;
}

export async function runUpdate(cwd?: string): Promise<UpdateResult> {
	logger.log("Running updates...\n");

	const skillsResult = await runSkillsUpdate(cwd);
	const componentsReport = await runComponentsUpdate(cwd);

	const hasSkillFailures = skillsResult.failed.length > 0;

	console.log("");
	logger.log(
		`Update complete: skills ${skillsResult.installed.length}/${skillsResult.installed.length + skillsResult.failed.length}, components ${componentsReport.updated.length + componentsReport.added.length} updated`,
	);

	return { success: !hasSkillFailures };
}
