import type { LayoutPreset, ThemePreset } from "../blueprint/types.js";

export const PLAN_CAPABILITIES = [
	"foundation",
	"nextjs",
	"conversion",
	"accessibility",
	"seo",
	"analytics",
	"supabase",
	"payments",
	"email",
	"ai",
	"monorepo",
] as const;

export type PlanCapability = (typeof PLAN_CAPABILITIES)[number];

export interface AgentPlanPage {
	name: string;
	route: string;
	layout: LayoutPreset;
	components: string[];
	title?: string;
}

export interface AgentPlan {
	$schema?: string;
	name: string;
	intent: string;
	rootLayout: LayoutPreset;
	theme: ThemePreset;
	pages: AgentPlanPage[];
	skills?: {
		capabilities?: PlanCapability[];
		additional?: string[];
		curated?: boolean;
	};
	integrations?: {
		supabase?: boolean;
		stripe?: boolean;
		resend?: boolean;
		openai?: boolean;
	};
	env?: Partial<{
		NEXT_PUBLIC_SUPABASE_URL: string;
		NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
		SUPABASE_SERVICE_ROLE_KEY: string;
		DATABASE_URL: string;
		NEXT_PUBLIC_SITE_URL: string;
		OPENAI_API_KEY: string;
		STRIPE_SECRET_KEY: string;
		STRIPE_WEBHOOK_SECRET: string;
		RESEND_API_KEY: string;
	}>;
}

export interface CompiledPlan {
	blueprint: {
		name: string;
		rootLayout: LayoutPreset;
		theme: ThemePreset;
		pages: AgentPlanPage[];
	};
	skills: {
		curated: boolean;
		custom: string[];
	};
	integrations: Required<NonNullable<AgentPlan["integrations"]>>;
	env: NonNullable<AgentPlan["env"]>;
}
