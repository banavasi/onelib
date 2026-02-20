import { describe, expect, it } from "vitest";
import { checkNodeVersion, parseNodeVersion } from "../utils/preflight.js";

describe("parseNodeVersion", () => {
	it("parses 'v20.0.0' to 20", () => {
		expect(parseNodeVersion("v20.0.0")).toBe(20);
	});

	it("parses 'v24.12.0' to 24", () => {
		expect(parseNodeVersion("v24.12.0")).toBe(24);
	});

	it("parses '18.17.1' without v prefix to 18", () => {
		expect(parseNodeVersion("18.17.1")).toBe(18);
	});

	it("returns NaN for garbage input", () => {
		expect(parseNodeVersion("not-a-version")).toBeNaN();
	});
});

describe("checkNodeVersion", () => {
	it("returns ok for Node >= 20", () => {
		const result = checkNodeVersion(20);
		expect(result.ok).toBe(true);
	});

	it("returns ok for Node 24", () => {
		const result = checkNodeVersion(24);
		expect(result.ok).toBe(true);
	});

	it("returns error for Node 18", () => {
		const result = checkNodeVersion(18);
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.message).toContain("20");
		}
	});

	it("returns error for Node 16", () => {
		const result = checkNodeVersion(16);
		expect(result.ok).toBe(false);
	});
});
