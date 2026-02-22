import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { type UpdateReport, updateComponents } from "@banavasi/components";
import * as logger from "../utils/logger.js";

export async function runComponentsUpdate(cwd?: string): Promise<UpdateReport> {
	const projectDir = cwd ?? process.cwd();

	// Source components directory from the installed @banavasi/components package
	// Use import.meta.resolve to find the package location (works with both symlinks and installed packages)
	let sourceDir: string;

	try {
		const componentsModuleUrl = await import.meta.resolve("@banavasi/components/registry.json");
		const componentsRegistryPath = fileURLToPath(componentsModuleUrl);
		const componentsPackagePath = dirname(componentsRegistryPath);
		sourceDir = join(componentsPackagePath, "src");
	} catch (error) {
		// Fallback for older Node versions or if registry.json export is not available
		const currentDir = dirname(fileURLToPath(import.meta.url));
		// When installed as a package, we're in node_modules/@banavasi/scripts/dist/commands/
		// @banavasi/components will be at node_modules/@banavasi/components/
		sourceDir = join(currentDir, "../../../../@banavasi/components/src");
	}

	logger.log("Updating components...");

	const report = updateComponents(sourceDir, projectDir);

	if (report.added.length > 0) {
		logger.success(`Added: ${report.added.join(", ")}`);
	}
	if (report.updated.length > 0) {
		logger.success(`Updated: ${report.updated.join(", ")}`);
	}
	if (report.skipped.length > 0) {
		logger.warn(`Skipped (locally modified): ${report.skipped.join(", ")}`);
	}
	if (report.upToDate.length > 0) {
		logger.log(`Up to date: ${report.upToDate.length} components`);
	}

	if (report.peerDependencies && Object.keys(report.peerDependencies).length > 0) {
		const depsList = Object.entries(report.peerDependencies)
			.map(([name, version]) => `${name}@${version}`)
			.join(" ");
		logger.log(`New peer dependencies needed: ${depsList}`);
		logger.log(`Run: pnpm add ${Object.keys(report.peerDependencies).join(" ")}`);
	}

	return report;
}
