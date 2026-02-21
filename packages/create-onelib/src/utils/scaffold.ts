import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scaffoldComponents } from "@onelib/components";
import fse from "fs-extra";
import { TEMPLATE_FILES_WITH_PLACEHOLDERS, TEMPLATE_RENAME_MAP } from "../constants.js";
import { type PlaceholderValues, replacePlaceholders } from "./placeholders.js";

function getTemplatePath(): string {
	const currentDir = path.dirname(fileURLToPath(import.meta.url));
	// Navigate from src/utils/ or dist/utils/ to packages/templates/base/
	return path.resolve(currentDir, "../../../templates/base");
}

function getComponentsSourcePath(): string {
	const currentDir = path.dirname(fileURLToPath(import.meta.url));
	// Navigate from src/utils/ or dist/utils/ to packages/components/src/
	return path.resolve(currentDir, "../../../components/src");
}

export async function scaffoldProject(projectDir: string, projectName: string): Promise<void> {
	const templateDir = getTemplatePath();

	// Copy the entire template directory
	await fse.copy(templateDir, projectDir);

	const values: PlaceholderValues = { projectName };

	// Replace placeholders in files that need them
	for (const file of TEMPLATE_FILES_WITH_PLACEHOLDERS) {
		const filePath = path.join(projectDir, file);
		if (fs.existsSync(filePath)) {
			const content = fs.readFileSync(filePath, "utf-8");
			const replaced = replacePlaceholders(content, values);
			fs.writeFileSync(filePath, replaced, "utf-8");
		}
	}

	// Rename .template files
	for (const [from, to] of Object.entries(TEMPLATE_RENAME_MAP)) {
		const fromPath = path.join(projectDir, from);
		const toPath = path.join(projectDir, to);
		if (fs.existsSync(fromPath)) {
			const content = fs.readFileSync(fromPath, "utf-8");
			const replaced = replacePlaceholders(content, values);
			fs.writeFileSync(toPath, replaced, "utf-8");
			fs.unlinkSync(fromPath);
		}
	}

	// Copy component .tsx files into src/components/
	const componentsSourceDir = getComponentsSourcePath();
	const targetComponentsDir = path.join(projectDir, "src/components");
	scaffoldComponents(componentsSourceDir, targetComponentsDir);
}
