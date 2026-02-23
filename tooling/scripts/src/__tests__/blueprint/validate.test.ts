import { describe, expect, it } from "vitest";
import { validateBlueprint } from "../../blueprint/validate.js";

describe("validateBlueprint", () => {
	it("accepts valid blueprint", () => {
		const input = {
			name: "Demo",
			rootLayout: "marketing",
			theme: "vibrant",
			pages: [
				{ name: "Home", route: "/", layout: "marketing", components: ["hero", "navbar"] },
			],
		};

		const parsed = validateBlueprint(input);
		expect(parsed.name).toBe("Demo");
		expect(parsed.pages).toHaveLength(1);
	});

	it("rejects duplicate routes", () => {
		expect(() =>
			validateBlueprint({
				name: "Demo",
				rootLayout: "blank",
				theme: "default",
				pages: [
					{ name: "A", route: "/same", layout: "blank", components: [] },
					{ name: "B", route: "/same", layout: "blank", components: [] },
				],
			}),
		).toThrow(/Duplicate route/);
	});
});
