import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { LAYOUT_PRESETS, THEME_PRESETS } from "../blueprint/types.js";
import type { AgentPlan } from "./types.js";
import { PLAN_CAPABILITIES } from "./types.js";

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isLayoutPreset(value: string): value is AgentPlan["rootLayout"] {
	return (LAYOUT_PRESETS as readonly string[]).includes(value);
}

function isThemePreset(value: string): value is AgentPlan["theme"] {
	return (THEME_PRESETS as readonly string[]).includes(value);
}

function isCapability(value: string): value is NonNullable<NonNullable<AgentPlan["skills"]>["capabilities"]>[number] {
	return (PLAN_CAPABILITIES as readonly string[]).includes(value);
}

function loadKnownComponents(): Set<string> {
	try {
		const registryUrl = import.meta.resolve("@banavasi/components/registry.json");
		const registryPath = fileURLToPath(registryUrl);
		const parsed = JSON.parse(readFileSync(registryPath, "utf-8")) as {
			components: Array<{ name: string }>;
		};
		return new Set(parsed.components.map((entry) => entry.name));
	} catch {
		const fallback = fileURLToPath(new URL("../../../packages/components/registry.json", import.meta.url));
		const parsed = JSON.parse(readFileSync(fallback, "utf-8")) as {
			components: Array<{ name: string }>;
		};
		return new Set(parsed.components.map((entry) => entry.name));
	}
}

function validateSkillRepo(value: string): boolean {
	return /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(value);
}

export function validateAgentPlan(input: unknown): AgentPlan {
	if (!isObject(input)) {
		throw new Error("Plan must be a JSON object");
	}

	const name = input.name;
	if (typeof name !== "string" || name.trim().length === 0) {
		throw new Error("Plan 'name' must be a non-empty string");
	}

	const intent = input.intent;
	if (typeof intent !== "string" || intent.trim().length < 12) {
		throw new Error("Plan 'intent' must be a meaningful non-empty string");
	}

	const rootLayout = input.rootLayout;
	if (typeof rootLayout !== "string" || !isLayoutPreset(rootLayout)) {
		throw new Error(`Plan 'rootLayout' must be one of: ${LAYOUT_PRESETS.join(", ")}`);
	}

	const theme = input.theme;
	if (typeof theme !== "string" || !isThemePreset(theme)) {
		throw new Error(`Plan 'theme' must be one of: ${THEME_PRESETS.join(", ")}`);
	}

	const pages = input.pages;
	if (!Array.isArray(pages) || pages.length === 0) {
		throw new Error("Plan 'pages' must be a non-empty array");
	}

	const knownComponents = loadKnownComponents();
	const seenRoutes = new Set<string>();
	const parsedPages = pages.map((page, index) => {
		if (!isObject(page)) {
			throw new Error(`Page at index ${index} must be an object`);
		}

		const route = page.route;
		if (typeof route !== "string" || !route.startsWith("/")) {
			throw new Error(`Page ${index} has invalid route. Routes must start with '/'`);
		}
		if (seenRoutes.has(route)) {
			throw new Error(`Duplicate route found: ${route}`);
		}
		seenRoutes.add(route);

		const pageName = page.name;
		if (typeof pageName !== "string" || pageName.trim().length === 0) {
			throw new Error(`Page ${index} has invalid 'name'`);
		}

		const layout = page.layout;
		if (typeof layout !== "string" || !isLayoutPreset(layout)) {
			throw new Error(`Page ${index} has invalid layout. Allowed: ${LAYOUT_PRESETS.join(", ")}`);
		}

		const components = page.components;
		if (!isStringArray(components)) {
			throw new Error(`Page ${index} must include a string array 'components'`);
		}
		for (const component of components) {
			if (!knownComponents.has(component)) {
				throw new Error(`Page ${index} references unknown component: ${component}`);
			}
		}

		const title = page.title;
		if (title !== undefined && typeof title !== "string") {
			throw new Error(`Page ${index} has invalid optional 'title'`);
		}

		return {
			name: pageName,
			route,
			layout,
			components,
			title,
		};
	});

	let skills: AgentPlan["skills"];
	if (input.skills !== undefined) {
		if (!isObject(input.skills)) {
			throw new Error("Plan 'skills' must be an object when provided");
		}
		const capabilitiesRaw = input.skills.capabilities;
		if (capabilitiesRaw !== undefined && !isStringArray(capabilitiesRaw)) {
			throw new Error("Plan 'skills.capabilities' must be a string array");
		}
		const capabilities = (capabilitiesRaw ?? []).map((value) => {
			if (!isCapability(value)) {
				throw new Error(`Unknown capability '${value}'. Allowed: ${PLAN_CAPABILITIES.join(", ")}`);
			}
			return value;
		});

		const additionalRaw = input.skills.additional;
		if (additionalRaw !== undefined && !isStringArray(additionalRaw)) {
			throw new Error("Plan 'skills.additional' must be a string array");
		}
		const additional = (additionalRaw ?? []).map((value) => {
			if (!validateSkillRepo(value)) {
				throw new Error(`Invalid custom skill repo '${value}'. Expected owner/repo format.`);
			}
			return value;
		});

		const curated = input.skills.curated;
		if (curated !== undefined && typeof curated !== "boolean") {
			throw new Error("Plan 'skills.curated' must be boolean when provided");
		}

		skills = { capabilities, additional, curated };
	}

	let integrations: AgentPlan["integrations"];
	if (input.integrations !== undefined) {
		if (!isObject(input.integrations)) {
			throw new Error("Plan 'integrations' must be an object when provided");
		}
		for (const key of ["supabase", "stripe", "resend", "openai"] as const) {
			const value = input.integrations[key];
			if (value !== undefined && typeof value !== "boolean") {
				throw new Error(`Plan 'integrations.${key}' must be boolean when provided`);
			}
		}
		integrations = {
			supabase: Boolean(input.integrations.supabase),
			stripe: Boolean(input.integrations.stripe),
			resend: Boolean(input.integrations.resend),
			openai: Boolean(input.integrations.openai),
		};
	}

	let env: AgentPlan["env"];
	if (input.env !== undefined) {
		if (!isObject(input.env)) {
			throw new Error("Plan 'env' must be an object when provided");
		}
		env = {};
		const allowed = [
			"NEXT_PUBLIC_SUPABASE_URL",
			"NEXT_PUBLIC_SUPABASE_ANON_KEY",
			"SUPABASE_SERVICE_ROLE_KEY",
			"DATABASE_URL",
			"NEXT_PUBLIC_SITE_URL",
			"OPENAI_API_KEY",
			"STRIPE_SECRET_KEY",
			"STRIPE_WEBHOOK_SECRET",
			"RESEND_API_KEY",
		] as const;
		for (const key of Object.keys(input.env)) {
			if (!(allowed as readonly string[]).includes(key)) {
				throw new Error(`Unsupported env key in plan: ${key}`);
			}
		}
		for (const key of allowed) {
			const value = input.env[key];
			if (value !== undefined && typeof value !== "string") {
				throw new Error(`Plan 'env.${key}' must be a string when provided`);
			}
			if (typeof value === "string") {
				env[key] = value;
			}
		}
	}

	return {
		$schema: typeof input.$schema === "string" ? input.$schema : undefined,
		name,
		intent,
		rootLayout,
		theme,
		pages: parsedPages,
		skills,
		integrations,
		env,
	};
}
