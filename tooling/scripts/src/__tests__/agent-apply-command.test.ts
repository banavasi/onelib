import { describe, expect, it } from "vitest";
import { parseAgentApplyArgs } from "../commands/agent-apply.js";

describe("parseAgentApplyArgs", () => {
	it("parses --file option", () => {
		expect(parseAgentApplyArgs(["--file", "onelib.plan.json"])).toEqual({ file: "onelib.plan.json" });
	});

	it("parses -f option", () => {
		expect(parseAgentApplyArgs(["-f", "plan.json"])).toEqual({ file: "plan.json" });
	});

	it("returns empty options when no args", () => {
		expect(parseAgentApplyArgs([])).toEqual({});
	});
});
