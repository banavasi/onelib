// @onelib/skills – curated skills & generators
export const SKILLS_VERSION = "0.1.0";

export const CURATED_SKILLS = [
	"anthropics/skills/frontend-design",
	"vercel-labs/next-skills/next-best-practices",
	"vercel-labs/next-skills/next-cache-components",
	"giuseppe-trisciuoglio/developer-kit/shadcn-ui",
	"vercel/turborepo/turborepo",
	"obra/superpowers/brainstorming",
	"obra/superpowers/test-driven-development",
	"obra/superpowers/systematic-debugging",
	"wshobson/agents/tailwind-design-system",
] as const;

export type CuratedSkill = (typeof CURATED_SKILLS)[number];

// Re-export skill-related types from registry
export type { Skill } from "@onelib/registry";
