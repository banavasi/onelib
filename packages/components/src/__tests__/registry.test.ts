import { describe, expect, it } from "vitest";
import { loadComponentRegistry, validateComponentRegistry } from "../registry.js";

describe("validateComponentRegistry", () => {
	it("validates a valid registry", () => {
		const registry = {
			version: "0.1.0",
			components: [
				{
					name: "basic-button",
					displayName: "Basic Button",
					category: "buttons",
					source: "seraui",
					sourceUrl: "https://seraui.com/docs/buttons/basic",
					version: "0.1.0",
					description: "Clean, accessible button with variants",
					files: ["buttons/basic-button/basic-button.tsx"],
					dependencies: [],
					tags: ["button", "interactive"],
				},
			],
		};
		const result = validateComponentRegistry(registry);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.components).toHaveLength(1);
			expect(result.data.components[0]?.name).toBe("basic-button");
		}
	});

	it("rejects invalid registry", () => {
		const result = validateComponentRegistry({ version: "bad", components: [] });
		expect(result.success).toBe(false);
	});
});

describe("loadComponentRegistry", () => {
	it("loads and validates the registry.json file", () => {
		const result = loadComponentRegistry();
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.version).toBe("0.1.0");
			expect(Array.isArray(result.data.components)).toBe(true);
		}
	});

	it("loads registry with 53 real components", () => {
		const result = loadComponentRegistry();
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.components).toHaveLength(53);
		}
	});

	it("loads registry with peerDependencies fields", () => {
		const result = loadComponentRegistry();
		expect(result.success).toBe(true);
		if (result.success) {
			const hasAnyPeerDeps = result.data.components.some(
				(c) => c.peerDependencies !== undefined,
			);
			expect(hasAnyPeerDeps).toBe(true);
		}
	});
});
