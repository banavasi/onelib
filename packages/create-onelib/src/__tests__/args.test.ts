import { describe, expect, it } from "vitest";
import { parseCliArgs } from "../index.js";

describe("parseCliArgs", () => {
	it("parses project name and blueprint", () => {
		expect(parseCliArgs(["demo-app", "--blueprint", "demo.json"]))
			.toEqual({ projectName: "demo-app", blueprintFile: "demo.json" });
	});

	it("parses blueprint short flag", () => {
		expect(parseCliArgs(["-b", "demo.json"]))
			.toEqual({ blueprintFile: "demo.json" });
	});
});
