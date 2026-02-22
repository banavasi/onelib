export { CURATED_SKILLS } from "@banavasi/skills";

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
	".npmrc.template": ".npmrc",
};

export const MIN_NODE_VERSION = 20;
export const SKILL_INSTALL_TIMEOUT_MS = 30_000;
export const DEFAULT_PROJECT_NAME = "vibe-starter";
