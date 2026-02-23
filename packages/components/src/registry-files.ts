import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

interface RegistryComponent {
	name: string;
	files?: string[];
	peerDependencies?: Record<string, string>;
}

interface ComponentsRegistry {
	components?: RegistryComponent[];
}

export function readComponentsRegistry(sourceDir: string): ComponentsRegistry | null {
	const registryCandidates = [
		join(sourceDir, "registry.json"),
		join(sourceDir, "../registry.json"),
	];
	const registryPath = registryCandidates.find((path) => existsSync(path));
	if (!registryPath) return null;
	return JSON.parse(readFileSync(registryPath, "utf-8")) as ComponentsRegistry;
}

export function getComponentFilesFromRegistry(
	sourceDir: string,
	category: string,
	componentDir: string,
	componentName: string,
): string[] | null {
	const registry = readComponentsRegistry(sourceDir);
	const entry = registry?.components?.find((component) => component.name === componentName);
	if (!entry?.files?.length) return null;

	const prefix = `${category}/${componentDir}/`;
	const matched = entry.files
		.filter((file) => file.startsWith(prefix))
		.map((file) => file.slice(prefix.length))
		.filter((file) => !file.endsWith(".stories.tsx") && file !== "index.ts");

	return matched.length > 0 ? matched : null;
}
