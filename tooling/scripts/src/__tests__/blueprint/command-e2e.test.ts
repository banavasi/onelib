import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { runBlueprintApply } from "../../commands/blueprint-apply.js";

const tempDirs: string[] = [];

afterEach(() => {
	for (const dir of tempDirs.splice(0)) {
		rmSync(dir, { recursive: true, force: true });
	}
});

describe("blueprint:apply command integration", () => {
	it("applies a real blueprint file in a temp app directory", async () => {
		const cwd = join(tmpdir(), `onelib-blueprint-e2e-${Date.now()}`);
		tempDirs.push(cwd);

		mkdirSync(join(cwd, "src/app"), { recursive: true });
		writeFileSync(join(cwd, "src/app/globals.css"), "@import \"tailwindcss\";\n", "utf-8");
		writeFileSync(
			join(cwd, "onelib.blueprint.json"),
			JSON.stringify(
				{
					name: "Demo Site",
					rootLayout: "dashboard",
					theme: "vibrant",
					pages: [
						{
							name: "Home",
							route: "/",
							layout: "marketing",
							components: ["navbar", "hero"],
							title: "Home",
						},
						{
							name: "About",
							route: "/about",
							layout: "docs",
							components: ["basic-accordion"],
							title: "About",
						},
					],
				},
				null,
				2,
			),
			"utf-8",
		);

		const result = await runBlueprintApply({
			cwd,
			file: "onelib.blueprint.json",
		});
		expect(result.success).toBe(true);

		expect(existsSync(join(cwd, "src/app/(layout-marketing)/page.tsx"))).toBe(true);
		expect(existsSync(join(cwd, "src/app/(layout-docs)/about/page.tsx"))).toBe(true);
		expect(existsSync(join(cwd, "src/app/(layout-dashboard)/layout.tsx"))).toBe(true);
		expect(existsSync(join(cwd, ".onelib/blueprint.applied.json"))).toBe(true);

		const rootLayout = readFileSync(join(cwd, "src/app/layout.tsx"), "utf-8");
		expect(rootLayout).toContain("data-onelib-theme=\"vibrant\"");

		const globals = readFileSync(join(cwd, "src/app/globals.css"), "utf-8");
		expect(globals).toContain('@import "tailwindcss";');
		expect(globals).toContain("onelib:tailwind:start");
		expect(globals).toContain("onelib:theme:start");
		expect(globals).toContain("onelib:layout:start");

		const config = readFileSync(join(cwd, "onelib.config.ts"), "utf-8");
		expect(config).toContain('layout: "dashboard"');
		expect(config).toContain('preset: "vibrant"');
		expect(config).toContain('"hero"');
		expect(config).toContain('"navbar"');
		expect(config).toContain('"basic-accordion"');
	});
});
