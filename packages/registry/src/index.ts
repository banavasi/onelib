// Schemas

export {
	COMPONENT_CATEGORIES,
	ComponentCategorySchema,
	LAYOUT_CATEGORIES,
	LayoutCategorySchema,
	SemverSchema,
	SKILL_CATEGORIES,
	SKILL_SOURCES,
	SkillCategorySchema,
	SkillSourceSchema,
	SOURCES,
	SourceSchema,
} from "./schemas/common.js";
export { ComponentSchema } from "./schemas/component.js";
export { LayoutSchema } from "./schemas/layout.js";
export { RegistryManifestSchema } from "./schemas/registry.js";
export { SkillSchema } from "./schemas/skill.js";

// Types
export type { Component, Layout, RegistryManifest, Skill } from "./types.js";
export type { EntityType, RegistryItem } from "./utils/resolve.js";

// Utils
export {
	getComponent,
	getLayout,
	getSkill,
	listByCategory,
	listBySource,
	resolveWithDependencies,
	searchRegistry,
} from "./utils/resolve.js";
export type { BumpType } from "./utils/version.js";
export { bumpVersion, compareVersions } from "./utils/version.js";

// Constants
export const REGISTRY_VERSION = "0.2.1";
