import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { computeChecksum } from "./checksum.js";
import type { ComponentsLock } from "./scaffold.js";

export interface UpdateOptions {
	force?: boolean;
}

export interface UpdateReport {
	updated: string[];
	skipped: string[];
	added: string[];
	upToDate: string[];
	peerDependencies: Record<string, string>;
}

/**
 * Scans source components and updates the target project.
 * Uses checksum comparison to detect user modifications.
 */
export function updateComponents(
	sourceDir: string,
	projectDir: string,
	options: UpdateOptions = {},
): UpdateReport {
	const componentsDir = join(projectDir, "src/components");
	const lockPath = join(projectDir, ".onelib/components.lock");

	// Load existing lockfile
	let lock: ComponentsLock = { version: "0.1.0", components: {} };
	if (existsSync(lockPath)) {
		lock = JSON.parse(readFileSync(lockPath, "utf-8")) as ComponentsLock;
	}

	const report: UpdateReport = {
		updated: [],
		skipped: [],
		added: [],
		upToDate: [],
		peerDependencies: {},
	};

	// Scan source components
	const categories = readdirSync(sourceDir).filter((entry) =>
		statSync(join(sourceDir, entry)).isDirectory(),
	);

	for (const category of categories) {
		const categoryPath = join(sourceDir, category);
		const componentDirs = readdirSync(categoryPath).filter((entry) =>
			statSync(join(categoryPath, entry)).isDirectory(),
		);

		for (const componentDir of componentDirs) {
			const componentPath = join(categoryPath, componentDir);
			const files = readdirSync(componentPath);
			const sourceFiles = files.filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"));

			for (const file of sourceFiles) {
				const componentName = basename(file, ".tsx");
				const sourceContent = readFileSync(join(componentPath, file), "utf-8");
				const sourceChecksum = computeChecksum(sourceContent);
				const targetPath = join(componentsDir, category, file);
				const lockEntry = lock.components[componentName];

				if (!lockEntry) {
					// New component — install it
					mkdirSync(join(componentsDir, category), { recursive: true });
					writeFileSync(targetPath, sourceContent, "utf-8");
					lock.components[componentName] = {
						version: "0.1.0",
						checksum: sourceChecksum,
						installedAt: new Date().toISOString(),
					};
					report.added.push(componentName);
					continue;
				}

				// Check if source has changed
				if (lockEntry.checksum === sourceChecksum) {
					report.upToDate.push(componentName);
					continue;
				}

				// Source has changed — check if user modified the local file
				if (existsSync(targetPath)) {
					const localContent = readFileSync(targetPath, "utf-8");
					const localChecksum = computeChecksum(localContent);
					const userModified = localChecksum !== lockEntry.checksum;

					if (userModified && !options.force) {
						report.skipped.push(componentName);
						continue;
					}
				}

				// Update the component
				mkdirSync(join(componentsDir, category), { recursive: true });
				writeFileSync(targetPath, sourceContent, "utf-8");
				lock.components[componentName] = {
					version: "0.1.0",
					checksum: sourceChecksum,
					installedAt: new Date().toISOString(),
				};
				report.updated.push(componentName);
			}
		}
	}

	// Collect peer dependencies from registry for added/updated components
	const changedComponents = [...report.added, ...report.updated];
	if (changedComponents.length > 0) {
		const registryCandidates = [
			join(sourceDir, "registry.json"),
			join(sourceDir, "../registry.json"),
		];
		const registryPath = registryCandidates.find((p) => existsSync(p));
		if (registryPath) {
			const registryData = JSON.parse(readFileSync(registryPath, "utf-8"));
			if (Array.isArray(registryData.components)) {
				for (const entry of registryData.components) {
					if (
						changedComponents.includes(entry.name) &&
						entry.peerDependencies
					) {
						Object.assign(report.peerDependencies, entry.peerDependencies);
					}
				}
			}
		}
	}

	// Write updated lockfile
	mkdirSync(join(projectDir, ".onelib"), { recursive: true });
	writeFileSync(lockPath, JSON.stringify(lock, null, "\t"), "utf-8");

	return report;
}
