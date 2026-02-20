import { describe, expect, it } from "vitest";
import { defineConfig, VERSION } from "../index.js";
import type { OnelibConfig } from "../types.js";

describe("defineConfig", () => {
	it("returns the config object unchanged", () => {
		const config: OnelibConfig = {
			name: "my-project",
			registry: {
				components: ["button", "card"],
				layouts: [],
			},
			skills: {
				curated: true,
				custom: [],
			},
			theme: {
				preset: "default",
			},
		};

		const result = defineConfig(config);
		expect(result).toBe(config);
	});

	it("accepts minimal config", () => {
		const config: OnelibConfig = {
			name: "test",
			registry: {
				components: [],
				layouts: [],
			},
			skills: {
				curated: true,
				custom: [],
			},
			theme: {
				preset: "default",
			},
		};

		const result = defineConfig(config);
		expect(result.name).toBe("test");
	});

	it("preserves custom theme preset", () => {
		const config: OnelibConfig = {
			name: "test",
			registry: {
				components: [],
				layouts: [],
			},
			skills: {
				curated: false,
				custom: ["my-org/my-skill/cool-skill"],
			},
			theme: {
				preset: "custom",
			},
		};

		const result = defineConfig(config);
		expect(result.theme.preset).toBe("custom");
		expect(result.skills.curated).toBe(false);
	});
});

describe("VERSION", () => {
	it("is a valid semver string", () => {
		expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
	});
});
