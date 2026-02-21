import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { scaffoldProject } from "../../utils/scaffold.js";

describe("scaffoldProject", () => {
	let tmpDir: string;

	beforeEach(() => {
		tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "onelib-test-"));
	});

	afterEach(() => {
		fs.rmSync(tmpDir, { recursive: true, force: true });
	});

	it("creates the project directory", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		expect(fs.existsSync(projectDir)).toBe(true);
	});

	it("copies package.json with replaced project name", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		const pkgPath = path.join(projectDir, "package.json");
		expect(fs.existsSync(pkgPath)).toBe(true);
		const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
		expect(pkg.name).toBe("my-project");
	});

	it("copies tsconfig.json", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		expect(fs.existsSync(path.join(projectDir, "tsconfig.json"))).toBe(true);
	});

	it("copies src/app/layout.tsx with replaced project name", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		const layoutPath = path.join(projectDir, "src/app/layout.tsx");
		expect(fs.existsSync(layoutPath)).toBe(true);
		const content = fs.readFileSync(layoutPath, "utf-8");
		expect(content).toContain("my-project");
		expect(content).not.toContain("{{PROJECT_NAME}}");
	});

	it("creates onelib.config.ts with replaced project name", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		const configPath = path.join(projectDir, "onelib.config.ts");
		expect(fs.existsSync(configPath)).toBe(true);
		const content = fs.readFileSync(configPath, "utf-8");
		expect(content).toContain("my-project");
		expect(content).not.toContain("{{PROJECT_NAME}}");
	});

	it("creates project-focus.md with replaced project name", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		const focusPath = path.join(projectDir, "project-focus.md");
		expect(fs.existsSync(focusPath)).toBe(true);
		const content = fs.readFileSync(focusPath, "utf-8");
		expect(content).toContain("my-project");
		expect(content).not.toContain("{{PROJECT_NAME}}");
	});

	it("renames .gitignore.template to .gitignore", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		expect(fs.existsSync(path.join(projectDir, ".gitignore"))).toBe(true);
		expect(fs.existsSync(path.join(projectDir, ".gitignore.template"))).toBe(false);
	});

	it("creates agent config directories", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");
		expect(fs.existsSync(path.join(projectDir, ".opencode/config.json"))).toBe(true);
		expect(fs.existsSync(path.join(projectDir, ".claude/settings.json"))).toBe(true);
		expect(fs.existsSync(path.join(projectDir, ".codex/config.yaml"))).toBe(true);
	});

	it("copies component .tsx files into src/components/", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");

		// Check that at least the sample components exist
		const buttonsDir = path.join(projectDir, "src/components/buttons");
		const backgroundsDir = path.join(projectDir, "src/components/backgrounds");

		expect(fs.existsSync(buttonsDir)).toBe(true);
		expect(fs.existsSync(backgroundsDir)).toBe(true);
	});

	it("creates .onelib/components.lock", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");

		const lockPath = path.join(projectDir, "src/.onelib/components.lock");
		expect(fs.existsSync(lockPath)).toBe(true);
	});

	it("does not leave any {{PROJECT_NAME}} placeholders", async () => {
		const projectDir = path.join(tmpDir, "my-project");
		await scaffoldProject(projectDir, "my-project");

		function checkDir(dir: string): void {
			const entries = fs.readdirSync(dir, { withFileTypes: true });
			for (const entry of entries) {
				const fullPath = path.join(dir, entry.name);
				if (entry.isDirectory()) {
					if (entry.name !== "node_modules") {
						checkDir(fullPath);
					}
				} else {
					const content = fs.readFileSync(fullPath, "utf-8");
					expect(content, `Placeholder found in ${fullPath}`).not.toContain("{{PROJECT_NAME}}");
				}
			}
		}

		checkDir(projectDir);
	});
});
