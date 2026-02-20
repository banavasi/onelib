import { z } from "zod";
import { LayoutCategorySchema, SemverSchema, SourceSchema } from "./common.js";

export const LayoutSchema = z.object({
	name: z.string().min(1),
	displayName: z.string().min(1),
	description: z.string(),
	version: SemverSchema,
	source: SourceSchema,
	category: LayoutCategorySchema,
	dependencies: z.array(z.string()).default([]),
	files: z.array(z.string()).min(1),
	devOnly: z.boolean().default(false),
	tags: z.array(z.string()).default([]),
	slots: z.array(z.string()).default([]),
	requiredComponents: z.array(z.string()).default([]),
});
