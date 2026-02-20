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

export const TEMPLATE_FILES_WITH_PLACEHOLDERS = [
	"package.json.template",
	"onelib.config.ts",
	"project-focus.md",
	"src/app/layout.tsx",
	"src/app/page.tsx",
	".codex/config.yaml",
] as const;

export const TEMPLATE_RENAME_MAP: Record<string, string> = {
	"package.json.template": "package.json",
	".gitignore.template": ".gitignore",
};

export const MIN_NODE_VERSION = 20;
export const SKILL_INSTALL_TIMEOUT_MS = 30_000;
export const DEFAULT_PROJECT_NAME = "vibe-starter";
