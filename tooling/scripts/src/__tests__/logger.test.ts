import { describe, expect, it } from "vitest";
import { formatError, formatLog, formatSuccess, formatWarn } from "../utils/logger.js";

describe("logger formatters", () => {
	it("formatLog includes the message", () => {
		const output = formatLog("hello world");
		expect(output).toContain("hello world");
		expect(output).toContain("onelib");
	});

	it("formatSuccess includes the message", () => {
		const output = formatSuccess("done");
		expect(output).toContain("done");
	});

	it("formatWarn includes the message", () => {
		const output = formatWarn("careful");
		expect(output).toContain("careful");
	});

	it("formatError includes the message", () => {
		const output = formatError("failed");
		expect(output).toContain("failed");
	});
});
