#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_PROJECT_NAME } from "./constants.js";
import { execCommand, isCommandAvailable } from "./utils/exec.js";
import { checkNodeVersion, parseNodeVersion } from "./utils/preflight.js";
import { scaffoldProject } from "./utils/scaffold.js";
import { installSkills } from "./utils/skills.js";

export interface CliArgs {
	projectName?: string;
	blueprintFile?: string;
}

export function parseCliArgs(argv: string[]): CliArgs {
	const args: CliArgs = {};
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (!arg) continue;
		if (arg === "--blueprint" || arg === "-b") {
			const value = argv[i + 1];
			if (value && !value.startsWith("-")) {
				args.blueprintFile = value;
				i++;
			}
			continue;
		}

		if (!arg.startsWith("-") && !args.projectName) {
			args.projectName = arg;
		}
	}
	return args;
}

export async function main(): Promise<void> {
	const cliArgs = parseCliArgs(process.argv.slice(2));
	p.intro(`${pc.cyan("create-onelib")} — scaffold an Onelib project`);

	// Pre-flight: Node version
	const nodeVersion = parseNodeVersion(process.version);
	const nodeCheck = checkNodeVersion(nodeVersion);
	if (!nodeCheck.ok) {
		p.cancel(pc.red(nodeCheck.message));
		process.exit(1);
	}

	// Pre-flight: pnpm
	const hasPnpm = await isCommandAvailable("pnpm");
	if (!hasPnpm) {
		p.cancel(pc.red("pnpm is required but not found. Install it with: corepack enable"));
		process.exit(1);
	}

	// Prompt: project name
	const projectName =
		cliArgs.projectName ??
		(await p.text({
			message: "What is your project name?",
			placeholder: DEFAULT_PROJECT_NAME,
			defaultValue: DEFAULT_PROJECT_NAME,
			validate(value) {
				if (!value?.trim()) return "Project name is required";
				if (!/^[a-z0-9-]+$/.test(value.trim())) {
					return "Project name must be lowercase alphanumeric with hyphens only";
				}
			},
		}));

	if (p.isCancel(projectName)) {
		p.cancel("Cancelled.");
		process.exit(0);
	}

	const projectDir = path.resolve(process.cwd(), projectName);

	// Check if directory exists
	if (fs.existsSync(projectDir)) {
		const entries = fs.readdirSync(projectDir);
		if (entries.length > 0) {
			const overwrite = await p.confirm({
				message: `Directory ${pc.bold(projectName)} already exists and is not empty. Overwrite?`,
				initialValue: false,
			});

			if (p.isCancel(overwrite) || !overwrite) {
				p.cancel("Cancelled.");
				process.exit(0);
			}

			fs.rmSync(projectDir, { recursive: true, force: true });
		}
	}

	// Scaffold
	const scaffoldSpinner = p.spinner();
	scaffoldSpinner.start("Scaffolding project...");
	try {
		await scaffoldProject(projectDir, projectName);
		scaffoldSpinner.stop("Project scaffolded");
	} catch (error) {
		scaffoldSpinner.stop("Scaffold failed");
		// Clean up on fatal error
		if (fs.existsSync(projectDir)) {
			fs.rmSync(projectDir, { recursive: true, force: true });
		}
		p.cancel(
			pc.red(
				`Failed to scaffold project: ${error instanceof Error ? error.message : String(error)}`,
			),
		);
		process.exit(1);
	}

	// Install dependencies
	const installSpinner = p.spinner();
	installSpinner.start("Installing dependencies...");
	const installResult = await execCommand("pnpm", ["install"], {
		cwd: projectDir,
	});
	if (installResult.ok) {
		installSpinner.stop("Dependencies installed");
	} else {
		installSpinner.stop(pc.yellow("Dependency install failed — run `pnpm install` manually"));
	}

	// Optional blueprint application
	if (cliArgs.blueprintFile) {
		const blueprintSpinner = p.spinner();
		blueprintSpinner.start(`Applying blueprint (${cliArgs.blueprintFile})...`);
		try {
			const applyResult = await execCommand(
				"pnpm",
				["onelib-scripts", "blueprint:apply", "--file", cliArgs.blueprintFile],
				{
					cwd: projectDir,
				},
			);
			if (applyResult.ok) {
				blueprintSpinner.stop("Blueprint applied");
			} else {
				blueprintSpinner.stop(pc.yellow(`Blueprint apply failed: ${applyResult.message}`));
			}
		} catch (error) {
			blueprintSpinner.stop(
				pc.yellow(
					`Blueprint apply failed: ${error instanceof Error ? error.message : String(error)}`,
				),
			);
		}
	}

	// Install skills
	const skillsSpinner = p.spinner();
	skillsSpinner.start("Installing curated skills...");
	const skillsResult = await installSkills(projectDir);
	if (skillsResult.failed.length === 0) {
		skillsSpinner.stop(`Installed ${skillsResult.installed.length} skills`);
	} else {
		skillsSpinner.stop(
			pc.yellow(
				`Installed ${skillsResult.installed.length} skills, ${skillsResult.failed.length} failed`,
			),
		);
		p.note(
			skillsResult.failed.map((s) => `  - ${s}`).join("\n"),
			"Failed skills (install manually with npx skills add <skill>)",
		);
	}

	// Git init
	const hasGit = await isCommandAvailable("git");
	if (hasGit) {
		const gitSpinner = p.spinner();
		gitSpinner.start("Initializing git...");
		const gitInit = await execCommand("git", ["init"], { cwd: projectDir });
		if (gitInit.ok) {
			await execCommand("git", ["add", "."], { cwd: projectDir });
			await execCommand("git", ["commit", "-m", "Initial commit from create-onelib"], {
				cwd: projectDir,
			});
			gitSpinner.stop("Git initialized with initial commit");
		} else {
			gitSpinner.stop(pc.yellow("Git init failed — skipping"));
		}
	}

	// Done
	p.outro(
		`${pc.green("Done!")} Your project is ready at ${pc.bold(projectName)}\n\n` +
			`  ${pc.cyan("cd")} ${projectName}\n` +
			`  ${pc.cyan("pnpm dev")}\n`,
	);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
	main().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}
