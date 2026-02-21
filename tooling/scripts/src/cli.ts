#!/usr/bin/env node
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runSkillsUpdate } from "./commands/skills-update.js";
import { runUpdate } from "./commands/update.js";
import * as logger from "./utils/logger.js";

const VALID_COMMANDS = ["update", "skills:update"] as const;
type Command = (typeof VALID_COMMANDS)[number];

export function parseCommand(argv: string[]): Command | null {
	const cmd = argv[2];
	if (cmd && (VALID_COMMANDS as readonly string[]).includes(cmd)) {
		return cmd as Command;
	}
	return null;
}

function printUsage(): void {
	console.log("Usage: onelib-scripts <command>\n");
	console.log("Commands:");
	console.log("  update          Run all updates (skills, registry, templates)");
	console.log("  skills:update   Update curated and custom skills");
}

async function main(): Promise<void> {
	const command = parseCommand(process.argv);

	if (!command) {
		printUsage();
		process.exit(1);
	}

	switch (command) {
		case "update": {
			const result = await runUpdate();
			process.exit(result.success ? 0 : 1);
			break;
		}
		case "skills:update": {
			const result = await runSkillsUpdate();
			process.exit(result.failed.length > 0 ? 1 : 0);
			break;
		}
	}
}

const thisFile = fileURLToPath(import.meta.url);
const isDirectRun = process.argv[1] && resolve(process.argv[1]) === thisFile;

if (isDirectRun) {
	main().catch((err: unknown) => {
		logger.error(err instanceof Error ? err.message : String(err));
		process.exit(1);
	});
}
