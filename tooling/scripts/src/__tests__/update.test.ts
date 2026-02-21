import { describe, expect, it, vi } from "vitest";

vi.mock("../commands/skills-update.js", () => ({
	runSkillsUpdate: vi.fn(),
}));

vi.mock("../commands/components-update.js", () => ({
	runComponentsUpdate: vi.fn(),
}));

import { runComponentsUpdate } from "../commands/components-update.js";
import { runSkillsUpdate } from "../commands/skills-update.js";
import { runUpdate } from "../commands/update.js";

describe("runUpdate", () => {
	it("calls runSkillsUpdate", async () => {
		vi.mocked(runSkillsUpdate).mockResolvedValue({
			installed: ["skill/a"],
			failed: [],
		});
		vi.mocked(runComponentsUpdate).mockResolvedValue({
			updated: [],
			skipped: [],
			added: [],
			upToDate: [],
		});

		const result = await runUpdate("/fake/dir");
		expect(runSkillsUpdate).toHaveBeenCalledWith("/fake/dir");
		expect(result.success).toBe(true);
	});

	it("returns success=false when skills update has failures", async () => {
		vi.mocked(runSkillsUpdate).mockResolvedValue({
			installed: [],
			failed: ["skill/a"],
		});
		vi.mocked(runComponentsUpdate).mockResolvedValue({
			updated: [],
			skipped: [],
			added: [],
			upToDate: [],
		});

		const result = await runUpdate("/fake/dir");
		expect(result.success).toBe(false);
	});

	it("calls runComponentsUpdate", async () => {
		vi.mocked(runSkillsUpdate).mockResolvedValue({
			installed: ["skill/a"],
			failed: [],
		});
		vi.mocked(runComponentsUpdate).mockResolvedValue({
			updated: ["basic-button"],
			skipped: [],
			added: [],
			upToDate: [],
		});

		const result = await runUpdate("/fake/dir");
		expect(runComponentsUpdate).toHaveBeenCalledWith("/fake/dir");
		expect(result.success).toBe(true);
	});
});
