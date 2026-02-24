import { isAbsolute, join, resolve } from "node:path";
import { applyBlueprint, parseBlueprintFile } from "../blueprint/apply.js";
import { loadConfig } from "../utils/config.js";
import * as logger from "../utils/logger.js";

export interface BlueprintApplyOptions {
	file?: string;
	cwd?: string;
}

export function parseBlueprintArgs(argv: string[]): BlueprintApplyOptions {
	const options: BlueprintApplyOptions = {};
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

export async function runBlueprintApply(options: BlueprintApplyOptions = {}): Promise<{ success: boolean }> {
	const cwd = options.cwd ?? process.cwd();
	const file = options.file ?? "onelib.blueprint.json";
	const blueprintPath = isAbsolute(file) ? file : resolve(join(cwd, file));

	logger.log(`Applying blueprint: ${blueprintPath}`);

	const blueprint = parseBlueprintFile(blueprintPath);
	const config = await loadConfig(cwd);
	const result = await applyBlueprint(blueprint, cwd, config);

	logger.success(`Applied blueprint '${blueprint.name}'`);
	logger.log(`Created ${result.pagesCreated.length} page(s)`);
	logger.log(`Created ${result.layoutsCreated.length} layout wrapper(s)`);
	logger.log(`Scaffolded ${result.componentsInstalled} component file(s)`);
	if (Object.keys(result.peerDependencies).length > 0) {
		logger.log(
			`Peer dependencies: ${Object.entries(result.peerDependencies)
				.map(([name, version]) => `${name}@${version}`)
				.join(", ")}`,
		);
		if (result.peerDependenciesInstall.success) {
			logger.success("Installed peer dependencies");
		} else if (result.peerDependenciesInstall.command) {
			logger.warn(
				`Peer dependency install failed (${result.peerDependenciesInstall.error ?? "unknown error"}). Run: ${result.peerDependenciesInstall.command}`,
			);
		}
	}
	logger.log(`Updated config: ${result.configPath}`);

	return { success: true };
}
