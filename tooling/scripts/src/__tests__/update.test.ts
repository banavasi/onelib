import { describe, expect, it, vi } from "vitest";

vi.mock("../commands/skills-update.js", () => ({
	runSkillsUpdate: vi.fn(),
}));

import { runUpdate } from "../commands/update.js";
import { runSkillsUpdate } from "../commands/skills-update.js";

describe("runUpdate", () => {
	it("calls runSkillsUpdate", async () => {
		vi.mocked(runSkillsUpdate).mockResolvedValue({
			installed: ["skill/a"],
			failed: [],
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

		const result = await runUpdate("/fake/dir");
		expect(result.success).toBe(false);
	});
});
