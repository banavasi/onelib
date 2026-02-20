import type { Component, Layout, RegistryManifest, Skill } from "../types.js";

export type EntityType = "components" | "layouts" | "skills";
export type RegistryItem = Component | Layout | Skill;

export function getComponent(manifest: RegistryManifest, name: string): Component | undefined {
	return manifest.components.find((c) => c.name === name);
}

export function getLayout(manifest: RegistryManifest, name: string): Layout | undefined {
	return manifest.layouts.find((l) => l.name === name);
}

export function getSkill(manifest: RegistryManifest, name: string): Skill | undefined {
	return manifest.skills.find((s) => s.name === name);
}

function getItems(manifest: RegistryManifest, type: EntityType): RegistryItem[] {
	switch (type) {
		case "components":
			return manifest.components;
		case "layouts":
			return manifest.layouts;
		case "skills":
			return manifest.skills;
	}
}

export function listByCategory(
	manifest: RegistryManifest,
	type: EntityType,
	category: string,
): RegistryItem[] {
	return getItems(manifest, type).filter((item) => item.category === category);
}

export function listBySource(
	manifest: RegistryManifest,
	type: EntityType,
	source: string,
): RegistryItem[] {
	return getItems(manifest, type).filter((item) => item.source === source);
}

function hasTags(item: RegistryItem): item is Component | Layout {
	return "tags" in item;
}

export function searchRegistry(manifest: RegistryManifest, query: string): RegistryItem[] {
	const lowerQuery = query.toLowerCase();
	const results: RegistryItem[] = [];

	for (const type of ["components", "layouts", "skills"] as const) {
		for (const item of getItems(manifest, type)) {
			const tags = hasTags(item) ? item.tags : [];
			const searchable = [item.name, item.displayName, item.description, ...tags]
				.join(" ")
				.toLowerCase();

			if (searchable.includes(lowerQuery)) {
				results.push(item);
			}
		}
	}

	return results;
}

function hasDependencies(item: RegistryItem): item is Component | Layout {
	return "dependencies" in item;
}

export function resolveWithDependencies(manifest: RegistryManifest, name: string): RegistryItem[] {
	const allItems = new Map<string, RegistryItem>();
	for (const type of ["components", "layouts", "skills"] as const) {
		for (const item of getItems(manifest, type)) {
			allItems.set(item.name, item);
		}
	}

	const item = allItems.get(name);
	if (!item) {
		throw new Error(`Registry item not found: ${name}`);
	}

	const resolved: RegistryItem[] = [];
	const visited = new Set<string>();
	const resolving = new Set<string>();

	function resolve(itemName: string): void {
		if (visited.has(itemName)) return;
		if (resolving.has(itemName)) {
			throw new Error(`Circular dependency detected: ${itemName}`);
		}
		resolving.add(itemName);

		const current = allItems.get(itemName);
		if (!current) {
			throw new Error(`Dependency not found: ${itemName}`);
		}

		if (hasDependencies(current)) {
			for (const dep of current.dependencies) {
				resolve(dep);
			}
		}

		resolving.delete(itemName);
		visited.add(itemName);
		resolved.push(current);
	}

	resolve(name);
	return resolved;
}
