import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { OnelibConfig } from "@banavasi/onelib";

const CONFIG_FILENAME = "onelib.config.ts";

export async function loadConfig(cwd: string): Promise<OnelibConfig | null> {
	const configPath = join(cwd, CONFIG_FILENAME);

	if (!existsSync(configPath)) {
		return null;
	}

	try {
		const configUrl = pathToFileURL(configPath).href;
		const mod = await import(configUrl);
		const config = mod.default as OnelibConfig;
		return config;
	} catch {
		return null;
	}
}
