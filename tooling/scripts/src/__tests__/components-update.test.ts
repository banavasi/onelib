import { describe, expect, it, vi } from "vitest";
import { runComponentsUpdate } from "../commands/components-update.js";

vi.mock("@onelib/components", () => ({
	updateComponents: vi.fn(() => ({
		updated: ["basic-button"],
		skipped: [],
		added: ["aurora"],
		upToDate: ["fuzzy-text"],
		peerDependencies: {},
	})),
}));

describe("runComponentsUpdate", () => {
	it("returns an update report", async () => {
		const result = await runComponentsUpdate("/fake/project");
		expect(result.updated).toContain("basic-button");
		expect(result.added).toContain("aurora");
		expect(result.upToDate).toContain("fuzzy-text");
	});
});
