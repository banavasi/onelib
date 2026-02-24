import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { OnelibConfig } from "@banavasi/onelib";
import { applyBlueprint } from "../blueprint/apply.js";
import type { OnelibBlueprint } from "../blueprint/types.js";
import { runSkillsUpdate } from "../commands/skills-update.js";
import { execCommand } from "../utils/exec.js";
import * as logger from "../utils/logger.js";
import { compileAgentPlan } from "./compile.js";
import type { AgentPlan } from "./types.js";
import { validateAgentPlan } from "./validate.js";

function toBlueprint(plan: AgentPlan): OnelibBlueprint {
	return {
		name: plan.name,
		rootLayout: plan.rootLayout,
		theme: plan.theme,
		pages: plan.pages,
	};
}

function renderConfig(config: OnelibConfig): string {
	const components = JSON.stringify(config.registry.components, null, "\t");
	const layouts = JSON.stringify(config.registry.layouts, null, "\t");
	const customSkills = JSON.stringify(config.skills.custom, null, "\t");

	return `import { defineConfig } from "@banavasi/onelib";

export default defineConfig({
\tname: ${JSON.stringify(config.name)},
\tregistry: {
\t\tcomponents: ${components},
\t\tlayouts: ${layouts},
\t},
\tskills: {
\t\tcurated: ${config.skills.curated},
\t\tcustom: ${customSkills},
\t},
\ttheme: {
\t\tpreset: ${JSON.stringify(config.theme.preset)},
\t},
\tlayout: ${JSON.stringify(config.layout ?? "blank")},
});
`;
}

function detectPackageManager(cwd: string): "pnpm" | "npm" | "yarn" | "bun" {
	const has = (filename: string) => {
		try {
			readFileSync(join(cwd, filename));
			return true;
		} catch {
			return false;
		}
	};
	if (has("pnpm-lock.yaml")) return "pnpm";
	if (has("yarn.lock")) return "yarn";
	if (has("bun.lockb") || has("bun.lock")) return "bun";
	if (has("package-lock.json")) return "npm";
	return "pnpm";
}

function installArgs(manager: "pnpm" | "npm" | "yarn" | "bun", packages: string[]): { cmd: string; args: string[] } {
	switch (manager) {
		case "npm":
			return { cmd: "npm", args: ["install", "--save", ...packages] };
		case "yarn":
			return { cmd: "yarn", args: ["add", ...packages] };
		case "bun":
			return { cmd: "bun", args: ["add", ...packages] };
		case "pnpm":
		default:
			return { cmd: "pnpm", args: ["add", ...packages] };
	}
}

function integrationPackages(integrations: { supabase: boolean; stripe: boolean; resend: boolean; openai: boolean }): string[] {
	const deps: string[] = [];
	if (integrations.supabase) deps.push("@supabase/supabase-js", "@supabase/ssr");
	if (integrations.stripe) deps.push("stripe");
	if (integrations.resend) deps.push("resend");
	if (integrations.openai) deps.push("openai");
	return Array.from(new Set(deps));
}

function writeEnvFile(cwd: string, env: Record<string, string | undefined>): void {
	const entries = Object.entries(env).filter(([, value]) => typeof value === "string" && value.length > 0);
	if (entries.length === 0) return;
	const lines = entries.map(([key, value]) => `${key}=${value}`);
	writeFileSync(join(cwd, ".env.local"), `${lines.join("\n")}\n`, "utf-8");
}

export function parseAgentPlanFile(path: string): AgentPlan {
	const raw = readFileSync(path, "utf-8");
	const json = JSON.parse(raw) as unknown;
	return validateAgentPlan(json);
}

export async function applyAgentPlan(plan: AgentPlan, cwd: string, config: OnelibConfig | null): Promise<void> {
	const compiled = compileAgentPlan(plan);
	const blueprint = toBlueprint(plan);
	const result = await applyBlueprint(blueprint, cwd, config);

	const nextConfig: OnelibConfig = {
		name: plan.name,
		registry: {
			components: Array.from(new Set(blueprint.pages.flatMap((page) => page.components))).sort((a, b) => a.localeCompare(b)),
			layouts: Array.from(new Set([blueprint.rootLayout, ...blueprint.pages.map((page) => page.layout)])).sort((a, b) => a.localeCompare(b)),
		},
		skills: compiled.skills,
		theme: { preset: blueprint.theme },
		layout: blueprint.rootLayout,
	};
	writeFileSync(join(cwd, "onelib.config.ts"), renderConfig(nextConfig), "utf-8");

	writeEnvFile(cwd, compiled.env);

	const deps = integrationPackages(compiled.integrations);
	if (deps.length > 0) {
		const manager = detectPackageManager(cwd);
		const install = installArgs(manager, deps);
		logger.log(`Installing integration dependencies: ${deps.join(", ")}`);
		const installResult = await execCommand(install.cmd, install.args, { cwd, timeoutMs: 180_000 });
		if (!installResult.ok) {
			logger.warn(`Dependency install failed (${installResult.message}). Install manually.`);
		}
	}

	await runSkillsUpdate(cwd);
	logger.success(`Applied agent plan '${plan.name}'`);
	logger.log(`Created ${result.pagesCreated.length} page(s)`);
	logger.log(`Created ${result.layoutsCreated.length} layout wrapper(s)`);
	logger.log(`Scaffolded ${result.componentsInstalled} component file(s)`);
}
