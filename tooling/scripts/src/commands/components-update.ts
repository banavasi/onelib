import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type UpdateReport, updateComponents } from "@onelib/components";
import * as logger from "../utils/logger.js";

export async function runComponentsUpdate(cwd?: string): Promise<UpdateReport> {
	const projectDir = cwd ?? process.cwd();

	// Source components directory from the installed @onelib/components package
	const currentDir = dirname(fileURLToPath(import.meta.url));
	const sourceDir = resolve(currentDir, "../../node_modules/@onelib/components/src");

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

	return report;
}
