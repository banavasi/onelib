import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { computeChecksum } from "./checksum.js";

export interface LockEntry {
	version: string;
	checksum: string;
	installedAt: string;
}

export interface ComponentsLock {
	version: string;
	components: Record<string, LockEntry>;
}

/**
 * Copies component .tsx files (excluding stories and index barrels) from
 * a source directory into a target directory, organized by category.
 * Creates a lockfile for update tracking.
 */
export function scaffoldComponents(
	sourceDir: string,
	targetDir: string,
	componentVersion = "0.1.0",
): void {
	const lock: ComponentsLock = { version: "0.1.0", components: {} };

	// Read category directories
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

			// Find .tsx files that are NOT stories and NOT index files
			const sourceFiles = files.filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"));

			for (const file of sourceFiles) {
				const content = readFileSync(join(componentPath, file), "utf-8");
				const targetCategoryDir = join(targetDir, category);
				mkdirSync(targetCategoryDir, { recursive: true });
				writeFileSync(join(targetCategoryDir, file), content, "utf-8");

				// Add to lockfile
				const componentName = basename(file, ".tsx");
				lock.components[componentName] = {
					version: componentVersion,
					checksum: computeChecksum(content),
					installedAt: new Date().toISOString(),
				};
			}
		}
	}

	// Write lockfile
	const lockDir = join(dirname(targetDir), ".onelib");
	mkdirSync(lockDir, { recursive: true });
	writeFileSync(join(lockDir, "components.lock"), JSON.stringify(lock, null, "\t"), "utf-8");
}
