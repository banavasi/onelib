import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ComponentSchema, SemverSchema } from "@onelib/registry";
import { z } from "zod";

const ComponentRegistrySchema = z.object({
	version: SemverSchema,
	components: z.array(ComponentSchema),
});

export type ComponentRegistry = z.infer<typeof ComponentRegistrySchema>;

export type ValidationResult =
	| { success: true; data: ComponentRegistry }
	| { success: false; error: z.ZodError };

export function validateComponentRegistry(data: unknown): ValidationResult {
	const result = ComponentRegistrySchema.safeParse(data);
	if (result.success) {
		return { success: true, data: result.data };
	}
	return { success: false, error: result.error };
}

export function loadComponentRegistry(): ValidationResult {
	const currentDir = dirname(fileURLToPath(import.meta.url));
	const registryPath = resolve(currentDir, "../registry.json");
	const raw = readFileSync(registryPath, "utf-8");
	const data: unknown = JSON.parse(raw);
	return validateComponentRegistry(data);
}
