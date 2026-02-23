import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { applyBlueprint } from "../../blueprint/apply.js";

const dirs: string[] = [];

afterEach(() => {
	for (const dir of dirs.splice(0)) {
		// lazy cleanup by OS tmp policy; keeping explicit list for future cleanup hooks
		void dir;
	}
});

describe("applyBlueprint", () => {
	it("creates pages, layouts, and updates config", async () => {
		const cwd = mkdtempSync(join(tmpdir(), "onelib-blueprint-"));
		dirs.push(cwd);

		const result = await applyBlueprint(
			{
				name: "Demo",
				rootLayout: "dashboard",
				theme: "neutral",
				pages: [
					{ name: "Home", route: "/", layout: "marketing", components: ["hero", "navbar"] },
				],
			},
			cwd,
			null,
		);

		expect(result.pagesCreated.length).toBe(1);
		expect(result.layoutsCreated.length).toBeGreaterThan(0);

		const config = readFileSync(join(cwd, "onelib.config.ts"), "utf-8");
		expect(config).toContain('layout: "dashboard"');
		expect(config).toContain('preset: "neutral"');

		const rootLayout = readFileSync(join(cwd, "src/app/layout.tsx"), "utf-8");
		expect(rootLayout).toContain("data-onelib-theme=\"neutral\"");
	});
});
