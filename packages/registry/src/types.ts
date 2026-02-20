import type { z } from "zod";
import type { ComponentSchema } from "./schemas/component.js";
import type { LayoutSchema } from "./schemas/layout.js";
import type { RegistryManifestSchema } from "./schemas/registry.js";
import type { SkillSchema } from "./schemas/skill.js";

export type Component = z.infer<typeof ComponentSchema>;
export type Layout = z.infer<typeof LayoutSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type RegistryManifest = z.infer<typeof RegistryManifestSchema>;
