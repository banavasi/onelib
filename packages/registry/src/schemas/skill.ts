import { z } from "zod";
import { SemverSchema, SkillCategorySchema, SkillSourceSchema } from "./common.js";

export const SkillSchema = z.object({
	name: z.string().min(1),
	displayName: z.string().min(1),
	description: z.string(),
	version: SemverSchema,
	source: SkillSourceSchema,
	category: SkillCategorySchema,
	files: z.array(z.string()).min(1),
	projectFocusRequired: z.boolean().default(false),
});
