import { describe, expect, it } from "vitest";
import { parseBlueprintArgs } from "../commands/blueprint-apply.js";

describe("parseBlueprintArgs", () => {
	it("parses --file option", () => {
		expect(parseBlueprintArgs(["--file", "demo.json"]))
			.toEqual({ file: "demo.json" });
	});

	it("parses -f option", () => {
		expect(parseBlueprintArgs(["-f", "demo.json"]))
			.toEqual({ file: "demo.json" });
	});

	it("returns empty options when no args", () => {
		expect(parseBlueprintArgs([])).toEqual({});
	});
});
