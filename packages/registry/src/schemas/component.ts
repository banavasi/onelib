import { z } from "zod";
import { ComponentCategorySchema, SemverSchema, SourceSchema } from "./common.js";

export const ComponentSchema = z.object({
	name: z.string().min(1),
	displayName: z.string().min(1),
	description: z.string(),
	version: SemverSchema,
	source: SourceSchema,
	category: ComponentCategorySchema,
	sourceUrl: z.string().url().optional(),
	peerDependencies: z.record(z.string(), z.string()).optional(),
	dependencies: z.array(z.string()).default([]),
	files: z.array(z.string()).min(1),
	devOnly: z.boolean().default(false),
	tags: z.array(z.string()).default([]),
});
