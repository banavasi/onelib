// @banavasi/skills – curated skills & generators
export const SKILLS_VERSION = "0.2.2";

export const CURATED_SKILLS = [
	"anthropics/skills",
	"vercel-labs/next-skills",
	"giuseppe-trisciuoglio/developer-kit",
	"vercel/turborepo",
	"obra/superpowers",
	"wshobson/agents",
] as const;

export type CuratedSkill = (typeof CURATED_SKILLS)[number];

// Re-export skill-related types from registry
export type { Skill } from "@banavasi/registry";
