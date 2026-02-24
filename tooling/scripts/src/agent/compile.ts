import { CURATED_SKILLS } from "@banavasi/skills";
import type { CompiledPlan, PlanCapability, AgentPlan } from "./types.js";

const CAPABILITY_SKILL_MAP: Record<PlanCapability, string[]> = {
	foundation: ["anthropics/skills", "obra/superpowers"],
	nextjs: ["vercel-labs/next-skills"],
	conversion: ["giuseppe-trisciuoglio/developer-kit"],
	accessibility: ["wshobson/agents"],
	seo: ["vercel-labs/next-skills"],
	analytics: ["giuseppe-trisciuoglio/developer-kit"],
	supabase: ["giuseppe-trisciuoglio/developer-kit"],
	payments: ["giuseppe-trisciuoglio/developer-kit"],
	email: ["giuseppe-trisciuoglio/developer-kit"],
	ai: ["anthropics/skills"],
	monorepo: ["vercel/turborepo"],
};

function dedupe(values: string[]): string[] {
	return Array.from(new Set(values));
}

function inferCapabilities(plan: AgentPlan): PlanCapability[] {
	const caps = new Set<PlanCapability>(plan.skills?.capabilities ?? []);
	caps.add("foundation");
	caps.add("nextjs");
	caps.add("conversion");
	caps.add("accessibility");

	if (plan.integrations?.supabase) caps.add("supabase");
	if (plan.integrations?.stripe) caps.add("payments");
	if (plan.integrations?.resend) caps.add("email");
	if (plan.integrations?.openai) caps.add("ai");

	if (plan.pages.some((page) => page.route.includes("/docs"))) caps.add("seo");
	return Array.from(caps);
}

export function compileAgentPlan(plan: AgentPlan): CompiledPlan {
	const capabilities = inferCapabilities(plan);
	const mappedSkills = capabilities.flatMap((capability) => CAPABILITY_SKILL_MAP[capability] ?? []);
	const additional = plan.skills?.additional ?? [];
	const curated = plan.skills?.curated ?? true;

	const customSkills = dedupe([...mappedSkills, ...additional]).filter(
		(skill) => !(CURATED_SKILLS as readonly string[]).includes(skill),
	);

	return {
		blueprint: {
			name: plan.name,
			rootLayout: plan.rootLayout,
			theme: plan.theme,
			pages: plan.pages,
		},
		skills: {
			curated,
			custom: customSkills,
		},
		integrations: {
			supabase: Boolean(plan.integrations?.supabase),
			stripe: Boolean(plan.integrations?.stripe),
			resend: Boolean(plan.integrations?.resend),
			openai: Boolean(plan.integrations?.openai),
		},
		env: plan.env ?? {},
	};
}
