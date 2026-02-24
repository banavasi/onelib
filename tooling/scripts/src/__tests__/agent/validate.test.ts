import { describe, expect, it } from "vitest";
import { validateAgentPlan } from "../../agent/validate.js";

describe("validateAgentPlan", () => {
	it("validates a strict plan", () => {
		const result = validateAgentPlan({
			name: "Demo",
			intent: "Build a conversion-focused SaaS website with clear trust and CTA structure.",
			rootLayout: "marketing",
			theme: "vibrant",
			pages: [{ name: "Home", route: "/", layout: "marketing", components: ["hero", "navbar"] }],
			skills: { capabilities: ["nextjs", "conversion"], additional: ["owner/repo"], curated: true },
		});

		expect(result.name).toBe("Demo");
		expect(result.pages[0]?.route).toBe("/");
	});

	it("rejects unknown capability", () => {
		expect(() =>
			validateAgentPlan({
				name: "Demo",
				intent: "Build a conversion-focused SaaS website with clear trust and CTA structure.",
				rootLayout: "marketing",
				theme: "vibrant",
				pages: [{ name: "Home", route: "/", layout: "marketing", components: ["hero"] }],
				skills: { capabilities: ["unknown-capability"] },
			}),
		).toThrowError(/Unknown capability/);
	});
});
