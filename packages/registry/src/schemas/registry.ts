import { z } from "zod";
import { SemverSchema } from "./common.js";
import { ComponentSchema } from "./component.js";
import { LayoutSchema } from "./layout.js";
import { SkillSchema } from "./skill.js";

export const RegistryManifestSchema = z.object({
	version: SemverSchema,
	updatedAt: z.string().datetime(),
	components: z.array(ComponentSchema),
	layouts: z.array(LayoutSchema),
	skills: z.array(SkillSchema),
});
