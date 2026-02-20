import { describe, expect, it } from "vitest";
import seedData from "../../data/registry.json" with { type: "json" };
import { RegistryManifestSchema } from "../registry.js";

const validManifest = {
	version: "0.1.0",
	updatedAt: "2026-02-20T00:00:00.000Z",
	components: [
		{
			name: "button",
			displayName: "Button",
			description: "A clickable button",
			version: "1.0.0",
			source: "shadcn",
			category: "ui",
			files: ["src/components/ui/button.tsx"],
		},
	],
	layouts: [],
	skills: [],
};

describe("RegistryManifestSchema", () => {
	it("accepts a valid manifest", () => {
		const result = RegistryManifestSchema.parse(validManifest);
		expect(result.version).toBe("0.1.0");
		expect(result.components).toHaveLength(1);
		expect(result.layouts).toHaveLength(0);
		expect(result.skills).toHaveLength(0);
	});

	it("rejects missing version", () => {
		const { version, ...withoutVersion } = validManifest;
		expect(() => RegistryManifestSchema.parse(withoutVersion)).toThrow();
	});

	it("rejects missing updatedAt", () => {
		const { updatedAt, ...withoutDate } = validManifest;
		expect(() => RegistryManifestSchema.parse(withoutDate)).toThrow();
	});

	it("rejects invalid component in manifest", () => {
		expect(() =>
			RegistryManifestSchema.parse({
				...validManifest,
				components: [{ name: "bad" }],
			}),
		).toThrow();
	});

	it("validates the seed registry.json", () => {
		const result = RegistryManifestSchema.parse(seedData);
		expect(result.version).toBe("0.1.0");
	});
});
