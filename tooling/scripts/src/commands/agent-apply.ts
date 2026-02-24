import { isAbsolute, join, resolve } from "node:path";
import { applyAgentPlan, parseAgentPlanFile } from "../agent/apply.js";
import { loadConfig } from "../utils/config.js";
import * as logger from "../utils/logger.js";

export interface AgentApplyOptions {
	file?: string;
	cwd?: string;
}

export function parseAgentApplyArgs(argv: string[]): AgentApplyOptions {
	const options: AgentApplyOptions = {};
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === "--file" || arg === "-f") {
			const value = argv[i + 1];
			if (value) {
				options.file = value;
				i++;
			}
		}
	}
	return options;
}

export async function runAgentApply(options: AgentApplyOptions = {}): Promise<{ success: boolean }> {
	const cwd = options.cwd ?? process.cwd();
	const file = options.file ?? "onelib.plan.json";
	const planPath = isAbsolute(file) ? file : resolve(join(cwd, file));
	logger.log(`Applying agent plan: ${planPath}`);

	const plan = parseAgentPlanFile(planPath);
	const config = await loadConfig(cwd);
	await applyAgentPlan(plan, cwd, config);
	return { success: true };
}
