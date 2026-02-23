import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { CatalogComponent } from "./starter-types";

interface RegistryEntry {
	name: string;
	displayName: string;
	category: string;
	description: string;
}

interface RegistryShape {
	components: RegistryEntry[];
}

export function loadComponentCatalog(): CatalogComponent[] {
	const candidates = [
		resolve(process.cwd(), "packages/components/registry.json"),
		resolve(process.cwd(), "../../packages/components/registry.json"),
		resolve(process.cwd(), "../packages/components/registry.json"),
	];

	const registryPath = candidates.find((candidate) => existsSync(candidate));
	if (!registryPath) {
		return [];
	}

	const parsed = JSON.parse(readFileSync(registryPath, "utf-8")) as RegistryShape;
	return parsed.components.map((component) => ({
		name: component.name,
		displayName: component.displayName,
		category: component.category,
		description: component.description,
	}));
}
