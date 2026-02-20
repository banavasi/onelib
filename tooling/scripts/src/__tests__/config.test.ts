import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadConfig } from "../utils/config.js";

describe("loadConfig", () => {
	let tempDir: string;

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), "onelib-config-test-"));
	});

	afterEach(async () => {
		await rm(tempDir, { recursive: true, force: true });
	});

	it("returns null when onelib.config.ts does not exist", async () => {
		const result = await loadConfig(tempDir);
		expect(result).toBeNull();
	});

	it("loads a valid config file", async () => {
		const configContent = `
export default {
	name: "test-project",
	registry: { components: [], layouts: [] },
	skills: { curated: true, custom: ["my/custom/skill"] },
	theme: { preset: "default" },
};
`;
		await writeFile(join(tempDir, "onelib.config.ts"), configContent);

		const result = await loadConfig(tempDir);
		expect(result).not.toBeNull();
		expect(result?.name).toBe("test-project");
		expect(result?.skills.curated).toBe(true);
		expect(result?.skills.custom).toEqual(["my/custom/skill"]);
	});

	it("returns null for a config with syntax errors", async () => {
		await writeFile(join(tempDir, "onelib.config.ts"), "export default {{{BROKEN");
		const result = await loadConfig(tempDir);
		expect(result).toBeNull();
	});
});
